#!/bin/bash

# Create Traefik default config
create_traefik_default_config() {
    local main_config="$MAIN_TRAEFIK_PATH/traefik.yml"
    local acme_json_path="$DYNAMIC_TRAEFIK_PATH/acme.json"

    if [ -f "$acme_json_path" ]; then
        chmod 600 "$acme_json_path"
    fi

    mkdir -p "$MAIN_TRAEFIK_PATH"

    if [ -e "$main_config" ]; then
        if [ -d "$main_config" ]; then
            rm -rf "$main_config"
        elif [ -f "$main_config" ]; then
            echo "✅ Traefik config already exists, skipping"
            return
        fi
    fi

    cat > "$main_config" << EOF
global:
  sendAnonymousUsage: false

providers:
  file:
    directory: /etc/gitpaas/traefik/dynamic
    watch: true
  swarm:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: gitpaas-network

entryPoints:
  web:
    address: ":${TRAEFIK_PORT}"
  websecure:
    address: ":${TRAEFIK_SSL_PORT}"
    http3:
      advertisedPort: ${TRAEFIK_HTTP3_PORT}

api:
  insecure: true
EOF

    echo "✅ Traefik default config created"
}