import { chmodSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { stringify } from 'yaml';

import { paths } from '../configs/paths';
import { getDefaultTraefikConfig } from '../configs/traefik';

/**
 * Get default Traefik middlewares configuration as YAML string
 *
 * @returns YAML string of default Traefik middlewares configuration
 */
export const getDefaultMiddlewares = (): string => {
    const defaultMiddlewares = {
        http: {
            middlewares: {
                'redirect-to-https': {
                    redirectScheme: {
                        scheme: 'https',
                        permanent: true,
                    },
                },
            },
        },
    };

    const yamlStr = stringify(defaultMiddlewares);

    return yamlStr;
};

/**
 * Create default Traefik middlewares
 */
export const createDefaultMiddlewares = (): void => {
    const { DYNAMIC_TRAEFIK_PATH } = paths();
    const middlewaresPath = join(DYNAMIC_TRAEFIK_PATH, 'middlewares.yml');

    if (existsSync(middlewaresPath)) {
        console.log('✅ Default middlewares already exists');
        return;
    }

    const yamlStr = getDefaultMiddlewares();

    mkdirSync(DYNAMIC_TRAEFIK_PATH, { recursive: true });
    writeFileSync(middlewaresPath, yamlStr, 'utf8');
};

/**
 * Create default Traefik configuration
 */
export const createDefaultTraefikConfig = (): void => {
    const { MAIN_TRAEFIK_PATH, DYNAMIC_TRAEFIK_PATH } = paths();
    const mainConfig = join(MAIN_TRAEFIK_PATH, 'traefik.yml');
    const acmeJsonPath = join(DYNAMIC_TRAEFIK_PATH, 'acme.json');

    if (existsSync(acmeJsonPath)) {
        chmodSync(acmeJsonPath, '600');
    }

    // Create the traefik directory first
    mkdirSync(MAIN_TRAEFIK_PATH, { recursive: true });

    // Check if traefik.yml exists and handle the case where it might be a directory
    if (existsSync(mainConfig)) {
        const stats = statSync(mainConfig);

        // If traefik.yml is a directory, remove it
        if (stats.isDirectory()) {
            console.log('Found traefik.yml as directory, removing it...');

            rmSync(mainConfig, { recursive: true, force: true });
        } else if (stats.isFile()) {
            console.log('✅ Main config already exists');
            return;
        }
    }

    const yamlStr = getDefaultTraefikConfig();
    writeFileSync(mainConfig, yamlStr, 'utf8');

    console.log('✅ Traefik config created successfully');
};
