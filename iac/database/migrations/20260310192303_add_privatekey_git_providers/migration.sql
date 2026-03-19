/*
  Warnings:

  - Added the required column `private_key` to the `git_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "git_providers" ADD COLUMN     "private_key" TEXT NOT NULL;
