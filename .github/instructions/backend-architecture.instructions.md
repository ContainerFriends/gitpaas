---
name: "Backend Architecture"
description: "Clean Architecture patterns and conventions for Project Planner backend application"
applyTo: "apps/backend/src/**/*.{ts,js}"
---

# Backend architecture

## Overview

Project Planner backend implementa **Clean Architecture** con una estructura modular basada en features, integraciones externas robustas y patrones de orquestación para workflows complejos.

## Architecture layers

### Core structure
```
src/
├── core/                   # Shared infrastructure and domain concepts
│   ├── domain/             # Common interfaces, errors, models
│   ├── infrastructure/     # Shared services (logging, database, external APIs, Inngest)
│   └── ui/                 # Common HTTP components (middlewares, handlers)
└── features/               # Business features with Clean Architecture
    └── [entity]/
        ├── application/    # Use cases and orchestrators
        ├── domain/         # Pure business logic and contracts
        │   ├── constants/  # Domain constants
        │   ├── dtos/       # Data transfer objects
        │   ├── events/     # Inngest event name constants
        │   ├── gateways/   # External API interfaces (GitHub)
        │   ├── models/     # Entity models and types
        │   └── repositories/ # Persistence interfaces
        ├── infrastructure/ # External dependencies implementation
        │   ├── database/   # Prisma repositories + mappers
        │   └── octokit/    # Octokit gateways + mappers
        └── ui/             # HTTP layer and entrypoints
            ├── controllers/  # Request handlers
            ├── events/       # Inngest function handlers (entrypoints)
            ├── routes/       # Express route definitions
            └── validation/   # Joi schemas
```

> Not all features require every subdirectory. For example, `settings` has no gateways (no GitHub integration), `authentication` has only infrastructure and ui layers, and `events` has only ui layer.

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

### Repository interfaces

- Abstract persistence dependencies (database)
- Located in `domain/repositories/`
- Naming: `{Entity}Repository` (e.g., `IssuesRepository`, `RepositoriesRepository`, `OrganizationsRepository`)
- Implemented by Prisma repositories in `infrastructure/database/`

### Gateway interfaces

- Abstract external API dependencies (GitHub)
- Located in `domain/gateways/`
- Naming: `{Entity}GithubGateway` (e.g., `IssuesGithubGateway`, `RepositoriesGithubGateway`, `OrganizationsGithubGateway`)
- Implemented by Octokit gateways in `infrastructure/octokit/`

### DTOs and Value objects

- Strongly typed data transfer objects
- Input validation at boundaries
- Transformation between layers

### Domain errors

Hierarchical error system:

- `AuthenticationError` / `AuthorizationError`
- `DatabaseError` with specific error types
- `GitHubError` for external API failures
- `ConfigurationError` for setup issues
- `NotFoundError` / `ConflictError` / `TimeoutError`

## Infrastructure layer (External dependencies)

### Database management

- **ORM**: Prisma with PostgreSQL adapter
- **Pattern**: singleton client with connection pooling
- **Location**: `core/infrastructure/prisma/`
- **Features**: type-safe operations, migrations, logging per environment

### External API integration (GitHub Gateways)

- **GitHub**: Octokit REST API client
- **Pattern**: Gateway pattern — implementations in `infrastructure/octokit/` implement domain gateway interfaces from `domain/gateways/`
- **Client factory**: centralized Octokit instance in `core/infrastructure/octokit/`
- **Naming**: `{entity}OctokitGateway` (e.g., `issuesOctokitGateway`, `repositoriesOctokitGateway`, `organizationsOctokitGateway`)
- **Mappers**: `{entity}-octokit.mapper.ts` transform external API data to domain models
- **Error Handling**: API-specific error wrapping with `GitHubError`

### Background jobs (Inngest)

- **Client**: Singleton `inngestClient` in `core/infrastructure/inngest/inngest.client.ts`
- **Purpose**: Async event-driven processing for heavy operations (sync workflows)
- **Event constants**: Defined in `domain/events/{feature}.events.ts` with `id` and `name` fields
- **Event handlers**: Inngest functions in `ui/events/{action}.event.ts` (considered UI entrypoints)
- **Registration**: All Inngest functions are registered centrally in `features/events/ui/controllers/internal-events.controller.ts` via `serve()`
- **Dispatch**: Controllers send events via `inngestClient.send({ name: EVENT_CONSTANT.name, data: {} })`
- **Route**: Inngest serve middleware is mounted at `/v1/events/internal`

#### Event flow
```
1. Controller → inngestClient.send({ name: SYNC_ORGANIZATIONS_EVENT.name, data: {} })
2. Inngest receives event → matches handler in ui/events/
3. Handler executes orchestrator with injected dependencies
```

#### Event naming convention
- Event names: `planner/{entity}.{action}` (e.g., `planner/organizations.sync`)
- Event IDs: `{action}-{entity}` (e.g., `sync-organizations`)
- Constants file: `domain/events/{entity}.events.ts`

### Logging system

- **Library**: Winston with structured logging
- **Features**: multiple transports (Console + optional Loki)
- **Levels**: debug, Info, Warn, Error with environment-based filtering
- **Format**: colored console output with timestamps and metadata

## UI layer (HTTP interface)

### Express application setup

```typescript
Security (Helmet) → CORS → JSON Parsing → Routes → Error Handling
```

### Route organization

- Feature-based routing: `/v1/organizations`, `/v1/repositories`, `/v1/issues`
- Health check endpoint: `/health`
- Versioned APIs with configurable API version

### Middleware pipeline

- **Authentication**: Auth0 JWT validation
- **Validation**: Joi schema validation with factory pattern
- **Error Handling**: centralized error mapping to HTTP responses
- **Logging**: request/response logging with structured data

### Controller pattern

- Thin controllers that delegate to orchestrators/use-cases
- Controllers that trigger background jobs dispatch Inngest events instead of calling orchestrators directly
- Consistent error handling with centralized error handler
- HTTP status code mapping from domain errors

## Configuration management

### Environment variables

- **Required**: PORT, HOST, ENVIRONMENT, API_VERSION, CORS_ORIGIN, AUTH0_ISSUER, AUTH0_AUDIENCE
- **Optional**: DATABASE_URL, GITHUB_PERSONAL_ACCESS_TOKEN, LOG_LEVEL, LOKI_URL
- **Validation**: startup validation ensures required variables are present

### Security configuration

- **CORS**: configurable origins with validation
- **Helmet**: security headers for production
- **Rate Limiting**: JSON body size limits (10mb)
- **Authentication**: Auth0 integration for JWT validation

## Integration patterns

### GitHub API integration

- Repository synchronization and issue management
- Pagination handling for large datasets
- Label-based issue categorization (status/, priority/ prefixes)
- Rate limiting awareness and error handling

### Database patterns

- Repository pattern: Prisma implementations fulfill domain repository interfaces
- Naming: `{entity}PrismaRepository` in `infrastructure/database/` (e.g., `issuesPrismaRepository`)
- Prisma mappers (`{entity}-prisma.mapper.ts`) for data transformation
- Transaction support for complex operations
- Connection management with graceful shutdown

### Gateway patterns

- Gateway pattern: Octokit implementations fulfill domain gateway interfaces
- Naming: `{entity}OctokitGateway` in `infrastructure/octokit/` (e.g., `issuesOctokitGateway`)
- Octokit mappers (`{entity}-octokit.mapper.ts`) for external data transformation
- Centralized error handling with `GitHubError` and `ConfigurationError`

## Deployment architecture

### Application lifecycle

- Environment validation on startup
- Graceful shutdown with resource cleanup
- Health check endpoint for monitoring
- Structured logging for observability

### Error recovery

- Database connection retry logic
- External API fallback strategies
- Request timeout handling
- Resource cleanup on shutdown signals (SIGTERM, SIGINT)