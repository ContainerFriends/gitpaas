import { exit } from 'node:process';

import { setupMode } from './configs/environment';
import { TRAEFIK_VERSION } from './configs/traefik';
import { setupDirectories } from './steps/config-paths';
import { initializeNetwork } from './steps/initialize-network';
import { initializePostgres, waitForPostgresLocal } from './steps/initialize-postgres';
import { initializeRedis } from './steps/initialize-redis';
import { initializeSwarm } from './steps/initialize-swarm';
import { initializeStandaloneTraefik } from './steps/initialize-traefik';
import { generatePrismaClient, runMigrations } from './steps/run-migrations';
import { createDefaultMiddlewares, createDefaultServerTraefikConfig, createDefaultTraefikConfig } from './steps/traefik-setup';
import { waitForPostgresProduction } from './steps/wait-for-postgres';
import { execAsync } from './utils/exec-async';

const isLocal = setupMode === 'local';

(async () => {
    try {
        console.log(`🚀 GitPaaS ${isLocal ? 'local' : 'production'} setup\n`);

        // Step 1: Initialize Docker infrastructure (only for local setup)
        if (isLocal) {
            await initializeSwarm();
        }

        // Step 2: Create all required directories
        setupDirectories();

        // Step 3: Create Traefik configuration files
        createDefaultMiddlewares();

        // Step 4: Create Traefik main config
        createDefaultTraefikConfig();

        // Step 5: Initialize network
        await initializeNetwork();

        if (isLocal) {
            // Step 6 (local): Create local routing config and start services
            createDefaultServerTraefikConfig();
            await execAsync(`docker pull traefik:v${TRAEFIK_VERSION}`);
            await initializeStandaloneTraefik();
            await initializeRedis();
            await initializePostgres();
            await waitForPostgresLocal();
        } else {
            // Step 6 (production): Wait for externally managed PostgreSQL
            await waitForPostgresProduction();
        }

        // Step 7: Generate Prisma client and deploy migrations
        await generatePrismaClient();
        await runMigrations();

        console.log(`\n🥳 GitPaaS ${isLocal ? 'local' : 'production'} setup completed`);
        exit(0);
    } catch (error) {
        console.error('❌ Error in GitPaaS setup', error);
        exit(1);
    }
})();
