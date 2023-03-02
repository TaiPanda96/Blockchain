const moment = require('moment');
const Transaction = require("../../Schemas/Transactions/TransactionsSchema");
const { getCachedQueryResult } = require("../../Cache/RedisFunctions")

const getAssetClassStats = async (req,res) => {
    // Get top 5 asset classes
    let top5AssetClasses = await Transaction.aggregate([
        { $match: { borrowerId: req.userObj._id} },
        { $unwind: "$blockChainSnapshot" },
        { $group: { _id: "$blockChainSnapshot.data.assetClass", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ])
    return res.status(200).send(top5AssetClasses.filter(e => e._id !== null))
}

const getTransactionStats = async (req, res) => {
    // Get top 5 highest amount transactions
    let facilityStats = await Transaction.aggregate([
        { $match: { borrowerId: req.userObj._id } },
        { $unwind: "$blockChainSnapshot" },
        { $group: { _id: "$blockChainSnapshot.data.assetClass", count: { $sum: 1 }, totalAmount: { $sum: "$blockChainSnapshot.data.amount" } } },
        { $project: { _id: 1 , count: 1, totalAmount: 1 }},
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
    ]);
    return res.status(200).send({ chartTitle: 'Transactions by Facility', chartData: facilityStats.filter(e => e._id !== null) || []});
}

const getTransactionStatsByDate = async (req, res) => {
    // Get top 5 dates with highest volume of transactions
    let transactionStats = await Transaction.aggregate([
        { $match: { borrowerId: req.userObj._id }},
        { $unwind: "$blockChainSnapshot" },
        { $addFields: {
            transactionDateMinute: { 
                $minute: { 
                    $dateFromString: { dateString: "$blockChainSnapshot.data.transactionDate" } 
                } 
            },
            transactionMonth: {
                $month: { 
                    $dateFromString: { dateString: "$blockChainSnapshot.data.transactionDate" } 
                } 
            },
            transactionDay: { 
                $dayOfMonth: { 
                    $dateFromString: { dateString: "$blockChainSnapshot.data.transactionDate" } 
                } 
            },
            transactionDateHour: { 
                $hour: { 
                    $dateFromString: { dateString: "$blockChainSnapshot.data.transactionDate" } 
                } 
            },
            transactionDateYear: { 
                $year: { 
                    $dateFromString: { dateString: "$blockChainSnapshot.data.transactionDate" } 
                } 
            },

        }},
        { $group: {
            "_id": {
                "year": "$transactionDateYear",
                "month": "$transactionMonth",
                "day": "$transactionDay",
                "hour": "$transactionDateHour",
                "interval": {
                    "$subtract": [ 
                      { "$minute": { $dateFromString: { dateString: "$blockChainSnapshot.data.transactionDate" }}
                        },
                      { "$mod": [{ "$minute": { $dateFromString: { dateString: "$blockChainSnapshot.data.transactionDate" }}}, 60] }
                    ]
                  }
            },
            count: { $sum: 1}
        }},
        { $project: { _id: 0, year: "$_id.year" , month: "$_id.month", day: "$_id.day",hour: "$_id.hour", count: 1}},
        { $sort: { hour : -1 } },
        { $limit: 10 }
    ]);
    return res.status(200).send({ chartTitle: 'Hourly Requests', chartData: transactionStats.filter(e => e._id !== null) || []});

}

module.exports = {
    getAssetClassStats,
    getTransactionStats,
    getTransactionStatsByDate
}