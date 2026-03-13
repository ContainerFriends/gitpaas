import { exit } from 'node:process';

import { setupMode } from './configs/environment';
import { setupDirectories } from './steps/config-paths';
import { initializeNetwork } from './steps/initialize-network';
import { initializePostgres, waitForPostgres } from './steps/initialize-postgres';
import { initializeRedis } from './steps/initialize-redis';
import { initializeSwarm } from './steps/initialize-swarm';
import { initializeTraefik } from './steps/initialize-traefik';
import { generatePrismaClient, runMigrations } from './steps/run-migrations';
import { createTraefikDefaultMiddlewares, createTraefikDefaultConfig } from './steps/traefik-setup';

const isLocal = setupMode === 'local';

(async () => {
    try {
        console.log(`🚀 GitPaaS ${isLocal ? 'local' : 'production'} setup\n`);

        // Step 1: initialize Docker infrastructure (only for local setup)
        if (isLocal) {
            await initializeSwarm();
        }

        // Step 2: create all required directories
        setupDirectories();

        // Step 3: create Traefik configuration files
        createTraefikDefaultMiddlewares();
        createTraefikDefaultConfig();

        // Step 4: Initialize network
        await initializeNetwork();

        // Step 5: Initialize Traefik
        await initializeTraefik();

        // Step 6: Initialize Redis
        await initializeRedis();

        // Step 7: Initialize Postgres
        await initializePostgres();

        // Step 8: Wait for Postgres to be ready
        await waitForPostgres();

        // Step 9: Generate Prisma client and deploy migrations
        await generatePrismaClient();
        await runMigrations();

        console.log(`\n🥳 GitPaaS ${isLocal ? 'local' : 'production'} setup completed`);
        exit(0);
    } catch (error) {
        console.error('❌ Error in GitPaaS setup', error);
        exit(1);
    }
})();
