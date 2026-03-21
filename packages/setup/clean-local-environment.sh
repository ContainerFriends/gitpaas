#!/bin/bash

echo -e "🗑️  Starting GitPaaS cleanup and environment removal\n"

# Paths
BASE_PATH="$(realpath "$(pwd)/.docker")"
SERVICES=("gitpaas-traefik" "gitpaas-redis" "gitpaas-postgres")
NETWORK="gitpaas-network"
VOLUMES=("gitpaas-redis" "gitpaas-postgres")

# Check if the current node is a Swarm manager
is_swarm_manager() {
    [ "$(docker info --format '{{.Swarm.ControlAvailable}}' 2>/dev/null)" = "true" ]
}


if is_swarm_manager; then
    # Delete services
    echo "🛑 Stopping and removing Docker services..."
    for service in "${SERVICES[@]}"; do
        if docker service ls --filter "name=$service" --format '{{.Name}}' | grep -x "$service" > /dev/null 2>&1; then
            docker service rm "$service" > /dev/null
            echo "✅ Service $service removal signal sent"
        fi
    done
    
    echo "⏳ Waiting for containers to fully stop..."
    sleep 5

    # Delete network
    echo "🌐 Removing Docker network..."
    if docker network inspect "$NETWORK" > /dev/null 2>&1; then
        docker network rm "$NETWORK" > /dev/null 2>&1
        echo "✅ Network $NETWORK removed"
    fi
else
    echo "🟡 Node is not a Swarm Manager, skipping services and network removal"
fi

# Delete volumes
echo "💾 Removing Docker volumes..."
for volume in "${VOLUMES[@]}"; do
    if docker volume inspect "$volume" > /dev/null 2>&1; then
        for i in {1..3}; do
            if docker volume rm "$volume" > /dev/null 2>&1; then
                echo "✅ Volume $volume removed"
                break
            else
                if [ $i -eq 3 ]; then
                    echo "❌ Could not remove volume $volume (still busy)"
                else
                    echo "⏳ Volume $volume busy, retrying ($i/3)..."
                    sleep 2
                fi
            fi
        done
    fi
done

# Clean local files
echo "📂 Cleaning up local directories..."
if [ -d "$BASE_PATH" ]; then
    rm -rf "$BASE_PATH"
    echo "✅ Local directory $BASE_PATH deleted"
else
    echo "✅ Local directory already clean"
fi

# Leave Swarm mode if manager
if is_swarm_manager; then
    echo "🐝 Leaving Docker Swarm mode..."
    if docker swarm leave --force > /dev/null 2>&1; then
        echo "✅ Left Docker Swarm successfully"
    else
        echo "❌ Failed to leave Docker Swarm"
    fi
else
    echo "✅ Node already outside of Swarm, skipping"
fi

echo -e "\n✨ Environment clean and silent!"