import { Router } from 'express';

import { createServiceController } from '../controllers/create-service.controller';
import { deleteServiceController } from '../controllers/delete-service.controller';
import { getServiceByIdController } from '../controllers/get-service-by-id.controller';
import { getServicesByProjectController } from '../controllers/get-services-by-project.controller';
import { getServicesController } from '../controllers/get-services.controller';
import { updateServiceController } from '../controllers/update-service.controller';
import { createServiceSchema, projectIdSchema, serviceIdSchema, updateServiceSchema } from '../validators/services.validators';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const servicesRouter = Router();

servicesRouter.get('/', getServicesController);
servicesRouter.get('/project/:projectId', validateInput(projectIdSchema, 'params'), getServicesByProjectController);
servicesRouter.get('/:id', validateInput(serviceIdSchema, 'params'), getServiceByIdController);
servicesRouter.post('/', validateInput(createServiceSchema, 'body'), createServiceController);
servicesRouter.patch('/:id', validateInput(serviceIdSchema, 'params'), validateInput(updateServiceSchema, 'body'), updateServiceController);
servicesRouter.delete('/:id', validateInput(serviceIdSchema, 'params'), deleteServiceController);

export { servicesRouter };
