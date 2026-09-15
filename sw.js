const CACHE = 'snl-nfl-v9';
const ASSETS = [
  '/SNL-NFL-2026-Draft/',
  '/SNL-NFL-2026-Draft/index.html',
  '/SNL-NFL-2026-Draft/icon-192.png',
  '/SNL-NFL-2026-Draft/icon-512.png',
  '/SNL-NFL-2026-Draft/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for ESPN API calls, cache-first for app shell
  if (e.request.url.includes('espn.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('[]')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
