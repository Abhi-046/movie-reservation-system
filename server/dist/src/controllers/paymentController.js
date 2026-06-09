"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyPayments = exports.payReservation = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const socket_1 = require("../socket");
const payReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;
        const reservation = await prisma_1.default.reservation.findUnique({
            where: {
                id: reservationId,
            },
            include: {
                reservedSeats: true,
            },
        });
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }
        if (reservation.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Reservation already processed",
            });
        }
        const paymentId = "PAY_" + Math.random().toString(36).substring(2, 10);
        const updatedReservation = await prisma_1.default.reservation.update({
            where: {
                id: reservationId,
            },
            data: {
                status: "CONFIRMED",
            },
        });
        (0, socket_1.getIO)()
            .to(updatedReservation.showtimeId)
            .emit("payment-confirmed", reservation.reservedSeats.map((seat) => seat.seatId));
        return res.json({
            success: true,
            paymentId,
            reservation: updatedReservation,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Payment failed",
        });
    }
};
exports.payReservation = payReservation;
const getMyPayments = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const payments = await prisma_1.default.reservation.findMany({
            where: {
                userId: req.user.id,
                status: "CONFIRMED",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json({
            success: true,
            payments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments",
        });
    }
};
exports.getMyPayments = getMyPayments;
