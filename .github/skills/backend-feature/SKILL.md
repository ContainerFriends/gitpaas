---
name: backend-feature
description: Use when creating new backend features for Project Planner. Guides through Clean Architecture layer creation with domain models, DTOs, repository interfaces, gateway interfaces, use cases, orchestrators, Prisma/Octokit infrastructure, controllers, routes, and validation.
---

# Project Planner — Backend feature creation guide

Step-by-step instructions for creating new backend features following the established Clean Architecture patterns in the Project Planner monorepo.

---

## Prerequisites

- Project Planner monorepo set up and running
- Familiarity with the backend architecture instructions (`.github/instructions/backend-architecture.instructions.md`)
- Prisma schema already updated with the new entity model (if DB-backed)
- Prisma client regenerated after schema changes

---

## Feature architecture overview

Every backend feature lives in `apps/backend/src/features/{feature-name}/` and follows a strict 4-layer Clean Architecture:

```
features/{feature-name}/
├── domain/              ← Pure types, no dependencies
│   ├── models/          ← Entity interfaces
│   ├── dtos/            ← Data transfer objects
│   ├── repositories/    ← Repository interface contracts (persistence)
│   ├── gateways/        ← Gateway interface contracts (external APIs)
│   └── constants/       ← Feature-specific constants (optional)
├── application/         ← Business logic, depends only on domain
│   ├── use-cases/       ← Single-responsibility operations
│   └── orchestrators/   ← Coordinates multiple use cases
├── infrastructure/      ← Concrete implementations
│   ├── database/        ← Prisma repository + mapper
│   └── octokit/         ← GitHub API gateway + mapper (optional)
└── ui/                  ← HTTP layer
    ├── controllers/     ← Express request handlers
    ├── routes/          ← Express router definitions
    └── validation/      ← Joi validation schemas (optional)
```

**Dependency flow:** Domain ← Application ← Infrastructure ← UI

---

## Step-by-Step feature creation

### Step 1: Domain layer — Models

Create the entity model as a TypeScript interface. Models are pure data structures with no behavior.

**File:** `domain/models/{entity}.models.ts`

```typescript
/**
 * {Entity} model
 */
export interface {Entity} {
    id: string;
    name: string;
    // ... domain properties
}
```

**Conventions:**

- One model file per entity aggregate
- Use `string` for IDs (even if numeric in external systems)
- Create extended interfaces for relations: `{Entity}With{Relation}`, `{Entity}With{Relation}And{OtherRelation}`
- Use union types for enums: `status: 'todo' | 'in_progress' | 'done'`
- Use `null` (not `undefined`) for optional values in models

**Example with relations:**

```typescript
export interface Issue {
    id: string;
    number: string;
    title: string;
    body: string | null;
    url: string;
    repositoryId: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    labels: Array<{ name: string; color: string }>;
    assignee: { name: string; avatarUrl: string } | null;
}

export interface IssueWithRepository extends Issue {
    repository: Repository;
}

export interface IssueWithRepositoryAndOrganization extends Issue {
    repository: RepositoryWithOrganization;
}
```

---

### Step 2: Domain layer — DTOs

Create DTOs for each distinct operation (create, update, upsert). DTOs carry data between layers.

**File:** `domain/dtos/{operation}-{entity}.dto.ts`

**Naming convention:** `{Operation}{Entity}Dto`

```typescript
/**
 * Upsert {entity} DTO
 */
export interface Upsert{Entity}Dto {
    id: string;
    name: string;
    // ... only fields needed for the operation
}
```

**Common DTO types per feature:**

- `Upsert{Entity}Dto` — For sync operations (create or update)
- `Create{Entity}Dto` — For creation only
- `Update{Entity}Dto` — For partial updates
- `CreateGithub{Entity}Dto` — For creating on GitHub
- `UpdateGithub{Entity}Dto` — For updating on GitHub

**Example:**

```typescript
/**
 * Create Github issue DTO
 */
export interface CreateGithubIssueDto {
    repositoryId: string;
    title: string;
    body: string;
    priority: string;
    labels: string[];
}
```

---

### Step 3: Domain layer — Repository interfaces (persistence)

Define contracts for persistence operations that the database infrastructure must implement.

**File:** `domain/repositories/{entity}.repository.ts`

```typescript
import { Upsert{Entity}Dto } from '../dtos/upsert-{entity}.dto';
import { {Entity} } from '../models/{entity}.models';

/**
 * {Entity} repository
 */
export interface {Entity}Repository {
    /**
     * Get all {entities}
     *
     * @returns List of {entities}
     */
    getAll: () => Promise<{Entity}[]>;

    /**
     * Upsert a {entity}
     *
     * @param upsertDto {Entity} upsert data
     */
    upsert: (upsertDto: Upsert{Entity}Dto) => Promise<void>;
}
```

**Conventions:**

- Always use JSDoc on the interface and each method
- Methods return `Promise<T>` — everything is async
- Use DTOs for write parameters, domain models for return types
- Interface names: `{Entity}Repository` (e.g., `IssuesRepository`, `RepositoriesRepository`, `OrganizationsRepository`)
- One file per entity: `{entity}.repository.ts`

---

### Step 3b: Domain layer — Gateway interfaces (external APIs)

Define contracts for external API operations that the Octokit infrastructure must implement. Only needed for features that interact with GitHub.

**File:** `domain/gateways/{entity}-github.gateway.ts`

```typescript
import { {Entity} } from '../models/{entity}.models';

/**
 * {Entity} Github gateway
 */
export interface {Entity}GithubGateway {
    /**
     * Get all {entities} from GitHub
     *
     * @returns List of {entities}
     */
    getAll: () => Promise<{Entity}[]>;
}
```

**Conventions:**

- Always use JSDoc on the interface and each method
- Methods return `Promise<T>` — everything is async
- Use DTOs for write parameters, domain models for return types
- Interface names: `{Entity}GithubGateway` (e.g., `IssuesGithubGateway`, `RepositoriesGithubGateway`, `OrganizationsGithubGateway`)
- One file per entity: `{entity}-github.gateway.ts`

---

### Step 4: Domain layer — Constants (optional)

For feature-specific configuration values.

**File:** `domain/constants/{entity}.const.ts`

```typescript
/**
 * Excluded organization name for sync
 */
export const EXCLUDED_ORGANIZATION_NAME = 'my-org';

/**
 * Standard labels for issues
 */
export const STANDARD_LABELS = [
    { name: 'priority/low', color: '0e8a16' },
    { name: 'priority/medium', color: 'fbca04' },
    // ...
];
```

---

### Step 5: Application layer — Use cases

Each use case is a single pure function with one responsibility. Repository interfaces are injected via function parameters.

**File:** `application/use-cases/{action}-{entity}.use-case.ts`

**Naming patterns:**

- `get-all-{entities}.use-case.ts` — Persistence read operations
- `get-{entity}-by-id.use-case.ts` — Persistence read by ID
- `get-{entities}-by-{field}.use-case.ts` — Persistence filtered read
- `create-{entity}.use-case.ts` — Persistence create
- `update-{entity}.use-case.ts` — Persistence update
- `get-{entities}-by-{field}-from-github.use-case.ts` — GitHub read operations
- `create-github-{entity}.use-case.ts` — GitHub create
- `update-github-{entity}.use-case.ts` — GitHub update
- `change-github-{entity}-status.use-case.ts` — GitHub status change

**Use case for persistence (repository):**

```typescript
import { {Entity} } from '../../domain/models/{entity}.models';
import { {Entity}Repository } from '../../domain/repositories/{entity}.repository';

/**
 * Get all {entities} use case.
 *
 * @param repository {Entity} repository
 *
 * @returns {Entity} list
 */
export async function getAll{Entities}UseCase(
    repository: {Entity}Repository,
): Promise<{Entity}[]> {
    return repository.getAll();
}
```

**Use case for GitHub (gateway):**

```typescript
import { {Entity}GithubGateway } from '../../domain/gateways/{entity}-github.gateway';
import { {Entity} } from '../../domain/models/{entity}.models';

/**
 * Get all {entities} from GitHub use case.
 *
 * @param gateway GitHub {entity} gateway
 *
 * @returns {Entity} list
 */
export async function getAll{Entities}FromGithubUseCase(
    gateway: {Entity}GithubGateway,
): Promise<{Entity}[]> {
    return gateway.getAll();
}
```

**Use case for creation with DTO mapping:**

```typescript
import { Upsert{Entity}Dto } from '../../domain/dtos/upsert-{entity}.dto';
import { {Entity} } from '../../domain/models/{entity}.models';
import { {Entity}Repository } from '../../domain/repositories/{entity}.repository';

/**
 * Create {entity} use case.
 *
 * @param repository {Entity} repository
 * @param data {Entity} creation data
 */
export async function create{Entity}UseCase(
    repository: {Entity}Repository,
    data: {Entity},
): Promise<void> {
    const upsertDto: Upsert{Entity}Dto = {
        id: data.id,
        name: data.name,
        // ... map domain model to DTO
    };

    return repository.upsert(upsertDto);
}
```

**Conventions:**

- Pure functions, no class instances
- Repository interfaces as first parameter (dependency injection)
- Data as subsequent parameters
- JSDoc on every function
- Export as named function (not default export)
- Simple use cases can directly delegate to repository without extra logic

---

### Step 6: Application layer — Orchestrators

Orchestrators coordinate multiple use cases for complex workflows. They are the main entry point called by controllers.

**File:** `application/orchestrators/{action}.orchestrator.ts`

```typescript
import { {Entity}GithubGateway } from '../../domain/gateways/{entity}-github.gateway';
import { {Entity}Repository } from '../../domain/repositories/{entity}.repository';
import { create{Entity}UseCase } from '../use-cases/create-{entity}.use-case';
import { getAll{Entities}FromGithubUseCase } from '../use-cases/get-all-{entities}-from-github.use-case';

/**
 * Synchronize {entities} orchestrator
 *
 * @param gateway GitHub {entity} gateway
 * @param repository {Entity} repository
 */
export async function sync{Entities}Orchestrator(
    gateway: {Entity}GithubGateway,
    repository: {Entity}Repository,
): Promise<void> {
    // Get from GitHub
    const githubEntities = await getAll{Entities}FromGithubUseCase(gateway);

    // Persist all
    const createPromises = githubEntities.map((entity) =>
        create{Entity}UseCase(repository, entity),
    );

    await Promise.all(createPromises);
}
```

**Simple orchestrator (delegation only):**

```typescript
export async function get{Entities}Orchestrator(
    repository: {Entity}Repository,
): Promise<{Entity}[]> {
    return getAll{Entities}UseCase(repository);
}
```

**Conventions:**

- Orchestrators receive ALL repository/gateway interfaces they need via parameters
- Use `Promise.all` for parallel independent operations
- Cross-feature: import use cases from other features when needed (e.g., repos orchestrator imports org use cases)
- Name reflects the workflow: `sync`, `get`, `create`, `update`, `changeStatus`
- Always async functions
- Use `gateway` parameter name for GitHub gateway interfaces, `repository` for persistence interfaces

---

### Step 7: Infrastructure layer — Prisma mapper

Bidirectional mapper between Prisma types and domain models.

**File:** `infrastructure/database/{entity}-prisma.mapper.ts`

```typescript
import { Upsert{Entity}Dto } from '../../domain/dtos/upsert-{entity}.dto';
import { {Entity} } from '../../domain/models/{entity}.models';

import { {Entity} as Prisma{Entity} } from '@core/infrastructure/prisma/generated/client';

/**
 * {Entity} Prisma data mapper
 */
export const {entity}PrismaMapper = {
    toDomain: (prisma{Entity}: Prisma{Entity}): {Entity} => ({
        id: prisma{Entity}.id,
        name: prisma{Entity}.name,
        // ... map all fields from Prisma to domain
    }),
    toPersistenceUpsert: (upsertDto: Upsert{Entity}Dto): Prisma{Entity} => ({
        id: upsertDto.id,
        name: upsertDto.name,
        // ... map all fields from DTO to Prisma type
    }),
};
```

**For entities with relations, add specialized mappers:**

```typescript
export const {entity}PrismaMapper = {
    toDomain: (prisma{Entity}: Prisma{Entity}): {Entity} => ({ /* ... */ }),
    toDomainWithRelation: (prisma{Entity}: Prisma{Entity} & {
        relation: PrismaRelation;
    }): {Entity}WithRelation => ({
        // ... map entity fields
        relation: relationPrismaMapper.toDomain(prisma{Entity}.relation),
    }),
    toPersistenceCreate: (dto: Create{Entity}Dto): Prisma.{Entity}CreateInput => ({
        // ... use `relation: { connect: { id: dto.relationId } }` for relations
    }),
    toPersistenceUpdate: (dto: Update{Entity}Dto): Prisma.{Entity}UpdateInput => ({
        // ... only updated fields
    }),
};
```

**Conventions:**

- Mapper is a const object (not a class)
- Export named as `{entity}PrismaMapper`
- Import Prisma types from `@core/infrastructure/prisma/generated/client`
- Handle JSON fields with helper functions (e.g., `convertLabelsFromPrisma()`)
- Handle `null` ↔ `undefined` conversions between Prisma and domain

---

### Step 8: Infrastructure layer — Prisma repository

Concrete implementation of the persistence repository interface.

**File:** `infrastructure/database/{entity}-prisma.repository.ts`

```typescript
import { Upsert{Entity}Dto } from '../../domain/dtos/upsert-{entity}.dto';
import { {Entity} } from '../../domain/models/{entity}.models';
import { {Entity}Repository } from '../../domain/repositories/{entity}.repository';

import { {entity}PrismaMapper } from './{entity}-prisma.mapper';

import { DatabaseError, DatabaseErrorType } from '@core/domain/errors/database.error';
import { PrismaClient } from '@core/infrastructure/prisma/generated/client';
import { prismaClient } from '@core/infrastructure/prisma/prisma.client';

/**
 * {Entity} Prisma repository
 */
export const {entity}PrismaRepository: {Entity}Repository = {
    getAll: async (): Promise<{Entity}[]> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const entities = await prisma.{entity}.findMany({
                orderBy: { name: 'asc' },
            });

            return entities.map({entity}PrismaMapper.toDomain);
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve {entities} from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    upsert: async (upsertDto: Upsert{Entity}Dto): Promise<void> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            await prisma.{entity}.upsert({
                where: { id: upsertDto.id },
                update: {entity}PrismaMapper.toPersistenceUpsert(upsertDto),
                create: {entity}PrismaMapper.toPersistenceUpsert(upsertDto),
            });
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to create or update {entity}: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
};
```

**Conventions:**

- Repository is a const object implementing the domain interface
- Always get Prisma client via `prismaClient.getInstance() as PrismaClient`
- Wrap ALL database calls in try/catch
- Re-throw as `DatabaseError` with descriptive message and `DatabaseErrorType`
- Use `include: { relation: true }` for reading entities with relations
- Use `connect: { id }` for writing relation references
- Export named as `{entity}PrismaRepository`

---

### Step 9: Infrastructure layer — Octokit mapper

For features integrating with GitHub API.

**File:** `infrastructure/octokit/{entity}-octokit.mapper.ts`

```typescript
import { Octokit } from '@octokit/rest';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';

import { {Entity} } from '../../domain/models/{entity}.models';

type OctokitInstance = Octokit;

type Octokit{Entity}Data = GetResponseDataTypeFromEndpointMethod<
    OctokitInstance['rest']['{scope}']['{method}']
>[number];

/**
 * {Entity} Octokit data mapper
 */
export const {entity}OctokitMapper = {
    toDomain: (octokit{Entity}: Octokit{Entity}Data): {Entity} => ({
        id: octokit{Entity}.id.toString(),  // GitHub IDs are numbers → convert to string
        name: octokit{Entity}.login,
        // ... map GitHub API fields to domain model
    }),
};
```

**Conventions:**

- Use `@octokit/types` `GetResponseDataTypeFromEndpointMethod` for type-safe API response types
- Convert numeric GitHub IDs to strings
- Map snake_case API fields to camelCase domain fields
- Mapper is a const object, exported as `{entity}OctokitMapper`

---

### Step 10: Infrastructure layer — Octokit gateway

Concrete implementation of the GitHub gateway interface.

**File:** `infrastructure/octokit/{entity}-octokit.gateway.ts`

```typescript
import { {Entity} } from '../../domain/models/{entity}.models';
import { {Entity}GithubGateway } from '../../domain/gateways/{entity}-github.gateway';

import { {entity}OctokitMapper } from './{entity}-octokit.mapper';

import { ConfigurationError } from '@core/domain/errors/configuration.error';
import { GitHubError } from '@core/domain/errors/github.error';
import { getOctokitInstance } from '@core/infrastructure/octokit/client.octokit';

/**
 * {Entity} Octokit gateway
 */
export const {entity}OctokitGateway: {Entity}GithubGateway = {
    getAll: async (): Promise<{Entity}[]> => {
        try {
            const octokit = getOctokitInstance();

            const response = await octokit.rest.{scope}.{method}({
                per_page: 100,
            });

            return response.data.map({entity}OctokitMapper.toDomain);
        } catch (error: unknown) {
            // Re-throw ConfigurationError as-is (missing token, etc.)
            if (error instanceof ConfigurationError) {
                throw error;
            }

            const statusCode = error && typeof error === 'object' && 'status' in error
                ? (error as { status: number }).status
                : undefined;

            throw new GitHubError(
                'Failed to retrieve {entities} from GitHub API',
                statusCode,
            );
        }
    },
};
```

**For paginated endpoints:**

```typescript
getAll: async (): Promise<{Entity}[]> => {
    try {
        const octokit = getOctokitInstance();
        const allEntities: {Entity}[] = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
            const response = await octokit.rest.{scope}.{method}({
                per_page: 100,
                page,
            });

            allEntities.push(...response.data.map({entity}OctokitMapper.toDomain));

            hasMorePages = response.data.length === 100;
            page++;
        }

        return allEntities;
    } catch (error: unknown) {
        // ... same error handling pattern
    }
},
```

**Conventions:**

- Get Octokit via `getOctokitInstance()` singleton
- Always re-throw `ConfigurationError` without wrapping
- Wrap other errors in `GitHubError` with extracted status code
- Use `per_page: 100` for list endpoints
- Implement `while(hasMorePages)` pagination for endpoints that may exceed 100 results
- Export named as `{entity}OctokitGateway`

---

### Step 11: UI layer — Validation schemas

Joi schemas for request validation.

**File:** `ui/validation/{entity}.validation.ts`

```typescript
import Joi from 'joi';

/**
 * Schema for validating {entity} ID parameter
 */
export const {entity}IdParamsSchema = Joi.object({
    {entity}Id: Joi.string().required().messages({
        'any.required': '{Entity} ID is required',
    }),
});

/**
 * Schema for creating a {entity}
 */
export const create{Entity}Schema = Joi.object({
    title: Joi.string().required().max(256).messages({
        'any.required': 'Title is required',
        'string.max': 'Title must not exceed 256 characters',
    }),
    body: Joi.string().optional().allow('').max(65535).messages({
        'string.max': 'Body must not exceed 65535 characters',
    }),
    // ... field validations with custom messages
});
```

**Conventions:**

- One validation file per entity
- Named exports with descriptive names: `{entity}IdParamsSchema`, `create{Entity}Schema`, `update{Entity}Schema`
- Always provide custom `.messages()` for user-friendly error messages
- Separate schemas for params, body, and query validation
- Used with `validateInput(schema, 'body' | 'params' | 'query')` middleware from core

---

### Step 12: UI layer — Controllers

Thin async Express handlers. They wire together concrete infrastructure implementations and orchestrators.

**File:** `ui/controllers/{action}.controller.ts` (one file per action)

```typescript
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { get{Entities}Orchestrator } from '../../application/orchestrators/get-{entities}.orchestrator';
import { {entity}PrismaRepository } from '../../infrastructure/database/{entity}-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get {entities} controller
 *
 * @param req Request
 * @param res Response
 */
export const get{Entities}Controller: RequestHandler = async (_req, res) => {
    try {
        const result = await get{Entities}Orchestrator({entity}PrismaRepository);

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error(
            { message: `Error: ${(error as Error).message}` },
            'Get {entities} controller',
        );

        handleError(error as Error, res);
    }
};
```

**Controller with GitHub gateway (e.g., create, sync):**

```typescript
import { create{Entity}Orchestrator } from '../../application/orchestrators/create-{entity}.orchestrator';
import { {entity}PrismaRepository } from '../../infrastructure/database/{entity}-prisma.repository';
import { {entity}OctokitGateway } from '../../infrastructure/octokit/{entity}-octokit.gateway';

export const create{Entity}Controller: RequestHandler = async (req, res) => {
    try {
        const result = await create{Entity}Orchestrator(
            {entity}OctokitGateway,
            {entity}PrismaRepository,
            req.body,
        );

        res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
        appLogger.error(
            { message: `Error: ${(error as Error).message}` },
            'Create {entity} controller',
        );

        handleError(error as Error, res);
    }
};
```

**Conventions:**

- One controller per action/endpoint
- Type: `RequestHandler` from Express
- Always use `try/catch` with `appLogger.error` + `handleError`
- Inject concrete repositories and gateways into orchestrator calls (this is where DI happens)
- Use `_req` when request is unused, `req` when accessing params/body/query
- Use `StatusCodes` enum from `http-status-codes` (never raw numbers)
- Return `StatusCodes.OK` for reads, `StatusCodes.CREATED` for successful creates
- Log errors with format: `Error: ${(error as Error).message}`
- Logger label matches controller name: `'Get {entities} controller'`

---

### Step 13: UI layer — Routes

Register routes with middleware chain.

**File:** `ui/routes/{entity}.routes.ts`

```typescript
import { Router } from 'express';

import { get{Entities}Controller } from '../controllers/get-{entities}.controller';
import { create{Entity}Controller } from '../controllers/create-{entity}.controller';
import { sync{Entities}Controller } from '../controllers/sync-{entities}.controller';

import { authenticationMiddleware } from '@features/authentication/ui/middlewares/authentication.middleware';
import { validateInput } from '@core/ui/middlewares/validation.middleware';

import { create{Entity}Schema } from '../validation/{entity}.validation';
import { {entity}IdParamsSchema } from '../validation/{entity}.validation';

const {entity}Router = Router();

// GET endpoints
{entity}Router.get('/', authenticationMiddleware, get{Entities}Controller);
{entity}Router.get('/sync', authenticationMiddleware, sync{Entities}Controller);
{entity}Router.get('/:entityId', authenticationMiddleware, validateInput({entity}IdParamsSchema, 'params'), getEntityByIdController);

// POST endpoints
{entity}Router.post('/', authenticationMiddleware, validateInput(create{Entity}Schema, 'body'), create{Entity}Controller);

// PATCH endpoints
{entity}Router.patch('/:entityId', authenticationMiddleware, validateInput({entity}IdParamsSchema, 'params'), validateInput(update{Entity}Schema, 'body'), update{Entity}Controller);

export { {entity}Router };
```

**Conventions:**

- Create `Router()` instance, named as `{entity}Router`
- Every route starts with `authenticationMiddleware`
- Add `validateInput(schema, source)` for routes with params/body/query
- Middleware order: `auth → validateParams → validateBody → controller`
- Export via named export `{ {entity}Router }`
- Route paths are relative (mounted with prefix in `index.ts`)

---

### Step 14: Register feature in application

Add the router to the main Express app.

**File:** `apps/backend/src/index.ts`

```typescript
// Add import
import { {entity}Router } from '@features/{feature-name}/ui/routes/{entity}.routes';

// Add route mounting (after existing routes)
app.use(`/${expressConfig.apiVersion}/{entities}`, {entity}Router);
```

**Convention:** Route prefix is `/${apiVersion}/{feature-name-plural}` (e.g., `/v1/organizations`, `/v1/repositories`, `/v1/issues`, `/v1/settings`).

---

## Import path aliases

The backend uses TypeScript path aliases configured in `tsconfig.json`:

| Alias | Path |
|-------|------|
| `@core/*` | `src/core/*` |
| `@features/*` | `src/features/*` |

**Usage examples:**

```typescript
import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';
import { DatabaseError, DatabaseErrorType } from '@core/domain/errors/database.error';
import { PrismaClient } from '@core/infrastructure/prisma/generated/client';
import { prismaClient } from '@core/infrastructure/prisma/prisma.client';
import { getOctokitInstance } from '@core/infrastructure/octokit/client.octokit';
import { validateInput } from '@core/ui/middlewares/validation.middleware';
import { authenticationMiddleware } from '@features/authentication/ui/middlewares/authentication.middleware';
```

---

## Available Core Domain errors

Use the appropriate domain error in infrastructure implementations:

| Error Class | Import | HTTP Status | When to Use |
|-------------|--------|-------------|-------------|
| `AuthenticationError` | `@core/domain/errors/authentication.error` | 401 | Invalid/missing auth token |
| `AuthorizationError` | `@core/domain/errors/authorization.error` | 403 | Insufficient permissions |
| `BadRequestError` | `@core/domain/errors/bad-request.error` | 400 | Invalid input data |
| `NotFoundError` | `@core/domain/errors/not-found.error` | 404 | Entity not found |
| `ConflictError` | `@core/domain/errors/conflict.error` | 409 | Duplicate/conflict |
| `DatabaseError` | `@core/domain/errors/database.error` | varies | DB operations failed |
| `GitHubError` | `@core/domain/errors/github.error` | varies | GitHub API failed |
| `ConfigurationError` | `@core/domain/errors/configuration.error` | 500 | Missing env vars |
| `TimeoutError` | `@core/domain/errors/timeout.error` | 408/504 | Operation timed out |

---

## Cross-Feature dependencies

Features can import use cases from other features when needed:

```typescript
// In repositories orchestrator — importing from organizations feature
import { getAllOrganizationsUseCase } from
    '@features/organizations/application/use-cases/get-all-organizations.use-case';
```

**Allowed cross-feature imports:**

- Use cases from `application/use-cases/`
- Domain models from `domain/models/`
- Domain repository interfaces from `domain/repositories/`
- Domain gateway interfaces from `domain/gateways/`
- Infrastructure repositories from `infrastructure/database/` (only in controllers for DI)
- Infrastructure gateways from `infrastructure/octokit/` (only in controllers for DI)

**Not allowed:**

- Importing controllers or routes from other features
- Importing orchestrators from other features (compose at orchestrator level instead)

---

## Persistence-Only features

Not all features need GitHub integration. For persistence-only features (like Settings):

1. Skip the `domain/gateways/` directory entirely
2. Skip the `infrastructure/octokit/` directory entirely
3. Only define `{Entity}Repository` in domain (no gateway interface)
4. Orchestrators only receive the persistence repository
5. Controllers only inject the Prisma repository

---

## Checklist for new feature

- [ ] **Prisma schema** updated in `iac/prisma/schema.prisma`
- [ ] **Migration** created via `npx prisma migrate dev`
- [ ] **Prisma client** regenerated
- [ ] **Domain models** defined in `domain/models/`
- [ ] **DTOs** created for each operation in `domain/dtos/`
- [ ] **Repository interfaces** defined in `domain/repositories/`
- [ ] **Gateway interfaces** defined in `domain/gateways/` (if GitHub integration)
- [ ] **Constants** added if needed in `domain/constants/`
- [ ] **Use cases** created in `application/use-cases/`
- [ ] **Orchestrators** created in `application/orchestrators/`
- [ ] **Prisma mapper** implemented in `infrastructure/database/`
- [ ] **Prisma repository** implemented in `infrastructure/database/`
- [ ] **Octokit mapper** implemented (if GitHub integration) in `infrastructure/octokit/`
- [ ] **Octokit gateway** implemented (if GitHub integration) in `infrastructure/octokit/`
- [ ] **Joi validation schemas** defined in `ui/validation/` (if needed)
- [ ] **Controllers** created in `ui/controllers/` (one per endpoint)
- [ ] **Router** defined in `ui/routes/`
- [ ] **Router registered** in `apps/backend/src/index.ts`
- [ ] **JSDoc** added to all public interfaces and functions
- [ ] **All errors** wrapped in appropriate domain error types

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Importing Prisma types directly in domain layer | Domain must be pure — only use domain interfaces/models |
| Using raw HTTP status codes (200, 404) | Use `StatusCodes` enum from `http-status-codes` |
| Catching errors without re-throwing as domain errors | Always wrap in `DatabaseError` / `GitHubError` in infrastructure |
| Missing `authenticationMiddleware` on routes | Every feature route MUST include auth middleware |
| Calling orchestrators from other orchestrators | Compose at orchestrator level using use cases instead |
| Forgetting to register router in `index.ts` | Add `app.use()` mount after creating the router |
| Using `undefined` instead of `null` for optional model fields | Models use `null`, DTOs can use `?:` optional syntax |
| Not mapping between layers | Always use mappers — never pass Prisma/Octokit types to domain |
| Confusing repositories and gateways | Repositories are for persistence (DB), gateways are for external APIs (GitHub) |
| Using `External{Entity}Repository` naming | Use `{Entity}GithubGateway` in `domain/gateways/` instead |
