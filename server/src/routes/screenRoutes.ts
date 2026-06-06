import express from "express";

import { createScreen, getScreens } from "../controllers/screenController";

import { protect } from "../middleware/authMiddleware";

import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", getScreens);

router.post("/", protect, authorize("ADMIN", "SUPER_ADMIN"), createScreen);

export default router;
//24052a86-995d-43e8-bf2e-7dfa295cf9cb