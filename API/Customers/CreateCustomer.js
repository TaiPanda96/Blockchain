const moment = require('moment');
const { initalizeCustomer } = require("../../Schemas/Customers/Init");
const mongoOptimCustomer = require("../../Schemas/Customers/CustomerSchema");
const { eventEmitter } = require('../../Triggers/GlobalEmitter');

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const createCustomer = async (req, res) => {
    if (Object.keys(req.body).some(key => {
        if (!req.body[key]) { return res.status(400).send({ ...errorMessage, error: `Invalid parameter ${key}` }) }
    }));
    const customer = await initalizeCustomer(req.body);
    if (!customer) { return res.status(400).send({ ...errorMessage, error: `Invalid customer object` }) }
    await mongoOptimCustomer.updateOne({ customerName: customer.customerName }, { ...customer }, { upsert: true, setDefaultsOnInsert: true });
    try {
        eventEmitter.emit('customer', { ...customer, updatedAt: moment().toDate() });
        return res.status(200).send({ message: `Customer created successfully` });
    } catch (err) {
        console.log(err)
    }
}

module.exports.createCustomer = createCustomer;