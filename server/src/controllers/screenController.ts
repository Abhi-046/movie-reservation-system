import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createScreen = async (req: Request, res: Response) => {
  try {
    const { name, theatreId } = req.body;

    const screen = await prisma.screen.create({
      data: {
        name,
        theatreId,
      },
    });

    res.status(201).json({
      success: true,
      screen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create screen",
    });
  }
};

export const getScreens = async (req: Request, res: Response) => {
  try {
    const screens = await prisma.screen.findMany({
      include: {
        theatre: true,
      },
    });

    res.json({
      success: true,
      screens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch screens",
    });
  }
};
