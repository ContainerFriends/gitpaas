import { z } from 'zod';

export const gitProviderFormSchema = z.object({
    name: z.string().min(1, 'Git provider name is required').max(100, 'Git provider name must be less than 100 characters'),
});
