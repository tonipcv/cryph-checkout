/*
  Warnings:

  - A unique constraint covering the columns `[asaasId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payment_asaasId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_asaasId_key" ON "Payment"("asaasId");
