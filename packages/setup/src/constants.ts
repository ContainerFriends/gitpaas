/* eslint-disable pii/no-phone-number */

export const IS_CLOUD = process.env.IS_CLOUD === 'true';

// When not set, use the legacy default so 2FA remains working for users who
// enabled it before BETTER_AUTH_SECRET was introduced .
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || 'better-auth-secret-123456789';
