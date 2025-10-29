/*
  Warnings:

  - You are about to drop the column `fare` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "fare",
ADD COLUMN     "baseFare" INTEGER,
ADD COLUMN     "totalFare" INTEGER;
