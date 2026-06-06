/*
  Warnings:

  - A unique constraint covering the columns `[screenId,row,number]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `category` on the `Seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SeatCategory" AS ENUM ('SILVER', 'GOLD', 'PLATINUM');

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "category",
ADD COLUMN     "category" "SeatCategory" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_screenId_row_number_key" ON "Seat"("screenId", "row", "number");
