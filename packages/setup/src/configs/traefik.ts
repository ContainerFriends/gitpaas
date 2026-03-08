/* eslint-disable pii/no-email */
import { stringify } from 'yaml';

/**
 * Traefik configuration model
 */
interface MainTraefikConfig {
    accessLog?: {
        filePath?: string;
        format?: string;
        filters?: {
            statusCodes?: string[];
            retryAttempts?: boolean;
            minDuration?: string;
            [k: string]: unknown;
        };
        fields?: {
            defaultMode?: string;
            names?: Record<string, string>;
            headers?: {
                defaultMode?: string;
                names?: Record<string, string>;
                [k: string]: unknown;
            };
            [k: string]: unknown;
        };
        bufferingSize?: number;
    };
    api?: {
        insecure?: boolean;
        dashboard?: boolean;
        debug?: boolean;
    };
    certificatesResolvers?: Record<
        string,
        {
            acme?: {
                email?: string;
                caServer?: string;
                certificatesDuration?: number;
                preferredChain?: string;
                storage?: string;
                keyType?: string;
                eab?: {
                    kid?: string;
                    hmacEncoded?: string;
                    [k: string]: unknown;
                };
                dnsChallenge?: {
                    provider?: string;
                    delayBeforeCheck?: string;
                    resolvers?: string[];
                    disablePropagationCheck?: boolean;
                    [k: string]: unknown;
                };
                httpChallenge?: {
                    entryPoint?: string;
                    [k: string]: unknown;
                };
                tlsChallenge?: Record<string, unknown>;
                [k: string]: unknown;
            };
        }
    >;
    entryPoints?: Record<
        string,
        {
            address?: string;
            transport?: {
                lifeCycle?: {
                    requestAcceptGraceTimeout?: string;
                    graceTimeOut?: string;
                    [k: string]: unknown;
                };
                respondingTimeouts?: {
                    readTimeout?: string;
                    writeTimeout?: string;
                    idleTimeout?: string;
                    [k: string]: unknown;
                };
                [k: string]: unknown;
            };
            proxyProtocol?: {
                insecure?: boolean;
                trustedIPs?: string[];
                [k: string]: unknown;
            };
            forwardedHeaders?: {
                insecure?: boolean;
                trustedIPs?: string[];
                [k: string]: unknown;
            };
            http?: {
                redirections?: {
                    entryPoint?: {
                        to?: string;
                        scheme?: string;
                        permanent?: boolean;
                        priority?: number;
                        [k: string]: unknown;
                    };
                    [k: string]: unknown;
                };
                middlewares?: string[];
                tls?: {
                    options?: string;
                    certResolver?: string;
                    domains?: Array<{
                        main?: string;
                        sans?: string[];
                        [k: string]: unknown;
                    }>;
                    [k: string]: unknown;
                };
                [k: string]: unknown;
            };
            http2?: {
                maxConcurrentStreams?: number;
                [k: string]: unknown;
            };
            http3?: {
                advertisedPort?: number;
                [k: string]: unknown;
            };
            udp?: {
                timeout?: string;
                [k: string]: unknown;
            };
        }
    >;
    experimental?: {
        kubernetesGateway?: boolean;
        http3?: boolean;
        hub?: boolean;
        plugins?: Record<
            string,
            {
                moduleName?: string;
                version?: string;
            }
        >;
        localPlugins?: Record<
            string,
            {
                moduleName?: string;
            }
        >;
    };
    global?: {
        checkNewVersion?: boolean;
        sendAnonymousUsage?: boolean;
    };
    hostResolver?: {
        cnameFlattening?: boolean;
        resolvConfig?: string;
        resolvDepth?: number;
    };
    hub?: {
        tls?: {
            insecure?: boolean;
            ca?: string;
            cert?: string;
            key?: string;
            [k: string]: unknown;
        };
    };
    log?: {
        level?: string;
        filePath?: string;
        format?: string;
    };
    metrics?: {
        prometheus?: {
            buckets?: number[];
            addEntryPointsLabels?: boolean;
            addRoutersLabels?: boolean;
            addServicesLabels?: boolean;
            entryPoint?: string;
            manualRouting?: boolean;
        };
        datadog?: {
            address?: string;
            pushInterval?: string;
            addEntryPointsLabels?: boolean;
            addRoutersLabels?: boolean;
            addServicesLabels?: boolean;
            prefix?: string;
        };
        statsD?: {
            address?: string;
            pushInterval?: string;
            addEntryPointsLabels?: boolean;
            addRoutersLabels?: boolean;
            addServicesLabels?: boolean;
            prefix?: string;
        };
        influxDB?: {
            address?: string;
            protocol?: string;
            pushInterval?: string;
            database?: string;
            retentionPolicy?: string;
            username?: string;
            password?: string;
            addEntryPointsLabels?: boolean;
            addRoutersLabels?: boolean;
            addServicesLabels?: boolean;
            additionalLabels?: Record<string, unknown>;
        };
        influxDB2?: {
            address?: string;
            token?: string;
            pushInterval?: string;
            org?: string;
            bucket?: string;
            addEntryPointsLabels?: boolean;
            addRoutersLabels?: boolean;
            addServicesLabels?: boolean;
            additionalLabels?: Record<string, unknown>;
        };
    };
    pilot?: {
        token?: string;
        dashboard?: boolean;
    };
    ping?: {
        entryPoint?: string;
        manualRouting?: boolean;
        terminatingStatusCode?: number;
    };
    providers?: {
        providersThrottleDuration?: string;
        docker?: {
            allowEmptyServices?: boolean;
            constraints?: string;
            defaultRule?: string;
            endpoint?: string;
            exposedByDefault?: boolean;
            httpClientTimeout?: number;
            network?: string;
            swarmMode?: boolean;
            swarmModeRefreshSeconds?: string;
            tls?: {
                ca?: string;
                caOptional?: boolean;
                cert?: string;
                key?: string;
                insecureSkipVerify?: boolean;
            };
            useBindPortIP?: boolean;
            watch?: boolean;
        };
        file?: {
            directory?: string;
            watch?: boolean;
            filename?: string;
            debugLogGeneratedTemplate?: boolean;
        };
        marathon?: {
            constraints?: string;
            trace?: boolean;
            watch?: boolean;
            endpoint?: string;
            defaultRule?: string;
            exposedByDefault?: boolean;
            dcosToken?: string;
            tls?: {
                ca?: string;
                caOptional?: boolean;
                cert?: string;
                key?: string;
                insecureSkipVerify?: boolean;
            };
            dialerTimeout?: string;
            responseHeaderTimeout?: string;
            tlsHandshakeTimeout?: string;
            keepAlive?: string;
            forceTaskHostname?: boolean;
            basic?: {
                httpBasicAuthUser?: string;
                httpBasicPassword?: string;
            };
            respectReadinessChecks?: boolean;
        };
        kubernetesIngress?: {
            endpoint?: string;
            token?: string;
            certAuthFilePath?: string;
            namespaces?: string[];
            labelSelector?: string;
            ingressClass?: string;
            throttleDuration?: string;
            allowEmptyServices?: boolean;
            allowExternalNameServices?: boolean;
            ingressEndpoint?: {
                ip?: string;
                hostname?: string;
                publishedService?: string;
            };
        };
        kubernetesCRD?: {
            endpoint?: string;
            token?: string;
            certAuthFilePath?: string;
            namespaces?: string[];
            allowCrossNamespace?: boolean;
            allowExternalNameServices?: boolean;
            labelSelector?: string;
            ingressClass?: string;
            throttleDuration?: string;
            allowEmptyServices?: boolean;
        };
        kubernetesGateway?: {
            endpoint?: string;
            token?: string;
            certAuthFilePath?: string;
            namespaces?: string[];
            labelSelector?: string;
            throttleDuration?: string;
        };
        rest?: {
            insecure?: boolean;
        };
        rancher?: {
            constraints?: string;
            watch?: boolean;
            defaultRule?: string;
            exposedByDefault?: boolean;
            enableServiceHealthFilter?: boolean;
            refreshSeconds?: number;
            intervalPoll?: boolean;
            prefix?: string;
        };
        consulCatalog?: {
            constraints?: string;
            prefix?: string;
            refreshInterval?: string;
            requireConsistent?: boolean;
            stale?: boolean;
            cache?: boolean;
            exposedByDefault?: boolean;
            defaultRule?: string;
            connectAware?: boolean;
            connectByDefault?: boolean;
            serviceName?: string;
            namespace?: string;
            namespaces?: string[];
            watch?: boolean;
            endpoint?: {
                address?: string;
                scheme?: string;
                datacenter?: string;
                token?: string;
                endpointWaitTime?: string;
                tls?: {
                    ca?: string;
                    caOptional?: boolean;
                    cert?: string;
                    key?: string;
                    insecureSkipVerify?: boolean;
                };
                httpAuth?: {
                    username?: string;
                    password?: string;
                };
            };
            [k: string]: unknown;
        };
        nomad?: {
            constraints?: string;
            prefix?: string;
            refreshInterval?: string;
            stale?: boolean;
            exposedByDefault?: boolean;
            defaultRule?: string;
            namespace?: string;
            endpoint?: {
                address?: string;
                region?: string;
                token?: string;
                endpointWaitTime?: string;
                tls?: {
                    ca?: string;
                    caOptional?: boolean;
                    cert?: string;
                    key?: string;
                    insecureSkipVerify?: boolean;
                };
            };
        };
        ecs?: {
            constraints?: string;
            exposedByDefault?: boolean;
            ecsAnywhere?: boolean;
            refreshSeconds?: number;
            defaultRule?: string;
            clusters?: string[];
            autoDiscoverClusters?: boolean;
            region?: string;
            accessKeyID?: string;
            secretAccessKey?: string;
        };
        consul?: {
            rootKey?: string;
            endpoints?: string[];
            token?: string;
            namespace?: string;
            namespaces?: string[];
            tls?: {
                ca?: string;
                caOptional?: boolean;
                cert?: string;
                key?: string;
                insecureSkipVerify?: boolean;
            };
        };
        etcd?: {
            rootKey?: string;
            endpoints?: string[];
            username?: string;
            password?: string;
            tls?: {
                ca?: string;
                caOptional?: boolean;
                cert?: string;
                key?: string;
                insecureSkipVerify?: boolean;
            };
        };
        zooKeeper?: {
            rootKey?: string;
            endpoints?: string[];
            username?: string;
            password?: string;
        };
        redis?: {
            rootKey?: string;
            endpoints?: string[];
            username?: string;
            password?: string;
            db?: number;
            tls?: {
                ca?: string;
                caOptional?: boolean;
                cert?: string;
                key?: string;
                insecureSkipVerify?: boolean;
            };
        };
        http?: {
            endpoint?: string;
            pollInterval?: string;
            pollTimeout?: string;
            tls?: {
                ca?: string;
                caOptional?: boolean;
                cert?: string;
                key?: string;
                insecureSkipVerify?: boolean;
            };
        };
        plugin?: Record<string, Record<string, unknown>>;
        [k: string]: unknown;
    };
    serversTransport?: {
        insecureSkipVerify?: boolean;
        rootCAs?: string[];
        maxIdleConnsPerHost?: number;
        forwardingTimeouts?: {
            dialTimeout?: string;
            responseHeaderTimeout?: string;
            idleConnTimeout?: string;
        };
    };
    tracing?: {
        serviceName?: string;
        spanNameLimit?: number;
        jaeger?: {
            samplingServerURL?: string;
            samplingType?: string;
            samplingParam?: number;
            localAgentHostPort?: string;
            gen128Bit?: boolean;
            propagation?: string;
            traceContextHeaderName?: string;
            disableAttemptReconnecting?: boolean;
            collector?: {
                endpoint?: string;
                user?: string;
                password?: string;
            };
        };
        zipkin?: {
            httpEndpoint?: string;
            sameSpan?: boolean;
            id128Bit?: boolean;
            sampleRate?: number;
        };
        datadog?: {
            localAgentHostPort?: string;
            globalTag?: string;
            /**
             * Sets a list of key:value tags on all spans.
             */
            globalTags?: Record<string, string>;
            debug?: boolean;
            prioritySampling?: boolean;
            traceIDHeaderName?: string;
            parentIDHeaderName?: string;
            samplingPriorityHeaderName?: string;
            bagagePrefixHeaderName?: string;
        };
        instana?: {
            localAgentHost?: string;
            localAgentPort?: number;
            logLevel?: string;
            enableAutoProfile?: boolean;
        };
        haystack?: {
            localAgentHost?: string;
            localAgentPort?: number;
            globalTag?: string;
            traceIDHeaderName?: string;
            parentIDHeaderName?: string;
            spanIDHeaderName?: string;
            baggagePrefixHeaderName?: string;
        };
        elastic?: {
            serverURL?: string;
            secretToken?: string;
            serviceEnvironment?: string;
        };
    };
}

export const TRAEFIK_SSL_PORT = Number.parseInt(process.env.TRAEFIK_SSL_PORT) || 443;
export const TRAEFIK_PORT = Number.parseInt(process.env.TRAEFIK_PORT) || 80;
export const TRAEFIK_HTTP3_PORT = Number.parseInt(process.env.TRAEFIK_HTTP3_PORT) || 443;

/**
 * Traefik default configuration
 */
export const getDefaultTraefikConfig = () => {
    const configObject: MainTraefikConfig = {
        global: {
            sendAnonymousUsage: false,
        },
        providers: {
            ...(process.env.NODE_ENV === 'development'
                ? {
                    docker: {
                          defaultRule: 'Host(`{{ trimPrefix `/` .Name }}.docker.localhost`)',
                    },
                }
                : {
                    swarm: {
                        exposedByDefault: false,
                        watch: true,
                    },
                    docker: {
                        exposedByDefault: false,
                        watch: true,
                          network: 'dokploy-network',
                    },
                }),
            file: {
                directory: '/etc/dokploy/traefik/dynamic',
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
                ...(process.env.NODE_ENV === 'production' && {
                    http: {
                        tls: {
                            certResolver: 'letsencrypt',
                        },
                    },
                }),
            },
        },
        api: {
            insecure: true,
        },
        ...(process.env.NODE_ENV === 'production' && {
            certificatesResolvers: {
                letsencrypt: {
                    acme: {
                        email: 'test@localhost.com',
                        storage: '/etc/dokploy/traefik/dynamic/acme.json',
                        httpChallenge: {
                            entryPoint: 'web',
                        },
                    },
                },
            },
        }),
    };

    const yamlStr = stringify(configObject);

    return yamlStr;
};
