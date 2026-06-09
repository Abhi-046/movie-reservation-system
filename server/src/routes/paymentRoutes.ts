import { Router } from "express";

import {
  createOrder,
  verifyPayment,
  getMyPayments,
} from "../controllers/paymentController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/create-order", protect, createOrder);

router.post("/verify", verifyPayment);

router.get("/my-payments", protect, getMyPayments);

export default router;
