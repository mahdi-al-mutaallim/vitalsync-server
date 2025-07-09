/*
  Warnings:

  - You are about to drop the column `needPasswordChange` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "needPasswordChange",
ADD COLUMN     "needsPasswordChange" BOOLEAN NOT NULL DEFAULT true;
