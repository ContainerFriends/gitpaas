#!/bin/bash

OUTPUT="dist/install.sh"
VERSION=$1
# Definimos la base donde están tus archivos .sh
BASE_PATH="packages/setup"

mkdir -p dist

echo "#!/bin/bash" > $OUTPUT
echo "# GitPaaS All-in-one Installer" >> $OUTPUT
echo "# Version: $VERSION" >> $OUTPUT
echo "# Generated: $(date)" >> $OUTPUT
echo -e "export VERSION_TAG=\"$VERSION\"\n" >> $OUTPUT
echo -e "export DOCKER_VERSION_TAG=\"$VERSION\"\n" >> $OUTPUT

# Función para añadir archivos evitando el shebang y los 'source'
bundle_folder() {
    local folder="$BASE_PATH/$1"
    if [ -d "$folder" ]; then
        echo "# --- Folder: $1 ---" >> $OUTPUT
        for f in "$folder"/*.sh; do
            echo "# File: $f" >> $OUTPUT
            # 1. Quitamos el shebang (#!/bin/bash)
            # 2. Quitamos las líneas que empiezan por 'source ' o '. ' porque ya no son necesarias
            grep -v '^#!' "$f" | grep -vE '^source |^\. ' >> $OUTPUT
            echo -e "\n" >> $OUTPUT
        done
    fi
}

# ORDEN CRÍTICO DE BUNDLING (ahora busca dentro de packages/setup/...)
bundle_folder "configs"
bundle_folder "utils"
bundle_folder "steps"

# Añadir la lógica principal (que asumo es packages/setup/install.sh)
echo "# --- Main Logic ---" >> $OUTPUT
if [ -f "$BASE_PATH/install.sh" ]; then
    grep -v '^#!' "$BASE_PATH/install.sh" | grep -vE '^source |^\. ' >> $OUTPUT
else
    echo "❌ Error: $BASE_PATH/install.sh not found!"
    exit 1
fi

echo "✅ Bundle created at $OUTPUT"