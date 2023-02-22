const moment = require('moment');
const mongoOptimCustomer = require("../../Schemas/Customers/CustomerSchema");
const { getKeyFromRedis, getMultiKeysFromRedis, searchKeys } = require("../../Cache/RedisFunctions");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getAllTransactions = async (req, res) => {
    let { customerId, assetClass, transactionDate } = req.query
    // Check Valid Customer
    let existingCustomer = await mongoOptimCustomer.findOne({ customerId: customerId });
    if (!existingCustomer) return res.status(400).send({ ...errorMessage, error: 'No customer found' });

    // Check Valid Transaction Date 
    if (transactionDate) {
        if (!moment(transactionDate, 'YYYY-MM-DD').isValid()) return res.status(400).send({ ...errorMessage, error: 'Invalid transaction date' });
    }
    let blockchain = await getKeyFromRedis(`ledger:customer:${customerId}`);
    if (!blockchain) return res.status(400).send({ ...errorMessage, error: 'No transactions found' });
    let ledger = JSON.parse(blockchain || []);
    let output = [];
    let filterApplied = [];

    if (transactionDate) {
        filterApplied.push({ label: 'transactionDate', value: moment(transactionDate, 'YYYY-MM-DD').toISOString() });
    }
    if (assetClass) {
        filterApplied.push({ label: 'assetClass', value: assetClass });
        if (typeof assetClass !== 'string') return res.status(400).send({ ...errorMessage, error: 'Invalid asset class' });
    }

    if (filterApplied.length === 0) {
        output = ledger.sort((a,b) => a.transactionDate > b.transactionDate ? 1: -1).slice(0,15)
    } else {
        filterApplied.forEach((filter) => {
            if (filter.label === 'transactionDate') {
                output = ledger.filter((transaction) => {
                    if (moment(transaction.data.transactionDate, 'YYYY-MM-DD').toISOString() === filter.value) {
                        return transaction;
                    }
                })
            } else {
                output = ledger.filter((transaction) => {
                    if (transaction.data[filter.label] === filter.value) {
                        return transaction;
                    }
                })
            }
        })
    }
    return res.status(200).send(output);
}

const getAssetClasses = async (req,res) => {
    let { customerId } = req.query;
    // Check Valid Customer
    let existingCustomer = await mongoOptimCustomer.findOne({ customerId: customerId });
    if (!existingCustomer) return res.status(400).send({ ...errorMessage, error: 'No customer found' });

    let blockchain = await getKeyFromRedis(`ledger:customer:${customerId}`);
    if (!blockchain) return res.status(400).send({ ...errorMessage, error: 'No transactions found' });
    let ledger = JSON.parse(blockchain || []);
    let assetClasses = ledger.map(e => e.data.assetClass).filter(e => e) || []
    return res.status(200).send(assetClasses || [])
}

module.exports.getAllTransactions = getAllTransactions;
module.exports.getAssetClasses = getAssetClasses;