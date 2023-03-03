const moment       = require('moment');
const User         = require("../../Schemas/Users/UserSchema");
const Transactions = require("../../Schemas/Transactions/TransactionsSchema");

const getSearch = async (req,res) => {
    let searchParam = {
        $search: {
            index: "AutoSearch",
            autocomplete: {
                query: req.query.search,
                path: req.query.search.includes("@") ? "email": "username",
                fuzzy: {
                    maxEdits: 1,
                },
                tokenOrder:"sequential"
            }
        }
    }
    let search = await User.aggregate([searchParam,
          {
            $limit: 20
          },
          {
            $project: {
              "_id": 0,
              "username": 1,
              "email": 1,
              "role" : 1,
              "customerName" :1,
              "joined": "$createdAt",
            }
          }
    ])
    return res.status(200).send(search || []);
}

module.exports.getSearch = getSearch;