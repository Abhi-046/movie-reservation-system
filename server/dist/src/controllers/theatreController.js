"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheatres = exports.createTheatre = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createTheatre = async (req, res) => {
    try {
        const theatre = await prisma_1.default.theatre.create({
            data: req.body,
        });
        res.status(201).json({
            success: true,
            theatre,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create theatre",
        });
    }
};
exports.createTheatre = createTheatre;
const getTheatres = async (req, res) => {
    try {
        const theatres = await prisma_1.default.theatre.findMany({
            include: {
                screens: true,
            },
        });
        res.json({
            success: true,
            theatres,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch theatres",
        });
    }
};
exports.getTheatres = getTheatres;
