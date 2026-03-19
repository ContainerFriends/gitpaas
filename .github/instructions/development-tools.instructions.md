---
name: "Development Tools & Quality"
description: "Development tools, code quality, and testing standards for Project Planner"
applyTo: "**/*.{ts,tsx,js,jsx,json,test.ts,spec.ts}"
---

# Development Tools & Quality

## Code Quality Tools

### ESLint configuration

- **Version**: ESLint 9.15.0 with TypeScript 5.9
- **Scope**: Centralized configuration in root package.json
- **Coverage**: Both frontend and backend applications

**Frontend multi-config setup:**

- `sourceTsConfig`: `src/**/*.{ts,tsx,d.ts}` → `tsconfig.json`
- `testsTsConfig`: `src/**/*.spec.{ts,tsx}` → `tsconfig.spec.json`  
- `configTsConfig`: `*.config.ts` → `tsconfig.config.json`
- `configMjsConfig`: `eslint.config.mjs`

**Rules summary:**

- Strict TypeScript enforcement for source code
- Relaxed rules for configuration files
- Import organization and extensions handling
- React hooks linting (frontend)

### TypeScript configuration

- **Version**: TypeScript 5.9.3
- **Strict mode**: Enabled across all applications

**Frontend project files:**

- `tsconfig.json`: main source code + `assets.d.ts` (CSS, images)
- `tsconfig.spec.json`: test files (Jest, Vitest, Testing Library types)
- `tsconfig.config.json`: config files (Node.js types, allows JS)

## Current Development Tools

### Turborepo Configuration

- **Version**: 2.8.11
- **Tasks**: build, dev, lint, test, type-check
- **Dependency management**: npm workspaces
- **Caching**: Build optimization and task orchestration
- **Cross-package dependencies**: Proper workspace isolation

### Vite Configuration (Frontend)

- **Version**: Vite 7.3.1
- **Development server**: Hot module replacement
- **React plugin**: @vitejs/plugin-react 5.1.4
- **TypeScript integration**: Built-in support
- **Build optimization**: Production bundling

### Development Server Tools

- **Backend**: tsx 4.21.0 for hot reload
- **Frontend**: Vite dev server with HMR
- **Package management**: npm 11.8.0 workspaces
- **Node.js**: Version 24.13.1 (mise managed)

## Future Testing Framework

### Planned Test Setup

- **Unit testing**: Test framework to be selected
- **Component testing**: React testing utilities
- **Test coverage**: Coverage reporting setup
- **Mock configuration**: External dependency mocking
- **Continuous integration**: Automated test execution

### Testing Standards (Planned)

- **Test organization**: AAA pattern (Arrange, Act, Assert)
- **Descriptive naming**: Clear behavior descriptions
- **Test isolation**: Independent test execution
- **Coverage requirements**: Business logic and critical paths
- **Edge case testing**: Error scenarios and validation

## Build & Package Management

### Current Setup

- **Monorepo structure**: Turborepo orchestration
- **Workspace isolation**: Separate package.json per app
- **Shared dependencies**: Centralized tooling configuration
- **Build pipeline**: TypeScript compilation and bundling
- **Development workflow**: Hot reload and type checking

## Git & version control

### Commit standards

- Conventional commit message format
- Descriptive and clear commit messages
- Atomic commits with single responsibility
- Issue reference integration
- Code review requirements

### Branch strategy

- Feature branches for new development
- Main branch protection rules
- Pull request workflow
- Code review requirements
- Automated testing on branches

## Documentation standards

### Code documentation

- JSDoc comments for public APIs
- README files for each application
- Architecture decision records
- API documentation generation
- Component documentation with examples

### Development workflow

- Local development setup instructions
- Environment variable configuration
- Database setup and migration procedures
- Testing guidelines and procedures
- Deployment and release procedures

## Security tools

### Dependency management

- Regular dependency updates
- Security vulnerability scanning
- License compliance checking
- Automated security alerts
- Dependency version pinning

### Code security

- Static analysis for security issues
- Input validation enforcement
- Secrets management guidelines
- Authentication flow validation
- Data privacy compliance checks