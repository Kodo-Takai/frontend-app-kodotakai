if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  // Registra el Service Worker solo si está en producción
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js').then((registration) => {
      console.log('Service Worker registrado con éxito:', registration);
    }).catch((error) => {
      console.log('Error al registrar el Service Worker:', error);
    });
  });
}
// EL ERROR ESTA EN .env