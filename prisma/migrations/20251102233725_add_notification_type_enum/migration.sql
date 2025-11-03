/*
  Warnings:

  - The `type` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RESERVATION', 'PAYMENT', 'PLAN_UPDATE', 'CLIENT_TRAINING', 'TRAINING_REQUEST', 'TRAINER_MESSAGE', 'GENERAL');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'GENERAL';
