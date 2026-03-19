/*
  Warnings:

  - Added the required column `client_id` to the `git_providers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_secret` to the `git_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "git_providers" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_secret" TEXT NOT NULL;
