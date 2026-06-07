import express from "express";

import {
  payReservation,
  getMyPayments,
} from "../controllers/paymentController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/pay", protect, payReservation);

router.get("/my", protect, getMyPayments);

export default router;