const router = require('express').Router();

const transactionRoute = require("./Transactions/TransactionsRoutes");
const optimUserRoute   = require("./Borrower/Authroutes");
const contractRoute    = require("./SmartContracts/ContractRoutes");

router.use('/auth', optimUserRoute);
router.use('/transactions', transactionRoute);
router.use('/contracts', contractRoute)

module.exports = router;