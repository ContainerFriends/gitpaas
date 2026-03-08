import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { PrismaClient } from './.prisma/client';
import { dbUrl } from './configs/database';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
});

/**
 * Ejecuta archivos de migración SQL desde la carpeta de migraciones
 */
async function runMigrations(): Promise<void> {
    const migrationsPath = join(process.cwd(), '../../../iac/database/migrations');

    let migrationFiles: string[];

    try {
        migrationFiles = readdirSync(migrationsPath).filter((file) => file.endsWith('.sql'));
    } catch {
        console.log('❌ No migrations folder found or no SQL files to run');
        return;
    }

    if (migrationFiles.length === 0) {
        console.log('❌ No SQL migration files found');
        return;
    }

    migrationFiles.sort();

    for (const file of migrationFiles) {
        const filePath = join(migrationsPath, file);
        const sql = readFileSync(filePath, 'utf-8');

        await prisma.$executeRawUnsafe(sql);
    }
}

/**
 * Run migrations
 */
await runMigrations()
    .then(() => {
        console.log('✅ Migration process complete');
    })
    .catch((error: any) => {
        console.error('❌ Migration process failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
