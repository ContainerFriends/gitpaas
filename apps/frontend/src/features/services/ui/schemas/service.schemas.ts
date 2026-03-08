import { z } from 'zod';

/**
 * Service creation schema
 */
export const createServiceSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    repositoryUrl: z.string().url('Must be a valid URL'),
    branch: z.string().optional(),
});

/**
 * Service update schema
 */
export const updateServiceSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
    repositoryUrl: z.string().url('Must be a valid URL').optional(),
    branch: z.string().optional(),
});

/**
 * Service form schema (used for both create and update)
 */
export const serviceFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    repositoryUrl: z.string().url('Must be a valid URL'),
    branch: z.string().optional(),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
export type ServiceFormSchema = z.infer<typeof serviceFormSchema>;