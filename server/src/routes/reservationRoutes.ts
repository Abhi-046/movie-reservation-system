import express from "express";

import {
  createReservation,
  getAvailableSeats,
} from "../controllers/reservationController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createReservation);

router.get("/available/:showtimeId", getAvailableSeats);

export default router;
