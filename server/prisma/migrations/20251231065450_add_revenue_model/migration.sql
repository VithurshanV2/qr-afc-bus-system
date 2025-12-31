-- CreateTable
CREATE TABLE "public"."Revenue" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "ticketCount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Revenue_tripId_key" ON "public"."Revenue"("tripId");

-- AddForeignKey
ALTER TABLE "public"."Revenue" ADD CONSTRAINT "Revenue_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
