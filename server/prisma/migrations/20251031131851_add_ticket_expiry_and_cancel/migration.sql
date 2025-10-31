-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Ticket_commuterId_status_idx" ON "public"."Ticket"("commuterId", "status");
