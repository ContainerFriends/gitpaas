import { Router } from 'express';

import { getBranchesController } from '../controllers/get-branches.controller';
import { getRepositoriesController } from '../controllers/get-repositories.controller';
import { getBranchesQuerySchema, getRepositoriesQuerySchema } from '../validators/repository.validators';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const repositoryRouter = Router();

repositoryRouter.get('/', validateInput(getRepositoriesQuerySchema, 'query'), getRepositoriesController);
repositoryRouter.get('/branches', validateInput(getBranchesQuerySchema, 'query'), getBranchesController);

export { repositoryRouter };
