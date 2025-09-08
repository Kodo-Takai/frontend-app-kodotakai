import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'   // ✅ ahora TS lo reconoce
import './index.css'
import App from './App.tsx'

// 👉 Registrar el service worker de vite-plugin-pwa
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nueva versión disponible, recarga la app')
    // aquí podrías mostrar un botón para refrescar manualmente
  },
  onOfflineReady() {
    console.log('La PWA ya está lista para funcionar sin conexión')
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
