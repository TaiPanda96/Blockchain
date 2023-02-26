const moment = require('moment');
const Borrower = require("../../Schemas/Users/UserSchema");
const { getMultiKeysFromRedis, searchKeys } = require("../../Cache/RedisFunctions");
const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getContract = async (req, res) => {
    let { borrowerId } = req.params;
    // Check Valid Customer
    let existingCustomer = await Borrower.findById(borrowerId);
    if (!existingCustomer) return res.status(400).send({ ...errorMessage, error: 'No customer found' });

    let keys = await searchKeys(`smartContract:${borrowerId}:*`);
    if (!keys) return res.status(400).send({ ...errorMessage, error: 'No transactions found' });

    let data = await getMultiKeysFromRedis(keys);
    if (!data) return res.status(400).send([]);

    let smartContracts = data.map(e => { return JSON.parse(e).map(e => {
        return { ...e }
    })}).flat(1).map(e => e.data).filter(e => e['contractId'])
    return res.status(200).send(smartContracts || [])
}

module.exports.getContract = getContract;