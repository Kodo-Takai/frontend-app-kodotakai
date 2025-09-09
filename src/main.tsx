// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'

import './index.css'
// ✅ Estilos globales (Sass). Cambia la ruta si usas otra.
import './styles/_index.scss'

// (Opcional) Si ya tienes Tailwind en index.css, déjalo también.
// import './index.css'

// 👉 Registrar el service worker de vite-plugin-pwa
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nueva versión disponible, recarga la app')
    // aquí podrías abrir un modal/toast y ofrecer "Actualizar ahora"
  },
  onOfflineReady() {
    console.log('La PWA ya está lista para funcionar sin conexión')
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
