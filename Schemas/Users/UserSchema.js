const mongoose   = require("mongoose");
const { Schema } = mongoose;
const { connectionInstance } = require("../MongoConnect");

const OptimUserSchema = new Schema({
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
  role:  {
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

var mongoOptimUser = connectionInstance.model('mongoOptimUser', OptimUserSchema, 'Users');
module.exports = mongoOptimUser;