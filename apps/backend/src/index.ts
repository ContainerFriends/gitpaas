// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config';

import express, { json } from 'express';

import { expressConfig } from '@core/infrastructure/express/config.express';
import { checkRequiredEnvVariables } from '@core/infrastructure/express/env-config.express';
import { setupGracefulShutdown } from '@core/infrastructure/express/graceful-shutdown.express';
import { helmetConfig } from '@core/infrastructure/express/helmet.express';
import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { healthRouter } from '@features/health/ui/routes/health.routes';

// Check for required environment variables
const requiredEnvVars = [
    'PORT',
    'HOST',
    'NODE_ENV',
    'API_VERSION',
    'SERVER_URL',
    'DEVELOPMENT_SERVER_URL',
    'REQUEST_TIMEOUT',
    'DATABASE_URL',
    'GITHUB_INSTALLER_URL',
    'SETUP_TOKEN',
];

checkRequiredEnvVariables(requiredEnvVars);

const app = express();

// Configure security policies
app.use(helmetConfig);

// Parse JSON bodies with size limit
app.use(json({ limit: '10mb' }));

// Routes
app.use(`/${expressConfig.apiVersion}/health`, healthRouter);

// Start server
const server = app.listen(expressConfig.port, () => {
    appLogger.info({ message: `🚀 Backend running on http://${expressConfig.host}:${expressConfig.port}` }, 'Application');
});

// Setup graceful shutdown
setupGracefulShutdown(server);

export default app;
