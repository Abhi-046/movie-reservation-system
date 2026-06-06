import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createTheatre = async (req: Request, res: Response) => {
  try {
    const theatre = await prisma.theatre.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      theatre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create theatre",
    });
  }
};

export const getTheatres = async (req: Request, res: Response) => {
  try {
    const theatres = await prisma.theatre.findMany({
      include: {
        screens: true,
      },
    });

    res.json({
      success: true,
      theatres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch theatres",
    });
  }
};
