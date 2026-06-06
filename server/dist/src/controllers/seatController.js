"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatsByScreen = exports.generateSeats = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../config/prisma"));
const generateSeats = async (req, res) => {
    try {
        const { screenId } = req.body;
        if (typeof screenId !== "string" || !screenId.trim()) {
            return res.status(400).json({
                success: false,
                message: "screenId is required",
            });
        }
        const screen = await prisma_1.default.screen.findUnique({
            where: {
                id: screenId,
            },
        });
        if (!screen) {
            return res.status(404).json({
                success: false,
                message: "Screen not found",
            });
        }
        const seats = [];
        const rows = ["A", "B", "C", "D", "E"];
        for (const row of rows) {
            for (let number = 1; number <= 10; number++) {
                let category = client_1.SeatCategory.SILVER;
                if (row === "D") {
                    category = client_1.SeatCategory.GOLD;
                }
                if (row === "E") {
                    category = client_1.SeatCategory.PLATINUM;
                }
                seats.push({
                    row,
                    number,
                    category,
                    screenId,
                });
            }
        }
        await prisma_1.default.seat.createMany({
            data: seats,
            skipDuplicates: true,
        });
        return res.status(201).json({
            success: true,
            seatsCreated: seats.length,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Seat generation failed",
        });
    }
};
exports.generateSeats = generateSeats;
const getSeatsByScreen = async (req, res) => {
    try {
        const { screenId } = req.params;
        if (typeof screenId !== "string" || !screenId.trim()) {
            return res.status(400).json({
                success: false,
                message: "screenId is required",
            });
        }
        const seats = await prisma_1.default.seat.findMany({
            where: {
                screenId,
            },
            orderBy: [
                {
                    row: "asc",
                },
                {
                    number: "asc",
                },
            ],
        });
        return res.json({
            success: true,
            seats,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch seats",
        });
    }
};
exports.getSeatsByScreen = getSeatsByScreen;
