const optimUserRoute  = require('express').Router();

const { login, register, checkPermissionsMiddleware } = require("./Authentication");

const { getBorrowerProfile } = require("./GetBorrower");
optimUserRoute.post('/register', register);
optimUserRoute.post('/login', login);
optimUserRoute.get('/get', checkPermissionsMiddleware, getBorrowerProfile);
const { updateBorrowerProfile } = require("./UpdateBorrower");
optimUserRoute.post('/update',checkPermissionsMiddleware,  updateBorrowerProfile)

module.exports = optimUserRoute;