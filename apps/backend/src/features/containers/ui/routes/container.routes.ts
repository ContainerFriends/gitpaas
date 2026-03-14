import { Router } from 'express';

import { getContainersController } from '../controllers/get-containers.controller';
import { removeContainerController } from '../controllers/remove-container.controller';
import { containerIdSchema } from '../validators/container.validators';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const containerRouter = Router();

containerRouter.get('/', getContainersController);
containerRouter.delete('/:id', validateInput(containerIdSchema, 'params'), removeContainerController);

export { containerRouter };
