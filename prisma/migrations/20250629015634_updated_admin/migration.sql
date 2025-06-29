/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `admins` table. All the data in the column will be lost.
  - Added the required column `contactNo` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "contactNumber",
ADD COLUMN     "contactNo" VARCHAR(20) NOT NULL;
