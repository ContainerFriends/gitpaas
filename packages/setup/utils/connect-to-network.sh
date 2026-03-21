#!/bin/bash

connect_to_network() {
    local container_id
    container_id=$(hostname)

    if docker network connect gitpaas-network "$container_id" 2>&1 | grep -q "already exists"; then
        return 0
    fi

    echo "✅ Connected to gitpaas-network"
}