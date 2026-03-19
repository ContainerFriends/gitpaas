-- CreateEnum
CREATE TYPE "GitProviderStatus" AS ENUM ('pending', 'active', 'error');

-- AlterTable
ALTER TABLE "git_providers" ADD COLUMN     "status" "GitProviderStatus" NOT NULL DEFAULT 'pending';
