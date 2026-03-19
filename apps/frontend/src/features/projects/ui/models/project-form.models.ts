import { z } from 'zod';

import { projectFormSchema } from '../schemas/project-form.schema';

export type ProjectFormData = z.infer<typeof projectFormSchema>;
