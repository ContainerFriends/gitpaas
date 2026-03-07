# Project Planner

## Project overview

Project Planner is a monorepo-based application for project planning and management, integrating with GitHub for organization, repository, and issue synchronization. The application follows Clean Architecture principles with a clear separation between frontend and backend services.

## Monorepo structure

The project uses **Turborepo** for build orchestration and npm workspaces for dependency management:

```
apps/
├── backend/     # Express REST API Server (Clean Architecture)
└── frontend/    # React Web Application (Clean Architecture)
packages/        # Shared packages
config/          # Centralized ESLint configuration
iac/             # Infrastructure: Docker, Prisma, Nginx
```

## Backend application (`apps/backend/`)

- **Runtime**: Node.js 24 + TypeScript 5.9
- **Framework**: Express.js 5.2
- **ORM**: Prisma 7.4 (PostgreSQL)
- **Architecture**: Clean Architecture per feature with 4 layers (domain, application, infrastructure, ui)
- **Authentication**: Auth0 JWT (`express-oauth2-jwt-bearer`)
- **GitHub integration**: Octokit REST client
- **Background jobs**: Inngest for async event-driven processing
- **Validation**: Joi schemas
- **Logging**: Winston + Winston-Loki
- **Security**: Helmet, CORS

### Backend features

| Feature | Description |
|---------|-------------|
| **authentication** | JWT middleware (Auth0), Auth0 Management API client |
| **organizations** | CRUD + GitHub sync of organizations |
| **repositories** | CRUD + GitHub sync of repositories, label management |
| **issues** | CRUD + GitHub sync of issues, status/priority management |
| **settings** | Application settings (sync exclusions) |
| **events** | Internal events (Inngest) and external events (GitHub webhooks) |

## Frontend application (`apps/frontend/`)

- **Runtime**: React 19.2 + TypeScript 5.9
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **State**: React Query (TanStack Query), useReducer
- **Forms**: React Hook Form + Zod validation
- **UI**: Tailwind CSS 3, Radix UI primitives, shadcn/ui components, Framer Motion, Lucide icons
- **Auth**: Auth0 React SDK
- **DnD**: @hello-pangea/dnd (drag-and-drop)
- **Notifications**: Sonner (toast)

### Frontend features

| Feature | Description |
|---------|-------------|
| **dashboard** | Main dashboard UI |
| **issues** | Issue management with full CRUD |
| **organizations** | Organization listing and sync |
| **repositories** | Repository listing and sync |
| **settings** | Application settings management |

## Development tools

### Code quality
- **ESLint 9**: Centralized configuration in `config/eslint/` with plugins for TypeScript, React, imports, JSDoc, JSON, YAML, security, regex, tests, and Prettier
- **TypeScript 5.9**: Strict mode across frontend and backend
- **Prettier**: Code formatting via ESLint plugin

### Build system
- **Turborepo 2.8**: Orchestrates build, dev, lint, test, and type-check across workspaces
- **npm Workspaces**: Dependency management and workspace isolation

### Infrastructure
- **Docker**: Separate Dockerfiles for backend and frontend with docker-compose
- **PostgreSQL**: Primary database
- **Nginx**: Frontend reverse proxy
- **Prisma Migrations**: Schema-first database management in `iac/prisma/`

### Runtime environment
- **Node.js**: 24.13.1 (managed via mise)
- **Package Manager**: npm 11.8.0
- **Package Manager**: npm 11.8.0
