require('dotenv').config();
const moment     = require('moment');
const express    = require("express");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cron       = require('node-cron');
const mongoose   = require('mongoose');

// Define Express App + Port #
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set Allow Access Control Origin
const allowedOrigins = ['http://localhost:3000'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, auth-token, Authorization, stripe-signature, APPS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return next();
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    let error = reason.stack.split("\n").map(e => e.trim()) || [];
    console.log(error);
});


let server = app.listen(PORT, (server) => { console.log(`Server is running on port ${PORT}.`) });

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;


mongoose.set("strictQuery", false);
mongoConnection = mongoose.connect(process.env.ATLASURI,
    {
        useNewUrlParser: false,
        useUnifiedTopology: true
    }
);
connectionDB = mongoose.connection
connectionDB.on("error", console.error.bind(console, "connection error: "));
connectionDB.once("open", function () {
    console.log("Connected successfully to MongoDB at", moment().toDate());
});

// Define Routes    
const routes = require('./API/Routes');
app.use('/api', routes);


// Blockchain
const { Blockchain } = require('./Blockchain/Ledger');
const { initializeLedger } = require("./Blockchain/FillBlockchain");


var ledger = new Blockchain(moment().toDate());
if (process.env.RUN === 'TRUE') {
    ledger.startGenesisBlock();
    if (process.env.SANDBOX === 'TRUE') {
        initializeLedger(ledger);
    }
}

// Event Framework
const { eventEmitter }   = require('./Triggers/GlobalEmitter');
const { deleteAllKeys }  = require('./Cache/RedisFunctions');
const { transactionCron } = require("./CronJob/CronContainer");
const { fillBlockChainData } = require('./Blockchain/FillBlockchain')
transactionCron();
// deleteAllKeys();
// fillBlockChainData();

// Handling
const { customerEventHandler, transactionEventHandler, smartContractEventHandler } = require('./Triggers/EventMonitoring');

eventEmitter.on("customer", async function verify(customerObj = {}) {
    return customerEventHandler(ledger, customerObj);
});

eventEmitter.on("transaction", async function verify(transactionObj = {}) {
    console.log('Event Triggered: Transaction');
    return transactionEventHandler(ledger, transactionObj);
});

eventEmitter.on("risk", async function verify(transactionObj = {}) {
    return transactionEventHandler(ledger, transactionObj);
});

eventEmitter.on('contract', async function verify(smartContract = {}) {
    return smartContractEventHandler(ledger, smartContract);
})