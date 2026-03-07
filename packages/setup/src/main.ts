import { exec } from 'node:child_process';
import { exit } from 'node:process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

import { setupDirectories } from './config-paths';
import { initializeNetwork, initializeSwarm } from './initialize-services';
import { initializePostgres } from './postgres-setup';
import { initializeRedis } from './redis-setup';
import { createDefaultMiddlewares, createDefaultServerTraefikConfig, createDefaultTraefikConfig, initializeStandaloneTraefik, TRAEFIK_VERSION } from './traefik-setup';

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
        console.log('GitPaaS setup completed');
        exit(0);
    } catch (e) {
        console.error('Error in GitPaaS setup', e);
    }
})();
