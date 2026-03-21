#!/bin/bash

# 1. Definición de funciones primero
clean_version_for_docker() {
    local version="$1"
    # Elimina la 'v' inicial solo si va seguida de un número
    echo "$version" | sed 's/^v\([0-9]\)/\1/'
}

bundle_folder() {
    local folder="$BASE_PATH/$1"
    if [ -d "$folder" ]; then
        echo "# --- Folder: $1 ---" >> $OUTPUT
        for f in "$folder"/*.sh; do
            echo "# File: $f" >> $OUTPUT
            grep -v '^#!' "$f" | grep -vE '^source |^\. ' >> $OUTPUT
            echo -e "\n" >> $OUTPUT
        done
    fi
}

# 2. Configuración de variables
OUTPUT="dist/install.sh"
VERSION=$1
BASE_PATH="packages/setup"

# Validar que recibimos versión
if [ -z "$VERSION" ]; then
    echo "❌ Error: No version provided"
    exit 1
fi

# 3. Procesamiento de la versión Docker
DOCKER_VERSION_TAG=$(clean_version_for_docker "$VERSION")

mkdir -p dist

# 4. Escritura del bundle
echo "#!/bin/bash" > $OUTPUT
echo "# GitPaaS All-in-one Installer" >> $OUTPUT
echo "# Version: $VERSION" >> $OUTPUT
echo "# Generated: $(date)" >> $OUTPUT
# Ahora estas variables sí tendrán valor
echo "export VERSION_TAG=\"$VERSION\"" >> $OUTPUT
echo "export DOCKER_VERSION_TAG=\"$DOCKER_VERSION_TAG\"" >> $OUTPUT
echo -e "\n" >> $OUTPUT

# 5. Bundling de carpetas
bundle_folder "configs"
bundle_folder "utils"
bundle_folder "steps"

# 6. Lógica principal
echo "# --- Main Logic ---" >> $OUTPUT
if [ -f "$BASE_PATH/install.sh" ]; then
    grep -v '^#!' "$BASE_PATH/install.sh" | grep -vE '^source |^\. ' >> $OUTPUT
else
    echo "❌ Error: $BASE_PATH/install.sh not found!"
    exit 1
fi

echo "✅ Bundle created at $OUTPUT with Docker Tag: $DOCKER_VERSION_TAG"