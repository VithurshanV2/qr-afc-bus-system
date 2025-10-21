/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Bus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrCode` to the `Bus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Bus" ADD COLUMN     "qrCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bus_qrCode_key" ON "public"."Bus"("qrCode");
