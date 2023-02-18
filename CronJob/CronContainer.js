const cron = require('node-cron');
const { fillBlockChainData } = require('../Blockchain/FillBlockChain');

const transactionCron = async () => {
    cron.schedule('*/5 * * * *', (err) => {
        console.log('Running transaction fill cron job at ' + new Date());
        fillBlockChainData();
        if (err) { 
            console.log(err)
        }
    });
}

module.exports.transactionCron = transactionCron;