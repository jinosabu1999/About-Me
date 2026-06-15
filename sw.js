/*
  Jino Sabu Portfolio — Service Worker
  PWA/offline support for GitHub Pages or any HTTPS host.

  This version is configured for the files you listed in your repo.

  It:
  - Pre-caches the main app shell and icon assets.
  - Falls back to cached index.html for offline page navigation.
  - Runtime-caches same-origin files and selected CDN assets.
  - Cleans old caches after updates.
*/

const SW_VERSION = 'jino-portfolio-v1.0.1';
const APP_SHELL_CACHE = `${SW_VERSION}-app-shell`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;

const APP_SHELL_URLS = [
  './',
  './index.html',

  // Profile / primary visual asset
  './profile.jpg',

  // Favicons + app icons
  './favicon.ico',
  './favicon.svg',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './favicon-48x48.png',
  './favicon-64x64.png',
  './favicon-96x96.png',
  './favicon-128x128.png',
  './favicon-256x256.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './maskable-icon-512x512.png',
  './apple-touch-icon.png',
  './safari-pinned-tab.svg',

  // Manifest / Microsoft tile config
  './site.webmanifest',
  './browserconfig.xml'
];

const CDN_HOSTS = new Set([
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'gumroad.com',
  'static.cloudflareinsights.com'
]);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_SHELL_CACHE);

    // Cache one-by-one so a missing optional file does not break install.
    await Promise.allSettled(
      APP_SHELL_URLS.map(url => cache.add(url))
    );

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const allowedCaches = new Set([APP_SHELL_CACHE, RUNTIME_CACHE]);
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames
        .filter(name => !allowedCaches.has(name))
        .map(name => caches.delete(name))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle GET requests. Let POST/PUT/etc pass through untouched.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Full-page navigation: network first, then cached index.html fallback.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Same-origin assets: stale-while-revalidate.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Selected CDN assets used by the site: stale-while-revalidate.
  if (CDN_HOSTS.has(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

async function networkFirstNavigation(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(APP_SHELL_CACHE);
    cache.put(request, fresh.clone()).catch(() => {});
    return fresh;
  } catch (error) {
    const cachedRequest = await caches.match(request);
    if (cachedRequest) return cachedRequest;

    const cachedIndex = await caches.match('./index.html');
    if (cachedIndex) return cachedIndex;

    return offlineHtmlResponse();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then(response => {
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise || offlineHtmlResponse();
}

function offlineHtmlResponse() {
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Offline | Jino Sabu</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #030305;
      color: #f5f5f5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 24px;
      text-align: center;
    }
    .card {
      max-width: 420px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 28px;
      padding: 28px;
      background: linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
      box-shadow: 0 18px 50px rgba(0,0,0,.35);
    }
    h1 { margin: 0 0 10px; font-size: 1.6rem; }
    p { margin: 0 0 18px; color: #b8b8c3; line-height: 1.55; }
    button {
      border: 0;
      border-radius: 999px;
      padding: 12px 18px;
      font-weight: 800;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>You are offline</h1>
    <p>The portfolio shell is not available in cache yet. Reconnect once, reload the site, and it will work better offline next time.</p>
    <button onclick="location.reload()">Try again</button>
  </main>
</body>
</html>`, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
