import express from "express";

import { generateSeats, getSeatsByScreen } from "../controllers/seatController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.post(
  "/generate",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  generateSeats,
);

router.get("/screen/:screenId", getSeatsByScreen);

export default router;
