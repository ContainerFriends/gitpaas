#!/bin/bash

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

    local output
    output=$(docker service create \
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
        "$image_name" 2>&1)

    if [ $? -ne 0 ]; then
        echo "❌ Traefik service setup failed:"
        echo "$output"
        return 1
    fi

    echo "✅ Traefik service created successfully"
}