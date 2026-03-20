/*
  Warnings:

  - A unique constraint covering the columns `[trace_id]` on the table `system_configs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trace_id` to the `system_configs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "system_configs" ADD COLUMN     "trace_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_trace_id_key" ON "system_configs"("trace_id");
