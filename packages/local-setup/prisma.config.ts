import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: '../../iac/database/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: '../../iac/database/migrations',
  },
});
