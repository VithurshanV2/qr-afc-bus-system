/*
  Warnings:

  - You are about to drop the column `fullName` on the `BusOperatorRequest` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `BusOperatorRequest` table. All the data in the column will be lost.
  - Added the required column `name` to the `BusOperatorRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `BusOperatorRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."BusOperatorRequest" DROP COLUMN "fullName",
DROP COLUMN "phone",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL;
