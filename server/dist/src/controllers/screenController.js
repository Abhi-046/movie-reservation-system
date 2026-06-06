"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreens = exports.createScreen = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createScreen = async (req, res) => {
    try {
        const { name, theatreId } = req.body;
        const screen = await prisma_1.default.screen.create({
            data: {
                name,
                theatreId,
            },
        });
        res.status(201).json({
            success: true,
            screen,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create screen",
        });
    }
};
exports.createScreen = createScreen;
const getScreens = async (req, res) => {
    try {
        const screens = await prisma_1.default.screen.findMany({
            include: {
                theatre: true,
            },
        });
        res.json({
            success: true,
            screens,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch screens",
        });
    }
};
exports.getScreens = getScreens;
