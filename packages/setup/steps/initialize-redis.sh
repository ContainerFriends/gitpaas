#!/bin/bash

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