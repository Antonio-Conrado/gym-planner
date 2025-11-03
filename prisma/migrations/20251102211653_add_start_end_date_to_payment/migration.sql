/*
  Warnings:

  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `rating` on the `Trainer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `weight` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `height` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `chest` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `waist` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `hips` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `biceps` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `legs` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `calf` on the `UserProgress` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - Added the required column `endDate` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "StatusList" NOT NULL DEFAULT 'COMPLETED',
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Trainer" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserProgress" ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "height" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "chest" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "waist" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "hips" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "biceps" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "legs" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "calf" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Payment_id_userId_idx" ON "Payment"("id", "userId");
