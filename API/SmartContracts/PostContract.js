const moment = require('moment');
const Borrower    = require("../../Schemas/Users/UserSchema");
const { eventEmitter }      = require('../../Triggers/GlobalEmitter');
const { initSmartContract } = require("../../SmartContracts/CreateContract");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const postContract = async (req,res) => {
    let { customerId } = req.params; 
    // Check Valid Customer
    let existingCustomer = await Borrower.findOne({ customerId: customerId });
    if (!existingCustomer) return res.status(400).send({ ...errorMessage, error: 'No customer found' });

    // Check Valid Contract Type
    if (!req.body.contractType || typeof req.body.contractType !== 'string') { return res.status(400).send({ ...errorMessage, error: 'Invalid contract type'})};
 
    // Check Trigger Steps
    if (!Array.isArray(req.body.triggerSteps)) { return res.status(400).send({ ...errorMessage, error: 'Missing trigger steps for smart contract'})}
    // Check Execution Steps
    if (!Array.isArray(req.body.executionSteps)) { return res.status(400).send({ ...errorMessage, error: 'Missing execution steps for smart contract'})}


    let contractId = Math.floor(Math.random() * Date.now())
    let smartContract = await initSmartContract(existingCustomer.customerId, req.body.contractType || 'covenant', {...req.body, contractId: contractId}) || {};
    eventEmitter.emit('contract',smartContract);
    return res.status(200).send(true)
}

module.exports.postContract = postContract;