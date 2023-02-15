const router = require('express').Router();

const transactionRoute = require("./Transactions/TransactionsRoutes");
const optimUserRoute   = require("./Customers/CustomerRoutes");
router.use('/customers', optimUserRoute)
router.use('/transactions', transactionRoute)

module.exports = router;