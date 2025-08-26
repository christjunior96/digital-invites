// Service Worker für Digital Invites PWA
// Ohne Caching - nur für PWA-Funktionalität

const CACHE_NAME = 'digital-invites-v1';

// Install Event - PWA Installation
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

// Activate Event - PWA Aktivierung
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Kein Caching, nur Network-First
self.addEventListener('fetch', (event) => {
  // Kein Caching - immer vom Netzwerk laden
  event.respondWith(fetch(event.request));
});

// Push Event - Für Push-Benachrichtigungen (optional)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');
  
  const options = {
    body: event.data ? event.data.text() : 'Neue Einladung verfügbar!',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Anzeigen',
        icon: '/favicon-32x32.png'
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/favicon-32x32.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Digital Invites', options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
