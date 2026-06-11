import express from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import seatRoutes from "./routes/seatRoutes";
import movieRoutes from "./routes/movieRoutes";
import theatreRoutes from "./routes/theatreRoutes";
import screenRoutes from "./routes/screenRoutes";
import showtimeRoutes from "./routes/showtimeRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import adminRoutes from "./routes/adminRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import seatLockRoutes from "./routes/seatLockRoutes";
import path from "path";
import nodemailer from "nodemailer";

const app = express();

// configure mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true" || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Movie Reservation API Running",
  });
});

app.use("/tickets", express.static(path.join(process.cwd(), "tickets")));

app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/seat-lock", seatLockRoutes);
app.use("/api/seat-locks", seatLockRoutes);
app.use(errorHandler);
app.get("/api/test-mail", async (req, res) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "abhinavbollagani528@gmail.com",
    subject: "Test",
    text: "Mail working",
  });

  res.send("Mail sent");
});

export default app;
