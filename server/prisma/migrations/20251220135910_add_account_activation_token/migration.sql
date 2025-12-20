-- AlterTable
ALTER TABLE "public"."BusOperatorRequest" ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" INTEGER;

-- CreateTable
CREATE TABLE "public"."AccountActivationToken" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountActivationToken_userId_key" ON "public"."AccountActivationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountActivationToken_token_key" ON "public"."AccountActivationToken"("token");

-- AddForeignKey
ALTER TABLE "public"."BusOperatorRequest" ADD CONSTRAINT "BusOperatorRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountActivationToken" ADD CONSTRAINT "AccountActivationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
