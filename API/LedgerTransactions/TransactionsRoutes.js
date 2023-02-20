const transactionRoute  = require('express').Router();

const { getAllTransactions } = require("./GetTransactions");
transactionRoute.get('/get-transaction', getAllTransactions);

const { postTransaction } = require('./PostTransaction');
transactionRoute.post('/post-transaction', postTransaction);

module.exports = transactionRoute;