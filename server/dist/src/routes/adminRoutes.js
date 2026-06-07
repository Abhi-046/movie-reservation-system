"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"));
router.get("/dashboard", adminController_1.getDashboardStats);
router.get("/reservations", adminController_1.getAllReservations);
router.get("/revenue", adminController_1.getRevenueReport);
router.get("/top-movies", adminController_1.getTopMovies);
router.get("/occupancy", adminController_1.getOccupancy);
exports.default = router;
