/* ═══════════════════════════════════════════════════════════════════════════
   Jino Sabu — Service Worker
   ───────────────────────────────────────────────────────────────────────────
   CACHE_VERSION must change on every deploy. It names both the cache and the
   precache manifest, so bumping it guarantees returning visitors never keep a
   stale HTML shell. index.html also registers `sw.js?v=<SITE_VERSION>`, which
   forces this file itself to be re-fetched on a new release.

   Keep in sync: CACHE_VERSION here  ↔  window.SITE_VERSION in index.html
   ═══════════════════════════════════════════════════════════════════════════ */
const CACHE_VERSION = 'v6.9';
const CACHE_NAME = `jino-portfolio-${CACHE_VERSION}`;
const RUNTIME_CACHE = `jino-runtime-${CACHE_VERSION}`;

/* Precache: the shell + everything the first screen needs, including the
   self-hosted font and icon subsets (no third-party requests any more). */
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './fonts/inter-latin.woff2',
  './fonts/inter-latin-ext.woff2',
  './fonts/jetbrains-mono-latin.woff2',
  './fonts/jetbrains-mono-latin-ext.woff2',
  './fonts/fa-solid-subset.woff2',
  './fonts/fa-regular-subset.woff2',
  './fonts/fa-brands-subset.woff2',
  './feeds/repos.json',
  './feeds/store.json',
  './profile.jpg',
  './favicon.ico',
  './favicon.svg',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // addAll rejects the whole batch if a single URL 404s, so add individually.
    await Promise.all(PRECACHE.map(async (url) => {
      try { await cache.add(new Request(url, { cache: 'reload' })); } catch (e) { /* optional asset */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((k) => k !== CACHE_NAME && k !== RUNTIME_CACHE)
      .map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_RUNTIME') caches.delete(RUNTIME_CACHE);
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  /* HTML: network-first with a 3s timeout, so a deploy is picked up immediately
     but offline still works. */
  if (req.mode === 'navigate' || (sameOrigin && req.destination === 'document')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const fresh = await Promise.race([
          fetch(req),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);
        if (fresh && fresh.ok) cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        return (await cache.match(req)) || (await cache.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  /* Feeds: network-first (they change on a schedule), cached copy as fallback. */
  if (sameOrigin && url.pathname.includes('/feeds/')) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        return (await cache.match(req)) || (await caches.match(req)) || Response.error();
      }
    })());
    return;
  }

  /* Static assets (fonts, icons, images): cache-first, refresh in background. */
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) {
      fetch(req).then((res) => {
        if (res && res.ok) caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
      }).catch(() => {});
      return cached;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok && sameOrigin) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});
