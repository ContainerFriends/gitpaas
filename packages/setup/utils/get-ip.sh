#!/bin/bash

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