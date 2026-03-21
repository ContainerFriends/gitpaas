#!/bin/bash
# scripts/bundle.sh

OUTPUT="dist/install.sh"
VERSION=$1

mkdir -p dist

echo "#!/bin/bash" > $OUTPUT
echo "# GitPaaS All-in-one Installer" >> $OUTPUT
echo "# Version: $VERSION" >> $OUTPUT
echo "# Generated: $(date)" >> $OUTPUT
echo -e "export VERSION_TAG=\"$VERSION\"\n" >> $OUTPUT

# Función para añadir archivos de una carpeta evitando el shebang
bundle_folder() {
    local folder=$1
    if [ -d "$folder" ]; then
        echo "# --- Folder: $folder ---" >> $OUTPUT
        for f in "$folder"/*.sh; do
            echo "# File: $f" >> $OUTPUT
            grep -v '^#!' "$f" >> $OUTPUT
            echo -e "\n" >> $OUTPUT
        done
    fi
}

# ORDEN CRÍTICO DE BUNDLING
bundle_folder "configs"
bundle_folder "utils"
bundle_folder "steps"

# Añadir la lógica principal al final (asumiendo que se llama main_install.sh)
echo "# --- Main Logic ---" >> $OUTPUT
grep -v '^#!' "main_install.sh" >> $OUTPUT

echo "✅ Bundle created at $OUTPUT"