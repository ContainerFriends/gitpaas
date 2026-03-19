import { Router } from 'express';

import { installGithubAppController } from '../controllers/install-github-app.controller';
import { postInstallGithubAppController } from '../controllers/post-install-github-app.controller';
import { installGithubAppQuerySchema, postInstallGithubAppQuerySchema } from '../validation/events.validation';

import { validateInput } from '@core/ui/middlewares/validation.middleware';

const eventsRouter = Router();

eventsRouter.get('/github-installation', validateInput(installGithubAppQuerySchema, 'query'), installGithubAppController);
eventsRouter.get('/github-postinstallation', validateInput(postInstallGithubAppQuerySchema, 'query'), postInstallGithubAppController);

export { eventsRouter };
