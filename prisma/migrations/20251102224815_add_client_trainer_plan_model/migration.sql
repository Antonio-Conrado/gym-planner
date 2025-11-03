-- CreateTable
CREATE TABLE "ClientTrainerPlan" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "daysOfWeek" "DaysOfWeek"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientTrainerPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientTrainerPlan" ADD CONSTRAINT "ClientTrainerPlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTrainerPlan" ADD CONSTRAINT "ClientTrainerPlan_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
