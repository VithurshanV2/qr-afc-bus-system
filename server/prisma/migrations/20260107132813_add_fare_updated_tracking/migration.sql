-- AlterTable
ALTER TABLE "public"."Route" ADD COLUMN     "fareUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "fareUpdatedById" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_fareUpdatedById_fkey" FOREIGN KEY ("fareUpdatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
