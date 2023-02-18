// Connect to Redis
const { redisClient } = require('./Connect');

const getKeyFromRedis = async (key) => {
    let data = await redisClient.get(key);
    if (!data) return 
    return JSON.parse(JSON.stringify(data) || {})
}

const getMultiKeysFromRedis = async (keys = []) => {
    let data = await redisClient.mget(keys);
    if (!data) return 
    return JSON.parse(JSON.stringify(data) || {});
}

const searchKeys = async (string = '') => new Promise((resolve,reject) => {
    return redisClient.scan(0, 'MATCH', string, async (err,reply) => {
        if (err) { console.log(err)}
        let cacheKey;
        if (reply) { cacheKey = reply[1] ? reply[1] : null }
        if (!cacheKey) { resolve([])}
        resolve(reply[1])
    })
});

const addToCache = async (key, redisUpdates = []) => {
    return new Promise((resolve,reject) => {
        redisClient.mset({ [`${key}`]: JSON.stringify(redisUpdates) }, (err, reply) => {
            if (err) { console.log(err) }
            console.log(reply)
            resolve(true)
        });
    });
}

const deleteAllKeys = async () => {
    return new Promise((resolve,reject) => {
        redisClient.flushall((err, reply) => {
            if (err) { console.log(err) }
            console.log(reply)
            resolve(true)
        });
    });
}


module.exports.searchKeys = searchKeys;
module.exports.getKeyFromRedis = getKeyFromRedis;
module.exports.getMultiKeysFromRedis = getMultiKeysFromRedis;
module.exports.addToCache = addToCache;
module.exports.deleteAllKeys = deleteAllKeys;


