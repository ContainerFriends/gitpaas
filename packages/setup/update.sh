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