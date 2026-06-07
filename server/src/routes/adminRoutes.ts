import express from "express";

import {
  getDashboardStats,
  getAllReservations,
  getRevenueReport,
  getTopMovies,
  getOccupancy,
} from "../controllers/adminController";

import { protect } from "../middleware/authMiddleware";

import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.use(protect, authorize("ADMIN", "SUPER_ADMIN"));

router.get("/dashboard", getDashboardStats);

router.get("/reservations", getAllReservations);

router.get("/revenue", getRevenueReport);

router.get("/top-movies", getTopMovies);

router.get("/occupancy", getOccupancy);

export default router;
