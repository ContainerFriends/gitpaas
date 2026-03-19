import { z } from 'zod';

/**
 * Project creation form schema
 */
export const projectFormSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
});
