const optimUserRoute  = require('express').Router();

const { login, register, checkPermissionsMiddleware } = require("./Authentication");

const { getBorrowerProfile } = require("./GetBorrower");
// Registration
optimUserRoute.post('/register', register);
// Login
optimUserRoute.post('/login', login);


// Get a Profile
optimUserRoute.get('/get', getBorrowerProfile);
// Update a Profile
const { updateBorrowerProfile } = require("./UpdateBorrower");
optimUserRoute.post('/update',checkPermissionsMiddleware,  updateBorrowerProfile)

module.exports = optimUserRoute;