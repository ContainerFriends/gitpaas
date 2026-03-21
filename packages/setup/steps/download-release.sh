#!/bin/bash

download_release() {
    local version="$1"
    echo "📦 Downloading GitPaaS source ($version)..."
    
    mkdir -p "$SOURCE_PATH"
    
    curl -fsSL "https://github.com/ContainerFriends/gitpaas/archive/refs/tags/${version}.tar.gz" | \
    tar -xzC "$SOURCE_PATH" --strip-components=1
    
    if [ $? -eq 0 ]; then
        echo "✅ Source code downloaded to $SOURCE_PATH"
    else
        echo "❌ Failed to download source code"
        exit 1
    fi
}