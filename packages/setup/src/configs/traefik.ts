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

/**
 * Traefik configuration file provider model
 */
export interface FileConfig {
    http?: {
        routers?: Record<string, HttpRouter>;
        services?: Record<string, HttpService>;
        /**
         * Attached to the routers, pieces of middleware are a means of tweaking the requests before they are sent to your service (or before the answer from the services are sent to the clients).
         *
         * There are several available middleware in Traefik, some can modify the request, the headers, some are in charge of redirections, some add authentication, and so on.
         *
         * Pieces of middleware can be combined in chains to fit every scenario.
         */
        middlewares?: Record<string, HttpMiddleware>;
        [k: string]: unknown;
    };
    tcp?: {
        routers?: Record<string, TcpRouter>;
        /**
         * Each of the fields of the service section represents a kind of service. Which means, that for each specified service, one of the fields, and only one, has to be enabled to define what kind of service is created. Currently, the two available kinds are LoadBalancer, and Weighted.
         */
        services?: Record<string, TcpService>;
        [k: string]: unknown;
    };
    udp?: {
        /**
         * Similarly to TCP, as UDP is the transport layer, there is no concept of a request, so there is no notion of an URL path prefix to match an incoming UDP packet with. Furthermore, as there is no good TLS support at the moment for multiple hosts, there is no Host SNI notion to match against either. Therefore, there is no criterion that could be used as a rule to match incoming packets in order to route them. So UDP "routers" at this time are pretty much only load-balancers in one form or another.
         */
        routers?: Record<string, UdpRouter>;
        /**
         * Each of the fields of the service section represents a kind of service. Which means, that for each specified service, one of the fields, and only one, has to be enabled to define what kind of service is created. Currently, the two available kinds are LoadBalancer, and Weighted.
         */
        services?: Record<string, UdpService>;
    };
    /**
     * Configures the TLS connection, TLS options, and certificate stores.
     */
    tls?: {
        certificates?: Array<{
            certFile?: string;
            keyFile?: string;
            /**
             * A list of stores can be specified here to indicate where the certificates should be stored. Although the stores list will actually be ignored and automatically set to ["default"].
             */
            stores?: string[];
            [k: string]: unknown;
        }>;
        /**
         * The TLS options allow one to configure some parameters of the TLS connection.
         */
        options?: Record<
            string,
            {
                /**
                 * Minimum TLS Version
                 */
                minVersion?: string;
                /**
                 * Maximum TLS Version. It is discouraged to use of this setting to disable TLS1.3. The recommended approach is to update the clients to support TLS1.3.
                 */
                maxVersion?: string;
                /**
                 * Cipher suites defined for TLS 1.2 and below cannot be used in TLS 1.3, and vice versa. With TLS 1.3, the cipher suites are not configurable (all supported cipher suites are safe in this case).
                 */
                cipherSuites?: string[];
                /**
                 * This option allows to set the preferred elliptic curves in a specific order.
                 *
                 * The names of the curves defined by crypto (e.g. CurveP521) and the RFC defined names (e.g. secp521r1) can be used.
                 */
                curvePreferences?: string[];
                /**
                 * With strict SNI checking enabled, Traefik won't allow connections from clients that do not specify a server_name extension or don't match any certificate configured on the tlsOption.
                 */
                sniStrict?: boolean;
                /**
                 * This option allows the server to choose its most preferred cipher suite instead of the client's. Please note that this is enabled automatically when minVersion or maxVersion are set.
                 */
                preferServerCipherSuites?: boolean;
                /**
                 * Traefik supports mutual authentication, through the clientAuth section.
                 */
                clientAuth?: {
                    /**
                     * For authentication policies that require verification of the client certificate, the certificate authority for the certificate should be set here.
                     */
                    caFiles?: string[];
                    clientAuthType?: string;
                    [k: string]: unknown;
                };
                [k: string]: unknown;
            }
        >;
        /**
         * Any store definition other than the default one (named default) will be ignored, and there is therefore only one globally available TLS store.
         */
        stores?: Record<
            string,
            {
                /**
                 * Traefik can use a default certificate for connections without a SNI, or without a matching domain. If no default certificate is provided, Traefik generates and uses a self-signed certificate.
                 */
                defaultCertificate?: {
                    certFile?: string;
                    keyFile?: string;
                };
                /**
                 * GeneratedCert defines the default generated certificate configuration.
                 */
                defaultGeneratedCert?: {
                    /**
                     * Resolver is the name of the resolver that will be used to issue the DefaultCertificate.
                     */
                    resolver?: string;
                    /**
                     * Domain is the domain definition for the DefaultCertificate.
                     */
                    domain?: {
                        /**
                         * Main defines the main domain name.
                         */
                        main?: string;
                        /**
                         * SANs defines the subject alternative domain names.
                         */
                        sans?: string[];
                        [k: string]: unknown;
                    };
                };
            }
        >;
    };
}

/**
 * Traefik options model
 */
export interface TraefikOptions {
    env?: string[];
    serverId?: string;
    additionalPorts?: Array<{
        targetPort: number;
        publishedPort: number;
        protocol?: string;
    }>;
}

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
