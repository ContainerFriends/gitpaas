import { z } from 'zod';

/**
 * Service form schema (used for both create and update)
 */
export const serviceFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
});

/**
 * Service detail form schema (used for service configuration)
 */
export const serviceDetailFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    gitProviderId: z.string().optional(),
    repositoryUrl: z.string().url('Repository URL must be a valid URL').optional().or(z.literal('')),
    branch: z.string().max(100, 'Branch must be less than 100 characters').optional().or(z.literal('')),
});
