const moment = require('moment');
const User    = require("../../Schemas/Users/UserSchema");
const Transactions = require("../../Schemas/Transactions/TransactionsSchema");
const { eventEmitter }      = require('../../Triggers/GlobalEmitter');
const { initSmartContract } = require("../../SmartContracts/CreateContract");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const postContract = async (req,res) => {
    // Check Valid Customer
    let borrowerId = req.userObj._id;
    let existingCustomer = await User.findOne({ _id: borrowerId });
    if (!existingCustomer) return res.status(400).send({ ...errorMessage, error: 'No customer found' });

    // Check Valid Contract Type
    if (!req.body.contractType || typeof req.body.contractType !== 'string') { return res.status(400).send({ ...errorMessage, error: 'Invalid contract type'})};
 
    // Check Trigger Steps
    if (!Array.isArray(req.body.triggerSteps)) { return res.status(400).send({ ...errorMessage, error: 'Missing trigger steps for smart contract'})}
    // Check Execution Steps
    if (!Array.isArray(req.body.executionSteps)) { return res.status(400).send({ ...errorMessage, error: 'Missing execution steps for smart contract'})}

    let contractId = Math.floor(Math.random() * Date.now())
    let smartContract = await initSmartContract(req.body.contractType || 'covenant', {...req.body,...existingCustomer._doc, contractId}) || {};
    Transactions.updateOne({borrowerId: borrowerId }, {$push: { smartContracts: {contractId,...smartContract}}}).then(() => {
        eventEmitter.emit('contract',{contractId,...smartContract});
        return res.status(200).send(true)
    }).catch(err => { console.log(err)
        return res.status(400).send([]) })
}

module.exports.postContract = postContract;