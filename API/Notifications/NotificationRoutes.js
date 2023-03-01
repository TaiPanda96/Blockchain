const optimNotficationRoutes  = require('express').Router();
const { checkPermissionsMiddleware } = require("../Middleware/Auth");
const { getRiskReviewNotifications } = require("./RiskNotifications");
// Get Facility
optimNotficationRoutes.get("/risk-notifications", checkPermissionsMiddleware, getRiskReviewNotifications);

module.exports = optimNotficationRoutes;