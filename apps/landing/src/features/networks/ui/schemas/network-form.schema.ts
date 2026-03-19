import { z } from 'zod';

/**
 * Network creation form schema
 */
export const networkFormSchema = z.object({
    name: z.string().min(1, 'Network name is required').max(100, 'Network name must be less than 100 characters'),
});