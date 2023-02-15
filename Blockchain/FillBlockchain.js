const moment = require("moment");
const { Blockchain, LedgerBlock } = require('./Ledger');
const { getRandomFloatBetween } = require("../Utility");

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

const fillBlockChainData = (ledger, desiredNumber = 10) => {
    var indexIncrement = 0;
    while (indexIncrement <= desiredNumber) {
        // Fill Loan Tape
        let assetClass      = assetClasses[Math.floor(Math.random() * assetClasses.length)];
        let facilityID      = Math.floor(getRandomFloatBetween(1,100))
        var facility        = facilityNames[Math.floor(Math.random() * facilityNames.length)] + '-' + String(Math.floor(getRandomFloatBetween(1,72)))
        var randomAmount    = 1000 * getRandomFloatBetween(1,100)
        var transactionDate = moment().add(indexIncrement, 'hours').toDate()
        let transaction = {
            assetClass: assetClass,
            facilityID: facilityID,
            facilityName: facility,
            amount: randomAmount,
            transactionDate: transactionDate,
        }
        
        ledger.appendLedgerBlock(transaction)
        if (indexIncrement === desiredNumber) {
            DEBUG && console.log(ledger.blockchain)
            console.log(`Transactions recorded at: ${moment().toDate()}`)
        }
        indexIncrement++
    }
}

module.exports.fillBlockChainData = fillBlockChainData;
module.exports.genesisBlock = genesisBlock;