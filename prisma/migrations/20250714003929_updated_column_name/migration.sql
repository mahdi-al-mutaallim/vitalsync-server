/*
  Warnings:

  - You are about to drop the column `profilePhoto` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "profilePhoto",
ADD COLUMN     "profilePhotoUrl" TEXT;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "experience",
DROP COLUMN "profilePhoto",
ADD COLUMN     "experienceInYears" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "profilePhotoUrl" TEXT;
