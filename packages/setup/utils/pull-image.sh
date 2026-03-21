#!/bin/bash

# Pull Docker image if not present
pull_image_if_missing() {
    local image="$1"

    if ! docker image inspect "$image" > /dev/null 2>&1; then
        echo "📦 Pulling image $image..."
        docker pull "$image" > /dev/null 2>&1 || echo "❌ Image pull failed for $image, continuing..."
    fi
}