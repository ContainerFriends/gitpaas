import { z } from 'zod';

export const gitProviderFormSchema = z.object({
    name: z.string().min(1, 'Git provider name is required').max(100, 'Git provider name must be less than 100 characters'),
    isOrganization: z.boolean().optional(),
    organizationName: z
        .string()
        .min(1, 'Organization name is required when creating an organization-scoped Git provider')
        .max(100, 'Organization name must be less than 100 characters')
        .optional(),
    type: z.enum(['github'], { message: 'Git provider type is required' }),
});
