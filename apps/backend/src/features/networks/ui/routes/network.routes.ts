import { Router } from 'express';

import { getNetworksController } from '../controllers/get-networks.controller';
import { getNetworkByIdController } from '../controllers/get-network-by-id.controller';
import { createNetworkController } from '../controllers/create-network.controller';
import { removeNetworkController } from '../controllers/remove-network.controller';
import { createNetworkSchema, networkIdSchema } from '../validators/network.validators';

import { validationMiddleware } from '@core/ui/middlewares/validation.middleware';

const router = Router();

/**
 * @route GET /networks
 * @description Get all Docker networks
 * @access Public
 */
router.get('/', getNetworksController);

/**
 * @route GET /networks/:id
 * @description Get network by ID
 * @access Public
 */
router.get('/:id', validationMiddleware(networkIdSchema, 'params'), getNetworkByIdController);

/**
 * @route POST /networks
 * @description Create a new network
 * @access Public
 */
router.post('/', validationMiddleware(createNetworkSchema), createNetworkController);

/**
 * @route DELETE /networks/:id
 * @description Remove a network
 * @access Public
 */
router.delete('/:id', validationMiddleware(networkIdSchema, 'params'), removeNetworkController);

export { router as networkRoutes };