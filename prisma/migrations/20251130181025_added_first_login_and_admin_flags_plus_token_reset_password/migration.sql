/*
  Warnings:

  - A unique constraint covering the columns `[tokenResetPassword]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailGeneratedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFirstLogin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordGeneratedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenResetPassword" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_tokenResetPassword_key" ON "User"("tokenResetPassword");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_isFirstLogin_emailGeneratedByAdmin_idx" ON "User"("isFirstLogin", "emailGeneratedByAdmin");

-- CreateIndex
CREATE INDEX "User_passwordGeneratedByAdmin_idx" ON "User"("passwordGeneratedByAdmin");

-- CreateIndex
CREATE INDEX "User_tokenResetPassword_idx" ON "User"("tokenResetPassword");
