#!/bin/bash

source ./configs/gitpaas.sh
source ./configs/paths.sh
source ./configs/traefik.sh
source ./configs/images.sh

source ./utils/colors.sh
source ./utils/command-exists.sh
source ./utils/get-ip.sh
source ./utils/get-private-ip.sh
source ./utils/format-ip-for-url.sh
source ./utils/check-proxmox.sh
source ./utils/generate-random-password.sh
source ./utils/pull-image.sh
source ./utils/ensure-postgres-secret.sh
source ./utils/wait-for-postgres.sh
source ./utils/connect-to-network.sh
source ./utils/clean-version-for-docker.sh

source ./steps/download-release.sh
source ./steps/setup-directories.sh
source ./steps/create-traefik-middlewares.sh
source ./steps/create-traefik-config.sh
source ./steps/initialize-network.sh
source ./steps/initialize-traefik.sh
source ./steps/initialize-redis.sh
source ./steps/initialize-postgres.sh
source ./steps/run-migrations.sh
source ./steps/initialize-backend.sh
source ./steps/initialize-github-installer.sh

install_gitpaas() {
    echo "🚀 Starting GitPaaS ${VERSION_TAG} configuration"

    if [ "$(id -u)" != "0" ]; then
        echo "❌ This script must be run as root" >&2
        exit 1
    fi

    # Check if is Mac OS
    if [ "$(uname)" = "Darwin" ]; then
        echo "❌ This script must be run on Linux" >&2
        exit 1
    fi

    # Check if is running inside a container
    if [ -f /.dockerenv ]; then
        echo "❌ This script must be run on Linux" >&2
        exit 1
    fi

    # Check if something is running on port 80
    if ss -tulnp | grep ':80 ' >/dev/null; then
        echo "❌ Error: something is already running on port 80" >&2
        exit 1
    fi

    # Check if something is running on port 443
    if ss -tulnp | grep ':443 ' >/dev/null; then
        echo "❌ Error: something is already running on port 443" >&2
        exit 1
    fi

    if command_exists docker; then
        echo "✅ Docker already installed"
    else
        echo "📦 Installing Docker (this may take a minute)..."
        # Capturamos errores en una variable, silenciando el progreso normal
        if ! DOCKER_INSTALL_ERR=$(curl -sSL https://get.docker.com | sh -s -- --version 28.5.0 2>&1 >/dev/null); then
            echo "❌ Docker installation failed:"
            echo "$DOCKER_INSTALL_ERR"
            exit 1
        fi
        echo "✅ Docker installed successfully"
    fi

    if command_exists jq; then
        echo "✅ jq already installed"
    else
        echo "📦 Installing jq..."
        if command_exists apt-get; then
            apt-get install -y jq >/dev/null 2>&1
        elif command_exists yum; then
            yum install -y jq >/dev/null 2>&1
        elif command_exists apk; then
            apk add --no-cache jq >/dev/null 2>&1
        else
            echo "⚠️ Could not install jq automatically. Please install it manually." >&2
            exit 1
        fi
        echo "✅ jq installed"
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

    advertise_addr="${ADVERTISE_ADDR:-$(get_private_ip)}"

    if [ -z "$advertise_addr" ]; then
        echo "❌ ERROR: We couldn't find a private IP address."
        echo "Please set the ADVERTISE_ADDR environment variable manually."
        echo "Example: export ADVERTISE_ADDR=192.168.1.100"
        exit 1
    fi

    export ADVERTISE_ADDR="$advertise_addr"
    echo "✅ Using advertise address: $advertise_addr"

    # Allow custom Docker Swarm init arguments via DOCKER_SWARM_INIT_ARGS environment variable
    # Example: export DOCKER_SWARM_INIT_ARGS="--default-addr-pool 172.20.0.0/16 --default-addr-pool-mask-length 24"
    # This is useful to avoid CIDR overlapping with cloud provider VPCs (e.g., AWS)
    swarm_init_args="${DOCKER_SWARM_INIT_ARGS:-}"
    
    if [ -n "$swarm_init_args" ]; then
        echo "Using custom swarm init arguments: $swarm_init_args"
        docker swarm init --advertise-addr $advertise_addr $swarm_init_args > /dev/null 2>&1
    else
        docker swarm init --advertise-addr $advertise_addr > /dev/null 2>&1
    fi
    
     if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to initialize Docker Swarm" >&2
        exit 1
    fi

    echo "✅ Docker Swarm initialized successfully"

    setup_directories
    download_release "$VERSION_TAG"
    create_traefik_default_middlewares
    create_traefik_default_config
    initialize_network
    initialize_traefik
    initialize_redis
    initialize_postgres
    wait_for_postgres
    connect_to_network
    run_migrations
    initialize_backend
    #initialize_github_installer

    public_ip="${ADVERTISE_ADDR:-$(get_ip)}"

    # Check GitHub App installation status
    printf "${BLUE}🔍 Checking GitHub App installation status...${NC}\n"

    max_attempts=10
    attempt=0
    health_response=""

    while [ $attempt -lt $max_attempts ]; do
        health_response=$(curl -ksf --connect-timeout 5 'https://localhost/v1/health?token="test"' 2>/dev/null)
        if [ -n "$health_response" ]; then
            break
        fi
        attempt=$((attempt + 1))
        echo "⏳ Waiting for backend to be ready... ($attempt/$max_attempts)"
        sleep 5
    done

    if [ -z "$health_response" ]; then
        printf "${YELLOW}⚠️ Could not reach the backend. Check the service status with: docker service ls${NC}\n"
    else
        is_installed=$(echo "$health_response" | jq -r '.services.githubApp.isInstalled')
        install_url=$(echo "$health_response" | jq -r '.services.githubApp.installUrl')

        if [ "$is_installed" = "false" ]; then
            printf "\n"
            printf "${YELLOW}⚠️ GitHub App is not installed yet.${NC}\n"
            printf "${YELLOW}To complete the setup, visit the following URL in your browser:${NC}\n\n"
            printf "${GREEN}👉 ${install_url}${NC}\n\n"
            printf "${BLUE}Follow the GitHub App installation flow and GitPaaS will be ready.${NC}\n"
        else
            printf "${GREEN}✅ GitHub App is installed and ready!${NC}\n"
            echo "✅ Setup completed"
        fi
    fi
}

update_gitpaas() {
    # Detect version tag
    VERSION_TAG=$(detect_version)
    DOCKER_VERSION_TAG=$(clean_version_for_docker "$VERSION_TAG")
    GHCR_OWNER="${GHCR_OWNER:-containerfriends}"
    BACKEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-backend:${DOCKER_VERSION_TAG}"
    INSTALLER_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-installer:${DOCKER_VERSION_TAG}"
    
    echo "Updating GitPaaS to version: ${VERSION_TAG}"
    
    # Pull images
    docker pull $BACKEND_IMAGE
    docker pull $INSTALLER_IMAGE

    # Update services
    docker service update --image $BACKEND_IMAGE gitpaas-backend
    docker service update --image $INSTALLER_IMAGE gitpaas-installer

    echo "GitPaaS has been updated to version: ${VERSION_TAG}"
}

# Main script execution
if [ "$1" = "update" ]; then
    update_gitpaas
else
    install_gitpaas
fi