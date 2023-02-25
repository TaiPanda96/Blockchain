const mongoose   = require("mongoose");
const { Schema } = mongoose;
const { connectionInstance } = require("../MongoConnect");

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
  customerName:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerType:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerAddress:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerCity:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerState:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerZip:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerCountry:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerPhone:  {
    type: Number,
    required: false, 
    unique: false,
    trim: true,
  },
  customerEmail:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerWebsite:  {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerIndustry:  {
    type: String,
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerIndustrySub: {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  customerSIC: {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  }, 
  customerNAICS: {
    type: String,
    required: false, 
    unique: false,
    trim: true,
  },
  blockChainSnapshot: {
    type: Array,
    required: false, 
    unique: false,
    trim: true,
  },
  smartContracts: {
    type: Array,
    required: false, 
    unique: false,
    trim: true,
  },
  customerCreated: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now,
  }
});

var mongoOptimCustomer = connectionInstance.model('mongoOptimBorrower', OptimUserSchema, 'Borrowers');
module.exports = mongoOptimCustomer;