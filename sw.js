const CACHE_NAME = 'tmt-calculadora-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación: guardar en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log('Error al cachear:', err);
      })
  );
  self.skipWaiting();
});

// Activación: limpiar cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: responder desde caché o red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, devolverlo
        if (response) {
          return response;
        }
        // Si no, ir a la red
        return fetch(event.request)
          .catch(() => {
            // Si falla la red y es una página, mostrar offline
            if (event.request.mode === 'navigate') {
              return new Response('Offline - La app está guardada para usar sin internet');
            }
          });
      })
  );
});