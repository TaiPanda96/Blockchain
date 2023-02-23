const transactionRoute  = require('express').Router();

const { getAllTransactions,getAssetClasses } = require("./GetTransactions");
transactionRoute.get('/get-transaction', getAllTransactions);
transactionRoute.get('/get-assets',getAssetClasses);

const { getAssetClassStats, getTransactionStats, getTransactionStatsByDate } = require('./GetTransactionStats');
transactionRoute.get('/get-transaction-stats', getTransactionStats);
transactionRoute.get('/get-asset-stats', getAssetClassStats);
transactionRoute.get('/get-transaction-stats-by-date', getTransactionStatsByDate);

const { postTransaction } = require('./PostTransaction');
transactionRoute.post('/post-transaction', postTransaction);

module.exports = transactionRoute;