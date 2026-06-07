"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOccupancy = exports.getTopMovies = exports.getRevenueReport = exports.getAllReservations = exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalMovies, totalReservations, revenue] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.movie.count(),
            prisma_1.default.reservation.count(),
            prisma_1.default.reservation.aggregate({
                _sum: {
                    totalAmount: true,
                },
            }),
        ]);
        return res.json({
            success: true,
            stats: {
                totalUsers,
                totalMovies,
                totalReservations,
                totalRevenue: revenue._sum.totalAmount || 0,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllReservations = async (req, res) => {
    try {
        const reservations = await prisma_1.default.reservation.findMany({
            include: {
                user: true,
                showtime: {
                    include: {
                        movie: true,
                        screen: {
                            include: {
                                theatre: true,
                            },
                        },
                    },
                },
                reservedSeats: {
                    include: {
                        seat: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json({
            success: true,
            reservations,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.getAllReservations = getAllReservations;
const getRevenueReport = async (req, res) => {
    try {
        const revenue = await prisma_1.default.reservation.aggregate({
            _sum: {
                totalAmount: true,
            },
        });
        const bookings = await prisma_1.default.reservation.count();
        return res.json({
            success: true,
            revenue: revenue._sum.totalAmount || 0,
            bookings,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.getRevenueReport = getRevenueReport;
const getTopMovies = async (req, res) => {
    try {
        const movies = await prisma_1.default.movie.findMany({
            include: {
                showtimes: {
                    include: {
                        reservations: true,
                    },
                },
            },
        });
        const result = movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            bookings: movie.showtimes.reduce((acc, showtime) => acc + showtime.reservations.length, 0),
        }));
        result.sort((a, b) => b.bookings - a.bookings);
        return res.json({
            success: true,
            movies: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.getTopMovies = getTopMovies;
const getOccupancy = async (req, res) => {
    try {
        const totalSeats = await prisma_1.default.seat.count();
        const bookedSeats = await prisma_1.default.reservedSeat.count();
        const occupancy = totalSeats === 0 ? 0 : ((bookedSeats / totalSeats) * 100).toFixed(2);
        return res.json({
            success: true,
            totalSeats,
            bookedSeats,
            occupancy: occupancy + "%",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.getOccupancy = getOccupancy;
