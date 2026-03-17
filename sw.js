// Freemovie.BD Service Worker
// Enables offline functionality and improves performance

const CACHE_NAME = 'cinemax-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/animations.css',
    '/js/main.js',
    '/js/data.js',
    '/manifest.json'
];

// Install Event - Cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        }).catch(err => {
            console.log('Cache installation error:', err);
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip requests for external resources that might fail
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request
                return fetch(event.request).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Cache successful responses
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                });
            })
            .catch(() => {
                // Offline fallback
                return new Response(
                    '<h1>Offline</h1><p>You are currently offline. Please check your connection.</p>',
                    {
                        headers: { 'Content-Type': 'text/html' }
                    }
                );
            })
    );
});

// Background Sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-newsletter') {
        event.waitUntil(syncNewsletter());
    }
});

async function syncNewsletter() {
    try {
        // Implement newsletter sync logic
        console.log('Syncing newsletter...');
    } catch (error) {
        console.error('Newsletter sync failed:', error);
    }
}

// Push Notifications (if implemented)
self.addEventListener('push', event => {
    const data = event.data?.json() ?? {};
    const options = {
        body: data.body || 'New movie alert!',
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        tag: 'cinemax-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'CineMax', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Check if window already open
            for (let client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window if not open
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

console.log('CineMax Service Worker loaded');
