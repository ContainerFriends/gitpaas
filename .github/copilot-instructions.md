# GitPaaS

## Project overview

GitPaaS is a self-hosted PaaS application for managing and deploying software artifacts.

## Monorepo structure

The project uses **Turborepo** for build orchestration and npm workspaces for dependency management:

```
apps/
├── backend/     # Express REST API Server (Clean Architecture)
└── frontend/    # React Web Application (Clean Architecture)
packages/        # Shared packages
iac/             # Infrastructure: Docker, Prisma, Nginx
```

## Backend application (`apps/backend/`)

- **Runtime**: Node.js 24 + TypeScript 5.9
- **Framework**: Express.js 5.2
- **ORM**: Prisma 7.4 (PostgreSQL)
- **Architecture**: Clean Architecture per feature with 4 layers (domain, application, infrastructure, ui)
- **Docker integration**: dockerode for Docker API communication
- **Validation**: Joi schemas
- **Logging**: Winston + Winston-Loki
- **Security**: Helmet, CORS

### Backend features

| Feature | Description |
|---------|-------------|
| **projects** | Project management with CRUD operations |
| **networks** | Docker network management (create, list, remove, inspect) |

## Frontend application (`apps/frontend/`)

- **Runtime**: React 19.2 + TypeScript 5.9
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **State**: React Query (TanStack Query), useReducer
- **Forms**: React Hook Form + Zod validation
- **UI**: Tailwind CSS 3, Radix UI primitives, shadcn/ui components, Framer Motion, Lucide icons
- **Notifications**: Sonner (toast)

### Frontend features

| Feature | Description |
|---------|-------------|
| **dashboard** | Main dashboard UI |
| **projects** | Project management interface |

## Development tools

### Code quality
- **ESLint 9**: Centralized configuration in `config/eslint/` with plugins for TypeScript, React, imports, JSDoc, JSON, YAML, security, regex, tests, and Prettier
- **TypeScript 5.9**: Strict mode across frontend and backend
- **Prettier**: Code formatting via ESLint plugin

### Build system
- **Turborepo 2.8**: Orchestrates build, dev, lint, test, and type-check across workspaces
- **npm Workspaces**: Dependency management and workspace isolation

### Infrastructure
- **Docker Swarm**: Container orchestration
- **Traefik**: Reverse proxy and load balancer
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Prisma Migrations**: Schema-first database management in `iac/database/`
- **Automated Setup**: Infrastructure provisioning via `packages/setup/`

### Runtime environment
- **Node.js**: 24.14.0 (managed via mise)
- **Package Manager**: npm 11.9.0

## General instructions

- Never run ESLint; this is the developer's responsibility.