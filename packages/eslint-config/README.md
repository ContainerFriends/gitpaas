# @deploy-hub/eslint-config

Configuraciones compartidas de ESLint para el monorepo Deploy Hub.

## Configuraciones Disponibles

### Base (`@deploy-hub/eslint-config/base`)
Configuración base con reglas TypeScript fundamentales:
- Reglas recomendadas de ESLint y TypeScript
- Configuración de variables no utilizadas
- Reglas de calidad de código básicas- **Configuraci贸n JSON/JSONC**: Reglas para archivos .json y .jsonc
- **Configuraci贸n package.json**: Orden espec铆fico de claves y validaci贸n
### Frontend (`@deploy-hub/eslint-config/frontend`)
Extiende la configuración base añadiendo:
- Reglas específicas para React
- Plugin react-hooks
- Plugin react-refresh para HMR
- Configuración para navegadores
- Ignorar archivos de build del frontend

### Backend (`@deploy-hub/eslint-config/backend`)
Extiende la configuración base añadiendo:
- Configuración específica para Node.js
- Permite uso de console.log
- Reglas async/await optimizadas
- Configuración para entorno de servidor
- Ignorar archivos de build del backend

## Uso

### En el Frontend
```javascript
// eslint.config.js
import config from '@deploy-hub/eslint-config/frontend';

export default config;
```

### En el Backend
```javascript
// eslint.config.js
import config from '@deploy-hub/eslint-config/backend';

export default config;
```

### Extensión Personalizada
```javascript
// eslint.config.js
import frontendConfig from '@deploy-hub/eslint-config/frontend';

export default [
  ...frontendConfig,
  {
    rules: {
      // Tus reglas personalizadas
      'no-console': 'error'
    }
  }
];
```

## Reglas Incluidas

### Base
- `@typescript-eslint/no-unused-vars`: Error con ignorePattern para `_`
- `prefer-const`: Error
- `no-var`: Error
- `eqeqeq`: Error (siempre ===)
- `curly`: Error (siempre usar llaves)
- **JSON**: Formato, indentaci贸n, ordenaci贸n de claves
- **package.json**: Orden espec铆fico de propiedades del package

### Frontend Específico
- `react-hooks/rules-of-hooks`: Error
- `react-hooks/exhaustive-deps`: Warning
- `react-refresh/only-export-components`: Warning

### Backend Específico
- `no-console`: Off (permitido en backend)
- `@typescript-eslint/no-floating-promises`: Warning
- `@typescript-eslint/await-thenable`: Error
- `@typescript-eslint/prefer-nullish-coalescing`: Error

## Desarrollo

Este package no requiere build steps ya que exporta directamente configuraciones JavaScript.