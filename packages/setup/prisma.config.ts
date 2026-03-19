import { defineConfig, env } from 'prisma/config';

declare const process: { env: Record<string, string | undefined> };

const schemaPath = process.env['PRISMA_SCHEMA_PATH'] ?? '../../iac/database/schema.prisma';
const migrationsPath = process.env['PRISMA_MIGRATIONS_PATH'] ?? '../../iac/database/migrations';

export default defineConfig({
  schema: schemaPath,
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: migrationsPath,
  },
});
