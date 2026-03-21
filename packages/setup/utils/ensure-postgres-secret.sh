#!/bin/bash

# Ensure Postgres Docker secret exists
ensure_postgres_secret() {
    local secret_name="gitpaas_postgres_password"

    if docker secret inspect "$secret_name" > /dev/null 2>&1; then
        echo "✅ PostgreSQL secret already exists"
        return 0
    fi

    export CURRENT_DB_PASSWORD=$(openssl rand -base64 24 | tr '+/' '-_' | tr -d '=')

    echo "$CURRENT_DB_PASSWORD" | docker secret create "$secret_name" - > /dev/null
    echo "✅ PostgreSQL secret created"

    DATABASE_URL="postgres://gitpaas:${CURRENT_DB_PASSWORD}@gitpaas-postgres:5432/gitpaas"
    export DATABASE_URL
    echo "✅ DATABASE_URL configured"
}