import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalMovies, totalReservations, revenue] =
      await Promise.all([
        prisma.user.count(),
        prisma.movie.count(),

        prisma.reservation.count(),

        prisma.reservation.aggregate({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const revenue = await prisma.reservation.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    const bookings = await prisma.reservation.count();

    return res.json({
      success: true,

      revenue: revenue._sum.totalAmount || 0,

      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const getTopMovies = async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany({
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

      bookings: movie.showtimes.reduce(
        (acc, showtime) => acc + showtime.reservations.length,
        0,
      ),
    }));

    result.sort((a, b) => b.bookings - a.bookings);

    return res.json({
      success: true,

      movies: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const getOccupancy = async (req: Request, res: Response) => {
  try {
    const totalSeats = await prisma.seat.count();

    const bookedSeats = await prisma.reservedSeat.count();

    const occupancy =
      totalSeats === 0 ? 0 : ((bookedSeats / totalSeats) * 100).toFixed(2);

    return res.json({
      success: true,

      totalSeats,

      bookedSeats,

      occupancy: occupancy + "%",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};
