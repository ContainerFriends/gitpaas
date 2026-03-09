import { Router } from 'express';

import { getContainersController } from '../controllers/get-containers.controller';

const containerRouter = Router();

containerRouter.get('/', getContainersController);

export { containerRouter };
