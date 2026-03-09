import { z } from 'zod';

import { serviceFormSchema, serviceDetailFormSchema } from '../schemas/service.schemas';

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type ServiceDetailFormData = z.infer<typeof serviceDetailFormSchema>;
