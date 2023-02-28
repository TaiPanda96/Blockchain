const optimUserRoute  = require('express').Router();

const { login, register } = require("./Login");
const { addHeader, checkPermissionsMiddleware } = require("../Middleware/Auth");
const { addFacility } = require('./AddFacility');
const { getFacility } = require("./GetFacility");

const { getBorrowerProfile } = require("./GetBorrower");
// Registration
optimUserRoute.post('/register', register);
// Login
optimUserRoute.post('/login',login);
// Get Facility
optimUserRoute.get("/get-facility", checkPermissionsMiddleware, getFacility);
// Post a Facility
optimUserRoute.post('/add-facility', checkPermissionsMiddleware, addFacility);

// Get a Profile
optimUserRoute.get('/get', checkPermissionsMiddleware, getBorrowerProfile);
// Update a Profile
const { updateBorrowerProfile } = require("./UpdateBorrower");
optimUserRoute.post('/update', checkPermissionsMiddleware,  updateBorrowerProfile)

module.exports = optimUserRoute;