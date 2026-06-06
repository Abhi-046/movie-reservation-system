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

const app = express();

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

app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use(errorHandler);

export default app;
//646c1618-0ebd-4733-8244-a4fec3ecb0f4
