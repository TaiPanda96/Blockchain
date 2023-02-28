const moment = require('moment');
const Borrower = require("../../Schemas/Users/UserSchema");
const { eventEmitter } = require('../../Triggers/GlobalEmitter');
const { getNestedObject } = require("../../Utility");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const postNotifications = async (req,res) => {
    // Check Valid Customer
    let { type } = req.query;
    let existingBorrower = await Borrower.findOne({ _id: req.body.borrowerId });
    if (!existingBorrower) return res.status(400).send({ ...errorMessage, error: 'No customer found' });
    const notificationObj = {
        date: moment().toDate(), 
        type: type, 
        title: "Upcoming Risk Review",
        details: {}
    }

    
    return res.status(200).send(notificationObj);
}

module.exports.postNotifications = postNotifications