const moment = require('moment');
const Borrower = require("../../Schemas/Users/UserSchema");
const { eventEmitter } = require('../../Triggers/GlobalEmitter');
const { getNestedObject } = require("../../Utility");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const postTransaction = async (req, res) => {
    // Check Valid Customer
    let existingBorrower = await Borrower.findOne({ _id: req.userObj._id });
    if (!existingBorrower) return res.status(400).send({ ...errorMessage, error: 'No customer found' });

    let { type } = req.query;

    // Check Valid Type;
    if (type) { if (typeof type !== 'string') return res.status(400).send({ ...errorMessage, error: 'Invalid transaction type' })}

    // Check Valid Transaction
    if (isNaN(req.body.amount)) return res.status(400).send({ ...errorMessage, error: 'Invalid amount transacted' });

    // Check Valid Interest Amount
    if (isNaN(req.body.interest)) return res.status(400).send({ ...errorMessage, error: 'Invalid interest defined' });

    // Check Valid Loan Term
    if (isNaN(req.body.term)) return res.status(400).send({ ...errorMessage, error: 'Invalid term length' });

    // Check Valid Loan To Value
    if (isNaN(req.body.loanToValue)) return res.status(400).send({ ...errorMessage, error: 'Invalid term length for transaction defined' });

    // Check Valid Transaction Date 
    if (!moment(req.body.transactionDate, 'YYYY-MM-DD').local().isValid()) return res.status(400).send({ ...errorMessage, error: 'Invalid transaction date' });

    let transaction = {
        borrowerId: existingBorrower._id.toString(),
        customerId: getNestedObject(req.body, ['customerId']) || '',
        assetClass: getNestedObject(req.body, ['assetClass']) || '',
        amount: getNestedObject(req.body, ['amount']) || '',
        term: getNestedObject(req.body, ['term']) || '',
        interest: getNestedObject(req.body, ['interest']) || '',
        loanToValue: getNestedObject(req.body, ['loanToValue']) || '',
        facilityID: getNestedObject(req.body, ['facilityID']) || '',
        facilityName: getNestedObject(req.body, ['facilityName']) || '',
        transactionDate: moment(getNestedObject(req.body, ['transactionDate']) || '', 'YYYY-MM-DD'),
    }
    try {
        eventEmitter.emit('transaction', transaction)
        return res.status(200).send(true);
    } catch (err) {
        return res.status(400).send({ error: err });
    }

}

module.exports.postTransaction = postTransaction;