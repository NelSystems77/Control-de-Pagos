const CACHE_NAME = "pagos-v3"; // version
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./notifications.js",
    "./manifest.json",
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
];

// Instalación: Cacheamos los recursos esenciales
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Caché abierto con éxito");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Obliga al nuevo SW a tomar el control de inmediato
});

// Activación: Limpieza de cachés antiguos
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Borrando caché antiguo:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estrategia de red: Cache First, falling back to network
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Retorna el recurso desde el caché si existe, sino lo busca en la red
            return response || fetch(event.request).catch(() => {
                // Opcional: Podrías retornar una página offline aquí
            });
        })
    );
});