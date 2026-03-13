import { execAsync } from '../utils/exec-async';

/**
 * Wait for PostgreSQL to be ready via TCP connection (production mode)
 *
 * In production, the container runs inside the gitpaas-network,
 * so we connect directly to gitpaas-postgres:5432
 */
export async function waitForPostgresProduction(maxAttempts = 30): Promise<void> {
    const host = process.env.POSTGRES_HOST || 'gitpaas-postgres';
    const port = process.env.POSTGRES_PORT || '5432';

    console.log(`⏳ Waiting for PostgreSQL at ${host}:${port}...`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // Use Node's net module via a simple script to check TCP connectivity
            await execAsync(
                `node -e "const net = require('net'); const s = net.createConnection(${port}, '${host}'); s.on('connect', () => { s.destroy(); process.exit(0); }); s.on('error', () => process.exit(1)); setTimeout(() => process.exit(1), 2000);"`,
            );
            console.log('✅ PostgreSQL is ready');
            return;
        } catch {
            console.log(`⏳ Attempt ${attempt}/${maxAttempts}: PostgreSQL not ready yet, waiting...`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    throw new Error('PostgreSQL failed to become ready within the expected time');
}
