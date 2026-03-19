import { Router } from 'express';

import { createProjectController } from '../controllers/create-project.controller';
import { deleteProjectController } from '../controllers/delete-project.controller';
import { getProjectByIdController } from '../controllers/get-project-by-id.controller';
import { getProjectsController } from '../controllers/get-projects.controller';
import { updateProjectController } from '../controllers/update-project.controller';
import { createProjectSchema, projectIdParamsSchema, updateProjectSchema } from '../validation/project.validation';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const projectRouter = Router();

projectRouter.get('/', getProjectsController);
projectRouter.get('/:projectId', validateInput(projectIdParamsSchema, 'params'), getProjectByIdController);
projectRouter.post('/', validateInput(createProjectSchema, 'body'), createProjectController);
projectRouter.patch(
    '/:projectId',
    validateInput(projectIdParamsSchema, 'params'),
    validateInput(updateProjectSchema, 'body'),
    updateProjectController,
);
projectRouter.delete('/:projectId', validateInput(projectIdParamsSchema, 'params'), deleteProjectController);

export { projectRouter };
