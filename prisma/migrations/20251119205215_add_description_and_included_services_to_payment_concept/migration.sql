/*
  Warnings:

  - Added the required column `description` to the `PaymentConcept` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentConcept" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "includedServices" TEXT[];
