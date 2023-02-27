const moment = require('moment');
const User  = require('../../Schemas/Users/UserSchema');
const { getCachedQueryResult } = require("../../Cache/RedisFunctions")

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const getBorrowerProfile = async (req, res) => {
    try {
        let cacheKey = `user:${req.userObj._id}`;
        let verifiedUser = await getCachedQueryResult(cacheKey, 1,User,{
            filterQuery: {_id: req.userObj._id },
            projectionQuery: { _id: 0, username: 1, email: 1, role: 1}
        });
        if (!verifiedUser) return res.status(200).send([]);
        return res.status(200).send(verifiedUser || {});
    } catch (err) {
        console.log(err)
        return res.status(400).send({...errorMessage, error: err});
    }
}

module.exports.getBorrowerProfile = getBorrowerProfile;