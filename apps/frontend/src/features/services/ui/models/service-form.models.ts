import { z } from 'zod';

import { serviceFormSchema } from '../schemas/service.schemas';

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
