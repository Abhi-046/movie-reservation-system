import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types/auth";

type CreateReservationBody = {
  showtimeId?: string;
  seatIds?: string[];
};

export const createReservation = async (
  req: AuthRequest<Record<string, string>, CreateReservationBody>,
  res: Response,
) => {
  try {
    const { showtimeId, seatIds } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!showtimeId || !seatIds?.length) {
      return res.status(400).json({
        success: false,
        message: "showtimeId and seatIds required",
      });
    }

    const showtime = await prisma.showtime.findUnique({
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

    const reservation = await prisma.$transaction(async (tx) => {
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

      const booking = await tx.reservation.create({
        data: {
          userId: req.user!.id,
          showtimeId,
          totalAmount: seatIds.length * showtime.price,
        },
      });

      await tx.reservedSeat.createMany({
        data: seatIds.map((seatId) => ({
          seatId,
          showtimeId,
          reservationId: booking.id,
        })),
      });

      await tx.reservationSeat.createMany({
        data: seatIds.map((seatId) => ({
          seatId,
          reservationId: booking.id,
        })),
      });

      return booking;
    });

    return res.status(201).json({
      success: true,
      reservation,
    });
  } catch (error) {
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

export const getAvailableSeats = async (
  req: AuthRequest<{
    showtimeId: string;
  }>,
  res: Response,
) => {
  try {
    const { showtimeId } = req.params;

    const showtime = await prisma.showtime.findUnique({
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
      prisma.seat.findMany({
        where: {
          screenId: showtime.screenId,
        },
      }),

      prisma.reservedSeat.findMany({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch seats",
    });
  }
};
