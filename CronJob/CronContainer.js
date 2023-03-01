const cron = require('node-cron');
const { fillBlockChainData } = require('../Blockchain/FillBlockChain');
const { checkRiskReviewSchedule } = require("../Triggers/RiskReview");

const transactionCron = async () => {
    cron.schedule('*/5 * * * *', (err) => {
        console.log('Running transaction fill cron job at ' + new Date());
        fillBlockChainData();
        if (err) { 
            console.log(err)
        }
    });
}

const riskReviewCron = async () => {
    cron.schedule('*/5 * * * *', (err) => {
        console.log('Running transaction fill cron job at ' + new Date());
        checkRiskReviewSchedule();
        if (err) { 
            console.log(err)
        }
    });

}

module.exports.transactionCron = transactionCron;
module.exports.riskReviewCron  = riskReviewCron;