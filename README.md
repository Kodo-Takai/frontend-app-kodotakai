### ViajaYa — Frontend (frontend-app-kodotakai)

Descripción
- ViajaYa Frontend es una SPA en React + TypeScript (Vite) con diseño responsivo, PWA opcional y componentes reutilizables para explorar destinos, gestionar agenda y perfiles.

Características
- React + TS + Vite
- PWA (service worker opcional)
- Estilos modulares (SCSS/CSS)
- Hooks de datos y contexto global
- Integración con API Backend
- Docker listo para producción

Arquitectura
- **Framework**: React + Vite
- **Estado**: Context/Redux (según carpeta `redux`)
- **Ruteo**: React Router
- **Build**: Vite
- **CI/CD**: GitHub Actions (si aplica)

Requisitos
- Node.js 18+
- PNPM o NPM
- Docker (opcional)

Variables de entorno (archivo `.env`)
- `VITE_API_BASE_URL=https://api.viajaya.com`
- `VITE_ENV=production`
- `VITE_MAPS_API_KEY=...` (si usa mapas)
- `VITE_SENTRY_DSN=...` (opcional)

Instalación y uso (desarrollo)
```bash
pnpm install
pnpm dev
```

Build y preview
```bash
pnpm build
pnpm preview
```

Docker (producción)
```bash
docker build -t viajaya/frontend .
docker run -d --name viajaya-frontend -p 8080:80 -e VITE_API_BASE_URL=https://api.viajaya.com viajaya/frontend
```

Estructura principal
- `src/components`, `src/pages`, `src/hooks`, `src/context`, `src/redux`
- `public/` (assets estáticos, manifest)
- `vite.config.ts`

Buenas prácticas
- Rutas basadas en `pages/`
- `.env` por entorno (no commitear secretos)
- Lint y formateo antes de commit
- Evitar llamadas directas: usar utils/hooks

PWA
- `serviceWorkerRegistration.js` y `manifest.json`
- Activar sólo en producción y medir caché

Accesibilidad y SEO
- Etiquetas semánticas
- Metadatos por página
- Imágenes optimizadas (ver `IMAGE_OPTIMIZATION.md`)

Despliegue
- Servir `dist/` detrás de Nginx/CDN
- Configurar `nginx.conf` para SPA (fallback a `index.html`)
- Inyectar `VITE_API_BASE_URL` en build o usar variables en runtime con un `config.json`

Licencia
- Ver `LICENSE` en el repositorio.
