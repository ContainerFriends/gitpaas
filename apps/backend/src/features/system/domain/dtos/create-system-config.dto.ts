/**
 * Create system configuration DTO
 */
export interface CreateSystemConfigDto {
    id: string;
    traceId: string;
    appId: string;
    privateKey: string;
    webhookSecret: string;
    appSlug: string;
    initializedAt: Date;
}
