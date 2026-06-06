import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createShowtime = async (req: Request, res: Response) => {
  try {
    const { movieId, screenId, startTime, endTime, price } = req.body;

    const conflict = await prisma.showtime.findFirst({
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

    const showtime = await prisma.showtime.create({
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
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create showtime",
    });
  }
};

export const getShowtimes = async (req: Request, res: Response) => {
  const showtimes = await prisma.showtime.findMany({
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

export const getShowtimesByMovie = async (req: Request, res: Response) => {
  const movieId = Array.isArray(req.params.movieId)
    ? req.params.movieId[0]
    : req.params.movieId;

  const showtimes = await prisma.showtime.findMany({
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
