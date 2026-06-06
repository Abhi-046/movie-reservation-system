"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShowtimesByMovie = exports.getShowtimes = exports.createShowtime = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createShowtime = async (req, res) => {
    try {
        const { movieId, screenId, startTime, endTime, price } = req.body;
        const conflict = await prisma_1.default.showtime.findFirst({
            where: {
                screenId,
                AND: [
                    {
                        startTime: {
                            lt: new Date(endTime),
                        },
                    },
                    {
                        endTime: {
                            gt: new Date(startTime),
                        },
                    },
                ],
            },
        });
        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Screen already occupied during this time",
            });
        }
        const showtime = await prisma_1.default.showtime.create({
            data: {
                movieId,
                screenId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                price,
            },
        });
        res.status(201).json({
            success: true,
            showtime,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create showtime",
        });
    }
};
exports.createShowtime = createShowtime;
const getShowtimes = async (req, res) => {
    const showtimes = await prisma_1.default.showtime.findMany({
        include: {
            movie: true,
            screen: true,
        },
    });
    res.json({
        success: true,
        showtimes,
    });
};
exports.getShowtimes = getShowtimes;
const getShowtimesByMovie = async (req, res) => {
    const movieId = Array.isArray(req.params.movieId)
        ? req.params.movieId[0]
        : req.params.movieId;
    const showtimes = await prisma_1.default.showtime.findMany({
        where: {
            movieId,
        },
        include: {
            screen: {
                include: {
                    theatre: true,
                },
            },
        },
    });
    res.json({
        success: true,
        showtimes,
    });
};
exports.getShowtimesByMovie = getShowtimesByMovie;
