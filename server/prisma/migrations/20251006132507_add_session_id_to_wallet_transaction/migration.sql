/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `WalletTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."WalletTransaction" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_sessionId_key" ON "public"."WalletTransaction"("sessionId");
