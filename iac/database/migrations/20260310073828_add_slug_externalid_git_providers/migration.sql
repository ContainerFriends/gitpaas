/*
  Warnings:

  - Added the required column `external_id` to the `git_providers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `git_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "git_providers" ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;
