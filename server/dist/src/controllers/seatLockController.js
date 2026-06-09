"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockSeats = exports.lockSeats = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const socket_1 = require("../socket");
const lockSeats = async (req, res) => {
    try {
        const { showtimeId, seatIds, userId } = req.body;
        for (const seatId of seatIds) {
            const key = `seat:${showtimeId}:${seatId}`;
            const alreadyLocked = await redis_1.default.get(key);
            if (alreadyLocked) {
                return res.status(400).json({
                    success: false,
                    message: `Seat ${seatId} already locked`,
                });
            }
        }
        for (const seatId of seatIds) {
            const key = `seat:${showtimeId}:${seatId}`;
            await redis_1.default.set(key, userId, {
                EX: 300,
            });
        }
        (0, socket_1.getIO)()
            .to(showtimeId)
            .emit("seat-locked", seatIds);
        return res.json({
            success: true,
            message: "Seats locked successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Lock failed",
        });
    }
};
exports.lockSeats = lockSeats;
const unlockSeats = async (req, res) => {
    try {
        const { showtimeId, seatIds } = req.body;
        for (const seatId of seatIds) {
            await redis_1.default.del(`seat:${showtimeId}:${seatId}`);
        }
        (0, socket_1.getIO)()
            .to(showtimeId)
            .emit("seat-unlocked", seatIds);
        return res.json({
            success: true,
            message: "Seats unlocked",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.unlockSeats = unlockSeats;
