const moment = require('moment');
const User  = require('../../Schemas/Users/UserSchema');
const { getCachedQueryResult } = require("../../Cache/RedisFunctions")

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getBorrowerProfile = async (req, res) => {
    let { id } = req.query;
    if (typeof id !== 'string' ) { return res.status(400).send({...errorMessage, error: 'Invalid customer id'})};
    let userCacheKey = `user:${id}`;
    let cacheExpiry = 3600;
    let output = await getCachedQueryResult(userCacheKey, cacheExpiry,User, {
        filterQuery: { _id :id },
        projectionQuery: {
            email: 1,
            username: 1, 
            role:1
        }, methodName: 'findById'
    });
    let userProfile = output;
    try {
        return res.status(200).send(userProfile || {});
    } catch (err) {
        return res.status(400).send({error: err});
    }
}

module.exports.getBorrowerProfile = getBorrowerProfile;