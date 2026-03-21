#!/bin/bash

# Setup application directories
setup_directories() {
    local directories=(
        "$BASE_PATH"
        "$MAIN_TRAEFIK_PATH"
        "$DYNAMIC_TRAEFIK_PATH"
        "$LOGS_PATH"
        "$APPLICATIONS_PATH"
        "$SSH_PATH"
        "$CERTIFICATES_PATH"
        "$MONITORING_PATH"
        "$SCHEDULES_PATH"
        "$VOLUME_BACKUPS_PATH"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir" || { echo "Failed to create directory: $dir"; continue; }
        fi

        if [ "$dir" = "$SSH_PATH" ]; then
            chmod 700 "$SSH_PATH"
        fi
    done

    echo "✅ Directories configured successfully"
}