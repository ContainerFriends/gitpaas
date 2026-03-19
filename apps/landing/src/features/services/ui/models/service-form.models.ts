import { z } from 'zod';

import { editServiceFormSchema, serviceFormSchema, serviceDetailFormSchema } from '../schemas/service.schemas';

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type EditServiceFormData = z.infer<typeof editServiceFormSchema>;
export type ServiceDetailFormData = z.infer<typeof serviceDetailFormSchema>;
