const router = require('express').Router();

const transactionRoute = require("./LedgerTransactions/TransactionsRoutes");
const optimUserRoute   = require("./Customers/CustomerRoutes");
const contractRoute    = require("./SmartContracts/ContractRoutes");
router.use('/customers', optimUserRoute);
router.use('/transactions', transactionRoute);
router.use('/contracts', contractRoute)

module.exports = router;