-- CreateTable
CREATE TABLE "system_configs" (
    "id" UUID NOT NULL,
    "app_id" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "webhook_secret" TEXT NOT NULL,
    "app_slug" TEXT NOT NULL,
    "initialized_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_app_id_key" ON "system_configs"("app_id");
