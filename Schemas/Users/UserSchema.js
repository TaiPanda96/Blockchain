const mongoose   = require("mongoose");
const { Schema } = mongoose;
const { connectionInstance } = require("../Connect");

const OptimUserSchema = new Schema({
  customerId: {
    type: String,
    required: true, 
    index: { unique: true },
  },
  orgLabel:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  username:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  email:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  password:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  userRole:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false
  }
});

var mongoOptimUser = connectionInstance.model('mongoOptimUser', OptimUserSchema, 'Customers');
module.exports = mongoOptimUser;