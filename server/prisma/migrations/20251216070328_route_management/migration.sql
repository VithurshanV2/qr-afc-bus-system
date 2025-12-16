/*
  Warnings:

  - A unique constraint covering the columns `[number,busType]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `busType` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RouteStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- CreateEnum
CREATE TYPE "public"."BusType" AS ENUM ('NORMAL', 'SEMILUXURY', 'LUXURY', 'SUPERLUXURY');

-- DropIndex
DROP INDEX "public"."Route_number_key";

-- AlterTable
ALTER TABLE "public"."Route" ADD COLUMN     "busType" "public"."BusType" NOT NULL,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "status" "public"."RouteStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedById" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Route_number_busType_key" ON "public"."Route"("number", "busType");

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
