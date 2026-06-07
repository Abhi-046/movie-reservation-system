import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types/auth";

export const payReservation = async (req: Request, res: Response) => {
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

    if (reservation.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Reservation already processed",
      });
    }

    const paymentId = "PAY_" + Math.random().toString(36).substring(2, 10);

    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return res.json({
      success: true,
      paymentId,
      reservation: updatedReservation,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Payment failed",
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
