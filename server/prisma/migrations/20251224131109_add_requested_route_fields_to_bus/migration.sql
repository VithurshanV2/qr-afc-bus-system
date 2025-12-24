-- AlterTable
ALTER TABLE "public"."Bus" ADD COLUMN     "requestedBusType" "public"."BusType",
ADD COLUMN     "requestedRouteName" TEXT,
ADD COLUMN     "requestedRouteNumber" TEXT;
