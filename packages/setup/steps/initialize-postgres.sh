#!/bin/bash

# Initialize Postgres as a Docker service
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