const Borrower = require("../Schemas/Users/UserSchema");
const Transactions = require("../Schemas/Transactions/TransactionsSchema");
const { addLedgerBlockStatic } = require("../Blockchain/Ledger");
const { addToCache, getKeyFromRedis } = require("../Cache/RedisFunctions");

const customerEventHandler = async (ledger, customerObj = {}) => {
    // Searching for the customer's ledger
    let existingBlock = await getKeyFromRedis(`ledger:${customerObj.borrowerId}:blockchain`);
    if (existingBlock) {
        let blockchain = JSON.parse(existingBlock);
        blockchain[0]  = { ...customerObj }
        ledger.blockchain = blockchain;
        await addToCache(`ledger:${customerObj.borrowerId}:blockchain`, blockchain);
    } else {
        // Initialize Genesis Block and Pass the New Customer Obj to create the new ledger
        ledger.startGenesisBlock(customerObj);
        await addToCache(`ledger:${customerObj.borrowerId}:blockchain`, ledger.blockchain);
    }
}

const smartContractEventHandler = async (ledger, smartContract = {}) => {
    let existingBlock = await getKeyFromRedis(`smartContract:${smartContract.borrowerId}:${smartContract.contractId}`);
    let blockChain = [];
    if (existingBlock) {
        blockChain = JSON.parse(existingBlock);
        // Append new transaction object
        let redisUpdate = addLedgerBlockStatic(blockChain, smartContract)
        if (redisUpdate.length === 0) { return console.log('No updates') };
        console.log(smartContract.borrowerId)
        addToCache(`smartContract:${smartContract.borrowerId}:${smartContract.contractId}`, redisUpdate).then((reply) => {
            console.log(`Transaction Added to Blockchain ${reply}`);
            console.log(blockChain[blockChain.length - 1])
        }).catch((err) => console.log(err));
        await Transactions.updateOne({ borrowerId: smartContract.borrowerId }, { $push: { smartContract: smartContract } });
    } else {
        console.log(smartContract)
        let existingCustomer = await Borrower.findOne({ _id: smartContract.borrowerId }, {
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
            customerSIC: 1,
            customerNAICS: 1
        });
        if (!existingCustomer) { return console.log('No existing customer, cannot call transaction event handler.') }
        // Initialize Genesis Block and Pass the New Customer Obj to create the new ledger
        ledger.startGenesisBlock(existingCustomer._doc);
        ledger.appendLedgerBlock(smartContract);
        addToCache(`smartContract:${smartContract.borrowerId}:${smartContract.contractId}`, ledger.blockchain).then((reply) => {
            console.log(`Smart Contract Added For ${smartContract.borrowerId}: ${reply}`);
        }).catch((err) => console.log(err));
        await Transactions.updateOne({ borrowerId: smartContract.borrowerId }, { $push: { smartContracts: smartContract } });
    }
}

const transactionEventHandler = async (ledger, transactionObj = {}) => {
    let existingBlock = await getKeyFromRedis(`ledger:${transactionObj.borrowerId}:blockchain`);
    let blockChain = [];
    if (existingBlock) {
        // Grab the latest block from the blockchain cache and append the new transaction
        // If server is restarted, the blockchain cache will be empty and the transaction will be lost on restart
        blockChain = JSON.parse(existingBlock);
        // Append new transaction object
        let redisUpdate = addLedgerBlockStatic(blockChain, transactionObj)
        if (redisUpdate.length === 0) { return console.log('No updates') };
        addToCache(`ledger:${transactionObj.borrowerId}:blockchain`, redisUpdate).then((reply) => {
            console.log(`Transaction Added to Blockchain ${reply}`);
            console.log(blockChain[blockChain.length - 1])
        }).catch((err) => console.log(err));
        await Transactions.updateOne({ borrowerId: transactionObj.borrowerId }, { $set: { blockChainSnapshot: redisUpdate } });
    } else {
        // Initialize Genesis Block and Pass the New Customer Obj to create the new ledger
        let existingCustomer = await Borrower.findById(transactionObj.borrowerId);
        console.log(existingCustomer)
        ledger.startGenesisBlock(existingCustomer._doc);
        ledger.appendLedgerBlock(transactionObj);
        addToCache(`ledger:${transactionObj.borrowerId}:blockchain`, ledger.blockchain).then((reply) => {
            console.log(`Transaction Added to Blockchain ${reply}`);
        }).catch((err) => console.log(err));
        await Transactions.updateOne({ borrowerId: transactionObj.borrowerId }, { $set: { blockChainSnapshot: ledger.blockchain } });
    }
}

module.exports.customerEventHandler = customerEventHandler;
module.exports.transactionEventHandler = transactionEventHandler;
module.exports.smartContractEventHandler = smartContractEventHandler;