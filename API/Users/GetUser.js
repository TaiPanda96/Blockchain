const moment = require('moment');
const { eventEmitter }   = require("../../Triggers/GlobalEmitter");
const mongoOptimUser     = require("../../Schemas/Users/UserSchema");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getUser = async (req, res) => {
    let { id } = req.query;
    if (typeof email !== 'string' ) { return res.status(400).send({...errorMessage, error: 'Invalid customer id'})}
    let customer = await mongoOptimUser.findById({_id :id}) || null;
    if (!customer) { return res.status(400).send({...errorMessage, error: `Invalid customer email ${email}`})}
    try {
        eventEmitter.emit('customer', customer);
        return res.status(200).send(customer || {});
    } catch (err) {
        console.log(err)
    }
}

module.exports.getUser = getUser;