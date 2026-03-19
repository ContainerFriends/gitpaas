// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config';

import cors from 'cors';
import express, { json } from 'express';

import { expressConfig } from '@core/infrastructure/express/config.express';
import { validateCorsConfig } from '@core/infrastructure/express/cors.express';
import { checkRequiredEnvVariables } from '@core/infrastructure/express/env-config.express';
import { setupGracefulShutdown } from '@core/infrastructure/express/graceful-shutdown.express';
import { helmetConfig } from '@core/infrastructure/express/helmet.express';
import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { healthRouter } from '@features/health/ui/routes/health.routes';

// Check for required environment variables
const requiredEnvVars = ['PORT', 'HOST', 'NODE_ENV', 'API_VERSION', 'CORS_ORIGIN', 'REQUEST_TIMEOUT', 'DATABASE_URL', 'FRONTEND_URL'];

checkRequiredEnvVariables(requiredEnvVars);

const app = express();

// Configure security policies
app.use(helmetConfig);

// Configure CORS
validateCorsConfig(expressConfig.corsOrigin, expressConfig.environment);
const corsOriginString = expressConfig.corsOrigin;
const allowedOrigins = corsOriginString.split(',').map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));

// Parse JSON bodies with size limit
app.use(json({ limit: '10mb' }));

// Routes
app.use(`/health`, healthRouter);

// Start server
const server = app.listen(expressConfig.port, () => {
    appLogger.info({ message: `🚀 Backend running on http://${expressConfig.host}:${expressConfig.port}` }, 'Application');
});

// Setup graceful shutdown
setupGracefulShutdown(server);

export default app;
