import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types/auth";
import { getIO } from "../socket";

type CreateReservationBody = {
  showtimeId?: string;
  seatIds?: string[];
};

export const createReservation = async (
  req: AuthRequest<Record<string, string>, CreateReservationBody>,
  res: Response,
) => {
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

    const booking = await prisma.$transaction(async (tx) => {
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
          userId: req.user!.id,
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

    getIO().to(showtimeId).emit("seat-booked", seatIds);

    return res.status(201).json({
      success: true,
      reservation: booking,
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

export const getMyReservations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reservations = await prisma.reservation.findMany({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

export const getReservationById = async (req: AuthRequest, res: Response) => {
  try {
    const reservation = await prisma.reservation.findUnique({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

export const cancelReservation = async (req: AuthRequest, res: Response) => {
  try {
    const reservation = await prisma.reservation.findUnique({
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

    await prisma.$transaction(async (tx) => {
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

    getIO()
      .to(reservation.showtimeId)
      .emit("seat-unlocked", releasedSeatIds);

    res.json({
      success: true,
      message: "Reservation cancelled",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};
