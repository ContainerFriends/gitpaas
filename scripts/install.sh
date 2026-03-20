#!/bin/bash

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

# Paths
BASE_PATH="/etc/gitpaas"
SOURCE_PATH="$BASE_PATH/source"
MAIN_TRAEFIK_PATH="$BASE_PATH/traefik"
DYNAMIC_TRAEFIK_PATH="$MAIN_TRAEFIK_PATH/dynamic"
LOGS_PATH="$BASE_PATH/logs"
APPLICATIONS_PATH="$BASE_PATH/applications"
SSH_PATH="$BASE_PATH/ssh"
CERTIFICATES_PATH="$DYNAMIC_TRAEFIK_PATH/certificates"
MONITORING_PATH="$BASE_PATH/monitoring"
SCHEDULES_PATH="$BASE_PATH/schedules"
VOLUME_BACKUPS_PATH="$BASE_PATH/volume-backups"

# Traefik ports and version
TRAEFIK_SSL_PORT="${TRAEFIK_SSL_PORT:-443}"
TRAEFIK_PORT="${TRAEFIK_PORT:-80}"
TRAEFIK_HTTP3_PORT="${TRAEFIK_HTTP3_PORT:-443}"
TRAEFIK_VERSION="${TRAEFIK_VERSION:-3.6.10}"

# Images and versions
VERSION_TAG="${VERSION_TAG:-v1.3.3}"
DOCKER_VERSION_TAG="${DOCKER_VERSION_TAG:-1.3.3}"
GHCR_OWNER="${GHCR_OWNER:-containerfriends}"
BACKEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-backend:${DOCKER_VERSION_TAG}"

command_exists() {
    command -v "$@" > /dev/null 2>&1
}

get_ip() {
    local ip=""
    
    # Try IPv4 first
    # First attempt: ifconfig.io
    ip=$(curl -4s --connect-timeout 5 https://ifconfig.io 2>/dev/null)
    
    # Second attempt: icanhazip.com
    if [ -z "$ip" ]; then
        ip=$(curl -4s --connect-timeout 5 https://icanhazip.com 2>/dev/null)
    fi
    
    # Third attempt: ipecho.net
    if [ -z "$ip" ]; then
        ip=$(curl -4s --connect-timeout 5 https://ipecho.net/plain 2>/dev/null)
    fi

    # If no IPv4, try IPv6
    if [ -z "$ip" ]; then
        # Try IPv6 with ifconfig.io
        ip=$(curl -6s --connect-timeout 5 https://ifconfig.io 2>/dev/null)
        
        # Try IPv6 with icanhazip.com
        if [ -z "$ip" ]; then
            ip=$(curl -6s --connect-timeout 5 https://icanhazip.com 2>/dev/null)
        fi
        
        # Try IPv6 with ipecho.net
        if [ -z "$ip" ]; then
            ip=$(curl -6s --connect-timeout 5 https://ipecho.net/plain 2>/dev/null)
        fi
    fi

    if [ -z "$ip" ]; then
        echo "Error: Could not determine server IP address automatically (neither IPv4 nor IPv6)." >&2
        echo "Please set the ADVERTISE_ADDR environment variable manually." >&2
        echo "Example: export ADVERTISE_ADDR=<your-server-ip>" >&2
        exit 1
    fi

    echo "$ip"
}

get_private_ip() {
    ip addr show | grep -E "inet (192\.168\.|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.)" | head -n1 | awk '{print $2}' | cut -d/ -f1
}

format_ip_for_url() {
    local ip="$1"
    if echo "$ip" | grep -q ':'; then
        # IPv6
        echo "[${ip}]"
    else
        # IPv4
        echo "${ip}"
    fi
}

# Clean version tag for Docker images (remove 'v' prefix if present)
clean_version_for_docker() {
    local version="$1"
    # Remove 'v' prefix only if followed by digits (e.g., v1.3.0 -> 1.3.0)
    echo "$version" | sed 's/^v\([0-9]\)/\1/'
}

download_release() {
    local version="$1"
    echo "📦 Downloading GitPaaS source ($version)..."
    
    mkdir -p "$SOURCE_PATH"
    
    curl -fsSL "https://github.com/ContainerFriends/gitpaas/archive/refs/tags/${version}.tar.gz" | \
    tar -xzC "$SOURCE_PATH" --strip-components=1
    
    if [ $? -eq 0 ]; then
        echo "✅ Source code downloaded to $SOURCE_PATH"
    else
        echo "❌ Failed to download source code"
        exit 1
    fi
}

# Function to detect if running in Proxmox LXC container
is_proxmox_lxc() {
    # Check for LXC in environment
    if [ -n "$container" ] && [ "$container" = "lxc" ]; then
        return 0  # LXC container
    fi
    
    # Check for LXC in /proc/1/environ
    if grep -q "container=lxc" /proc/1/environ 2>/dev/null; then
        return 0  # LXC container
    fi
    
    return 1  # Not LXC
}

generate_random_password() {
    # Generate a secure random password using multiple methods with fallbacks
    local password=""
    
    # Try using openssl (most reliable, available on most systems)
    if command -v openssl >/dev/null 2>&1; then
        password=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    # Fallback to /dev/urandom with tr (most Linux systems)
    elif [ -r /dev/urandom ]; then
        password=$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
    # Last resort fallback using date and simple hashing
    else
        if command -v sha256sum >/dev/null 2>&1; then
            password=$(date +%s%N | sha256sum | base64 | head -c 32)
        elif command -v shasum >/dev/null 2>&1; then
            password=$(date +%s%N | shasum -a 256 | base64 | head -c 32)
        else
            # Very basic fallback - combines multiple sources of entropy
            password=$(echo "$(date +%s%N)-$(hostname)-$$-$RANDOM" | base64 | tr -d "=+/" | head -c 32)
        fi
    fi
    
    # Ensure we got a password of correct length
    if [ -z "$password" ] || [ ${#password} -lt 20 ]; then
        echo "Error: Failed to generate random password" >&2
        exit 1
    fi
    
    echo "$password"
}

# Setup application directories
setup_directories() {
    local directories=(
        "$BASE_PATH"
        "$MAIN_TRAEFIK_PATH"
        "$DYNAMIC_TRAEFIK_PATH"
        "$LOGS_PATH"
        "$APPLICATIONS_PATH"
        "$SSH_PATH"
        "$CERTIFICATES_PATH"
        "$MONITORING_PATH"
        "$SCHEDULES_PATH"
        "$VOLUME_BACKUPS_PATH"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir" || { echo "Failed to create directory: $dir"; continue; }
        fi

        if [ "$dir" = "$SSH_PATH" ]; then
            chmod 700 "$SSH_PATH"
        fi
    done

    echo "✅ Directories configured successfully"
}

# Create Traefik default middlewares configuration
create_traefik_default_middlewares() {
    local middlewares_path="$DYNAMIC_TRAEFIK_PATH/middlewares.yml"

    if [ -f "$middlewares_path" ]; then
        return
    fi

    mkdir -p "$DYNAMIC_TRAEFIK_PATH"

    cat > "$middlewares_path" << 'EOF'
http:
  middlewares:
    redirect-to-https:
      redirectScheme:
        scheme: https
        permanent: true
EOF

    echo "✅ Traefik default middlewares created"
}

# Create Traefik default config
create_traefik_default_config() {
    local main_config="$MAIN_TRAEFIK_PATH/traefik.yml"
    local acme_json_path="$DYNAMIC_TRAEFIK_PATH/acme.json"

    if [ -f "$acme_json_path" ]; then
        chmod 600 "$acme_json_path"
    fi

    mkdir -p "$MAIN_TRAEFIK_PATH"

    if [ -e "$main_config" ]; then
        if [ -d "$main_config" ]; then
            rm -rf "$main_config"
        elif [ -f "$main_config" ]; then
            echo "✅ Traefik config already exists, skipping"
            return
        fi
    fi

    cat > "$main_config" << EOF
global:
  sendAnonymousUsage: false

providers:
  file:
    directory: /etc/gitpaas/traefik/dynamic
    watch: true
  docker:
    defaultRule: "Host(\`{{ trimPrefix \`/\` .Name }}.docker.localhost\`)"

entryPoints:
  web:
    address: ":${TRAEFIK_PORT}"
  websecure:
    address: ":${TRAEFIK_SSL_PORT}"
    http3:
      advertisedPort: ${TRAEFIK_HTTP3_PORT}

api:
  insecure: true
EOF

    echo "✅ Traefik default config created"
}

# Check if Docker network is initialized
docker_network_initialized() {
    docker network inspect gitpaas-network > /dev/null 2>&1
}

# Initialize Docker network
initialize_network() {
    if ! docker_network_initialized; then
        docker network create --driver overlay --attachable gitpaas-network > /dev/null 2>&1
        echo "✅ Docker network created successfully"
    else
        echo "✅ Docker network already exists, skipping"
    fi
}

# Pull Docker image if not present
pull_image_if_missing() {
    local image="$1"

    if ! docker image inspect "$image" > /dev/null 2>&1; then
        echo "📦 Pulling image $image..."
        docker pull "$image" > /dev/null 2>&1 || echo "❌ Image pull failed for $image, continuing..."
    fi
}

# Initialize Traefik as a Docker service
initialize_traefik() {
    local image_name="traefik:v${TRAEFIK_VERSION}"
    local service_name="gitpaas-traefik"

    pull_image_if_missing "$image_name"

    local existing_service
    existing_service=$(docker service ls --filter "name=${service_name}" --format '{{.Name}}' | grep -x "$service_name")

    if [ -n "$existing_service" ]; then
        echo "✅ Traefik service already running, skipping"
        return 0
    fi

    docker service create \
        --name "$service_name" \
        --network gitpaas-network \
        --constraint "node.role==manager" \
        --replicas 1 \
        --mount type=bind,source="$MAIN_TRAEFIK_PATH/traefik.yml",target=/etc/traefik/traefik.yml,readonly \
        --mount type=bind,source="$DYNAMIC_TRAEFIK_PATH",target=/etc/gitpaas/traefik/dynamic,readonly \
        --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock,readonly \
        --publish mode=host,target=${TRAEFIK_PORT},published=${TRAEFIK_PORT},protocol=tcp \
        --publish mode=host,target=${TRAEFIK_SSL_PORT},published=${TRAEFIK_SSL_PORT},protocol=tcp \
        --publish mode=host,target=${TRAEFIK_HTTP3_PORT},published=${TRAEFIK_HTTP3_PORT},protocol=udp \
        "$image_name" > /dev/null 2>&1 || { echo "❌ Traefik service setup failed"; return 1; }

    echo "✅ Traefik service created successfully"
}

# Initialize Redis as a Docker service
initialize_redis() {
    local image_name="${REDIS_IMAGE:-redis:8.4-alpine3.22}"
    local service_name="gitpaas-redis"

    pull_image_if_missing "$image_name"

    local existing_service
    existing_service=$(docker service ls --filter "name=${service_name}" --format '{{.Name}}' | grep -x "$service_name")

    if [ -n "$existing_service" ]; then
        echo "✅ Redis service already running, skipping"
        return 0
    fi

    local publish_flag=""
    if [ "${NODE_ENV}" = "development" ]; then
        publish_flag="--publish mode=host,target=6379,published=6379,protocol=tcp"
    fi

    docker service create \
        --name "$service_name" \
        --network gitpaas-network \
        --constraint "node.role==manager" \
        --replicas 1 \
        --mount type=volume,source=gitpaas-redis,target=/data \
        $publish_flag \
        "$image_name" > /dev/null 2>&1 || { echo "❌ Redis service setup failed"; return 1; }

    echo "✅ Redis service created successfully"
}

# Ensure Postgres Docker secret exists
ensure_postgres_secret() {
    local secret_name="gitpaas_postgres_password"

    if docker secret inspect "$secret_name" > /dev/null 2>&1; then
        echo "✅ PostgreSQL secret already exists"
        return 0
    fi

    export CURRENT_DB_PASSWORD=$(openssl rand -base64 24 | tr '+/' '-_' | tr -d '=')

    echo "$CURRENT_DB_PASSWORD" | docker secret create "$secret_name" - > /dev/null
    echo "✅ PostgreSQL secret created"

    DATABASE_URL="postgres://gitpaas:${CURRENT_DB_PASSWORD}@gitpaas-postgres:5432/gitpaas"
    export DATABASE_URL
    echo "✅ DATABASE_URL configured"
}

# Initialize Postgres as a Docker service (production)
initialize_postgres() {
    local image_name="${POSTGRES_IMAGE:-postgres:18.3-alpine3.23}"
    local service_name="gitpaas-postgres"

    ensure_postgres_secret

    pull_image_if_missing "$image_name"

    local existing_service
    existing_service=$(docker service ls --filter "name=${service_name}" --format '{{.Name}}' | grep -x "$service_name")

    if [ -n "$existing_service" ]; then
        echo "✅ Postgres service already running, skipping"
        return 0
    fi

    docker service create \
        --name "$service_name" \
        --network gitpaas-network \
        --constraint "node.role==manager" \
        --replicas 1 \
        --mount type=volume,source=gitpaas-postgres,target=/var/lib/postgresql/data \
        --secret gitpaas_postgres_password \
        --env POSTGRES_USER=gitpaas \
        --env POSTGRES_DB=gitpaas \
        --env POSTGRES_PASSWORD_FILE=/run/secrets/gitpaas_postgres_password \
        "$image_name" > /dev/null 2>&1 || { echo "❌ Postgres service setup failed"; return 1; }

    echo "✅ Postgres service created successfully"
}

# Wait for PostgreSQL to be ready
wait_for_postgres() {
    local max_attempts="${1:-30}"
    local attempt=1

    echo "⏳ Waiting for PostgreSQL to be ready..."

    while [ "$attempt" -le "$max_attempts" ]; do
        local container_id
        container_id=$(docker ps --filter "label=com.docker.swarm.service.name=gitpaas-postgres" --format '{{.ID}}' | head -1)

        if [ -n "$container_id" ]; then
            if docker exec "$container_id" pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; then
                echo "✅ PostgreSQL is ready"
                return 0
            fi
        fi

        echo "⏳ Attempt $attempt/$max_attempts - PostgreSQL not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo "❌ PostgreSQL failed to become ready within the expected time"
    return 1
}

connect_to_network() {
    local container_id
    container_id=$(hostname)

    if docker network connect gitpaas-network "$container_id" 2>&1 | grep -q "already exists"; then
        return 0
    fi

    echo "✅ Connected to gitpaas-network"
}

# Run Prisma migrations
run_migrations() {
    if [ -z "$BACKEND_IMAGE" ]; then
        echo "❌ BACKEND_IMAGE environment variable is required"
        return 1
    fi

    pull_image_if_missing "$BACKEND_IMAGE"

    echo "🔄 Running Prisma migrations..."

    MIGRATION_OUTPUT=$(docker run --rm \
        --network gitpaas-network \
        -e DATABASE_URL="postgres://gitpaas:${CURRENT_DB_PASSWORD}@gitpaas-postgres:5432/gitpaas" \
        -e PRISMA_SCHEMA_PATH="/app/iac/database/schema.prisma" \
        -e PRISMA_MIGRATIONS_PATH="/app/iac/database/migrations" \
        "$BACKEND_IMAGE" \
        npx prisma migrate deploy --config=./prisma.config.ts 2>&1)

    if [ $? -eq 0 ]; then
        echo "✅ Migrations applied successfully"
    else
        echo "❌ Migration failed. Error details:"
        echo "-------------------------------------------"
        echo "$MIGRATION_OUTPUT"
        echo "-------------------------------------------"
        
        if echo "$MIGRATION_OUTPUT" | grep -q "P1001"; then
            echo "💡 Tip: Prisma cannot reach the database. Check if 'gitpaas-postgres' is healthy."
        fi
        
        return 1
    fi
}

# Initialize Backend as a Docker service
initialize_backend() {
    if [ -z "$BACKEND_IMAGE" ]; then
        echo "❌ BACKEND_IMAGE environment variable is required"
        return 1
    fi

    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL is not available. Ensure PostgreSQL setup completed first."
        return 1
    fi

    if [ -z "$ADVERTISE_ADDR" ]; then
        echo "❌ ADVERTISE_ADDR environment variable is required"
        return 1
    fi

    local service_name="gitpaas-backend"
    local secret_id
    secret_id=$(docker secret inspect gitpaas_postgres_password --format '{{.ID}}' 2>/dev/null)

    if [ -z "$secret_id" ]; then
        echo "❌ Postgres secret not found"
        return 1
    fi

    local existing_service
    existing_service=$(docker service ls --filter "name=${service_name}" --format '{{.Name}}' | grep -x "$service_name")

    if [ -n "$existing_service" ]; then
        echo "🔄 Updating Backend service..."
        docker service rm "$service_name"
    fi

    local release_tag_env=""
    if [ -n "$RELEASE_TAG" ]; then
        release_tag_env="--env RELEASE_TAG=${RELEASE_TAG}"
    fi

    docker service create \
        --name "$service_name" \
        --network gitpaas-network \
        --constraint "node.role==manager" \
        --replicas 1 \
        --update-parallelism 1 \
        --update-order stop-first \
        --label "traefik.enable=true" \
        --label "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https" \
        --label "traefik.http.middlewares.redirect-to-https.redirectscheme.permanent=true" \
        --label "traefik.http.routers.backend.rule=PathPrefix(\`/\`)" \
        --label "traefik.http.routers.backend.entrypoints=web" \
        --label "traefik.http.routers.backend.middlewares=redirect-to-https" \
        --label "traefik.http.routers.backend-secure.rule=PathPrefix(\`/\`)" \
        --label "traefik.http.routers.backend-secure.entrypoints=websecure" \
        --label "traefik.http.routers.backend-secure.tls=true" \
        --label "traefik.http.services.backend-secure.loadbalancer.server.port=4000" \
        --env DATABASE_URL="${DATABASE_URL}" \
        --env ADVERTISE_ADDR="${ADVERTISE_ADDR}" \
        --env NODE_ENV=production \
        --env SERVER_URL=http://localhost:4000 \
        --env 'DEVELOPMENT_SERVER_URL=""' \
        --env SETUP_TOKEN=test \
        --env CORS_ORIGIN="https://${ADVERTISE_ADDR}" \
        --env GITHUB_INSTALLER_URL="https://${ADVERTISE_ADDR}/installer" \
        $release_tag_env \
        --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
        --mount type=bind,source=/etc/gitpaas,target=/etc/gitpaas \
        --secret source=gitpaas_postgres_password,target=/run/secrets/postgres_password,uid=0,gid=0,mode=0444 \
        "$BACKEND_IMAGE" || { echo "❌ Backend service setup failed"; return 1; }

    echo "✅ Backend service created successfully"
}

# Initialize Github Installer as a Docker service
initialize_github_installer() {
    if [ -z "$INSTALLER_IMAGE" ]; then
        echo "❌ INSTALLER_IMAGE environment variable is required"
        return 1
    fi

    local service_name="gitpaas-installer"

    pull_image_if_missing "$INSTALLER_IMAGE"

    local existing_service
    existing_service=$(docker service ls --filter "name=${service_name}" --format '{{.Name}}' | grep -x "$service_name")

    if [ -n "$existing_service" ]; then
        echo "🔄 Updating Github Installer service..."
        docker service rm "$service_name"
    fi

    docker service create \
        --name "$service_name" \
        --network gitpaas-network \
        --constraint "node.role==manager" \
        --replicas 1 \
        --update-parallelism 1 \
        --update-order stop-first \
        --label "traefik.enable=true" \
        --label "traefik.http.routers.installer.rule=PathPrefix(\`/installer\`)" \
        --label "traefik.http.routers.installer.priority=10" \
        --label "traefik.http.routers.installer.entrypoints=web" \
        --label "traefik.http.routers.installer.middlewares=redirect-to-https" \
        --label "traefik.http.routers.installer-secure.rule=PathPrefix(\`/installer\`)" \
        --label "traefik.http.routers.installer-secure.priority=10" \
        --label "traefik.http.routers.installer-secure.entrypoints=websecure" \
        --label "traefik.http.routers.installer-secure.tls=true" \
        --label "traefik.http.services.installer-secure.loadbalancer.server.port=80" \
        "$INSTALLER_IMAGE" || { echo "❌ Installer service setup failed"; return 1; }

    echo "✅ Github Installer service created successfully"
}

install_gitpaas() {
    echo "🚀 Starting GitPaaS ${VERSION_TAG} configuration"

    if [ "$(id -u)" != "0" ]; then
        echo "❌ This script must be run as root" >&2
        exit 1
    fi

    # Check if is Mac OS
    if [ "$(uname)" = "Darwin" ]; then
        echo "❌ This script must be run on Linux" >&2
        exit 1
    fi

    # Check if is running inside a container
    if [ -f /.dockerenv ]; then
        echo "❌ This script must be run on Linux" >&2
        exit 1
    fi

    # Check if something is running on port 80
    if ss -tulnp | grep ':80 ' >/dev/null; then
        echo "❌ Error: something is already running on port 80" >&2
        exit 1
    fi

    # Check if something is running on port 443
    if ss -tulnp | grep ':443 ' >/dev/null; then
        echo "❌ Error: something is already running on port 443" >&2
        exit 1
    fi

    if command_exists docker; then
        echo "✅ Docker already installed"
    else
        echo "📦 Installing Docker (this may take a minute)..."
        # Capturamos errores en una variable, silenciando el progreso normal
        if ! DOCKER_INSTALL_ERR=$(curl -sSL https://get.docker.com | sh -s -- --version 28.5.0 2>&1 >/dev/null); then
            echo "❌ Docker installation failed:"
            echo "$DOCKER_INSTALL_ERR"
            exit 1
        fi
        echo "✅ Docker installed successfully"
    fi

    if command_exists jq; then
        echo "✅ jq already installed"
    else
        echo "📦 Installing jq..."
        if command_exists apt-get; then
            apt-get install -y jq >/dev/null 2>&1
        elif command_exists yum; then
            yum install -y jq >/dev/null 2>&1
        elif command_exists apk; then
            apk add --no-cache jq >/dev/null 2>&1
        else
            echo "⚠️ Could not install jq automatically. Please install it manually." >&2
            exit 1
        fi
        echo "✅ jq installed"
    fi

    # Check if running in Proxmox LXC container and set endpoint mode
    endpoint_mode=""
    if is_proxmox_lxc; then
        echo "⚠️ WARNING: Detected Proxmox LXC container environment!"
        echo "Adding --endpoint-mode dnsrr to Docker services for LXC compatibility."
        echo "This may affect service discovery but is required for LXC containers."
        echo ""
        endpoint_mode="--endpoint-mode dnsrr"
        echo "Waiting for 5 seconds before continuing..."
        sleep 5
    fi

    docker swarm leave --force 2>/dev/null

    advertise_addr="${ADVERTISE_ADDR:-$(get_private_ip)}"

    if [ -z "$advertise_addr" ]; then
        echo "❌ ERROR: We couldn't find a private IP address."
        echo "Please set the ADVERTISE_ADDR environment variable manually."
        echo "Example: export ADVERTISE_ADDR=192.168.1.100"
        exit 1
    fi
    echo "✅ Using advertise address: $advertise_addr"

    # Allow custom Docker Swarm init arguments via DOCKER_SWARM_INIT_ARGS environment variable
    # Example: export DOCKER_SWARM_INIT_ARGS="--default-addr-pool 172.20.0.0/16 --default-addr-pool-mask-length 24"
    # This is useful to avoid CIDR overlapping with cloud provider VPCs (e.g., AWS)
    swarm_init_args="${DOCKER_SWARM_INIT_ARGS:-}"
    
    if [ -n "$swarm_init_args" ]; then
        echo "Using custom swarm init arguments: $swarm_init_args"
        docker swarm init --advertise-addr $advertise_addr $swarm_init_args > /dev/null 2>&1
    else
        docker swarm init --advertise-addr $advertise_addr > /dev/null 2>&1
    fi
    
     if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to initialize Docker Swarm" >&2
        exit 1
    fi

    echo "✅ Docker Swarm initialized successfully"

    setup_directories
    download_release "$VERSION_TAG"
    create_traefik_default_middlewares
    create_traefik_default_config
    initialize_network
    initialize_traefik
    initialize_redis
    initialize_postgres
    wait_for_postgres
    connect_to_network
    run_migrations
    initialize_backend
    initialize_github_installer

    public_ip="${ADVERTISE_ADDR:-$(get_ip)}"

    # Check GitHub App installation status
    printf "${BLUE}🔍 Checking GitHub App installation status...${NC}\n"

    max_attempts=10
    attempt=0
    health_response=""

    while [ $attempt -lt $max_attempts ]; do
        health_response=$(curl -ksf --connect-timeout 5 'https://localhost/v1/health?token="test"' 2>/dev/null)
        if [ -n "$health_response" ]; then
            break
        fi
        attempt=$((attempt + 1))
        echo "⏳ Waiting for backend to be ready... ($attempt/$max_attempts)"
        sleep 5
    done

    if [ -z "$health_response" ]; then
        printf "${YELLOW}⚠️ Could not reach the backend. Check the service status with: docker service ls${NC}\n"
    else
        is_installed=$(echo "$health_response" | jq -r '.services.githubApp.isInstalled')
        install_url=$(echo "$health_response" | jq -r '.services.githubApp.installUrl')

        if [ "$is_installed" = "false" ]; then
            printf "\n"
            printf "${YELLOW}⚠️ GitHub App is not installed yet.${NC}\n"
            printf "${YELLOW}To complete the setup, visit the following URL in your browser:${NC}\n\n"
            printf "${GREEN}👉 ${install_url}${NC}\n\n"
            printf "${BLUE}Follow the GitHub App installation flow and GitPaaS will be ready.${NC}\n"
        else
            printf "${GREEN}✅ GitHub App is installed and ready!${NC}\n"
            echo "✅ Setup completed"
        fi
    fi
}

update_gitpaas() {
    # Detect version tag
    VERSION_TAG=$(detect_version)
    DOCKER_VERSION_TAG=$(clean_version_for_docker "$VERSION_TAG")
    GHCR_OWNER="${GHCR_OWNER:-containerfriends}"
    BACKEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-backend:${DOCKER_VERSION_TAG}"
    INSTALLER_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-installer:${DOCKER_VERSION_TAG}"
    
    echo "Updating GitPaaS to version: ${VERSION_TAG}"
    
    # Pull images
    docker pull $BACKEND_IMAGE
    docker pull $INSTALLER_IMAGE

    # Update services
    docker service update --image $BACKEND_IMAGE gitpaas-backend
    docker service update --image $INSTALLER_IMAGE gitpaas-installer

    echo "GitPaaS has been updated to version: ${VERSION_TAG}"
}

# Main script execution
if [ "$1" = "update" ]; then
    update_gitpaas
else
    install_gitpaas
fi