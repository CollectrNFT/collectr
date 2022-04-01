/*
  Warnings:

  - You are about to drop the column `collectrId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `walletAddress` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passTokenId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_collectrId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "collectrId",
ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "userId",
ADD COLUMN     "passTokenId" INTEGER NOT NULL,
ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_walletAddress_key" ON "Profile"("walletAddress");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
