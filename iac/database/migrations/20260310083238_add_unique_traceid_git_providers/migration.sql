/*
  Warnings:

  - A unique constraint covering the columns `[trace_id]` on the table `git_providers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "git_providers_trace_id_key" ON "git_providers"("trace_id");
