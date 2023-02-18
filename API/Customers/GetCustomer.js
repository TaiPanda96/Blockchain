const moment = require('moment');
const mongoOptimCustomer  = require('../../Schemas/Customers/CustomerSchema');

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getCustomer = async (req, res) => {
    let { customerId } = req.query;
    if (typeof customerId !== 'string' ) { return res.status(400).send({...errorMessage, error: 'Invalid customer id'})}
    let customer = await mongoOptimCustomer.findOne({customerId:customerId}, {
        customerId: 1,
        orgLabel: 1,
        customerName: 1,
        customerType: 1,
        customerAddress: 1,
        customerCity: 1,
        customerZip: 1,
        customerCountry: 1,
        customerPhone: 1,
        customerEmail: 1,
        customerWebsite: 1,
        customerIndustry: 1,
        customerInddustrySub: 1,
        customerSIC: 1,
        customerNAICS: 1
    }) || null;
    if (!customer) { return res.status(400).send({...errorMessage, error: `Customer not found.`})}
    try {
        return res.status(200).send(customer || {});
    } catch (err) {
        return res.status(400).send({error: err});
    }
}

module.exports.getCustomer = getCustomer;