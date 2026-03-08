/* eslint-disable pii/no-email */
import { stringify } from 'yaml';

import { MainTraefikConfig } from '../models/traefik';

export const TRAEFIK_SSL_PORT = Number.parseInt(process.env.TRAEFIK_SSL_PORT || '443');
export const TRAEFIK_PORT = Number.parseInt(process.env.TRAEFIK_PORT || '80');
export const TRAEFIK_HTTP3_PORT = Number.parseInt(process.env.TRAEFIK_HTTP3_PORT || '443');
export const TRAEFIK_VERSION = process.env.TRAEFIK_VERSION || '3.6.7';

/**
 * Traefik default configuration
 */
export const getDefaultTraefikConfig = () => {
    const configObject: MainTraefikConfig = {
        global: {
            sendAnonymousUsage: false,
        },
        providers: {
            file: {
                directory: '/etc/gitpaas/traefik/dynamic',
                watch: true,
            },
        },
        entryPoints: {
            web: {
                address: `:${TRAEFIK_PORT}`,
            },
            websecure: {
                address: `:${TRAEFIK_SSL_PORT}`,
                http3: {
                    advertisedPort: TRAEFIK_HTTP3_PORT,
                },
            },
        },
        api: {
            insecure: true,
        },
    };

    // Configure providers based on environment
    if (process.env.NODE_ENV === 'development') {
        if (configObject.providers) {
            configObject.providers.docker = {
                defaultRule: 'Host(`{{ trimPrefix `/` .Name }}.docker.localhost`)',
            };
        }
    } else if (configObject.providers) {
        configObject.providers.swarm = {
            exposedByDefault: false,
            watch: true,
        };
        configObject.providers.docker = {
            exposedByDefault: false,
            watch: true,
            network: 'gitpaas-network',
        };
    }

    // Configure TLS and certificates for production
    if (process.env.NODE_ENV === 'production') {
        if (configObject.entryPoints?.websecure) {
            configObject.entryPoints.websecure.http = {
                tls: {
                    certResolver: 'letsencrypt',
                },
            };
        }

        configObject.certificatesResolvers = {
            letsencrypt: {
                acme: {
                    email: 'test@localhost.com',
                    storage: '/etc/gitpaas/traefik/dynamic/acme.json',
                    httpChallenge: {
                        entryPoint: 'web',
                    },
                },
            },
        };
    }

    const yamlStr = stringify(configObject);

    return yamlStr;
};
