import express from "express";

import {
  createMovie,
  deleteMovie,
  getMovieById,
  getMovies,
  updateMovie,
} from "../controllers/movieController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", getMovies);

router.get("/:id", getMovieById);

router.post("/", protect, authorize("ADMIN", "SUPER_ADMIN"), createMovie);

router.put("/:id", protect, authorize("ADMIN", "SUPER_ADMIN"), updateMovie);

router.delete("/:id", protect, authorize("ADMIN", "SUPER_ADMIN"), deleteMovie);

export default router;
