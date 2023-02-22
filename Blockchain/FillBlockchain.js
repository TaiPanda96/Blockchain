const moment = require("moment");
const { Blockchain, LedgerBlock, addLedgerBlockStatic } = require('./Ledger');
const { getRandomFloatBetween, getNestedObject } = require("../Utility");
const { getKeyFromRedis, addToCache } = require('../Cache/RedisFunctions')

const mongoOptimCustomer = require("../Schemas/Customers/CustomerSchema");

const DEBUG = true;

const genesisBlock = {
    customerId: "BMO123",
    orgLabel: "BMO",
    customerName: "Bank of Montreal",
    customerType: "Bank",
    customerAddress: "150 King Street West",
    customerCity: "Toronto",
    customerZip: "M5S0A5",
    customerCountry: "Canada",
    customerPhone: 6479195955,
    customerEmail: "taishanlin1996@gmail.com",
    customerWebsite: "https://www.bmo.com/main/personal",
    customerIndustry: "Financial Services",
    customerInddustrySub: "Financial Services & Insurance",
    customerSIC: "1996",
    customerNAICS: "351098utigjanlsfavaweoig"
}

const facilityNames = [
    'Term Loan',
    'Transporation Loan',
    'Commercial Loan',
    'Mortgage Loan',
    'Credit Card Loan',
    'Line of Credit',
    'Overdraft',
    'Supplier Credit',
    'Revolving Credit Facility',
]

const assetClasses = [
    'Securitizable Asset',
    'Taxable Municipals',
    'Investment-Grade Corporates',
    'Treasurys',
    'ABS',
    'Agency MBS',
    'Agency Bonds',
    'Consumer ABS',
    'Commercial ABS'
]

const customerIds = [
    '63eaca8559ef868d14301442',
    '63ed51357b05a5c9a9d0991e'
]

const fillBlockChainData = (desiredNumber = 10) => {
    var indexIncrement = 0;
    while (indexIncrement <= desiredNumber) {
        // Fill Loan Tape
        let customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
        let assetClass = assetClasses[Math.floor(Math.random() * assetClasses.length)];
        let facilityID = Math.floor(getRandomFloatBetween(1, 100))
        var facility = facilityNames[Math.floor(Math.random() * facilityNames.length)] + '-' + String(Math.floor(getRandomFloatBetween(1, 72)))
        var randomAmount = 1000 * getRandomFloatBetween(1, 100)
        var transactionDate = moment().add(indexIncrement, 'hours').toISOString()
        let transaction = {
            transactionId: Math.floor(Math.random() * Date.now()),
            customerId: customerId,
            assetClass: assetClass,
            amount: randomAmount,
            term: getRandomFloatBetween(1, 72),
            interest: getRandomFloatBetween(0, 0.08),
            loanToValue: getRandomFloatBetween(0, 1),
            facilityID: facilityID,
            facilityName: facility,
            transactionDate: transactionDate
        }
        setTimeout(async () => {
            let existingCache = await getKeyFromRedis(`ledger:${customerId}:blockchain`);
            if (existingCache) {
                let blockchain = JSON.parse(existingCache)
                let redisUpdate = addLedgerBlockStatic(blockchain, transaction)
                if (redisUpdate.length === 0) { return console.log('No updates') };
                addToCache(`ledger:${transaction.customerId}:blockchain`, redisUpdate).then((reply) => {
                    console.log(`Transaction Added to Blockchain ${reply}`);
                    // console.log(blockchain[blockchain.length - 1])
                }).catch((err) => console.log(err));
                await mongoOptimCustomer.updateOne({ customerId: transaction.customerId }, { $set: { blockChainSnapshot: redisUpdate } });
            }
        }, indexIncrement * 300);
        indexIncrement++
    }
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
    redisClient.mset({ [blockChainCacheKey]: JSON.stringify(ledger.blockchain) }, (err, reply) => {
        if (err) { console.log(err) }
        console.log(`Blockchain Updated ${cacheKey}:${reply}`)
    });
}


module.exports.fillBlockChainData = fillBlockChainData;
module.exports.initializeLedger = initializeLedger;
module.exports.genesisBlock = genesisBlock;