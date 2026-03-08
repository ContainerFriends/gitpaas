---
name: "Infrastructure & Deployment"
description: "Infrastructure, deployment, and environment configuration for GitPaaS"
applyTo: "iac/**/*.{yml,yaml,dockerfile,sh}"
---

# Infrastructure & Deployment

## Container architecture

### Docker Swarm orchestration

- **Swarm Mode**: Single-node Docker Swarm for container orchestration
- **Network**: `gitpaas-network` overlay network for service communication
- **Services**: PostgreSQL and Redis as Docker Swarm services
- **Containers**: Traefik as standalone container for reverse proxy
- **Placement**: All services constrained to manager nodes
- **Restart Policies**: Always restart for high availability

### Service architecture

- **Traefik**: Reverse proxy and load balancer (standalone container)
- **PostgreSQL**: Primary database (Swarm service)
- **Redis**: Cache and session store (Swarm service)
- **Backend**: Node.js Express API (development: local, production: containerized)
- **Frontend**: Vite React application (development: local, production: static files)

## Infrastructure provisioning

### Automated setup process

The `packages/setup` package provides automated infrastructure provisioning:

1. **Directory Structure**: Creates `/etc/gitpaas/` hierarchy (production) or `.docker/` (development)
2. **Docker Swarm**: Initializes single-node swarm with `AdvertiseAddr: 127.0.0.1`
3. **Overlay Network**: Creates `gitpaas-network` with `attachable: true`
4. **Traefik Configuration**: Generates main config and dynamic configurations
5. **Service Deployment**: Deploys PostgreSQL and Redis as Swarm services
6. **Traefik Deployment**: Starts Traefik container with Docker socket access
7. **Database Setup**: Generates Prisma client and applies migrations

### GitPaaS directory structure

```
/etc/gitpaas/                  # Base path (production)
├── traefik/                   # Traefik configuration
│   ├── traefik.yml           # Main Traefik configuration
│   └── dynamic/              # Dynamic configurations
│       ├── middlewares.yml   # HTTPS redirect middleware
│       ├── gitpaas.yml       # Application routing
│       └── acme.json         # Let's Encrypt certificates
├── logs/                     # Application logs
├── applications/             # Application deployments
├── compose/                  # Docker Compose files
├── ssh/                      # SSH configurations (chmod 700)
├── monitoring/               # Monitoring configurations
├── registry/                 # Docker registry data
├── schedules/                # Scheduled tasks
├── volume-backups/           # Volume backup data
└── patch-repos/              # Repository patches
```

## Database infrastructure

### PostgreSQL service configuration

- **Image**: `postgres:18.3-alpine3.23`
- **Service Name**: `gitpaas-postgres`
- **Credentials**: User/DB: `gitpaas`, Password: `amukds4wi9001583845717ad2`
- **Persistent Volume**: `gitpaas-postgres` mounted to `/var/lib/postgresql/data`
- **Network**: Connected to `gitpaas-network`
- **Development**: Port 5432 exposed to host
- **Production**: Internal communication only
- **Placement**: Constrained to manager nodes

### Redis service configuration

- **Image**: `redis:8.4-alpine3.22`
- **Service Name**: `gitpaas-redis`
- **Persistent Volume**: `gitpaas-redis` mounted to `/data`
- **Network**: Connected to `gitpaas-network`
- **Development**: Port 6379 exposed to host
- **Production**: Internal communication only
- **Placement**: Constrained to manager nodes

### Prisma integration

- **Client Generation**: Automated during setup process
- **Migrations**: Deployed automatically via `prisma migrate deploy`
- **Configuration**: Custom config file `prisma.config.ts`
- **Output Path**: Generated client in `apps/backend/src/core/infrastructure/prisma/client`

## Reverse proxy & routing

### Traefik configuration

- **Image**: `traefik:v3.6.7` (configurable via `TRAEFIK_VERSION`)
- **Container Name**: `gitpaas-traefik`
- **Restart Policy**: `always`
- **Network**: Connected to `gitpaas-network`
- **Docker Socket**: Mounted for dynamic service discovery
- **Configuration Mounts**:
  - Main config: `/etc/traefik/traefik.yml`
  - Dynamic configs: `/etc/gitpaas/traefik/dynamic/`

### Port configuration

- **HTTP**: Port 80 (configurable via `TRAEFIK_PORT`)
- **HTTPS**: Port 443 (configurable via `TRAEFIK_SSL_PORT`)
- **HTTP/3**: Port 443 UDP (configurable via `TRAEFIK_HTTP3_PORT`)
- **Dashboard**: Port 8080 (optional, development only)

### SSL & certificates

- **Let's Encrypt**: Automatic SSL certificate generation (production)
- **HTTP Challenge**: Validation via port 80
- **ACME Storage**: `/etc/gitpaas/traefik/dynamic/acme.json` (chmod 600)
- **HTTPS Redirect**: Automatic HTTP to HTTPS redirection

### Provider configuration

- **Development**: Docker provider with auto-discovery
- **Production**: Docker Swarm provider with explicit exposure
- **File Provider**: Dynamic configuration from `/etc/gitpaas/traefik/dynamic/`

### Application routing

- **Default Route**: `gitpaas.docker.localhost` → `http://gitpaas:3000`
- **Load Balancer**: Built-in with health checks
- **Headers**: `passHostHeader: true` for proper forwarding

## Environment management

### Environment variables

**Required for setup:**
- `NODE_ENV`: `development` | `production`
- `DATABASE_URL`: PostgreSQL connection string
- `GITPAAS_PORT`: Application port (default: 3000)

**Optional configuration:**
- `TRAEFIK_VERSION`: Traefik image version (default: 3.6.7)
- `TRAEFIK_PORT`: HTTP port (default: 80)
- `TRAEFIK_SSL_PORT`: HTTPS port (default: 443)
- `TRAEFIK_HTTP3_PORT`: HTTP/3 port (default: 443)
- `POSTGRES_IMAGE`: PostgreSQL image (default: postgres:18.3-alpine3.23)
- `REDIS_IMAGE`: Redis image (default: redis:8.4-alpine3.22)
- `DOCKER_API_VERSION`: Docker API version
- `DOCKER_HOST`: Docker daemon host
- `DOCKER_PORT`: Docker daemon port

### Development vs Production

**Development:**
- Base path: `.docker/` in project root
- Host ports exposed for database access
- Docker provider with auto-discovery
- Insecure API access for debugging

**Production:**
- Base path: `/etc/gitpaas/`
- Internal network communication only
- Docker Swarm provider
- Let's Encrypt SSL certificates
- Security headers and HTTPS enforcement

## Deployment process

### Setup command

```bash
npm run setup  # Executes packages/setup automated provisioning
```

### Setup sequence

1. **Directories**: Create GitPaaS directory structure
2. **Middlewares**: Generate Traefik middleware configurations
3. **Swarm**: Initialize Docker Swarm (single-node)
4. **Network**: Create overlay network for services
5. **Traefik Config**: Generate main and dynamic configurations  
6. **Images**: Pull required Docker images
7. **Traefik**: Deploy reverse proxy container
8. **Redis**: Deploy cache service
9. **PostgreSQL**: Deploy database service
10. **Prisma**: Generate client and apply migrations

### Service lifecycle

- **Image Pull**: Automatic image pulling with fallback handling
- **Service Updates**: Update existing services or create new ones
- **Container Management**: Force remove and recreate for Traefik
- **Error Handling**: Continue on non-critical errors (409 conflicts)
- **Health Checks**: Built-in service monitoring

### Data persistence

- **PostgreSQL Volume**: `gitpaas-postgres` for database data
- **Redis Volume**: `gitpaas-redis` for cache persistence
- **Traefik State**: Configuration and certificates in `/etc/gitpaas/`
- **Application Logs**: Persistent logging in `/etc/gitpaas/logs/`