#!/bin/bash

# Initialize Backend
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
        --label "traefik.http.routers.backend.rule=PathPrefix(\"/\")" \
        --label "traefik.http.routers.backend.entrypoints=web" \
        --label "traefik.http.routers.backend.middlewares=redirect-to-https@file" \
        --label "traefik.http.routers.backend-secure.rule=PathPrefix(\"/\")" \
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
        "$BACKEND_IMAGE" > /dev/null 2>&1 || { echo "❌ Backend service setup failed"; return 1; }

    echo "✅ Backend service created successfully"
}