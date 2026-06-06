import { Request, Response } from "express";
import { Prisma, SeatCategory } from "@prisma/client";
import prisma from "../config/prisma";

export const generateSeats = async (req: Request, res: Response) => {
  try {
    const { screenId } = req.body;

    if (typeof screenId !== "string" || !screenId.trim()) {
      return res.status(400).json({
        success: false,
        message: "screenId is required",
      });
    }

    const screen = await prisma.screen.findUnique({
      where: {
        id: screenId,
      },
    });

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    const seats: Prisma.SeatCreateManyInput[] = [];

    const rows = ["A", "B", "C", "D", "E"];

    for (const row of rows) {
      for (let number = 1; number <= 10; number++) {
        let category: SeatCategory = SeatCategory.SILVER;

        if (row === "D") {
          category = SeatCategory.GOLD;
        }

        if (row === "E") {
          category = SeatCategory.PLATINUM;
        }

        seats.push({
          row,
          number,
          category,
          screenId,
        });
      }
    }

    await prisma.seat.createMany({
      data: seats,
      skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      seatsCreated: seats.length,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Seat generation failed",
    });
  }
};

export const getSeatsByScreen = async (req: Request, res: Response) => {
  try {
    const { screenId } = req.params;

    if (typeof screenId !== "string" || !screenId.trim()) {
      return res.status(400).json({
        success: false,
        message: "screenId is required",
      });
    }

    const seats = await prisma.seat.findMany({
      where: {
        screenId,
      },
      orderBy: [
        {
          row: "asc",
        },
        {
          number: "asc",
        },
      ],
    });

    return res.json({
      success: true,
      seats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch seats",
    });
  }
};
