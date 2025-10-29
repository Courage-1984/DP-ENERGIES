// Service Worker for DP ENERGIES
const CACHE_NAME = 'dp-energies-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/404.html',
    '/error.html',
    '/style.css',
    '/main.js',
    '/assets/images/favicon_io/logo_primary.png',
    '/assets/images/favicon_io/favicon.ico',
    '/assets/images/favicon_io/android-chrome-192x192.png',
    '/assets/images/favicon_io/android-chrome-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch(function (error) {
                console.warn('Service Worker: Cache failed', error);
            })
    );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', function (event) {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external resources like Google Analytics, CDNs, etc.
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .catch(function () {
                        // If both cache and network fail, return a fallback
                        if (event.request.destination === 'document') {
                            // Check if it's a 404-like request, serve 404 page
                            if (event.request.url.includes('404') ||
                                (!event.request.url.endsWith('/') && !event.request.url.includes('.'))) {
                                return caches.match('/404.html');
                            }
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
