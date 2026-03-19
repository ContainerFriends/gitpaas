import { Router } from 'express';

import { getVolumesController } from '../controllers/get-volumes.controller';
import { removeVolumeController } from '../controllers/remove-volume.controller';
import { volumeNameSchema } from '../validators/volume.validators';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const volumeRouter = Router();

volumeRouter.get('/', getVolumesController);
volumeRouter.delete('/:name', validateInput(volumeNameSchema, 'params'), removeVolumeController);

export { volumeRouter };
