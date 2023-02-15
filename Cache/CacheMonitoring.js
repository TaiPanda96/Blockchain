const moment = require('moment');

const { searchKeys, getKeyFromRedis, addToCache } = require('../Cache/RedisFunctions');

const monitorServer = async () => {
    let date = moment().toDate();

    // if the blockchain cache is empty, flag

}