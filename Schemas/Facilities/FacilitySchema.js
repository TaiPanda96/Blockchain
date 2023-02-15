const mongoose   = require("mongoose");
const { Schema } = mongoose;
const { connectionInstance } = require("../Connect");

const OptimFacilitySchema = new Schema({
  customerId: {
    type: String,
    required: true, 
    index: { unique: true },
  },
  facilityUpdated: {
    type: Date,
    required: false,
    default: Date.now,
  }
});

var mongoOptimFacility = connectionInstance.model('mongoOptimFacility', OptimFacilitySchema, 'Facilities');
module.exports = mongoOptimFacility;