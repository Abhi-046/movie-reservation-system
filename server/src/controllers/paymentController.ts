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
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
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
        reservedSeats: true,

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

    const user = await prisma.user.findUnique({
      where: {
        id: reservation.userId,
      },
    });

    if (user) {
      await sendTicketMail(user.email, ticketPath);
    }

    getIO()
      .to(reservation.showtimeId)
      .emit(
        "payment-confirmed",
        reservation.reservedSeats.map((seat) => seat.seatId),
      );

    return res.json({
      success: true,
      message: "Payment verified successfully",

      reservation,

      ticketUrl: `/tickets/${reservation.id}.pdf`,

      ticketPath,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const getMyPayments = async (req: AuthRequest, res: Response) => {
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

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};
