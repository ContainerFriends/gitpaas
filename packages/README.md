# Packages

Este directorio contiene paquetes compartidos que pueden ser utilizados por múltiples aplicaciones en el monorepo.

## Estructura Recomendada

```
packages/
├── ui/                # Componentes UI compartidos
├── utils/             # Utilidades compartidas
├── types/             # Tipos TypeScript compartidos
├── config/            # Configuraciones compartidas
└── api-client/        # Cliente de API compartido
```

## Creando un Nuevo Paquete

Para crear un nuevo paquete:

1. Crea una nueva carpeta en `packages/`
2. Añade un `package.json` con nombre `@deploy-hub/package-name`
3. Configura el build y exports correctamente
4. Añade el paquete como dependencia en las apps que lo necesiten

## Ejemplo de package.json

```json
{
  "name": "@deploy-hub/utils",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```