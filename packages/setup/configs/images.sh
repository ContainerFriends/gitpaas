#!/bin/bash

GHCR_OWNER="${GHCR_OWNER:-containerfriends}"
BACKEND_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-backend:${DOCKER_VERSION_TAG}"
INSTALLER_IMAGE="ghcr.io/${GHCR_OWNER}/gitpaas-installer:${DOCKER_VERSION_TAG}"