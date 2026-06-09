import dotenv from "dotenv";
dotenv.config();

import http from "http";

import app from "./app";
import redisClient from "./config/redis";

import { initializeSocket } from "./socket";

(async () => {
  await redisClient.set("project", "movie-reservation");

  const value = await redisClient.get("project");

  console.log("Redis Test:", value);
})();

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
