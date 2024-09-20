/*
  Warnings:

  - You are about to drop the column `cd` on the `Control` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Control` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[controlCd]` on the table `Control` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Control_controlCd_cd_key";

-- AlterTable
ALTER TABLE "Control" DROP COLUMN "cd",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "ControlDetail" (
    "id" SERIAL NOT NULL,
    "controlId" INTEGER NOT NULL,
    "cd" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ControlDetail_controlId_cd_key" ON "ControlDetail"("controlId", "cd");

-- CreateIndex
CREATE UNIQUE INDEX "Control_controlCd_key" ON "Control"("controlCd");

-- AddForeignKey
ALTER TABLE "ControlDetail" ADD CONSTRAINT "ControlDetail_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
