"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Client Connected:", socket.id);
        socket.on("join-showtime", (showtimeId) => {
            socket.join(showtimeId);
            console.log(`${socket.id} joined ${showtimeId}`);
        });
        socket.on("disconnect", () => {
            console.log("Client Disconnected");
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }
    return io;
};
exports.getIO = getIO;
