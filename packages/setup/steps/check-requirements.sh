#!/bin/bash

check_requirements() {
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
}