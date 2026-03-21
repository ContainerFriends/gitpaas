#!/bin/bash

# Create Traefik default middlewares configuration
create_traefik_default_middlewares() {
    local middlewares_path="$DYNAMIC_TRAEFIK_PATH/middlewares.yml"

    if [ -f "$middlewares_path" ]; then
        return
    fi

    mkdir -p "$DYNAMIC_TRAEFIK_PATH"

    cat > "$middlewares_path" << 'EOF'
http:
  middlewares:
    redirect-to-https:
      redirectScheme:
        scheme: https
        permanent: true
EOF

    echo "✅ Traefik default middlewares created"
}