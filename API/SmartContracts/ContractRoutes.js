const smartContractRoutes  = require('express').Router();

const { postContract } = require('./PostContract');
smartContractRoutes.post('/post-contract/:borrowerId', postContract);

const { getContract } = require("./GetContract");
smartContractRoutes.get('/get-contracts/:borrowerId', getContract);

module.exports = smartContractRoutes;