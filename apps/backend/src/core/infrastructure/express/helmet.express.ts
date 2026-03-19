import helmet from 'helmet';

/**
 * Helmet security configuration
 *
 * This configuration is optimized for a JSON API that doesn't serve HTML content
 */
export const helmetConfig = helmet({
    // Content Security Policy is for browsers loading resources, not needed for JSON APIs
    contentSecurityPolicy: false,

    // Cross-origin policies not relevant for REST APIs
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,

    // HSTS - Force HTTPS in production
    hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
    },

    // Prevent browsers from MIME-sniffing
    noSniff: true,

    // Remove X-Powered-By header to hide Express
    hidePoweredBy: true,

    // X-Frame-Options to prevent clickjacking
    frameguard: {
        action: 'deny',
    },

    // Disable X-XSS-Protection (deprecated, modern browsers use CSP)
    xssFilter: false,

    // Referrer Policy
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },
});
