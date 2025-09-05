// Service Worker for Personal Bank PWA
const CACHE_NAME = 'personal-bank-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/loans.html',
  '/financial_education.html',
  '/careers.html',
  '/investor_relations.html',
  '/press.html',
  '/privacy.html',
  '/register.html',
  '/terms.html',
  '/documentation.html',
  '/static/css/style.css',
  '/static/js/script.js',
  '/images/favicon.ico',
  '/images/logo.png',
  '/images/logo2.jpg',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // For HTML pages, return offline page
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});