const moment = require('moment');
const mongoOptimCustomer = require("../../Schemas/Customers/CustomerSchema");
const { getCachedQueryResult } = require("../../Cache/RedisFunctions")

const getAssetClassStats = async (req,res) => {
    let { customerId } = req.query;
    // Get top 5 asset classes
    let top5AssetClasses = await mongoOptimCustomer.aggregate([
        { $match: { customerId: customerId} },
        { $unwind: "$blockChainSnapshot" },
        { $group: { _id: "$blockChainSnapshot.data.assetClass", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ])
    return res.status(200).send(top5AssetClasses.filter(e => e._id !== null))
}

const getTransactionStats = async (req, res) => {
    let { customerId } = req.query;
    // Get top 5 highest amount transactions
    let facilityStats = await mongoOptimCustomer.aggregate([
        { $match: { customerId: customerId } },
        { $unwind: "$blockChainSnapshot" },
        { $group: { _id: "$blockChainSnapshot.data.facilityName",totalAmount: { $sum: "$blockChainSnapshot.data.amount" } } },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
    ]);
    return res.status(200).send(facilityStats);
}

const getTransactionStatsByDate = async (req, res) => {
    let { customerId } = req.query;
    // Get top 5 dates with highest volume of transactions
    let transactionStats = await mongoOptimCustomer.aggregate([
        { $match: { customerId: customerId } },
        { $unwind: "$blockChainSnapshot" },
        { $group: { _id: "$blockChainSnapshot.data.transactionDate", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    return res.status(200).send(transactionStats.filter(e => e._id !== null));

}

module.exports = {
    getAssetClassStats,
    getTransactionStats,
    getTransactionStatsByDate
}