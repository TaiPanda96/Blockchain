const transactionRoute  = require('express').Router();

const { getAllTransactions,getAssetClasses } = require("./GetTransactions");
transactionRoute.get('/get-transaction', getAllTransactions);
transactionRoute.get('/get-assets',getAssetClasses);

const { postTransaction } = require('./PostTransaction');
transactionRoute.post('/post-transaction', postTransaction);


module.exports = transactionRoute;