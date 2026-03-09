import { z } from 'zod';

import { gitProviderFormSchema } from '../schemas/git-provider-form.schema';

export type GitProviderFormData = z.infer<typeof gitProviderFormSchema>;
