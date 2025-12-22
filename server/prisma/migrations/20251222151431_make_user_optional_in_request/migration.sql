-- DropForeignKey
ALTER TABLE "public"."BusOperatorRequest" DROP CONSTRAINT "BusOperatorRequest_userId_fkey";

-- AlterTable
ALTER TABLE "public"."BusOperatorRequest" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BusOperatorRequest" ADD CONSTRAINT "BusOperatorRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
