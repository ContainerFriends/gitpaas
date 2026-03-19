import helmet from 'helmet';

/**
 * Helmet security configuration
 */
export const helmetConfig = helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    hidePoweredBy: true,
    frameguard: {
        action: 'deny',
    },
    xssFilter: false,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },
});
