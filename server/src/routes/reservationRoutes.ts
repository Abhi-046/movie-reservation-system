import express from "express";

import {
  cancelReservation,
  createReservation,
  getAvailableSeats,
  getMyReservations,
  getReservationById,
} from "../controllers/reservationController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createReservation);

router.get("/available/:showtimeId", getAvailableSeats);

router.get("/my-reservations", protect, getMyReservations);

router.get("/:id", protect, getReservationById);

router.delete("/:id/cancel", protect, cancelReservation );

export default router;
