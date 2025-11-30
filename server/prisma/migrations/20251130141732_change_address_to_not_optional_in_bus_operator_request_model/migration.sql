/*
  Warnings:

  - Made the column `address` on table `BusOperatorRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."BusOperatorRequest" ALTER COLUMN "address" SET NOT NULL;
