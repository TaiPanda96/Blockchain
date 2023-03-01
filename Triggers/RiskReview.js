const moment       = require("moment");
const Borrower     = require("../Schemas/Users/UserSchema");
const Transactions = require("../Schemas/Transactions/TransactionsSchema");

const checkRiskReviewSchedule = async () => {
    let borrowers = await Borrower.find({ role: "borrower", $or: [{ rewviewDate: {$exists:false}}, { reviewDate: {$lte: moment().toDate()}}]});
    let bulkWriteTransactions = [];
    let bulkWriteUsers = [];
    if (Array.isArray(borrowers) && borrowers.length > 0) {
        borrowers.forEach(async (userObj) => {
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
            bulkWriteTransactions.push({
                updateOne: {
                  "filter": { borrowerId: userObj._id },
                  "update": { $push: { riskReview: riskReviewNotification} },
                  "upsert": true,
                  "setDefaultsOnInsert": false,
                }
              });
            bulkWriteUsers.push({
                updateOne: {
                    "filter": { _id: userObj._id },
                    "update": { $set: { reviewDate : riskReviewNotification.reviewDate } },
                    "upsert": true,
                    "setDefaultsOnInsert": false,
                  }
            });
        });

        if (bulkWriteTransactions.length > 0 ) {
            Transactions.bulkWrite(bulkWriteTransactions).then((res) => {
                console.log("Completed update", res['ok'])
            }).catch(err => {
                console.log(err)
            });
        }

        if (bulkWriteTransactions) {
            Borrower.bulkWrite(bulkWriteUsers).then((res) => {
                console.log("Completed update", res['ok'])
            }).catch(err => {
                console.log(err)
            });
        }
    }

}
module.exports.checkRiskReviewSchedule = checkRiskReviewSchedule;