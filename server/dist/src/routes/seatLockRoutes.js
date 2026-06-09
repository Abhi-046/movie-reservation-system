"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seatLockController_1 = require("../controllers/seatLockController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/lock", authMiddleware_1.protect, seatLockController_1.lockSeats);
router.post("/unlock", authMiddleware_1.protect, seatLockController_1.unlockSeats);
exports.default = router;
