import express from "express";

import { createTheatre, getTheatres } from "../controllers/theatreController";

import { protect } from "../middleware/authMiddleware";

import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", getTheatres);

router.post("/", protect, authorize("ADMIN", "SUPER_ADMIN"), createTheatre);

export default router;
