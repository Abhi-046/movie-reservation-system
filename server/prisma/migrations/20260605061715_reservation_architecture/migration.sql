-- CreateTable
CREATE TABLE "ReservedSeat" (
    "id" TEXT NOT NULL,
    "showtimeId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "ReservedSeat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReservedSeat_showtimeId_seatId_key" ON "ReservedSeat"("showtimeId", "seatId");

-- AddForeignKey
ALTER TABLE "ReservedSeat" ADD CONSTRAINT "ReservedSeat_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservedSeat" ADD CONSTRAINT "ReservedSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservedSeat" ADD CONSTRAINT "ReservedSeat_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
