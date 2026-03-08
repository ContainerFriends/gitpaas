import { exec } from 'node:child_process';
import { exit } from 'node:process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

import { setupDirectories } from './steps/config-paths';
import { initializeSwarm } from './steps/initialize-swarm';
import { createDefaultMiddlewares } from './steps/traefik-setup';

(async () => {
    try {
        setupDirectories();
        createDefaultMiddlewares();
        await initializeSwarm();
        /* await initializeNetwork();
        createDefaultTraefikConfig();
        createDefaultServerTraefikConfig();
        await execAsync(`docker pull traefik:v${TRAEFIK_VERSION}`);
        await initializeStandaloneTraefik();
        await initializeRedis();
        await initializePostgres(); */

        console.log('GitPaaS setup completed');
        exit(0);
    } catch (error) {
        console.error('Error in GitPaaS setup', error);
    }
})();
