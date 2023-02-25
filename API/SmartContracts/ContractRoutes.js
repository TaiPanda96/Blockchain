const moment = require('moment');
const mongoOptimCustomer  = require("../../Schemas/Borrowers/Schema");
const { eventEmitter }    = require('../../Triggers/GlobalEmitter');
const { getNestedObject } = require("../../Utility");

const smartContractRoutes  = require('express').Router();

const { postContract } = require('./PostContract');
smartContractRoutes.post('/post-contract/:customerId', postContract);

const { getContract } = require("./GetContract");
smartContractRoutes.get('/get-contracts/:customerId', getContract);

module.exports = smartContractRoutes;