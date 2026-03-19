---
name: "Backend Architecture"
description: "Clean Architecture patterns and conventions for GitPaaS backend application"
applyTo: "apps/backend/src/**/*.{ts,js}"
---

# Backend architecture

## Overview

GitPaaS backend implements **Clean Architecture** with a modular feature-based structure, focusing on project management and Docker integration. The application follows strict layer separation with clear dependency inversion patterns.

## Architecture layers

### Core structure
```
src/
├── core/                   # Shared infrastructure and domain concepts
│   ├── domain/             # Common interfaces, errors, models
│   │   ├── errors/         # Domain error classes
│   │   ├── interfaces/     # Shared interfaces
│   │   └── models/         # Common domain models
│   ├── infrastructure/     # Shared services (logging, database, Docker, Prisma)
│   │   ├── docker/         # Docker client configuration
│   │   ├── express/        # Express configuration and middleware
│   │   ├── loggers/        # Winston logging setup
│   │   ├── octokit/        # GitHub client (available but unused)
│   │   └── prisma/         # Database client and configuration
│   └── ui/                 # Common HTTP components (middlewares, handlers, routes)
│       ├── controllers/    # Shared controllers (health)
│       ├── handlers/       # Error handlers
│       ├── middlewares/    # Common middleware
│       └── routes/         # Health check routes
└── features/               # Business features with Clean Architecture
    ├── projects/           # Project management (Database-backed)
    │   ├── application/    # Use cases and orchestrators
    │   ├── domain/         # Business logic and contracts
    │   │   ├── dtos/       # Data transfer objects
    │   │   ├── models/     # Project entity models
    │   │   └── repositories/ # Database persistence interfaces
    │   ├── infrastructure/ # External dependencies implementation
    │   │   └── database/   # Prisma repositories + mappers
    │   └── ui/             # HTTP layer and entrypoints
    │       ├── controllers/ # Request handlers
    │       ├── routes/      # Express route definitions
    │       └── validation/  # Joi schemas
    └── networks/           # Docker network management (API-backed)
        ├── application/    # Use cases and orchestrators
        ├── domain/         # Business logic and contracts
        │   ├── dtos/       # Data transfer objects
        │   ├── models/     # Network entity models
        │   └── repositories/ # Gateway interfaces (named as repositories)
        ├── infrastructure/ # External dependencies implementation
        │   └── docker/     # Docker gateway + mappers
        └── ui/             # HTTP layer and entrypoints
            ├── controllers/ # Request handlers
            ├── routes/      # Express route definitions
            └── validators/  # Joi schemas
```

### Dependency flow
```
Domain (interfaces) ← Application (use cases) ← Infrastructure (implementations) ← UI (HTTP)
```

## Application layer (Business logic)

### Use cases

- Single responsibility business operations
- Depend only on domain interfaces
- Pure functions with explicit inputs/outputs
- Comprehensive JSDoc documentation
- Dependency injection for repositories

### Orchestrators pattern

- **Purpose**: coordinate multiple use cases for complex workflows
- **Location**: `application/orchestrators/*.orchestrator.ts`
- **Example**: `syncIssuesOrchestrator` coordinates repository fetching + issues sync + persistence
- **Benefits**: encapsulates transaction boundaries and business workflows

## Domain layer (Pure Business logic)

### Entity models

- TypeScript interfaces with Union Types for constraints
- Example: `status: 'todo' | 'in_progress' | 'done'`
- Rich domain models with composed relationships

### Repository interfaces (Database persistence)

- Abstract database dependencies for entities stored in PostgreSQL
- Located in `domain/repositories/`
- Naming: `{Entity}Repository` (e.g., `ProjectRepository`)
- Implemented by Prisma repositories in `infrastructure/database/`
- Used for: `projects` feature

### Gateway interfaces (External API integration)

- Abstract external API dependencies (Docker API)
- Located in `domain/repositories/` (following project convention)
- Naming: `{Entity}Gateway` (e.g., `NetworkGateway`)
- Implemented by API gateways in `infrastructure/{service}/`
- Used for: `networks` feature with Docker integration

### DTOs and Value objects

- Strongly typed data transfer objects
- Input validation at boundaries
- Transformation between layers

### Domain errors

Hierarchical error system for different failure scenarios:

- `AuthenticationError` / `AuthorizationError` - For future auth implementation
- `DatabaseError` - Database connection and operation failures
- `DockerError` - Docker API communication failures
- `GitHubError` - GitHub API errors (infrastructure available but unused)
- `ConfigurationError` - Application setup and config issues
- `NotFoundError` / `ConflictError` / `BadRequestError` / `TimeoutError` - HTTP-related errors

## Infrastructure layer (External dependencies)

### Database management

- **ORM**: Prisma with PostgreSQL adapter
- **Pattern**: singleton client with connection pooling
- **Location**: `core/infrastructure/prisma/`
- **Features**: type-safe operations, migrations, environment-based logging
- **Repository implementation**: `{entity}PrismaRepository` in `infrastructure/database/`
- **Mappers**: `{entity}-prisma.mapper.ts` for data transformation between Prisma and domain models

### Docker API integration

- **Client**: dockerode for Docker socket communication
- **Pattern**: Gateway pattern — implementations in `infrastructure/docker/` implement domain gateway interfaces
- **Client factory**: centralized Docker client in `core/infrastructure/docker/docker.client.ts`
- **Naming**: `{entity}DockerGateway` (e.g., `networkDockerGateway`)
- **Mappers**: `{entity}-docker.mapper.ts` transform Docker API data to domain models
- **Error Handling**: API-specific error wrapping with `DockerError`

### Logging system

- **Library**: Winston with structured logging
- **Features**: multiple transports (Console + optional Loki)
- **Levels**: debug, info, warn, error with environment-based filtering
- **Format**: colored console output with timestamps and metadata
- **Usage**: controllers use `appLogger` for error logging and request tracking

## UI layer (HTTP interface)

### Express application setup

```typescript
Security (Helmet) → CORS → JSON Parsing → Routes → Error Handling
```

### Route organization

- Feature-based routing: `/v1/projects`, `/v1/networks`
- Health check endpoint: `/health`
- Versioned APIs with configurable API version via environment variables

### Controller pattern

- Thin controllers that delegate to orchestrators
- Consistent error handling with centralized error handler
- HTTP status code mapping from domain errors
- Structured logging for request tracking and debugging
- Dependency injection of repositories/gateways into orchestrators

## Configuration management

### Environment variables

- **Required**: PORT, HOST, NODE_ENV, API_VERSION, CORS_ORIGIN, REQUEST_TIMEOUT, DATABASE_URL
- **Optional**: LOG_LEVEL, LOKI_URL
- **Validation**: startup validation ensures required variables are present
- **No authentication**: Auth0 variables removed (future implementation)

### Security configuration

- **CORS**: configurable origins with validation
- **Helmet**: security headers for production
- **Rate Limiting**: JSON body size limits (10mb)
- **Future authentication**: Auth0 integration planned but not implemented

## Integration patterns

### Docker API integration

- Network management operations (create, list, remove, inspect)
- Container connection/disconnection to networks
- Network pruning operations
- Error handling for Docker daemon communication
- Mapping between Docker API responses and domain models

### Database patterns

- Repository pattern: Prisma implementations fulfill domain repository interfaces
- Naming: `{entity}PrismaRepository` in `infrastructure/database/` (e.g., `projectPrismaRepository`)
- Prisma mappers (`{entity}-prisma.mapper.ts`) for data transformation
- Connection management with graceful shutdown
- Transaction support for complex operations

### Gateway patterns

- Gateway pattern: implementations fulfill domain gateway interfaces for external APIs
- Naming: `{entity}DockerGateway` in `infrastructure/docker/` (e.g., `networkDockerGateway`)
- API mappers (`{entity}-docker.mapper.ts`) for external data transformation
- Centralized error handling with domain-specific errors (`DockerError`)
- Unified object-based structure with methods (not individual functions)

## Deployment architecture

### Application lifecycle

- Environment validation on startup (required variables check)
- Graceful shutdown with resource cleanup
- Health check endpoint (`/health`) for monitoring
- Structured logging for observability and debugging

### Error recovery

- Database connection retry logic
- Docker API fallback strategies
- Request timeout handling
- Resource cleanup on shutdown signals (SIGTERM, SIGINT)

## Current implementation status

### Implemented features

- **Projects**: Full CRUD with PostgreSQL persistence via Prisma
- **Networks**: Docker network management via dockerode
- **Core infrastructure**: Logging, error handling, Express setup

### Available but unused

- **GitHub integration**: Octokit client configured but no features use it
- **Authentication**: Error classes exist but no Auth0 implementation

The architecture is designed for extensibility, with clear separation between database-backed features (repositories) and external API features (gateways).