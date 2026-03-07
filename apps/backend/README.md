# Backend API - Deploy Hub

API REST construida con Express.js y TypeScript para la gestión de deployments de contenedores.

## Características

- ⚡ Express.js con TypeScript
- 🛡️ Middlewares de seguridad (Helmet, CORS)
- 📝 Logging con Morgan
- 🗜️ Compresión de respuestas
- 🔄 Hot reload en desarrollo con tsx
- 📊 Endpoint de health check
- 🎯 Estructura modular y escalable

## Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Ejecutar versión compilada
npm run start

# Linting
npm run lint

# Verificación de tipos
npm run type-check

# Limpiar build
npm run clean
```

## Endpoints

### Health Check
- `GET /health` - Información del estado del servidor

### Deployments
- `GET /api/deployments` - Lista todos los deployments
- `POST /api/deploy` - Inicia un nuevo deployment

**Ejemplo POST /api/deploy:**
```json
{
  "projectId": "1",
  "image": "nginx",
  "tag": "latest"
}
```

### Proyectos
- `GET /api/projects` - Lista todos los proyectos

## Estructura del Código

```
src/
├── index.ts          # Punto de entrada principal
├── routes/           # Definición de rutas (futuro)
├── controllers/      # Lógica de controladores (futuro)
├── middleware/       # Middlewares personalizados (futuro)
├── models/           # Modelos de datos (futuro)
└── utils/           # Utilidades compartidas (futuro)
```

## Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
PORT=3001
NODE_ENV=development
```

## Desarrollo

El servidor incluye hot reload automático en modo desarrollo. Cualquier cambio en los archivos `.ts` reiniciará automáticamente el servidor.

```bash
npm run dev
```

Servidor corriendo en: http://localhost:3001
Health check: http://localhost:3001/health

## Próximas Funcionalidades

- 🗄️ Integración con base de datos
- 🔐 Autenticación y autorización
- 🐳 Integración con Docker API
- ☸️ Integración con Kubernetes
- 📊 Métricas y monitoreo
- 🧪 Tests unitarios e integración