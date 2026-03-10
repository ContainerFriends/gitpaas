/*
  Warnings:

  - Added the required column `trace_id` to the `git_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "git_providers" ADD COLUMN     "trace_id" TEXT NOT NULL;
