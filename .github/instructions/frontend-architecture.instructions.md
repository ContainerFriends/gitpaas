---
name: "Frontend Architecture"
description: "React architecture patterns and conventions for CookApp frontend application"
applyTo: "apps/frontend/src/**/*.{tsx,ts}"
---

# Frontend architecture

## Clean Architecture layers

### Layer organization
```
features/[entity]/
├── application/    # State management and business logic
├── domain/         # Models, DTOs, and repository interfaces
├── infrastructure/ # API implementations and external services
└── ui/             # React components, hooks, and pages
```

### Dependency flow

Domain ← Application ← Infrastructure ← UI

## Application layer (State management)

- Business logic orchestration
- Custom hooks for data management
- State management coordination
- Client-side validation rules
- Error handling strategies

## Domain layer (Business models)

- Entity models and business rules
- Repository interfaces for data access
- DTOs for API communication
- Business validation logic
- Pure TypeScript interfaces

## Infrastructure layer (External services)

- API repository implementations
- HTTP client configuration
- Authentication token management
- React Query configuration
- External service integrations

## UI layer (React components)

- Functional components with hooks
- Page components for routing
- Reusable component library
- Form components with validation
- Layout and styling components

## Component architecture

### Component types

- **Feature Components**: Entity-specific business components
- **Page Components**: Route-level containers
- **UI Components**: Reusable interface elements
- **Layout Components**: Application structure and navigation
- **Form Components**: Data input and validation

### Component patterns

- Functional components with React hooks
- PascalCase naming for components
- camelCase naming for hooks and variables
- React.memo() for performance optimization
- Props interfaces for type safety

## State management strategy

### State types

- **Server State**: React Query for API data
- **Local State**: useState for component-specific data
- **Global State**: Context API for application-wide state
- **Form State**: Controlled components with validation
- **URL State**: React Router for navigation state

### Data flow

- Custom hooks abstract data fetching logic
- Components consume data through hooks
- React Query handles caching and synchronization
- Forms manage local state with validation
- Global state for authentication and user preferences

## Routing architecture

### Route organization

```
src/pages/
├── auth/           # Authentication pages
├── accounts/       # Account management pages
├── movements/      # Transaction pages
├── categories/     # Category management pages
├── dashboard/      # Analytics and dashboard pages
└── other-pages/    # Utility pages (404, etc.)
```

### Navigation patterns

- React Router 7 for SPA navigation
- Route-based code splitting
- Protected routes with authentication guards
- Breadcrumb navigation for complex flows
- Deep linking support for bookmarking

## Performance architecture

### Optimization strategies

- Code splitting at route level
- Component lazy loading
- React.memo for expensive components
- useMemo and useCallback for computations
- Bundle size optimization with Vite

### Caching strategy

- React Query for server state caching
- Stale-while-revalidate patterns
- Cache invalidation on mutations
- Optimistic updates for better UX
- Background data refreshing

## User experience patterns

### Loading states

- Skeleton screens for initial loads
- Progressive loading for lists
- Spinner indicators for actions
- Optimistic updates for immediate feedback
- Error boundaries for graceful failures

### Form handling

- Real-time validation feedback
- Proper error message display
- Accessible form controls
- Mobile-responsive layouts
- Auto-save for important data