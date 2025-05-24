-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verifyOtp" TEXT NOT NULL DEFAULT '',
    "verifyOtpExpireAt" INTEGER NOT NULL DEFAULT 0,
    "isAccountVerified" BOOLEAN NOT NULL DEFAULT false,
    "resetOtp" TEXT NOT NULL DEFAULT '',
    "resetOtpExpireAt" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
