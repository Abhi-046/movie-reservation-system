"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const screenController_1 = require("../controllers/screenController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.get("/", screenController_1.getScreens);
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), screenController_1.createScreen);
exports.default = router;
//24052a86-995d-43e8-bf2e-7dfa295cf9cb
