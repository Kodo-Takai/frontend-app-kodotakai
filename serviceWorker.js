// Nombre del cache (puedes modificarlo si lo deseas)
const CACHE_NAME = 'my-pwa-cache-v1';

// Archivos que se deben almacenar en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Agrega aquí otros archivos que quieras cachar
];

// Evento de instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Eliminar caches antiguos
          }
        })
      );
    })
  );
  console.log('Service Worker: Activo');
});

// Evento de solicitud (fetch) para manejar la respuesta en caché o desde la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si el archivo está en caché, devolverlo
      if (cachedResponse) {
        console.log('Service Worker: Respuesta desde el caché', event.request.url);
        return cachedResponse;
      }
      
      // Si no está en caché, hacer la solicitud a la red
      return fetch(event.request).then((networkResponse) => {
        // Guardar la respuesta de la red en caché para futuras solicitudes
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          console.log('Service Worker: Guardando en caché', event.request.url);
          return networkResponse;
        });
      });
    })
  );
});
