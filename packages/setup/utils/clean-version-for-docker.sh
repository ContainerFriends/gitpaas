#!/bin/bash

# Clean version tag for Docker images (remove 'v' prefix if present)
clean_version_for_docker() {
    local version="$1"
    # Remove 'v' prefix only if followed by digits (e.g., v1.3.0 -> 1.3.0)
    echo "$version" | sed 's/^v\([0-9]\)/\1/'
}