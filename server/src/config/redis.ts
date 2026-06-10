import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 2000),
  },
});

let isRedisReady = false;
let redisInitPromise: Promise<void> | null = null;

const connectRedis = async () => {
  if (redisInitPromise) {
    return redisInitPromise;
  }

  redisInitPromise = (async () => {
    try {
      await redisClient.connect();
      isRedisReady = true;
      console.log("Redis Connected");
    } catch (error) {
      console.warn("Redis unavailable, continuing without Redis cache.");
    }
  })();

  return redisInitPromise;
};

redisClient.on("error", (err) => {
  if (!isRedisReady) {
    return;
  }

  console.log("Redis Error:", err);
});

void connectRedis();

export default redisClient;
