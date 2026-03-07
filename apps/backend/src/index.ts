import compression from 'compression';
import cors from 'cors';
import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API routes
app.get('/api/deployments', (req, res) => {
    res.json({
        deployments: [
            {
                id: '1',
                name: 'deploy-hub-frontend',
                status: 'active',
                url: 'https://deploy-hub.example.com',
                lastDeployed: '2024-03-07T10:00:00Z',
            },
            {
                id: '2',
                name: 'deploy-hub-api',
                status: 'active',
                url: 'https://api.deploy-hub.example.com',
                lastDeployed: '2024-03-07T09:45:00Z',
            },
        ],
    });
});

app.get('/api/projects', (req, res) => {
    res.json({
        projects: [
            {
                id: '1',
                name: 'Deploy Hub',
                description: 'Container deployment management platform',
                status: 'active',
                containers: 2,
            },
        ],
    });
});

app.post('/api/deploy', (req, res) => {
    const { projectId, image, tag } = req.body;

    // Simulate deployment process
    res.json({
        deploymentId: `deploy-${Date.now()}`,
        status: 'initiated',
        projectId,
        image,
        tag,
        message: 'Deployment initiated successfully',
    });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.originalUrl} not found`,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
