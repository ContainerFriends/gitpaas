import { z } from 'zod';

import { networkFormSchema } from '../schemas/network-form.schema';

export type NetworkFormData = z.infer<typeof networkFormSchema>;