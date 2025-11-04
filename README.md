# Kodotakai

Proyecto frontend de la aplicación Kodotakai. Es una aplicación web moderna construida con React + TypeScript y Vite, pensada como frontend para un sistema de autenticación y experiencia de usuario (UX) profesional: login, registro, gestión de sesión, PWA y componentes reutilizables.

## 🔎 Resumen

- Stack: React 19, TypeScript, Vite, Tailwind/SASS (estilos), Redux Toolkit.
- PWA friendly: service worker y configuración para modo offline.
- Integración con Cloudinary para gestión de imágenes.
- Rutas y mapas: Google Maps y utilidades para localización y listas de sitios.

Este README incluye instrucciones para instalar, desarrollar, construir y desplegar localmente la app.

## Requisitos

- Node.js (recomendado >= 18). Comprueba tu versión con `node -v`.
- pnpm (recomendado, ya que el repo contiene `pnpm-lock.yaml`) o npm/yarn según prefieras.

Instalar pnpm (opcional):

```powershell
npm install -g pnpm
```

## Inicio rápido

1. Instalar dependencias

```powershell
# con pnpm (recomendado)
pnpm install

# o con npm
npm install
```

2. Levantar servidor de desarrollo

```powershell
# pnpm
pnpm run dev

# npm
npm run dev
```

3. Abrir en el navegador

Visita http://localhost:5173/ (Vite por defecto)

## Scripts disponibles (extraído de `package.json`)

- `dev` : inicia el servidor de desarrollo (vite).
- `build` : compila TypeScript y genera la build de Vite (`tsc -b && vite build`).
- `preview` : levanta un servidor de preview de la build (`vite preview`).
- `lint` : ejecuta ESLint sobre el proyecto.
- `type-check` : comprobación de tipos TypeScript (`tsc --noEmit`).
- `start` : alias que ejecuta `dev`.
- `setup` : atajo para instalar dependencias y ejecutar la comprobación de tipos (usa npm en el script original).

Ejemplo rápido para producción local:

```powershell
pnpm run build
pnpm run preview
```

> Nota: el repo incluye `Dockerfile` y `docker-compose.yaml` y una carpeta `nginx/` con configuración — ideal para despliegue en contenedor.

## Estructura del proyecto (resumen)

- `src/` – código fuente de la app
  - `components/` – componentes UI (cards, layout, form, ui común)
  - `pages/` – páginas principales (Home, Login, Register, Profile, Maps, etc.)
  - `context/`, `hooks/` – lógica compartida y hooks personalizados
  - `redux/` – store y slices
  - `config/` – configuración de Cloudinary y splash
  - `assets/`, `icons/` – fuentes, imágenes y assets
- `public/` – assets públicos y manifest PWA
- `nginx/` – configuración para servir la app en producción
- `Dockerfile`, `docker-compose.yaml` – contenedores y orquestación

Explora la carpeta `src/` para ver ejemplos de componentes y hooks (por ejemplo `useImageUpload.ts`, `useItineraryGeneration.ts`).

## PWA, Service Worker y Workbox

El proyecto incluye `serviceWorker.js` y hace uso de `workbox-window`. La configuración de `vite-plugin-pwa` también está en `devDependencies`.

Para probar la PWA en local:

1. Construye la app: `pnpm run build`.
2. Sirve con `pnpm run preview` o dentro del contenedor Nginx.

## Gestión de imágenes y Cloudinary

El proyecto integra Cloudinary (`@cloudinary/react`, `@cloudinary/url-gen`). Revisa `src/config/cloudinary.ts` para ver cómo configurar las credenciales. No incluyas claves en el repo; usa variables de entorno.

Hay un documento `IMAGE_OPTIMIZATION.md` en `src/` que describe prácticas de optimización de imágenes — léelo si vas a tocar imágenes o íconos.

## Desarrollo y mejores prácticas

- Usa `pnpm run lint` para detectar problemas de estilo.
- Ejecuta `pnpm run type-check` para validar tipos TypeScript.
- Añade tests y/o componentes pequeños y documenta cambios en el README si agregas features grandes.

## Despliegue con Docker (resumen)

El repo contiene `Dockerfile` y `docker-compose.yaml`. En general el flujo es:

1. `pnpm run build` para generar la carpeta `dist`.
2. Construir la imagen Docker (si usas Dockerfile):

```powershell
# desde la raíz del repo
docker build -t kodotakai-frontend .

# o con docker-compose
docker-compose up --build
```

La carpeta `nginx/` contiene `nginx.conf` para servir archivos estáticos y manejar rutas de SPA.

## Contribuir

1. Crea una rama a partir de `develop`.
2. Abre un PR con descripción clara y screenshots si aplica.
3. Si añades variables de entorno, documenta los nombres en este README o en `.env.example`.

## Problemas comunes / Troubleshooting

- Si Vite no arranca: comprueba la versión de Node y reinstala dependencias.
- Conflictos de lockfile: si usas pnpm, no mezcles con npm/yarn para instalar dependencias.
- Variables de entorno faltantes (Cloudinary, API back): crea un `.env` local con las variables necesarias.

## Referencias y documentación interna

- `src/IMAGE_OPTIMIZATION.md` – buenas prácticas para imágenes.
- `src/hooks/INTELLIGENT_FILTERING_SYSTEM.md` – doc interno para el sistema de filtrado.

## Licencia

Este proyecto incluye un archivo `LICENSE` en la raíz. Revisa el contenido para conocer los términos.

---
