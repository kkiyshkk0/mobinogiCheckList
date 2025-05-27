const CACHE_NAME = 'mobinogi-checklist-cache-v1';
const urlsToCache = [
  '.',
  './index.html',
  './checklist.json',
  './manifest.json',
  './styles.css',    // 스타일 파일 있으면
  './script.js',     // js 파일 있으면 따로 분리해서
  // 아이콘 파일들
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 설치 시 캐시 저장
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  );
});

// 요청 시 캐시 우선 응답
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => response || fetch(event.request))
  );
});
