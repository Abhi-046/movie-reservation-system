import { Request, Response } from "express";
import prisma from "../config/prisma";

type IdParams = {
  id: string;
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const movie = await prisma.movie.create({
      data: req.body,
    });

    return res.status(201).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("CREATE MOVIE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create movie",
    });
  }
};

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
    });
  }
};

export const getMovieById = async (req: Request<IdParams>, res: Response) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("GET MOVIE BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
    });
  }
};

export const updateMovie = async (req: Request<IdParams>, res: Response) => {
  try {
    const movie = await prisma.movie.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    return res.json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update movie",
    });
  }
};

export const deleteMovie = async (req: Request<IdParams>, res: Response) => {
  try {
    await prisma.movie.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.json({
      success: true,
      message: "Movie deleted",
    });
  } catch (error) {
    console.error("DELETE MOVIE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete movie",
    });
  }
};