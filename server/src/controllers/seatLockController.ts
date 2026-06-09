import { Request, Response } from "express";
import redisClient from "../config/redis";
import { getIO } from "../socket";

export const lockSeats = async (
  req: Request,
  res: Response
) => {
  try {
    const { showtimeId, seatIds, userId } =
      req.body;

    for (const seatId of seatIds) {
      const key = `seat:${showtimeId}:${seatId}`;

      const alreadyLocked =
        await redisClient.get(key);

      if (alreadyLocked) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatId} already locked`,
        });
      }
    }

    for (const seatId of seatIds) {
      const key = `seat:${showtimeId}:${seatId}`;

      await redisClient.set(
        key,
        userId,
        {
          EX: 300,
        }
      );
    }

    getIO()
      .to(showtimeId)
      .emit("seat-locked", seatIds);

    return res.json({
      success: true,
      message:
        "Seats locked successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Lock failed",
    });
  }
};

export const unlockSeats = async (
  req: Request,
  res: Response
) => {
  try {
    const { showtimeId, seatIds } =
      req.body;

    for (const seatId of seatIds) {
      await redisClient.del(
        `seat:${showtimeId}:${seatId}`
      );
    }

    getIO()
      .to(showtimeId)
      .emit("seat-unlocked", seatIds);

    return res.json({
      success: true,
      message: "Seats unlocked",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};