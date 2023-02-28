const transactionRoute  = require('express').Router();
const { checkPermissionsMiddleware } = require("../Middleware/Auth");
const { getAllTransactions,getAssetClasses } = require("./GetTransactions");
transactionRoute.get('/get-transaction', checkPermissionsMiddleware, getAllTransactions);
transactionRoute.get('/get-assets',checkPermissionsMiddleware, getAssetClasses);

const { getAssetClassStats, getTransactionStats, getTransactionStatsByDate } = require('./GetTransactionStats');
transactionRoute.get('/get-transaction-stats', checkPermissionsMiddleware, getTransactionStats);
transactionRoute.get('/get-asset-stats', checkPermissionsMiddleware, getAssetClassStats);
transactionRoute.get('/get-transaction-stats-by-date', checkPermissionsMiddleware, getTransactionStatsByDate);

const { postTransaction } = require('./PostTransaction');
transactionRoute.post('/post-transaction', checkPermissionsMiddleware, postTransaction);

module.exports = transactionRoute;