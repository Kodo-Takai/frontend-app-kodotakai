import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // Agregar el plugin PWA

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true, // Habilitar HTTPS
    // Si necesitas especificar los certificados, descomenta y configura las rutas adecuadas
    // https: {
    //   key: fs.readFileSync('path/to/localhost-key.pem'),
    //   cert: fs.readFileSync('path/to/localhost-cert.pem')
    // }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Registra el Service Worker con auto actualización
      manifest: {
        name: 'My PWA App', // Nombre completo de la aplicación
        short_name: 'PWA', // Nombre corto de la aplicación (se muestra en la pantalla de inicio)
        description: 'An awesome Progressive Web App', // Descripción de la PWA
        theme_color: '#ffffff', // Color del tema (para el navegador)
        background_color: '#ffffff', // Color de fondo de la PWA
        icons: [
          {
            src: 'icons/icon-192x192.png', // Ruta del ícono en formato PNG
            sizes: '192x192', // Tamaño del ícono
            type: 'image/png', // Tipo de archivo
          },
          {
            src: 'icons/icon-512x512.png', // Ruta del ícono grande
            sizes: '512x512', // Tamaño del ícono
            type: 'image/png', // Tipo de archivo
          },
        ],
      },
    }),
  ],
});
