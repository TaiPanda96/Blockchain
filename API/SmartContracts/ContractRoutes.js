const smartContractRoutes  = require('express').Router();

const { addHeader, checkPermissionsMiddleware } = require("../Middleware/Auth")

const { postContract } = require('./PostContract');
smartContractRoutes.post('/post-contract', checkPermissionsMiddleware, postContract);

const { getContract } = require("./GetContract");
smartContractRoutes.get('/get-contracts', checkPermissionsMiddleware, getContract);

module.exports = smartContractRoutes;