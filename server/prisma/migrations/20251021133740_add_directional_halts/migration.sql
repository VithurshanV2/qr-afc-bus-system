/*
  Warnings:

  - You are about to drop the column `halts` on the `Route` table. All the data in the column will be lost.
  - Added the required column `haltsA` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TripDirection" AS ENUM ('DIRECTIONA', 'DIRECTIONB');

-- AlterTable
ALTER TABLE "public"."Route" DROP COLUMN "halts",
ADD COLUMN     "haltsA" JSONB NOT NULL,
ADD COLUMN     "haltsB" JSONB;

-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "direction" "public"."TripDirection" NOT NULL;
