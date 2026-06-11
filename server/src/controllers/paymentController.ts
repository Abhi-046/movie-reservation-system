import { Request, Response } from "express";
import crypto from "crypto";

import prisma from "../config/prisma";
import razorpay from "../config/razorpay";

import { AuthRequest } from "../types/auth";
import { getIO } from "../socket";
import { generateTicket } from "../utils/generateTicket";
import { sendTicketMail } from "../utils/sendTicketMail";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    const order = await razorpay.orders.create({
      amount: reservation.totalAmount * 100,
      currency: "INR",

      // max 40 chars
      receipt: reservation.id.slice(0, 40),
    });

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      reservationId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const existingReservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (!existingReservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (existingReservation.status === "CONFIRMED") {
      return res.status(400).json({
        success: false,
        message: "Reservation already confirmed",
      });
    }

    const reservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },

      data: {
        status: "CONFIRMED",
      },

      include: {
        user: true,

        reservedSeats: {
          include: {
            seat: true,
          },
        },

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
      },
    });

    const ticketPath = await generateTicket(reservation);

    await sendTicketMail(
      reservation.user.email,
      ticketPath
    );

    getIO()
      .to(reservation.showtimeId)
      .emit(
        "payment-confirmed",
        reservation.reservedSeats.map(
          (seat) => seat.seatId
        ),
      );

    return res.json({
      success: true,
      message: "Payment verified successfully",

      reservation,

      ticketUrl: `/tickets/${reservation.id}.pdf`,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const getMyPayments = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payments = await prisma.reservation.findMany({
      where: {
        userId: req.user.id,
        status: "CONFIRMED",
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

    return res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};
