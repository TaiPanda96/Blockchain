const mongoose = require("mongoose");
const { Schema } = mongoose;
const { connectionInstance } = require("../MongoConnect");

const OptimTransactionSchema = new Schema({
    borrowerId: {
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

var mongoOptimTransactions = connectionInstance.model('mongoOptimTransactions', OptimTransactionSchema, 'Transactions');
module.exports = mongoOptimTransactions;