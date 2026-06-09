import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | undefined;

export const initializeSocket = (
  server: HttpServer
) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "Client Connected:",
      socket.id
    );

    socket.on(
      "join-showtime",
      (showtimeId: string) => {
        socket.join(showtimeId);

        console.log(
          `${socket.id} joined ${showtimeId}`
        );
      }
    );

    socket.on("disconnect", () => {
      console.log(
        "Client Disconnected"
      );
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
