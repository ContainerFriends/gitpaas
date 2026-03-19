import { Router } from 'express';

import { createNetworkController } from '../controllers/create-network.controller';
import { getNetworkByIdController } from '../controllers/get-network-by-id.controller';
import { getNetworksController } from '../controllers/get-networks.controller';
import { removeNetworkController } from '../controllers/remove-network.controller';
import { createNetworkSchema, networkIdSchema } from '../validators/network.validators';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const networkRouter = Router();

networkRouter.get('/', getNetworksController);
networkRouter.get('/:id', validateInput(networkIdSchema, 'params'), getNetworkByIdController);
networkRouter.post('/', validateInput(createNetworkSchema), createNetworkController);
networkRouter.delete('/:id', validateInput(networkIdSchema, 'params'), removeNetworkController);

export { networkRouter };
