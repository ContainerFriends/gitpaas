-- CreateEnum
CREATE TYPE "GitProviderType" AS ENUM ('github');

-- CreateTable
CREATE TABLE "git_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GitProviderType" NOT NULL DEFAULT 'github',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "git_providers_pkey" PRIMARY KEY ("id")
);
