"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, reservationController_1.createReservation);
router.get("/available/:showtimeId", reservationController_1.getAvailableSeats);
router.get("/my-reservations", authMiddleware_1.protect, reservationController_1.getMyReservations);
router.get("/:id", authMiddleware_1.protect, reservationController_1.getReservationById);
router.delete("/:id/cancel", authMiddleware_1.protect, reservationController_1.cancelReservation);
exports.default = router;
