#!/bin/bash

echo -e "🚀 Starting GitPaaS configuration for local environment\n"

# Paths
BASE_PATH="$(realpath "$(pwd)/.docker")"
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

# Database configuration
DATABASE_URL="postgres://gitpaas:password@localhost:5432/gitpaas"

# Check if Docker Swarm is initialized
docker_swarm_initialized() {
    [ "$(docker info --format '{{.Swarm.ControlAvailable}}' 2>/dev/null)" = "true" ]
}

# Initialize Docker Swarm service
initialize_swarm() {
    if ! docker_swarm_initialized; then
        docker swarm init --advertise-addr "127.0.0.1" --listen-addr "0.0.0.0" > /dev/null 2>&1
        echo "✅ Docker Swarm initialized successfully"
    else
        echo "✅ Docker Swarm already running, skipping initialization"
    fi
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

    docker service create \
        --name "$service_name" \
        --network gitpaas-network \
        --constraint "node.role==manager" \
        --replicas 1 \
        --mount type=volume,source=gitpaas-redis,target=/data \
        "$image_name" > /dev/null 2>&1 || { echo "❌ Redis service setup failed"; return 1; }

    echo "✅ Redis service created successfully"
}

# Initialize Postgres as a Docker service
initialize_postgres() {
    local image_name="${POSTGRES_IMAGE:-postgres:18.3-alpine3.23}"
    local service_name="gitpaas-postgres"

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
        --env POSTGRES_USER=gitpaas \
        --env POSTGRES_DB=gitpaas \
        --env POSTGRES_PASSWORD=password \
        --publish mode=host,target=5432,published=5432,protocol=tcp \
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

# Generate Prisma client
generate_prisma_client() {
    echo "🔄 Generating Prisma client..."
    export DATABASE_URL="postgres://gitpaas:password@localhost:5432/gitpaas"

    if npx prisma generate --config=./apps/backend/prisma.config.ts > /dev/null 2>&1; then
        echo "✅ Prisma client generated successfully"
    else
        echo "❌ Prisma generate failed"
        return 1
    fi
}

# Run Prisma migrations
run_migrations() {
    echo "🔄 Running Prisma migrations..."
    
    local MIGRATION_OUTPUT
    MIGRATION_OUTPUT=$(DATABASE_URL="postgres://gitpaas:password@localhost:5432/gitpaas" \
        npx prisma migrate deploy --config=./apps/backend/prisma.config.ts 2>&1)
    
    if [ $? -eq 0 ]; then
        echo "✅ Migrations applied successfully"
    else
        echo -e "\n❌ Migration failed. Error details:"
        echo "----------------------------------------------------------------"
        echo "$MIGRATION_OUTPUT"
        echo "----------------------------------------------------------------"
        return 1
    fi
}

initialize_swarm
setup_directories
create_traefik_default_middlewares
create_traefik_default_config
initialize_network
initialize_traefik
initialize_redis
initialize_postgres
wait_for_postgres
generate_prisma_client
run_migrations

echo -e "\n🥳 GitPaaS setup completed"