const moment       = require("moment");
const Borrower     = require("../Schemas/Users/UserSchema");
const Transactions = require("../Schemas/Transactions/TransactionsSchema");

const checkRiskReviewSchedule = async (userObj) => {
    
}

const initializeRiskReviewSchedule = async (userObj) => {
    let riskReviewNotification = {
        borrowerId: userObj._id,
        email: userObj.email,
        date: moment().local().toDate(),
        title: "Risk & Compliance",
        upcoming: true,
        reviewDate: moment().add('5', 'hours').local().toDate(),
        requiredDocuments: ['3 Years of Financials', 'Entity Formation Document', 'Asset Agreement'],
        submittedTo: ""
    }
    await Transactions.updateOne({borrowerId: userObj._id}, { $set: riskReviewNotification }, { upsert: true, setDefaultsOnInsert: false});
    await Borrower.updateOne({_id: userObj._id }, { $set: { upcomingReview: riskReviewNotification.reviewDate }});
}

module.exports.initializeRiskReviewSchedule = initializeRiskReviewSchedule;