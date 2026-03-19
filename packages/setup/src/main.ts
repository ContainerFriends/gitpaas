import { exit } from 'node:process';

import { setupMode } from './configs/environment';
import { setupDirectories } from './steps/config-paths';
import { initializeBackend } from './steps/initialize-backend';
import { initializeFrontend } from './steps/initialize-frontend';
import { initializeNetwork } from './steps/initialize-network';
import { configureDatabaseUrl, initializePostgres, waitForPostgres } from './steps/initialize-postgres';
import { initializeRedis } from './steps/initialize-redis';
import { initializeSwarm } from './steps/initialize-swarm';
import { initializeTraefik } from './steps/initialize-traefik';
import { generatePrismaClient, runMigrations } from './steps/run-migrations';
import { createTraefikDefaultMiddlewares, createTraefikDefaultConfig } from './steps/traefik-setup';
import { runStep } from './utils/run-step';

const isLocal = setupMode === 'local';

(async () => {
    try {
        console.log(`\n🚀 Starting GitPaaS ${isLocal ? 'local' : 'production'} setup\n`);

        // Step 1: initialize Docker infrastructure (local only)
        await runStep('Initialize Docker Swarm', initializeSwarm);

        // Step 2: create all required directories
        await runStep('Create directories', setupDirectories);

        // Step 3: create Traefik configuration files
        await runStep('Create Traefik configuration', () => {
            createTraefikDefaultMiddlewares();
            createTraefikDefaultConfig();
        });

        // Step 4: Initialize network
        await runStep('Initialize network', initializeNetwork);

        // Step 5: Initialize Traefik
        await runStep('Initialize Traefik', initializeTraefik);

        // Step 6: Initialize Redis
        await runStep('Initialize Redis', initializeRedis);

        // Step 7: Initialize Postgres
        await runStep('Initialize PostgreSQL', initializePostgres);

        // Step 8: Wait for Postgres to be ready
        await runStep('PostgreSQL is ready', waitForPostgres);

        // Step 9: Configure DATABASE_URL for Prisma (production only)
        await runStep('Configure database connection', configureDatabaseUrl);

        // Step 10: Generate Prisma client and deploy migrations
        await runStep('Generate Prisma client', generatePrismaClient);
        await runStep('Run database migrations', runMigrations);

        // Step 11: Initialize Backend
        await runStep('Initialize Backend', initializeBackend);

        // Step 12: Initialize Frontend
        await runStep('Initialize Frontend', initializeFrontend);

        console.log(`\n🥳 GitPaaS ${isLocal ? 'local' : 'production'} setup completed`);
        exit(0);
    } catch (error) {
        console.error('❌ Error in GitPaaS setup', error);
        exit(1);
    }
})();
