#!/bin/bash

install_docker() {
    if command_exists docker; then
        echo "✅ Docker already installed"
    else
        echo "📦 Installing Docker (this may take a minute)..."

        if ! DOCKER_INSTALL_ERR=$(curl -sSL https://get.docker.com | sh -s -- --version 28.5.0 2>&1 >/dev/null); then
            echo "❌ Docker installation failed:"
            echo "$DOCKER_INSTALL_ERR"
            exit 1
        fi
        echo "✅ Docker installed successfully"
    fi
}