const moment = require('moment');
const { Blockchain, LedgerBlock } = require('../Blockchain/Ledger');
const mongoOptimCustomer = require("../Schemas/Customers/CustomerSchema");

const { fillBlockChainData } = require('./FillBlockChain');

// Connect to Redis
const { redisClient } = require('../Cache/Connect');

const FILL = true;

const verifyTransaction = (transactionData = {}) => {
    if (Object.keys(transactionData).length === 0) { return false }
    // Verify that transaction details is accurate
    if (Object.keys(transactionData).filter(e => ['customerId', 'transactionAmount', 'transactionDate'].includes(e)).some(key => { if (!transactionData[key]) { return false } }));

    // Verify customer information is accurate
    let existingCustomer = mongoOptimCustomer.findOne({ customerId: transactionData.customerId }) || {};
    if (!existingCustomer) return false;

    let { transactionAmount, transactionDate, ...rest } = transactionData;
    // Verify transaction amount
    if (isNaN(transactionAmount) || !isNaN(parseInt(transactionAmount)) < 0) { return false };
    // Verify transaction Date
    if (!moment(transactionDate, 'YYYY-MM-DD').isValid()) { return false };
    return true;
}
const initializeLedger = (ledger) => {
    FILL && fillBlockChainData(ledger, 25)
    var ledgerKeys = ledger.blockchain.map((e, idx) => {
        return {
            currentAddress: e.hash,
            previousAddress: e.precedingHash,
            nextAddress: idx <= ledger.blockchain.length - 2 ? ledger.blockchain[idx + 1].hash : null
        }
    });
    var cacheKey = `ledger:keys:${moment().toDate().getTime()}`;
    var blockChainCacheKey = `ledger:blockchain`;

    // Push Snapshot of Ledger with Latest Transaction and Key Traversal Sequence
    redisClient.mset({ [cacheKey]: JSON.stringify({ 'lastTransaction': ledger.blockchain[ledger.blockchain.length - 1] || [], 'keySequence': ledgerKeys }) }, (err, reply) => {
        if (err) { console.log(err) }
        console.log(`Cach Key Updated ${cacheKey}:${reply}`)
    });
    // Set Expiry of Snapshot
    redisClient.expire(cacheKey, 5184000, (err, reply) => {
        if (err) { console.log(err) }
        console.log(`Expire ${cacheKey}:${reply}`)
    });
    // Create Immutable Blockchain in Cache
    redisClient.mset({[blockChainCacheKey]: JSON.stringify(ledger.blockchain) }, (err, reply) => {
        if (err) { console.log(err) }
        console.log(`Blockchain Updated ${cacheKey}:${reply}`)
    });
}


module.exports.verifyTransaction = verifyTransaction;
module.exports.initializeLedger  = initializeLedger;