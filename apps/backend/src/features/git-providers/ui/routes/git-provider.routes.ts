import { Router } from 'express';

import { deleteGitProviderController } from '../controllers/delete-git-provider.controller';
import { getGitProviderByIdController } from '../controllers/get-git-provider-by-id.controller';
import { getGitProvidersController } from '../controllers/get-git-providers.controller';
import { updateGitProviderController } from '../controllers/update-git-provider.controller';
import { gitProviderIdParamsSchema, updateGitProviderSchema } from '../validation/git-provider.validation';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const gitProviderRouter = Router();

gitProviderRouter.get('/', getGitProvidersController);
gitProviderRouter.get('/:gitProviderId', validateInput(gitProviderIdParamsSchema, 'params'), getGitProviderByIdController);
gitProviderRouter.patch(
    '/:gitProviderId',
    validateInput(gitProviderIdParamsSchema, 'params'),
    validateInput(updateGitProviderSchema, 'body'),
    updateGitProviderController,
);
gitProviderRouter.delete('/:gitProviderId', validateInput(gitProviderIdParamsSchema, 'params'), deleteGitProviderController);

export { gitProviderRouter };
