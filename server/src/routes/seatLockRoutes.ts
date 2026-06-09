import express from "express";

import { lockSeats, unlockSeats } from "../controllers/seatLockController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/lock", protect, lockSeats);

router.post("/unlock", protect, unlockSeats);

export default router;
