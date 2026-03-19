-- CreateEnum
CREATE TYPE "service_type" AS ENUM ('docker_compose');

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "type" "service_type" NOT NULL DEFAULT 'docker_compose';
