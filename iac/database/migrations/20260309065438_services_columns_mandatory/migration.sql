-- AlterTable
ALTER TABLE "services" ALTER COLUMN "repository_id" DROP NOT NULL,
ALTER COLUMN "branch" DROP NOT NULL;
