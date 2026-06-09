"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const redis_1 = __importDefault(require("./config/redis"));
const socket_1 = require("./socket");
(async () => {
    await redis_1.default.set("project", "movie-reservation");
    const value = await redis_1.default.get("project");
    console.log("Redis Test:", value);
})();
const server = http_1.default.createServer(app_1.default);
(0, socket_1.initializeSocket)(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
