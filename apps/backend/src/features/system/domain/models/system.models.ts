/**
 * System configuration model
 */
export interface SystemConfig {
    id: string;
    appId: string;
    privateKey: string;
    webhookSecret: string;
    appSlug: string;
    initializedAt: Date;
}
