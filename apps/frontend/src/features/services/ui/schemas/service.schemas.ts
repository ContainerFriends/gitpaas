import { z } from 'zod';

/**
 * Service form schema (used for both create and update)
 */
export const serviceFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
});
