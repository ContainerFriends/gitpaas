---
name: "Infrastructure & Deployment"
description: "Infrastructure, deployment, and environment configuration for Project Planner"
applyTo: "iac/**/*.{yml,yaml,dockerfile,sh}"
---

# Infrastructure & Deployment

## Container architecture

### Application containers

- **Backend Container**: Node.js runtime with Express application
- **Frontend Container**: Nginx serving static React build
- **Database Container**: PostgreSQL with persistent storage
- **Development Container**: VS Code dev container setup

### Container orchestration

- Docker Compose for local development
- Multi-stage builds for optimized images
- Health checks for service monitoring
- Volume mounts for development workflows
- Network isolation between services

## Database infrastructure

### PostgreSQL configuration

- Persistent volume for data storage
- Connection pooling configuration
- Performance tuning parameters
- Backup and recovery procedures
- Migration management with Prisma

### Data management

- Database initialization scripts
- Seed data for development
- Environment-specific configurations
- Connection string management
- Database monitoring and logging

## Environment management

### Development environment

- Docker Compose for local setup
- Hot reload for both frontend and backend
- Database seeding for test data
- Environment variable management
- SSL certificate handling for local HTTPS

### Production considerations

- Container registry management
- Secret management strategy
- Load balancing configuration
- Monitoring and alerting setup
- Backup and disaster recovery

## Authentication infrastructure

### Auth0 integration

- Application registration and configuration
- JWT token validation setup
- User management and roles
- Social login provider configuration
- Security policy enforcement

### Security configuration

- CORS settings for cross-origin requests
- HTTPS enforcement
- Security headers configuration
- Rate limiting implementation
- API key management

## Build & deployment pipeline

### Build process

- Turborepo for monorepo builds
- TypeScript compilation
- Asset bundling and optimization
- Test execution and coverage
- Static analysis and linting

### Deployment strategy

- Container image building
- Environment promotion workflow
- Rolling deployment strategy
- Health checks and rollback procedures
- Configuration management

## Monitoring & observability

### Logging strategy

- Structured logging with JSON format
- Log aggregation and centralization
- Error tracking and alerting
- Performance monitoring
- User activity tracking

### Health monitoring

- Application health endpoints
- Database connection monitoring
- External service dependency checks
- Resource utilization tracking
- Uptime monitoring and alerting