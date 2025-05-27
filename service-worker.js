const CACHE_NAME = 'mobinogi-checklist-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/checklist.json',
  '/main.js',
  '/style.css',
  '/icons/arrow-up.svg',
  '/icons/arrow-down.svg',
  '/icons/arrow-left.svg',
  '/icons/arrow-right.svg',
  '/icons/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json',
  '/service-worker.js',
  '/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
