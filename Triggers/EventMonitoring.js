const { addToCache, getKeyFromRedis } = require("../Cache/RedisFunctions");
const mongoOptimCustomer = require("../Schemas/Customers/CustomerSchema");
const moment = require('moment');
const { addLedgerBlockStatic } = require("../Blockchain/Ledger");

const customerEventHandler = async (ledger, customerObj = {}) => {
    // Searching for the customer's ledger
    let existingBlock = await getKeyFromRedis(`ledger:${customerObj.customerId}:blockchain`);
    if (existingBlock) {
        let blockchain = JSON.parse(existingBlock);
        blockchain[0] = { ...customerObj }
        ledger.blockchain = blockchain;
        await addToCache(`ledger:${customerObj.customerId}:blockchain`, blockchain);
    } else {
        // Initialize Genesis Block and Pass the New Customer Obj to create the new ledger
        ledger.startGenesisBlock(customerObj);
        await addToCache(`ledger:${customerObj.customerId}:blockchain`, ledger.blockchain);
    }
}

const smartContractEventHandler = async (ledger, smartContract = {}) => {
    let existingBlock = await getKeyFromRedis(`smartContract:${smartContract.customerId}:${smartContract.contractId}`);
    let blockChain = [];
    if (existingBlock) {
        blockChain = JSON.parse(existingBlock);
        // Append new transaction object
        let redisUpdate = addLedgerBlockStatic(blockChain,smartContract)
        if (redisUpdate.length === 0) { return console.log('No updates')};
        addToCache(`smartContract:${smartContract.customerId}:${smartContract.contractId}`, redisUpdate).then((reply) => {
            console.log(`Transaction Added to Blockchain ${reply}`);
            console.log(blockChain[blockChain.length - 1])
        }).catch((err) => console.log(err));
        await mongoOptimCustomer.updateOne({customerId: smartContract.customerId}, {$push: { smartContract: smartContract}} );
    } else {
        let existingCustomer = await mongoOptimCustomer.findOne({ customerId: smartContract.customerId }, {
            _id: 0,
            customerId: 1,
            orgLabel: 1,
            customerName: 1,
            customerType: 1,
            customerAddress: 1,
            customerCity: 1,
            customerZip: 1,
            customerCountry: 1,
            customerPhone: 1,
            customerEmail: 1,
            customerWebsite: 1,
            customerIndustry: 1,
            customerInddustrySub: 1,
            customerSIC: 1,
            customerNAICS: 1
        });
        if (!existingCustomer) { return console.log('No existing customer, cannot call transaction event handler.') }
        // Initialize Genesis Block and Pass the New Customer Obj to create the new ledger
        ledger.startGenesisBlock(existingCustomer._doc);
        ledger.appendLedgerBlock(smartContract);
        addToCache(`smartContract:${smartContract.customerId}:${smartContract.contractId}`, ledger.blockchain).then((reply) => {
            console.log(`Smart Contract Added For ${smartContract.customerId}: ${reply}`);
        }).catch((err) => console.log(err));
        await mongoOptimCustomer.updateOne({customerId: smartContract.customerId}, {$push: { smartContracts: smartContract}} );
    }
}

const transactionEventHandler = async (ledger, transactionObj = {}) => {
    let existingBlock = await getKeyFromRedis(`ledger:${transactionObj.customerId}:blockchain`);
    let blockChain = [];
    if (existingBlock) {
        // Grab the latest block from the blockchain cache and append the new transaction
        // If server is restarted, the blockchain cache will be empty and the transaction will be lost on restart
        blockChain = JSON.parse(existingBlock);
        // Append new transaction object
        let redisUpdate = addLedgerBlockStatic(blockChain,transactionObj)
        if (redisUpdate.length === 0) { return console.log('No updates')};
        addToCache(`ledger:${transactionObj.customerId}:blockchain`, redisUpdate).then((reply) => {
            console.log(`Transaction Added to Blockchain ${reply}`);
            console.log(blockChain[blockChain.length - 1])
        }).catch((err) => console.log(err));
        await mongoOptimCustomer.updateOne({customerId: transactionObj.customerId}, {$set: { blockChainSnapshot: redisUpdate}} );
    } else {
        // Initialize Genesis Block and Pass the New Customer Obj to create the new ledger
        let existingCustomer = await mongoOptimCustomer.findOne({customerId: transactionObj.customerId}, {
            _id:0,
            customerId: 1,
            orgLabel: 1,
            customerName: 1,
            customerType: 1,
            customerAddress: 1,
            customerCity: 1,
            customerZip: 1,
            customerCountry: 1,
            customerPhone: 1,
            customerEmail: 1,
            customerWebsite: 1,
            customerIndustry: 1,
            customerInddustrySub: 1,
            customerSIC: 1,
            customerNAICS: 1
        });
        ledger.startGenesisBlock(existingCustomer._doc);
        ledger.appendLedgerBlock(transactionObj);
        addToCache(`ledger:${transactionObj.customerId}:blockchain`, ledger.blockchain).then((reply) => {
            console.log(`Transaction Added to Blockchain ${reply}`);
        }).catch((err) => console.log(err));
        await mongoOptimCustomer.updateOne({customerId: transactionObj.customerId}, {$set: { blockChainSnapshot: ledger.blockchain}} );
    }
}

module.exports.customerEventHandler = customerEventHandler;
module.exports.transactionEventHandler = transactionEventHandler;
module.exports.smartContractEventHandler = smartContractEventHandler;