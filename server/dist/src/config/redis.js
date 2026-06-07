"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => {
    console.log("Redis Error", err);
});
(async () => {
    await redisClient.connect();
})();
exports.default = redisClient;
