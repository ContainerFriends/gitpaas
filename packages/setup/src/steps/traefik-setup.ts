import { chmodSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { stringify } from 'yaml';

import { paths } from '../configs/paths';
import { getDefaultTraefikConfig } from '../configs/traefik';

/**
 * Get default Traefik middlewares configuration as YAML string
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

    return stringify(defaultMiddlewares);
};

/**
 * Create default Traefik middlewares
 *
 * This includes middlewares for HTTPS redirection and other common use cases.
 * Checks if the middlewares configuration already exists, and if not, it creates it with the default settings.
 */
export const createTraefikDefaultMiddlewares = (): void => {
    const { DYNAMIC_TRAEFIK_PATH } = paths();
    const middlewaresPath = join(DYNAMIC_TRAEFIK_PATH, 'middlewares.yml');

    if (existsSync(middlewaresPath)) {
        return;
    }

    const yamlStr = getDefaultMiddlewares();

    mkdirSync(DYNAMIC_TRAEFIK_PATH, { recursive: true });
    writeFileSync(middlewaresPath, yamlStr, 'utf8');
};

/**
 * Create default Traefik configuration
 *
 * This includes the main Traefik configuration file with entry points, providers, and ACME settings.
 * It checks if the main configuration file already exists, and if not, it creates it with the default settings.
 * Also ensures that the ACME JSON file has the correct permissions for Traefik to read and write certificates.
 */
export const createTraefikDefaultConfig = (): void => {
    const { MAIN_TRAEFIK_PATH, DYNAMIC_TRAEFIK_PATH } = paths();
    const mainConfig = join(MAIN_TRAEFIK_PATH, 'traefik.yml');
    const acmeJsonPath = join(DYNAMIC_TRAEFIK_PATH, 'acme.json');

    if (existsSync(acmeJsonPath)) {
        chmodSync(acmeJsonPath, '600');
    }

    mkdirSync(MAIN_TRAEFIK_PATH, { recursive: true });

    if (existsSync(mainConfig)) {
        const stats = statSync(mainConfig);

        if (stats.isDirectory()) {
            rmSync(mainConfig, { recursive: true, force: true });
        } else if (stats.isFile()) {
            return;
        }
    }

    const yamlStr = getDefaultTraefikConfig();
    writeFileSync(mainConfig, yamlStr, 'utf8');
};
