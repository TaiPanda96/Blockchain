const router = require('express').Router();

const transactionRoute = require("./Transactions/TransactionsRoutes");
const optimUserRoute   = require("./Borrower/BorrowerRoutes");
const contractRoute    = require("./SmartContracts/ContractRoutes");
const optimNotficationRoutes = require("./Notifications/NotificationRoutes");

router.use('/auth', optimUserRoute);
router.use('/transactions', transactionRoute);
router.use('/contracts', contractRoute);
router.use('/notifications',optimNotficationRoutes );

module.exports = router;