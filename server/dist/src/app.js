"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const seatRoutes_1 = __importDefault(require("./routes/seatRoutes"));
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const theatreRoutes_1 = __importDefault(require("./routes/theatreRoutes"));
const screenRoutes_1 = __importDefault(require("./routes/screenRoutes"));
const showtimeRoutes_1 = __importDefault(require("./routes/showtimeRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const seatLockRoutes_1 = __importDefault(require("./routes/seatLockRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "Movie Reservation API Running",
    });
});
app.use("/api/movies", movieRoutes_1.default);
app.use("/api/showtimes", showtimeRoutes_1.default);
app.use("/api/theatres", theatreRoutes_1.default);
app.use("/api/screens", screenRoutes_1.default);
app.use("/api/reservations", reservationRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/seats", seatRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/seat-lock", seatLockRoutes_1.default);
app.use("/api/seat-locks", seatLockRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
