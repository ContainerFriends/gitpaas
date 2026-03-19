-- AlterTable
ALTER TABLE "services" ADD COLUMN     "git_provider_id" TEXT;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_git_provider_id_fkey" FOREIGN KEY ("git_provider_id") REFERENCES "git_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
