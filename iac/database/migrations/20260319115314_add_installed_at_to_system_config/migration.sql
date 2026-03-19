/*
  Warnings:

  - Added the required column `installed_at` to the `system_configs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "system_configs" ADD COLUMN     "installed_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "initialized_at" DROP DEFAULT;
