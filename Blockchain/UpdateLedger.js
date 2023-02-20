const moment = require('moment');
const { Blockchain, LedgerBlock } = require('../Blockchain/Ledger');
const mongoOptimCustomer = require("../Schemas/Customers/CustomerSchema");

const { fillBlockChainData } = require('./FillBlockChain');

// Connect to Redis
const { redisClient } = require('../Cache/Connect');

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

module.exports.initializeLedger  = initializeLedger;