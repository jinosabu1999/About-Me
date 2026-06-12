/* ═══════════════════════════════════════════════════════════
   Service Worker — Jino Sabu | Digital Architect
   Strategy:
   - App shell (HTML/icons/manifest): stale-while-revalidate
   - CDN assets (fonts, FA, Prism, libs): cache-first (immutable-ish)
   - Live APIs (Gumroad prices, visit counter): network-only,
     never cached, so real data stays real.
   ═══════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'v1';
const SHELL_CACHE = 'shell-' + CACHE_VERSION;
const CDN_CACHE = 'cdn-' + CACHE_VERSION;

const SHELL_ASSETS = [
  './',
  './index.html',
  './site.webmanifest',
  './favicon.ico',
  './favicon.svg',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './profile.jpg'
];

// Hosts whose responses are safe to cache long-term
const CDN_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'public-files.gumroad.com',
  'ui-avatars.com',
  'api.qrserver.com'
];

// Hosts that must always hit the network (live data)
const NETWORK_ONLY_HOSTS = [
  'abacus.jasoncameron.dev',
  'jinosabu1999.gumroad.com',
  'gumroad.com',
  'api.gumroad.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      // Cache shell assets individually so one missing icon doesn't fail install
      .then((cache) => Promise.allSettled(SHELL_ASSETS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== CDN_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Live data: network only (fall through to browser default on failure)
  if (NETWORK_ONLY_HOSTS.includes(url.hostname)) return;

  // Navigations / app shell: stale-while-revalidate so updates land next visit
  if (req.mode === 'navigate' || url.origin === self.location.origin) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => null);
        if (cached) {
          fetchPromise.catch(() => {});
          return cached;
        }
        const fresh = await fetchPromise;
        if (fresh) return fresh;
        // Offline navigation fallback → cached index
        if (req.mode === 'navigate') {
          const shell = await cache.match('./index.html') || await cache.match('./');
          if (shell) return shell;
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  // CDN assets: cache-first
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(CDN_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        } catch (err) {
          return new Response('', { status: 504, statusText: 'Offline' });
        }
      })
    );
  }
});

// Allow the page to trigger an immediate update
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
