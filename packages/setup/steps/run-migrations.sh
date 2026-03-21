#!/bin/bash

# Run Prisma migrations
run_migrations() {
    if [ -z "$BACKEND_IMAGE" ]; then
        echo "❌ BACKEND_IMAGE environment variable is required"
        return 1
    fi

    pull_image_if_missing "$BACKEND_IMAGE"

    echo "🔄 Running Prisma migrations..."

    MIGRATION_OUTPUT=$(docker run --rm \
        --network gitpaas-network \
        -e DATABASE_URL="postgres://gitpaas:${CURRENT_DB_PASSWORD}@gitpaas-postgres:5432/gitpaas" \
        "$BACKEND_IMAGE" \
        npx prisma migrate deploy --config=./prisma.config.ts 2>&1)

    if [ $? -eq 0 ]; then
        echo "✅ Migrations applied successfully"
    else
        echo "❌ Migration failed. Error details:"
        echo "-------------------------------------------"
        echo "$MIGRATION_OUTPUT"
        echo "-------------------------------------------"
        
        if echo "$MIGRATION_OUTPUT" | grep -q "P1001"; then
            echo "💡 Tip: Prisma cannot reach the database. Check if 'gitpaas-postgres' is healthy."
        fi
        
        return 1
    fi
}