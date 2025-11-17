/*
  Warnings:

  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `concept` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `paymentConceptId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
DROP COLUMN "concept",
ADD COLUMN     "paymentConceptId" INTEGER NOT NULL,
ADD COLUMN     "reference" TEXT;

-- CreateTable
CREATE TABLE "PaymentConcept" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "concept" "Concept" NOT NULL,

    CONSTRAINT "PaymentConcept_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentConceptId_fkey" FOREIGN KEY ("paymentConceptId") REFERENCES "PaymentConcept"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
