const moment              = require('moment');
const Borrower            = require("../../Schemas/Users/UserSchema");
const Transactions        = require("../../Schemas/Transactions/TransactionsSchema");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getRiskReviewNotifications = async (req,res) => {
    let existingBorrower = await Borrower.findOne({ _id: req.userObj._id });
    if (!existingBorrower) return res.status(400).send({ ...errorMessage, error: 'No borrower found' });
    let riskNotifications = await Transactions.aggregate([
        { $match: { borrowerId: req.userObj._id}},
        { $unwind: "$riskReview" },
        { $project : { "date": "$riskReview.date", "_id": 0, "title": "$riskReview.title", "upcoming": "$riskReview.upcoming", "reviewDate": "$riskReview.reviewDate" }},
        { $sort: { count: -1 } },
        { $limit: 10}
    ]);
    return res.status(200).send(riskNotifications || []);
}

const postNotifications = async (req,res) => {
    let existingBorrower = await Borrower.findOne({ _id: req.userObj._id });
    if (!existingBorrower) return res.status(400).send({ ...errorMessage, error: 'No borrower found' });
    let notificationObj = req.query.type === 'risk' ? {
        borrowerId: userObj._id,
        email: userObj.email,
        date: moment().local().toDate(),
        title: "Quarterly Review",
        upcoming: true,
        reviewDate: moment().add('5', 'hours').local().toDate(),
        requiredDocuments: ['3 Years of Financials', 'Entity Formation Document', 'Asset Agreement'],
        submittedTo: "" } : {
            borrowerId: userObj._id,
            email: userObj.email,
            date: moment().local().toDate(),
            reviewDate: moment().add('5', 'hours').local().toDate(),
            title: "Upcoming Compliance Reporting", 
            upcoming: true, 
            requiredDocuments: [],
            submitedTo: ""
        }
    let borrowerUpdatePromise = Borrower.updateOne({ _id: req.userObj._id}, { $set: { reviewDate: notificationObj.reviewDate}});
    let transactionsUpdatePromise = Transactions.updateOne({ borrowerId: req.userObj._id},{ $push: { riskReview: notificationObj}});

    Promise.all([borrowerUpdatePromise,transactionsUpdatePromise]).then((res) => {
        let [ borrowerUpdate, transactionUpdate ] = res;
        if (borrowerUpdate && transactionUpdate) {
            return res.status(200).send(notificationObj);
        } else {
            return res.status(200).send([]);
        }
    }).catch(error => {
        return res.status(400).send({ error: error, message: error.message})
    })


}

module.exports.postNotifications = postNotifications;
module.exports.getRiskReviewNotifications = getRiskReviewNotifications;