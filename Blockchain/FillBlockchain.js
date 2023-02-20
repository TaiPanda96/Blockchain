const moment = require("moment");
const { Blockchain, LedgerBlock } = require('./Ledger');
const { getRandomFloatBetween, getNestedObject } = require("../Utility");
const { redisClient } = require('../Cache/Connect');

const DEBUG = false;

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

const fillBlockChainData = (ledger, desiredNumber = 10) => {
    var indexIncrement = 0;
    const redisUpdates = [];
    while (indexIncrement <= desiredNumber) {
        // Fill Loan Tape
        let customerId      = customerIds[Math.floor(Math.random() * customerIds.length)];
        let assetClass      = assetClasses[Math.floor(Math.random() * assetClasses.length)];
        let facilityID      = Math.floor(getRandomFloatBetween(1,100))
        var facility        = facilityNames[Math.floor(Math.random() * facilityNames.length)] + '-' + String(Math.floor(getRandomFloatBetween(1,72)))
        var randomAmount    = 1000 * getRandomFloatBetween(1,100)
        var transactionDate = moment().add(indexIncrement, 'hours').toISOString()
        let transaction = {
            transactionId: Math.floor(Math.random() * Date.now()),
            customerId: customerId,
            assetClass: assetClass,
            amount: randomAmount,
            term: getRandomFloatBetween(1,72),
            interest: getRandomFloatBetween(0,0.08),
            loanToValue: getRandomFloatBetween(0,1),
            facilityID: facilityID,
            facilityName: facility,
            transactionDate: transactionDate
        }
        ledger.appendLedgerBlock(transaction)
        redisUpdates.push(customerId)
        if (indexIncrement === desiredNumber) {
            DEBUG && console.log(ledger.blockchain)
            DEBUG && console.log(`Transactions recorded at: ${moment().toDate()}`)
        }
        indexIncrement++
    }
    let uniqueCustomers = [...new Set(redisUpdates)]
    uniqueCustomers.forEach(customerId => {
        let customerTransactions = ledger.blockchain.filter(transaction => transaction.data.customerId === customerId)
        redisClient.mset(`ledger:customer:${customerId}`, JSON.stringify(customerTransactions), (err, reply) => { if (err) { console.log(err)} console.log(reply)})
    });

    // Update the final blockchain snapshot
    redisClient.mset(`ledger:blockchain:snapshot:${moment().toISOString()}`, JSON.stringify(ledger.blockchain), (err, reply) => { if (err) {console.log(err)} console.log(reply)})
}

module.exports.fillBlockChainData = fillBlockChainData;
module.exports.genesisBlock = genesisBlock;