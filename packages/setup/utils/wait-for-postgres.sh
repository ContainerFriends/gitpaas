#!/bin/bash

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