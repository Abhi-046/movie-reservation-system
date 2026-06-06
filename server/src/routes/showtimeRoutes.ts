import express from "express";

import {
  createShowtime,
  getShowtimes,
  getShowtimesByMovie,
} from "../controllers/showtimeController";

import { protect } from "../middleware/authMiddleware";

import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", getShowtimes);

router.get("/movie/:movieId", getShowtimesByMovie);

router.post("/", protect, authorize("ADMIN", "SUPER_ADMIN"), createShowtime);

export default router;
