/*
  Warnings:

  - The `url` column on the `ProgressPhoto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `biceps` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `calf` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `chest` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `hips` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `legs` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `recordedAt` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `waist` on the `UserProgress` table. All the data in the column will be lost.
  - Added the required column `durationWeek` to the `Routine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Routine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Routine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainerId` to the `Routine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."UserProgress_userId_recordedAt_idx";

-- AlterTable
ALTER TABLE "ProgressPhoto" DROP COLUMN "url",
ADD COLUMN     "url" TEXT[];

-- AlterTable
ALTER TABLE "Routine" ADD COLUMN     "durationWeek" INTEGER NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "goal" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trainerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserProgress" DROP COLUMN "biceps",
DROP COLUMN "calf",
DROP COLUMN "chest",
DROP COLUMN "createdAt",
DROP COLUMN "hips",
DROP COLUMN "legs",
DROP COLUMN "notes",
DROP COLUMN "recordedAt",
DROP COLUMN "waist";

-- CreateTable
CREATE TABLE "UserProgressHistory" (
    "id" SERIAL NOT NULL,
    "userProgressId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION,
    "chest" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "biceps" DOUBLE PRECISION,
    "legs" DOUBLE PRECISION,
    "calf" DOUBLE PRECISION,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgressHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineExercise" (
    "id" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "daysOfWeek" "DaysOfWeek" NOT NULL,
    "name" TEXT NOT NULL,
    "muscle" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "RoutineExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineLog" (
    "id" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "RoutineLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProgressHistory" ADD CONSTRAINT "UserProgressHistory_userProgressId_fkey" FOREIGN KEY ("userProgressId") REFERENCES "UserProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineExercise" ADD CONSTRAINT "RoutineExercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineLog" ADD CONSTRAINT "RoutineLog_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
