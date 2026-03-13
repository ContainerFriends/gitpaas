import { exit } from 'node:process';

import { TRAEFIK_VERSION } from './configs/traefik';
import { setupDirectories } from './steps/config-paths';
import { initializeNetwork } from './steps/initialize-network';
import { initializePostgres, waitForPostgres } from './steps/initialize-postgres';
import { initializeRedis } from './steps/initialize-redis';
import { initializeSwarm } from './steps/initialize-swarm';
import { initializeStandaloneTraefik } from './steps/initialize-traefik';
import { createDefaultMiddlewares, createDefaultServerTraefikConfig, createDefaultTraefikConfig } from './steps/traefik-setup';
import { execAsync } from './utils/exec-async';

(async () => {
    try {
        setupDirectories();
        createDefaultMiddlewares();
        await initializeSwarm();
        await initializeNetwork();
        createDefaultTraefikConfig();
        createDefaultServerTraefikConfig();
        await execAsync(`docker pull traefik:v${TRAEFIK_VERSION}`);
        await initializeStandaloneTraefik();
        await initializeRedis();
        await initializePostgres();

        // Wait for PostgreSQL to be fully ready
        await waitForPostgres();

        // Generate Prisma client after database is ready
        console.log('🔧 Generating Prisma client...');
        await execAsync('npx prisma generate --config=./prisma.config.ts');

        // Deploy migrations after client generation
        console.log('📦 Deploying database migrations...');
        await execAsync('npx prisma migrate deploy --config=./prisma.config.ts');

        console.log('\n🥳 GitPaaS setup completed');
        exit(0);
    } catch (error) {
        console.error('❌ Error in GitPaaS setup', error);
    }
})();
