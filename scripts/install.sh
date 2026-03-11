#!/bin/bash

# Detect version from environment variable or detect latest stable from GitHub
# Usage: GITPAAS_VERSION=latest bash install.sh
# Usage: bash install.sh (detects latest stable version)
detect_version() {
    local version="${GITPAAS_VERSION}"
    
    # If no version specified, get latest stable version from GitHub releases
    if [ -z "$version" ]; then
        echo "Detecting latest stable version from GitHub..." >&2
        
        # Try to get latest release from GitHub by following redirects
        version=$(curl -fsSL -o /dev/null -w '%{url_effective}\n' \
            https://github.com/dokploy/dokploy/releases/latest 2>/dev/null | \
            sed 's#.*/tag/##')
        
        # Fallback to latest tag if detection fails
        if [ -z "$version" ]; then
            echo "Warning: Could not detect latest version from GitHub, using fallback version latest" >&2
            version="latest"
        else
            echo "Latest stable version detected: $version" >&2
        fi
    fi
    
    echo "$version"
}

# Function to detect if running in Proxmox LXC container
is_proxmox_lxc() {
    # Check for LXC in environment
    if [ -n "$container" ] && [ "$container" = "lxc" ]; then
        return 0  # LXC container
    fi
    
    # Check for LXC in /proc/1/environ
    if grep -q "container=lxc" /proc/1/environ 2>/dev/null; then
        return 0  # LXC container
    fi
    
    return 1  # Not LXC
}

generate_random_password() {
    # Generate a secure random password using multiple methods with fallbacks
    local password=""
    
    # Try using openssl (most reliable, available on most systems)
    if command -v openssl >/dev/null 2>&1; then
        password=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    # Fallback to /dev/urandom with tr (most Linux systems)
    elif [ -r /dev/urandom ]; then
        password=$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
    # Last resort fallback using date and simple hashing
    else
        if command -v sha256sum >/dev/null 2>&1; then
            password=$(date +%s%N | sha256sum | base64 | head -c 32)
        elif command -v shasum >/dev/null 2>&1; then
            password=$(date +%s%N | shasum -a 256 | base64 | head -c 32)
        else
            # Very basic fallback - combines multiple sources of entropy
            password=$(echo "$(date +%s%N)-$(hostname)-$$-$RANDOM" | base64 | tr -d "=+/" | head -c 32)
        fi
    fi
    
    # Ensure we got a password of correct length
    if [ -z "$password" ] || [ ${#password} -lt 20 ]; then
        echo "Error: Failed to generate random password" >&2
        exit 1
    fi
    
    echo "$password"
}

install_gitpaas() {
    # Detect version tag
    VERSION_TAG=$(detect_version)
    
    echo "Installing GitPaaS version: ${VERSION_TAG}"
    if [ "$(id -u)" != "0" ]; then
        echo "This script must be run as root" >&2
        exit 1
    fi

    # check if is Mac OS
    if [ "$(uname)" = "Darwin" ]; then
        echo "This script must be run on Linux" >&2
        exit 1
    fi

    # check if is running inside a container
    if [ -f /.dockerenv ]; then
        echo "This script must be run on Linux" >&2
        exit 1
    fi

    # check if something is running on port 80
    if ss -tulnp | grep ':80 ' >/dev/null; then
        echo "Error: something is already running on port 80" >&2
        exit 1
    fi

    # check if something is running on port 443
    if ss -tulnp | grep ':443 ' >/dev/null; then
        echo "Error: something is already running on port 443" >&2
        exit 1
    fi



    command_exists() {
      command -v "$@" > /dev/null 2>&1
    }

    if command_exists docker; then
      echo "Docker already installed"
    else
      curl -sSL https://get.docker.com | sh -s -- --version 28.5.0
    fi

    # Check if running in Proxmox LXC container and set endpoint mode
    endpoint_mode=""
    if is_proxmox_lxc; then
        echo "⚠️ WARNING: Detected Proxmox LXC container environment!"
        echo "Adding --endpoint-mode dnsrr to Docker services for LXC compatibility."
        echo "This may affect service discovery but is required for LXC containers."
        echo ""
        endpoint_mode="--endpoint-mode dnsrr"
        echo "Waiting for 5 seconds before continuing..."
        sleep 5
    fi


    docker swarm leave --force 2>/dev/null

    get_ip() {
        local ip=""
        
        # Try IPv4 first
        # First attempt: ifconfig.io
        ip=$(curl -4s --connect-timeout 5 https://ifconfig.io 2>/dev/null)
        
        # Second attempt: icanhazip.com
        if [ -z "$ip" ]; then
            ip=$(curl -4s --connect-timeout 5 https://icanhazip.com 2>/dev/null)
        fi
        
        # Third attempt: ipecho.net
        if [ -z "$ip" ]; then
            ip=$(curl -4s --connect-timeout 5 https://ipecho.net/plain 2>/dev/null)
        fi

        # If no IPv4, try IPv6
        if [ -z "$ip" ]; then
            # Try IPv6 with ifconfig.io
            ip=$(curl -6s --connect-timeout 5 https://ifconfig.io 2>/dev/null)
            
            # Try IPv6 with icanhazip.com
            if [ -z "$ip" ]; then
                ip=$(curl -6s --connect-timeout 5 https://icanhazip.com 2>/dev/null)
            fi
            
            # Try IPv6 with ipecho.net
            if [ -z "$ip" ]; then
                ip=$(curl -6s --connect-timeout 5 https://ipecho.net/plain 2>/dev/null)
            fi
        fi

        if [ -z "$ip" ]; then
            echo "Error: Could not determine server IP address automatically (neither IPv4 nor IPv6)." >&2
            echo "Please set the ADVERTISE_ADDR environment variable manually." >&2
            echo "Example: export ADVERTISE_ADDR=<your-server-ip>" >&2
            exit 1
        fi

        echo "$ip"
    }

    get_private_ip() {
        ip addr show | grep -E "inet (192\.168\.|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.)" | head -n1 | awk '{print $2}' | cut -d/ -f1
    }

    advertise_addr="${ADVERTISE_ADDR:-$(get_private_ip)}"

    if [ -z "$advertise_addr" ]; then
        echo "ERROR: We couldn't find a private IP address."
        echo "Please set the ADVERTISE_ADDR environment variable manually."
        echo "Example: export ADVERTISE_ADDR=192.168.1.100"
        exit 1
    fi
    echo "Using advertise address: $advertise_addr"

    # Allow custom Docker Swarm init arguments via DOCKER_SWARM_INIT_ARGS environment variable
    # Example: export DOCKER_SWARM_INIT_ARGS="--default-addr-pool 172.20.0.0/16 --default-addr-pool-mask-length 24"
    # This is useful to avoid CIDR overlapping with cloud provider VPCs (e.g., AWS)
    swarm_init_args="${DOCKER_SWARM_INIT_ARGS:-}"
    
    if [ -n "$swarm_init_args" ]; then
        echo "Using custom swarm init arguments: $swarm_init_args"
        docker swarm init --advertise-addr $advertise_addr $swarm_init_args
    else
        docker swarm init --advertise-addr $advertise_addr
    fi
    
     if [ $? -ne 0 ]; then
        echo "Error: Failed to initialize Docker Swarm" >&2
        exit 1
    fi

    echo "Swarm initialized"

    docker network rm -f gitpaas-network 2>/dev/null
    docker network create --driver overlay --attachable gitpaas-network

    echo "Network created"

    mkdir -p /etc/gitpaas

    chmod 777 /etc/gitpaas

    # Generate secure random password for Postgres
    POSTGRES_PASSWORD=$(generate_random_password)
    
    # Store password as Docker Secret (encrypted and secure)
    echo "$POSTGRES_PASSWORD" | docker secret create gitpaas_postgres_password - 2>/dev/null || true
    
    echo "Generated secure database credentials (stored in Docker Secrets)"

    docker service create \
    --name gitpaas-postgres \
    --constraint 'node.role==manager' \
    --network gitpaas-network \
    --env POSTGRES_USER=gitpaas \
    --env POSTGRES_DB=gitpaas \
    --secret source=gitpaas_postgres_password,target=/run/secrets/postgres_password \
    --env POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password \
    --mount type=volume,source=gitpaas-postgres,target=/var/lib/postgresql/data \
    $endpoint_mode \
    postgres:16

    docker service create \
    --name gitpaas-redis \
    --constraint 'node.role==manager' \
    --network gitpaas-network \
    --mount type=volume,source=gitpaas-redis,target=/data \
    $endpoint_mode \
    redis:7

    # Installation
    # Set RELEASE_TAG environment variable for canary/feature versions
    release_tag_env=""
    if [[ "$VERSION_TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+ ]]; then
        # Specific version (v0.26.6, v0.26.7, etc.) → latest
        release_tag_env="-e RELEASE_TAG=latest"
    elif [ "$VERSION_TAG" != "latest" ]; then
        # canary, feature/*, etc. → use the tag as-is
        release_tag_env="-e RELEASE_TAG=$VERSION_TAG"
    fi

    GHCR_OWNER="${GHCR_OWNER:-gitpaas}"
    BACKEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-backend:${VERSION_TAG}"
    FRONTEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-frontend:${VERSION_TAG}"

    # Backend service: API on port 4000
    # Traefik routes /api/* requests to this service
    docker service create \
      --name gitpaas-backend \
      --replicas 1 \
      --network gitpaas-network \
      --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
      --mount type=bind,source=/etc/gitpaas,target=/etc/gitpaas \
      --secret source=gitpaas_postgres_password,target=/run/secrets/postgres_password \
      --update-parallelism 1 \
      --update-order stop-first \
      --constraint 'node.role == manager' \
      --label traefik.enable=true \
      --label traefik.http.routers.backend.rule='PathPrefix(`/api`)' \
      --label traefik.http.routers.backend.entrypoints=web \
      --label traefik.http.services.backend.loadbalancer.server.port=4000 \
      --label traefik.http.routers.backend-secure.rule='PathPrefix(`/api`)' \
      --label traefik.http.routers.backend-secure.entrypoints=websecure \
      --label traefik.http.routers.backend-secure.tls=true \
      --label traefik.http.services.backend-secure.loadbalancer.server.port=4000 \
      $endpoint_mode \
      $release_tag_env \
      -e ADVERTISE_ADDR=$advertise_addr \
      -e POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password \
      $BACKEND_IMAGE

    # Frontend service: SPA on port 80 (Nginx)
    # Traefik routes all other requests to this service
    docker service create \
      --name gitpaas-frontend \
      --replicas 1 \
      --network gitpaas-network \
      --update-parallelism 1 \
      --update-order stop-first \
      --constraint 'node.role == manager' \
      --label traefik.enable=true \
      --label traefik.http.routers.frontend.rule='PathPrefix(`/`)' \
      --label traefik.http.routers.frontend.priority=1 \
      --label traefik.http.routers.frontend.entrypoints=web \
      --label traefik.http.services.frontend.loadbalancer.server.port=80 \
      --label traefik.http.routers.frontend-secure.rule='PathPrefix(`/`)' \
      --label traefik.http.routers.frontend-secure.priority=1 \
      --label traefik.http.routers.frontend-secure.entrypoints=websecure \
      --label traefik.http.routers.frontend-secure.tls=true \
      --label traefik.http.services.frontend-secure.loadbalancer.server.port=80 \
      $endpoint_mode \
      $FRONTEND_IMAGE

    sleep 4

    docker service create \
        --name gitpaas-traefik \
        --replicas 1 \
        --network gitpaas-network \
        --constraint 'node.role == manager' \
        --mount type=bind,source=/etc/gitpaas/traefik/traefik.yml,target=/etc/traefik/traefik.yml \
        --mount type=bind,source=/etc/gitpaas/traefik/dynamic,target=/etc/gitpaas/traefik/dynamic \
        --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock,readonly \
        --publish published=80,target=80,mode=host \
        --publish published=443,target=443,mode=host \
        $endpoint_mode \
        traefik:v3.6.7

    GREEN="\033[0;32m"
    YELLOW="\033[1;33m"
    BLUE="\033[0;34m"
    NC="\033[0m" # No Color

    format_ip_for_url() {
        local ip="$1"
        if echo "$ip" | grep -q ':'; then
            # IPv6
            echo "[${ip}]"
        else
            # IPv4
            echo "${ip}"
        fi
    }

    public_ip="${ADVERTISE_ADDR:-$(get_ip)}"
    formatted_addr=$(format_ip_for_url "$public_ip")
    echo ""
    printf "${GREEN}Congratulations, GitPaaS is installed!${NC}\n"
    printf "${BLUE}Wait 15 seconds for the server to start${NC}\n"
    printf "${YELLOW}Please go to http://${formatted_addr}${NC}\n\n"
}

update_gitpaas() {
    # Detect version tag
    VERSION_TAG=$(detect_version)
    GHCR_OWNER="${GHCR_OWNER:-gitpaas}"
    BACKEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-backend:${VERSION_TAG}"
    FRONTEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-frontend:${VERSION_TAG}"
    
    echo "Updating GitPaaS to version: ${VERSION_TAG}"
    
    # Pull images
    docker pull $BACKEND_IMAGE
    docker pull $FRONTEND_IMAGE

    # Update services
    docker service update --image $BACKEND_IMAGE gitpaas-backend
    docker service update --image $FRONTEND_IMAGE gitpaas-frontend

    echo "GitPaaS has been updated to version: ${VERSION_TAG}"
}

# Main script execution
if [ "$1" = "update" ]; then
    update_gitpaas
else
    install_gitpaas
fi