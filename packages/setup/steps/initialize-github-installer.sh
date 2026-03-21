#!/bin/bash

# Initialize Github Installer
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
        "$INSTALLER_IMAGE" > /dev/null 2>&1 || { echo "❌ Installer service setup failed"; return 1; }

    echo "✅ Github Installer service created successfully"
}