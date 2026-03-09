import { z } from 'zod';

export const githubGitProviderFormSchema = z
    .object({
        name: z.string().min(1, 'Git provider name is required').max(100, 'Git provider name must be less than 100 characters'),
        isOrganization: z.boolean(),
        organizationName: z.string().max(100, 'Organization name must be less than 100 characters').optional(),
    })
    .refine((data) => !data.isOrganization || (data.organizationName && data.organizationName.trim().length > 0), {
        message: 'Organization name is required when "Is organization" is checked',
        path: ['organizationName'],
    });
