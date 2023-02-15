const optimUserRoute  = require('express').Router();

const { getCustomer } = require("./GetCustomer");
optimUserRoute.get('/auth-get', getCustomer);

const { createCustomer } = require("./CreateCustomer");
optimUserRoute.post('/auth-create', createCustomer);

module.exports = optimUserRoute;