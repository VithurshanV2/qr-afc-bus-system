/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BusOperatorRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `BusOperatorRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."BusOperatorRequest" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BusOperatorRequest_userId_key" ON "public"."BusOperatorRequest"("userId");

-- AddForeignKey
ALTER TABLE "public"."BusOperatorRequest" ADD CONSTRAINT "BusOperatorRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
