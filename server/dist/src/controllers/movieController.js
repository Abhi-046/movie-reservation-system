"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.updateMovie = exports.getMovieById = exports.getMovies = exports.createMovie = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createMovie = async (req, res) => {
    try {
        const movie = await prisma_1.default.movie.create({
            data: req.body,
        });
        res.status(201).json({
            success: true,
            movie,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create movie",
        });
    }
};
exports.createMovie = createMovie;
const getMovies = async (req, res) => {
    try {
        const movies = await prisma_1.default.movie.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({
            success: true,
            movies,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch movies",
        });
    }
};
exports.getMovies = getMovies;
const getMovieById = async (req, res) => {
    try {
        const movie = await prisma_1.default.movie.findUnique({
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
        res.json({
            success: true,
            movie,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch movie",
        });
    }
};
exports.getMovieById = getMovieById;
const updateMovie = async (req, res) => {
    try {
        const movie = await prisma_1.default.movie.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        res.json({
            success: true,
            movie,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update movie",
        });
    }
};
exports.updateMovie = updateMovie;
const deleteMovie = async (req, res) => {
    try {
        await prisma_1.default.movie.delete({
            where: {
                id: req.params.id,
            },
        });
        res.json({
            success: true,
            message: "Movie deleted",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete movie",
        });
    }
};
exports.deleteMovie = deleteMovie;
