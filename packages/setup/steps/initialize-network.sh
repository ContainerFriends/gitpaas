#!/bin/bash

# Initialize Docker network
initialize_network() {
    # Intentamos inspeccionar la red; si falla (2), procedemos a crearla
    if ! docker network inspect gitpaas-network > /dev/null 2>&1; then
        if docker network create --driver overlay --attachable gitpaas-network > /dev/null 2>&1; then
            echo "✅ Docker network created successfully"
        else
            echo "❌ Error: Could not create the network. Make sure Docker Swarm is active."
            return 1
        fi
    else
        echo "✅ Docker network already exists, skipping"
    fi
}