"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReservation = exports.getReservationById = exports.getMyReservations = exports.getAvailableSeats = exports.createReservation = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const socket_1 = require("../socket");
const createReservation = async (req, res) => {
    try {
        const { showtimeId, seatIds = [] } = req.body;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!showtimeId || seatIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "showtimeId and seatIds required",
            });
        }
        const showtime = await prisma_1.default.showtime.findUnique({
            where: {
                id: showtimeId,
            },
        });
        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: "Showtime not found",
            });
        }
        const booking = await prisma_1.default.$transaction(async (tx) => {
            const alreadyBooked = await tx.reservedSeat.findMany({
                where: {
                    showtimeId,
                    seatId: {
                        in: seatIds,
                    },
                },
            });
            if (alreadyBooked.length > 0) {
                throw new Error("SEATS_ALREADY_BOOKED");
            }
            const createdReservation = await tx.reservation.create({
                data: {
                    userId: req.user.id,
                    showtimeId,
                    totalAmount: seatIds.length * showtime.price,
                },
            });
            await tx.reservedSeat.createMany({
                data: seatIds.map((seatId) => ({
                    seatId,
                    showtimeId,
                    reservationId: createdReservation.id,
                })),
            });
            await tx.reservationSeat.createMany({
                data: seatIds.map((seatId) => ({
                    seatId,
                    reservationId: createdReservation.id,
                })),
            });
            return createdReservation;
        });
        (0, socket_1.getIO)().to(showtimeId).emit("seat-booked", seatIds);
        return res.status(201).json({
            success: true,
            reservation: booking,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "SEATS_ALREADY_BOOKED") {
            return res.status(400).json({
                success: false,
                message: "Seats already booked",
            });
        }
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Reservation failed",
        });
    }
};
exports.createReservation = createReservation;
const getAvailableSeats = async (req, res) => {
    try {
        const { showtimeId } = req.params;
        const showtime = await prisma_1.default.showtime.findUnique({
            where: {
                id: showtimeId,
            },
        });
        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: "Showtime not found",
            });
        }
        const [seats, reservedSeats] = await Promise.all([
            prisma_1.default.seat.findMany({
                where: {
                    screenId: showtime.screenId,
                },
            }),
            prisma_1.default.reservedSeat.findMany({
                where: {
                    showtimeId,
                },
            }),
        ]);
        const bookedSeatIds = new Set(reservedSeats.map((seat) => seat.seatId));
        const availableSeats = seats.filter((seat) => !bookedSeatIds.has(seat.id));
        return res.json({
            success: true,
            availableSeats,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch seats",
        });
    }
};
exports.getAvailableSeats = getAvailableSeats;
const getMyReservations = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const reservations = await prisma_1.default.reservation.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
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
        res.json({
            success: true,
            reservations,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getMyReservations = getMyReservations;
const getReservationById = async (req, res) => {
    try {
        const reservation = await prisma_1.default.reservation.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
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
        });
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }
        res.json({
            success: true,
            reservation,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getReservationById = getReservationById;
const cancelReservation = async (req, res) => {
    try {
        const reservation = await prisma_1.default.reservation.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                showtime: true,
                reservedSeats: true,
            },
        });
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }
        if (reservation.showtime.startTime < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel past show",
            });
        }
        const releasedSeatIds = reservation.reservedSeats.map((seat) => seat.seatId);
        await prisma_1.default.$transaction(async (tx) => {
            await tx.reservedSeat.deleteMany({
                where: {
                    reservationId: reservation.id,
                },
            });
            await tx.reservationSeat.deleteMany({
                where: {
                    reservationId: reservation.id,
                },
            });
            await tx.reservation.update({
                where: {
                    id: reservation.id,
                },
                data: {
                    status: "CANCELLED",
                },
            });
        });
        (0, socket_1.getIO)()
            .to(reservation.showtimeId)
            .emit("seat-unlocked", releasedSeatIds);
        res.json({
            success: true,
            message: "Reservation cancelled",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.cancelReservation = cancelReservation;
