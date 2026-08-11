const CACHE_NAME = 'anglers-jigsaw-v2-0-3';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/data.js',
  './js/app.js',
  './assets/images/logo.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/fish/largemouth-bass.svg',
  './assets/fish/bluegill.svg',
  './assets/fish/channel-catfish.svg',
  './assets/fish/rainbow-trout.svg',
  './assets/fish/brook-trout.svg',
  './assets/fish/red-drum.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  const networkFirst =
    request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/css/styles.css') ||
    url.pathname.endsWith('/js/app.js') ||
    url.pathname.endsWith('/js/data.js');

  if (networkFirst) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request))
  );
});
