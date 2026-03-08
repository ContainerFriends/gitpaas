import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { stringify } from 'yaml';

import { paths } from '../configs/paths';

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
        console.log('Default middlewares already exists');
        return;
    }

    const yamlStr = getDefaultMiddlewares();

    mkdirSync(DYNAMIC_TRAEFIK_PATH, { recursive: true });
    writeFileSync(middlewaresPath, yamlStr, 'utf8');
};
