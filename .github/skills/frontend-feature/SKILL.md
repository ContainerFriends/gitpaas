---
name: frontend-feature
description: Use when creating new frontend features for Project Planner. Guides through Clean Architecture layer creation with domain models, DTOs, repository interfaces, use cases, API infrastructure (models, mappers, repositories), providers with useReducer, context hooks, Zod schemas, form models, and React components.
---

# Project Planner — Frontend feature creation guide

Step-by-step instructions for creating new frontend features following the established Clean Architecture patterns in the Project Planner monorepo.

---

## Prerequisites

- Project Planner monorepo set up and running
- Familiarity with the frontend architecture instructions (`.github/instructions/frontend-architecture.instructions.md`)
- Corresponding backend API endpoints already implemented and available
- Auth0 authentication configured (`@auth0/auth0-react`)

---

## Feature architecture overview

Every frontend feature lives in `apps/frontend/src/features/{feature-name}/` and follows a strict 4-layer Clean Architecture:

```
features/{feature-name}/
├── domain/                 ← Pure types, no dependencies
│   ├── models/             ← Entity interfaces
│   ├── dtos/               ← Data transfer objects (optional)
│   └── repositories/       ← Repository interface contracts
├── application/            ← Business logic, depends only on domain
│   └── {action}.use-case.ts  ← Single-responsibility operations
├── infrastructure/         ← Concrete implementations
│   └── api/                ← API repository + mapper + API models
│       ├── {entity}-api.models.ts
│       ├── {entity}-api.mapper.ts
│       └── {entity}-api.repository.ts
└── ui/                     ← React presentation layer
    ├── providers/          ← Context + useReducer state management
    ├── hooks/              ← Context consumer hooks
    ├── containers/         ← Page-level orchestration components
    ├── components/         ← Presentational React components
    ├── schemas/            ← Zod validation schemas (optional)
    └── models/             ← Form models derived from schemas (optional)
```

**Dependency flow:** Domain ← Application ← Infrastructure ← UI

---

## Step-by-step feature creation

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
- Use `string` for IDs
- Create extended interfaces for relations: `{Entity}With{Relation}`, `{Entity}With{Relation}And{OtherRelation}`
- Use union types for enums: `status: 'todo' | 'in_progress' | 'done'`
- Use `null` (not `undefined`) for optional nullable values

**Example with relations:**

```typescript
/**
 * Issue model
 */
export interface Issue {
    id: string;
    number: string;
    title: string;
    body: string;
    url: string;
    repositoryId: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    labels: Array<{ name: string; color: string }>;
    assignee: { name: string; avatarUrl: string } | null;
}

/**
 * Issue with repository model
 */
export interface IssueWithRepository extends Issue {
    repository: {
        id: string;
        name: string;
        hasLabels: boolean;
        isPrivate: boolean;
        organizationId: string;
    };
}

/**
 * Issue with repository and organization model
 */
export interface IssueWithRepositoryAndOrganization extends IssueWithRepository {
    repository: IssueWithRepository['repository'] & {
        organization: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    };
}
```

---

### Step 2: Domain layer — DTOs

Create DTOs for write operations (create, update). DTOs carry data from the UI to the API.

**File:** `domain/dtos/{operation}-{entity}.dto.ts`

**Naming convention:** `{Operation}{Entity}Dto`

```typescript
/**
 * Create {entity} DTO.
 */
export interface Create{Entity}Dto {
    id: string;
    title: string;
    // ... only fields needed for the operation
}
```

**Example:**

```typescript
/**
 * Create issue DTO.
 */
export interface CreateIssueDto {
    id: string;
    title: string;
    body: string;
    priority: string;
    status: string;
    repositoryId: string;
    labels: string[];
}
```

**Conventions:**

- DTOs are only needed for features with write operations (create, update)
- Read-only features (like organizations list) don't need DTOs
- One DTO file per operation

---

### Step 3: Domain layer — Repository interface

Define a single repository interface per feature. Unlike the backend (which separates persistence/external), the frontend has a unified repository that abstracts all API communication.

**File:** `domain/repositories/{entity}.repository.ts`

```typescript
import { {Entity} } from '../models/{entity}.models';

/**
 * {Entity} repository
 */
export interface {Entity}Repository {
    /**
     * Get all {entities}
     *
     * @return List of {entities}
     */
    getAll: () => Promise<{Entity}[]>;

    /**
     * Sync {entities} from external source
     *
     * @return Promise that resolves when sync is complete
     */
    sync: () => Promise<void>;
}
```

**Conventions:**

- Single interface per feature (not split like backend)
- Interface name: `{Entity}Repository` (e.g., `OrganizationsRepository`, `IssuesRepository`)
- Methods return `Promise<T>` — everything is async
- JSDoc on the interface and every method
- Use DTOs for write method parameters, domain models for return types

**Example with full CRUD:**

```typescript
import { CreateIssueDto } from '../dtos/create-issue.dto';
import { UpdateIssueDto } from '../dtos/update-issue.dto';
import { IssueWithRepositoryAndOrganization } from '../models/issues.models';

/**
 * Issues repository
 */
export interface IssuesRepository {
    getAll: () => Promise<IssueWithRepositoryAndOrganization[]>;
    getByRepositoryId: (repositoryId: string) => Promise<IssueWithRepositoryAndOrganization[]>;
    getById: (id: string) => Promise<IssueWithRepositoryAndOrganization>;
    create: (createDto: CreateIssueDto) => Promise<IssueWithRepositoryAndOrganization>;
    update: (issueNumber: string, updateDto: UpdateIssueDto) => Promise<IssueWithRepositoryAndOrganization>;
    changeStatus: (id: string, newStatus: string) => Promise<IssueWithRepositoryAndOrganization>;
    sync: () => Promise<void>;
}
```

---

### Step 4: Application layer — Use cases

Each use case is a single pure async function with one responsibility. Repository interfaces are injected via function parameters.

**File:** `application/{action}-{entity}.use-case.ts`

**Naming patterns:**

- `get-{entities}.use-case.ts` — Fetch all
- `get-{entity}-by-id.use-case.ts` — Fetch single
- `get-{entities}-by-{field}.use-case.ts` — Fetch filtered
- `create-{entity}.use-case.ts` — Create
- `update-{entity}.use-case.ts` — Update
- `change-{entity}-status.use-case.ts` — Status change
- `sync-{entities}.use-case.ts` — Sync from external source

**Simple delegation use case:**

```typescript
import { {Entity} } from '../domain/models/{entity}.models';
import { {Entity}Repository } from '../domain/repositories/{entity}.repository';

/**
 * Get {entities} use case.
 *
 * @param repository {Entity} repository
 *
 * @return List of {entities}
 */
export async function get{Entities}UseCase(
    repository: {Entity}Repository,
): Promise<{Entity}[]> {
    return repository.getAll();
}
```

**Use case with DTO mapping:**

```typescript
import { v4 as uuidv4 } from 'uuid';

import { Create{Entity}Dto } from '../domain/dtos/create-{entity}.dto';
import { {Entity} } from '../domain/models/{entity}.models';
import { {Entity}Repository } from '../domain/repositories/{entity}.repository';

/**
 * Create {entity} use case.
 *
 * @param repository {Entity} repository
 * @param data {Entity} data to create
 */
export async function create{Entity}UseCase(
    repository: {Entity}Repository,
    data: any,
): Promise<{Entity}> {
    const createDto: Create{Entity}Dto = {
        id: uuidv4(),
        title: data.title,
        // ... map form data to DTO
    };

    return repository.create(createDto);
}
```

**Conventions:**

- Pure functions, no class instances
- Repository interface as first parameter (dependency injection)
- Additional data as subsequent parameters
- JSDoc on every function
- Export as named function (not default export)
- Use `uuid` (`v4 as uuidv4`) for generating client-side IDs when needed
- No orchestrators in the frontend — use cases are always single-operation

---

### Step 5: Infrastructure layer — API models

Define TypeScript interfaces that mirror the exact JSON shape returned by the backend API.

**File:** `infrastructure/api/{entity}-api.models.ts`

```typescript
/**
 * {Entity} API model
 */
export interface Api{Entity} {
    id: string;
    name: string;
    // ... exact fields from API response
}
```

**Conventions:**

- Prefix with `Api`: `ApiOrganization`, `ApiIssue`, `ApiRepository`
- Mirror API response structure exactly (including nested relations)
- Create extended interfaces for nested relations: `Api{Entity}With{Relation}`
- These types represent the wire format, not the domain model

**Example with nested relations:**

```typescript
/**
 * Issue API model
 */
export interface ApiIssue {
    id: string;
    number: string;
    title: string;
    body: string;
    url: string;
    repositoryId: string;
    status: string;
    priority: string;
    labels: Array<{ name: string; color: string }>;
    assignee: { name: string; avatarUrl: string } | null;
}

/**
 * Issue API model with repository
 */
export interface ApiIssueWithRepository extends ApiIssue {
    repository: {
        id: string;
        name: string;
        hasLabels: boolean;
        isPrivate: boolean;
        organizationId: string;
    };
}

/**
 * Issue API model with repository and organization
 */
export interface ApiIssueWithRepositoryAndOrganization extends ApiIssueWithRepository {
    repository: ApiIssueWithRepository['repository'] & {
        organization: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    };
}
```

---

### Step 6: Infrastructure layer — API mapper

Unidirectional mapper from API models to domain models. Maps API JSON responses into clean domain interfaces.

**File:** `infrastructure/api/{entity}-api.mapper.ts`

```typescript
import { {Entity} } from '../../domain/models/{entity}.models';

import { Api{Entity} } from './{entity}-api.models';

/**
 * {Entity} API data mapper
 */
export const {entity}ApiMapper = {
    toDomain: (apiResponse: Api{Entity}): {Entity} => ({
        id: apiResponse.id,
        name: apiResponse.name,
        // ... map all fields from API to domain
    }),
};
```

**Conventions:**

- Mapper is a const object (not a class)
- Export named as `{entity}ApiMapper` (e.g., `organizationApiMapper`, `issueApiMapper`)
- Unidirectional: only `toDomain` (API → Domain). No `toApi` needed — DTOs are sent directly
- Add specialized mappers for each relation level: `toDomainWithRepository`, `toDomainWithRepositoryAndOrganization`
- Cast string enums to union types: `apiResponse.status as 'todo' | 'in_progress' | 'done'`

**Example with multiple mappers:**

```typescript
export const issueApiMapper = {
    toDomain: (apiResponse: ApiIssue): Issue => ({
        id: apiResponse.id,
        number: apiResponse.number,
        title: apiResponse.title,
        body: apiResponse.body,
        url: apiResponse.url,
        repositoryId: apiResponse.repositoryId,
        status: apiResponse.status as 'todo' | 'in_progress' | 'done',
        priority: apiResponse.priority as 'low' | 'medium' | 'high',
        labels: apiResponse.labels,
        assignee: apiResponse.assignee,
    }),
    toDomainWithRepositoryAndOrganization: (
        apiResponse: ApiIssueWithRepositoryAndOrganization,
    ): IssueWithRepositoryAndOrganization => ({
        // ... full mapping including nested relations
    }),
};
```

---

### Step 7: Infrastructure layer — API repository

Concrete implementation of the domain repository interface using `fetch` and Auth0 tokens.

**File:** `infrastructure/api/{entity}-api.repository.ts`

```typescript
import { {Entity} } from '../../domain/models/{entity}.models';
import { {Entity}Repository } from '../../domain/repositories/{entity}.repository';

import { {entity}ApiMapper } from './{entity}-api.mapper';
import { Api{Entity} } from './{entity}-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * {Entity} API repository
 */
export const {entity}ApiRepository = (token: string): {Entity}Repository => ({
    getAll: async (): Promise<{Entity}[]> => {
        const response = await fetch(`${API_BASE_URL}/{entities}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch {entities}');

        const data: Api{Entity}[] = await response.json();

        return data.map({entity}ApiMapper.toDomain);
    },

    sync: async (): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/{entities}/sync`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'sync {entities}');
    },
});
```

**Conventions:**

- **Factory function pattern**: the repository is a function that receives `token: string` and returns the interface implementation
- Export named as `{entity}ApiRepository` (e.g., `organizationsApiRepository`, `issuesApiRepository`)
- Use `import.meta.env.VITE_API_BASE_URL` for the API base URL
- Every request includes `Content-Type: application/json` and `Authorization: Bearer ${token}` headers
- Always call `await handleHttpError(response, '{operation description}')` before parsing the response
- Parse response with `await response.json()` typed as the API model
- Map API models to domain models using the mapper
- For write operations, send DTOs directly via `JSON.stringify(dto)` in the body
- HTTP methods follow REST conventions: `GET` for reads, `POST` for create, `PATCH` for update
- API paths match backend routes without the `/v1/` prefix (base URL includes it)

**Write operation example:**

```typescript
create: async (createDto: CreateIssueDto): Promise<IssueWithRepositoryAndOrganization> => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...createDto }),
    });

    await handleHttpError(response, 'create issue');

    const data: ApiIssueWithRepositoryAndOrganization = await response.json();

    return issueApiMapper.toDomainWithRepositoryAndOrganization(data);
},
```

---

### Step 8: UI layer — Provider (Context + useReducer)

The provider is the **central state management** for the feature. It combines React Context with `useReducer` for predictable state updates.

**File:** `ui/providers/{Entity}Provider.tsx`

This is the most complex file in a feature. It contains:
1. State interface and initial state
2. Action types (discriminated union)
3. Reducer function
4. Context type (state + action methods)
5. Context creation
6. Provider component with `useCallback` methods

```tsx
import { useAuth0 } from '@auth0/auth0-react';
import { createContext, ReactNode, useReducer, useCallback } from 'react';
import { toast } from 'sonner';

import { get{Entities}UseCase } from '../../application/get-{entities}.use-case';
import { {Entity} } from '../../domain/models/{entity}.models';
import { {entity}ApiRepository } from '../../infrastructure/api/{entity}-api.repository';

import { isConfigurationError } from '@core/infrastructure/http/http-error.handler';

// ─── State ───────────────────────────────────────────────────

interface {Entity}State {
    {entities}: {Entity}[];
    loading{Entities}: boolean;
}

// ─── Actions ─────────────────────────────────────────────────

type {Entity}Action =
    | { type: 'SET_{ENTITIES}_LOADING'; payload: boolean }
    | { type: 'SET_{ENTITIES}'; payload: {Entity}[] };

const initialState: {Entity}State = {
    {entities}: [],
    loading{Entities}: false,
};

// ─── Reducer ─────────────────────────────────────────────────

function {entity}Reducer(state: {Entity}State, action: {Entity}Action): {Entity}State {
    switch (action.type) {
        case 'SET_{ENTITIES}_LOADING':
            return { ...state, loading{Entities}: action.payload };
        case 'SET_{ENTITIES}':
            return { ...state, {entities}: action.payload };
        default:
            return state;
    }
}

// ─── Context Type ────────────────────────────────────────────

interface {Entity}ContextType {
    {entities}: {Entity}[];
    loading{Entities}: boolean;
    get{Entities}: () => Promise<{Entity}[]>;
}

export const {Entity}Context = createContext<{Entity}ContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────

/**
 * {Entity} provider.
 */
export function {Entity}Provider({ children }: { children: ReactNode }): ReactNode {
    const { getAccessTokenSilently } = useAuth0();
    const [state, dispatch] = useReducer({entity}Reducer, initialState);

    const get{Entities} = useCallback(async () => {
        try {
            dispatch({ type: 'SET_{ENTITIES}_LOADING', payload: true });
            const token = await getAccessTokenSilently();
            const data = await get{Entities}UseCase({entity}ApiRepository(token));
            dispatch({ type: 'SET_{ENTITIES}', payload: data });
            return data;
        } catch (error) {
            if (isConfigurationError(error)) {
                console.error('Configuration error:', (error as any).errorData?.message || error.message);
            }
            throw error;
        } finally {
            dispatch({ type: 'SET_{ENTITIES}_LOADING', payload: false });
        }
    }, [getAccessTokenSilently]);

    return (
        <{Entity}Context.Provider value={{ ...state, get{Entities} }}>
            {children}
        </{Entity}Context.Provider>
    );
}
```

**Provider conventions:**

- **State management**: `useReducer` for all state (not `useState`)
- **Auth token**: obtained via `useAuth0().getAccessTokenSilently()`
- **Repository instantiation**: create repository inside each callback — `{entity}ApiRepository(token)` — because the token is async
- **Action naming**: `SET_{ENTITY}_LOADING`, `SET_{ENTITIES}`, `ADD_{ENTITY}`, `UPDATE_{ENTITY}`, `SET_SUBMITTING_{ENTITY}`
- **Loading states**: separate loading booleans for each async operation
- **Error handling**: check `isConfigurationError(error)` from `@core/infrastructure/http/http-error.handler`
- **Toast notifications**: use `toast.success('...')` from `sonner` for write operations (create, update)
- **All methods wrapped in `useCallback`** with `[getAccessTokenSilently]` dependency
- **try/finally pattern**: always dispatch loading=false in `finally`
- **Cross-feature data**: providers can import and use use cases from other features when needed (e.g., IssuesProvider imports from organizations and repositories features)

**Action types for CRUD features:**

```typescript
type IssuesAction =
    | { type: 'SET_ISSUES_LOADING'; payload: boolean }
    | { type: 'SET_ISSUES'; payload: IssueWithRepositoryAndOrganization[] }
    | { type: 'SET_SELECTED_ISSUE_LOADING'; payload: boolean }
    | { type: 'SET_SELECTED_ISSUE'; payload: IssueWithRepositoryAndOrganization | null }
    | { type: 'ADD_ISSUE'; payload: IssueWithRepositoryAndOrganization }
    | { type: 'UPDATE_ISSUE'; payload: IssueWithRepositoryAndOrganization }
    | { type: 'SET_SUBMITTING_ISSUE'; payload: boolean };
```

**Reducer for list + selection + mutations:**

```typescript
function issuesReducer(state: IssuesState, action: IssuesAction): IssuesState {
    switch (action.type) {
        case 'SET_ISSUES':
            return { ...state, issues: action.payload };
        case 'ADD_ISSUE':
            return { ...state, issues: [...state.issues, action.payload] };
        case 'UPDATE_ISSUE':
            return {
                ...state,
                issues: state.issues.map((issue) =>
                    issue.id === action.payload.id ? action.payload : issue,
                ),
                selectedIssue: state.selectedIssue?.id === action.payload.id
                    ? action.payload
                    : state.selectedIssue,
            };
        // ... other cases
        default:
            return state;
    }
}
```

---

### Step 9: UI layer — Context hook

A thin hook that consumes the context and throws if used outside the provider.

**File:** `ui/hooks/use{Entity}.tsx`

```tsx
import { useContext } from 'react';

import { {Entity}Context } from '../providers/{Entity}Provider';

/**
 * Hook to access the {entity} context.
 */
export function use{Entity}() {
    const context = useContext({Entity}Context);
    if (!context) {
        throw new Error('use{Entity} must be used within a {Entity}Provider');
    }
    return context;
}
```

**Conventions:**

- File extension: `.tsx` (even though it's just a hook, follows project convention)
- One hook per provider
- Named export: `use{Entity}` (e.g., `useIssues`, `useDashboard`, `useSettings`)
- Always validate context is not `undefined`
- Error message includes the provider name

---

### Step 10: UI layer — Zod schemas (Optional)

For features with forms, define Zod validation schemas.

**File:** `ui/schemas/{entity}.schema.ts`

```typescript
import z from 'zod';

/**
 * Create {entity} schema
 */
export const create{Entity}Schema = z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().optional(),
    priority: z.string(),
    organizationId: z.string().min(1, 'Organization is required'),
    repositoryId: z.string().min(1, 'Repository is required'),
    labels: z.array(z.string()),
});

/**
 * Update {entity} schema
 */
export const update{Entity}Schema = z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().optional(),
    // ... fields for update
});
```

**Conventions:**

- Use Zod (`z`) for validation (not Joi — that's backend-only)
- Named exports: `create{Entity}Schema`, `update{Entity}Schema`
- Validation messages as second argument to validators
- Schemas define the form shape, not the API shape

---

### Step 11: UI layer — Form models (Optional)

Derive TypeScript types from Zod schemas using `z.infer`.

**File:** `ui/models/{entity}-form.models.ts`

```typescript
import z from 'zod';

import { create{Entity}Schema, update{Entity}Schema } from '../schemas/{entity}.schema';

/**
 * Create form model
 */
export type Create{Entity}FormData = z.infer<typeof create{Entity}Schema>;

/**
 * Update form model
 */
export type Update{Entity}FormData = z.infer<typeof update{Entity}Schema>;
```

**Conventions:**

- Types are derived from schemas — never manually duplicated
- Named as `{Operation}{Entity}FormData`
- Used by `react-hook-form` with `zodResolver`

---

### Step 12: UI layer — Components

React functional components for the feature's UI.

**File:** `ui/components/{ComponentName}.tsx`

```tsx
import { type ReactNode } from 'react';

import { {Entity} } from '../../domain/models/{entity}.models';

interface {ComponentName}Props {
    {entity}: {Entity};
    onClick: () => void;
}

/**
 * {Component name} component.
 */
export function {ComponentName}({ {entity}, onClick }: {ComponentName}Props): ReactNode {
    return (
        <div onClick={onClick}>
            <h4>{entity.title}</h4>
        </div>
    );
}
```

**Component conventions:**

- **Functional components** only, with explicit `ReactNode` return type
- **PascalCase** file and component names: `IssueCard.tsx`, `CreateIssueForm.tsx`, `KanbanBoard.tsx`
- **Props interface** defined above the component: `interface {ComponentName}Props`
- **Named exports** (not default)
- **JSDoc** on the component function
- **Consume context** via hook: `const { data, loading } = use{Entity}()`
- **Import shared components** from `@shared/components/` (Button, Input, Select, Dialog, etc.)
- **CSS**: Tailwind utility classes, use `cn()` from `@shared/utils/merge-classes.util` for conditional classes
- **Icons**: `lucide-react` library
- **Animations**: `framer-motion` for AnimatePresence transitions

**Form component example (using react-hook-form + Zod):**

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { use{Entity} } from '../hooks/use{Entity}';
import { Create{Entity}FormData } from '../models/{entity}-form.models';
import { create{Entity}Schema } from '../schemas/{entity}.schema';

import { Button } from '@shared/components/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/Dialog';
import { Input } from '@shared/components/Input';
import { Label } from '@shared/components/Label';

export function Create{Entity}Form({ isOpen, onClose }: Props): ReactNode {
    const { create{Entity}, submitting{Entity} } = use{Entity}();
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Create{Entity}FormData>({
        resolver: zodResolver(create{Entity}Schema),
        defaultValues: { title: '', /* ... */ },
    });

    const onSubmit = async (data: Create{Entity}FormData) => {
        try {
            await create{Entity}(data);
            onClose();
        } catch (error) {
            console.error('Failed to create {entity}:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input {...register('title')} disabled={submitting{Entity}} />
                    {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
                    <Button type="submit" disabled={submitting{Entity}}>Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
```

---

### Step 13: UI layer — Container (Optional)

Containers are page-level components that orchestrate multiple providers, hooks, and child components.

**File:** `ui/containers/{Entity}Container.tsx`

```tsx
import { ReactNode, useEffect, useState } from 'react';

import { use{Entity} } from '../hooks/use{Entity}';
import { {ComponentA} } from '../components/{ComponentA}';
import { {ComponentB} } from '../components/{ComponentB}';

/**
 * {Entity} container component.
 */
export function {Entity}Container(): ReactNode {
    const { {entities}, loading{Entities}, get{Entities} } = use{Entity}();

    useEffect(() => {
        get{Entities}();
    }, [get{Entities}]);

    return (
        <div>
            <{ComponentA} data={{entities}} loading={loading{Entities}} />
            <{ComponentB} />
        </div>
    );
}
```

**Conventions:**

- Containers consume hooks, manage local UI state (`useState`), and load initial data via `useEffect`
- Containers compose child components and pass data/callbacks as props
- Container file name matches feature: `DashboardContainer.tsx`, `SettingsContainer.tsx`

---

### Step 14: Wire feature into pages

Connect the feature to the application routing by creating/updating a page component that wraps containers with providers.

**File:** `src/pages/{page-name}/{PageName}.tsx`

```tsx
import { ReactNode } from 'react';

import { {Entity}Container } from '@features/{feature-name}/ui/containers/{Entity}Container';
import { {Entity}Provider } from '@features/{feature-name}/ui/providers/{Entity}Provider';

/**
 * {Page name} page component.
 */
export function {PageName}(): ReactNode {
    return (
        <{Entity}Provider>
            <{Entity}Container />
        </{Entity}Provider>
    );
}
```

**Multiple providers nesting (real example):**

```tsx
export function HomePage(): ReactNode {
    return (
        <DashboardProvider>
            <IssuesProvider>
                <DashboardContainer />
            </IssuesProvider>
        </DashboardProvider>
    );
}
```

Then register the route in `App.tsx`:

```tsx
import { {PageName} } from '@pages/{page-name}/{PageName}';

// Inside Routes (authenticated)
<Route path="/{route-path}" element={<{PageName} />} />
```

---

## Import path aliases

The frontend uses TypeScript path aliases configured in `tsconfig.json`:

| Alias | Path |
|-------|------|
| `@core/*` | `src/core/*` |
| `@features/*` | `src/features/*` |
| `@layout/*` | `src/layout/*` |
| `@pages/*` | `src/pages/*` |
| `@shared/*` | `src/shared/*` |

**Usage examples:**

```typescript
import { handleHttpError, isConfigurationError } from '@core/infrastructure/http/http-error.handler';
import { getOrganizationsUseCase } from '@features/organizations/application/get-organizations.use-case';
import { Organization } from '@features/organizations/domain/models/organizations.models';
import { organizationsApiRepository } from '@features/organizations/infrastructure/api/organizations-api.repository';
import { Button } from '@shared/components/Button';
import { cn } from '@shared/utils/merge-classes.util';
import { AppLayout } from '@layout/ui/containers/layout.container';
import { HomePage } from '@pages/home/HomePage';
```

---

## Available shared components

Reusable UI components in `src/shared/components/` (based on Radix UI + Tailwind CSS):

| Component | Import | Notes |
|-----------|--------|-------|
| `Button` | `@shared/components/Button` | Variants: default, primary, destructive, outline, secondary, ghost, link |
| `Input` | `@shared/components/Input` | Integrates with react-hook-form `register()` |
| `Textarea` | `@shared/components/Textarea` | Multi-line text input |
| `Select` | `@shared/components/Select` | `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` |
| `Dialog` | `@shared/components/Dialog` | `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` |
| `Badge` | `@shared/components/Badge` | Variants: default, outline |
| `Label` | `@shared/components/Label` | Form field labels |
| `Tabs` | `@shared/components/Tabs` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `Switch` | `@shared/components/Switch` | Toggle switch |
| `Separator` | `@shared/components/Separator` | Visual divider |
| `Tooltip` | `@shared/components/Tooltip` | Hover tooltip |

**Utility:** `cn()` from `@shared/utils/merge-classes.util` — merges Tailwind classes using `clsx` + `tailwind-merge`.

---

## Core infrastructure

| Module | Import | Purpose |
|--------|--------|---------|
| `handleHttpError` | `@core/infrastructure/http/http-error.handler` | Validates HTTP responses, throws `ConfigurationError` for 500s with config issues |
| `isConfigurationError` | `@core/infrastructure/http/http-error.handler` | Type guard for configuration errors |
| `QueryClientProviderWrapper` | `@core/ui/providers/query-client.provider` | React Query provider (staleTime: 60s, gcTime: 5min, retry: 3 for non-4xx) |

---

## Cross-feature dependencies

Features can import from other features when needed:

```typescript
// In IssuesProvider — importing from organizations and repositories features
import { getOrganizationsUseCase } from '@features/organizations/application/get-organizations.use-case';
import { organizationsApiRepository } from '@features/organizations/infrastructure/api/organizations-api.repository';
import { getRepositoriesByOrganizationUseCase } from '@features/repositories/application/get-repositories-by-organization-id.use-case';
import { repositoriesApiRepository } from '@features/repositories/infrastructure/api/repositories-api.repository';
```

**Allowed cross-feature imports:**

- Use cases from `application/`
- Domain models from `domain/models/`
- Domain repository interfaces from `domain/repositories/`
- Infrastructure repositories from `infrastructure/api/` (for DI in providers)
- UI components from `ui/components/` (for composition in containers)
- UI hooks from `ui/hooks/` (for consuming context in containers)

**Not allowed:**

- Importing providers from other features (providers are composed at page level)
- Importing reducers or actions from other features

---

## Authentication pattern

All API calls require an Auth0 token. The pattern is consistent across all providers:

```tsx
const { getAccessTokenSilently } = useAuth0();

const someAction = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const data = await someUseCase({entity}ApiRepository(token));
    // ...
}, [getAccessTokenSilently]);
```

The token is obtained asynchronously and passed to the repository factory on every call. This ensures tokens are always fresh.

---

## Checklist for new feature

- [ ] **Domain models** defined in `domain/models/`
- [ ] **DTOs** created for write operations in `domain/dtos/` (if needed)
- [ ] **Repository interface** defined in `domain/repositories/`
- [ ] **Use cases** created in `application/` (one per operation)
- [ ] **API models** defined in `infrastructure/api/` (mirror API response)
- [ ] **API mapper** implemented in `infrastructure/api/` (API → Domain)
- [ ] **API repository** implemented in `infrastructure/api/` (factory with token)
- [ ] **Provider** created in `ui/providers/` (Context + useReducer)
- [ ] **Context hook** created in `ui/hooks/` (useContext wrapper)
- [ ] **Zod schemas** defined in `ui/schemas/` (if forms exist)
- [ ] **Form models** derived from schemas in `ui/models/` (if forms exist)
- [ ] **Components** created in `ui/components/`
- [ ] **Container** created in `ui/containers/` (if page-level orchestration needed)
- [ ] **Page** created/updated in `src/pages/` with provider wrapping
- [ ] **Route** registered in `App.tsx`
- [ ] **JSDoc** added to all exported interfaces, functions, and components

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Using `useState` for complex state in providers | Use `useReducer` with typed actions — it's the project pattern |
| Forgetting `await handleHttpError(response, '...')` before parsing | Always call it — it throws on non-OK responses |
| Creating repository outside `useCallback` or without fresh token | Always get token via `getAccessTokenSilently()` inside each callback |
| Importing provider from another feature in a provider | Compose providers at the page level, import use cases + repositories instead |
| Using Joi for frontend validation | Use Zod (`z`) — Joi is backend-only |
| Manually typing form data instead of using `z.infer` | Derive from schema: `type FormData = z.infer<typeof schema>` |
| Missing `useCallback` on provider methods | All async methods in providers must be wrapped in `useCallback` |
| Forgetting to dispatch loading=false in `finally` | Always use try/finally to ensure loading state is reset |
| Using default exports for components | Use named exports — project convention |
| Skipping the mapper and using API types in domain | Always map via `{entity}ApiMapper` — keep domain types pure |
| Using `undefined` for nullable model fields | Use `null` — consistent with backend domain models |
