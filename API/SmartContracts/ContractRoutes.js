const smartContractRoutes  = require('express').Router();

const { postContract } = require('./PostContract');
smartContractRoutes.post('/post-contract/:customerId', postContract);

const { getContract } = require("./GetContract");
smartContractRoutes.get('/get-contracts/:customerId', getContract);

module.exports = smartContractRoutes;