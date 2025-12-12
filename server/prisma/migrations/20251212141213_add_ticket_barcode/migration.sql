/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barcode` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "barcode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_barcode_key" ON "public"."Ticket"("barcode");
