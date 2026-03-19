import { Router } from 'express';

import { healthController } from '../controllers/health.controller';
import { healthQuerySchema } from '../validators/health.validators';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const healthRouter = Router();

healthRouter.get('/', validateInput(healthQuerySchema, 'query'), healthController);

export { healthRouter };
