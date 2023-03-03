const searchRoutes  = require('express').Router();

const { checkPermissionsMiddleware } = require("../Middleware/Auth");

const { getSearch } = require("./Autocomplete");
searchRoutes.get('/get-user', checkPermissionsMiddleware, getSearch);

module.exports = searchRoutes;