-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "status" "public"."TicketStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "fare" DROP NOT NULL;
