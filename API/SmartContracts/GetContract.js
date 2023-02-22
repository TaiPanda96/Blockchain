const moment = require('moment');
const mongoOptimCustomer = require("../../Schemas/Customers/CustomerSchema");
const { getMultiKeysFromRedis, searchKeys } = require("../../Cache/RedisFunctions");
const { getNestedObject } = require("../../Utility");
const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getContract = async (req, res) => {
    let { customerId } = req.params;
    // Check Valid Customer
    let existingCustomer = await mongoOptimCustomer.findOne({ customerId: customerId });
    if (!existingCustomer) return res.status(400).send({ ...errorMessage, error: 'No customer found' });

    let keys = await searchKeys(`smartContract:${customerId}:*`);
    if (!keys) return res.status(400).send({ ...errorMessage, error: 'No transactions found' });

    let data = await getMultiKeysFromRedis(keys);
    if (!data) return res.status(400).send([]);

    let smartContracts = data.map(e => { return JSON.parse(e).map(e => {
        return {
            customerId: getNestedObject(e,['data','customerId']), 
            customerEmail:getNestedObject(e,['data','customerEmail']), 
            contractId: getNestedObject(e,['data','contractId']), 
            contractType: getNestedObject(e,['data','contractType']),
            trigger: getNestedObject(e,['data','triggerOn','0']),
            steps: getNestedObject(e,['data','executionSteps'])
        }
    })}).flat(1).filter(e => e['contractId'])
    return res.status(200).send(smartContracts || [])
}

module.exports.getContract = getContract;