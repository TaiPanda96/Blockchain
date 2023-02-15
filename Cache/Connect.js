// Base Imports
var RedisPipeline = require("ioredis");

// Redis Connection
const REDIS_HOST = process.env.REDIS_HOST || "localhost";

const connectRedis = () => {
    var redisClient =  new RedisPipeline(`redis://${REDIS_HOST}:6379`);
    redisClient.on("error", function (error) {
        console.error(error);
    });
    redisClient.on("connect", function () {
        console.log("Redis client connected at " + REDIS_HOST + ":6379");
    });

    return redisClient;
}

var redisClient = connectRedis();
module.exports.redisClient = redisClient; 