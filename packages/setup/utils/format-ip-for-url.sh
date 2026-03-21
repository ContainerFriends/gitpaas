#!/bin/bash

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