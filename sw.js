/* ============================================================
   SERVICE WORKER — MathSpace
   Strategi: network-first untuk HTML/JS, cache-first untuk CSS
   ============================================================ */

const CACHE_VERSION = 'mathspace-v2';
const CACHE_NAME = `mathspace-${CACHE_VERSION}`;

// File inti yang di-cache saat install
const CORE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './data/materials.js',
  './data/formulas.js',
  './data/activities.js',
  './data/challenges.js',
  './data/questions.js',
  './js/utils.js',
  './js/formula-engine.js',
  './js/theme.js',
  './js/progress.js',
  './js/auth.js',
  './js/profile.js',
  './js/explorer.js',
  './js/detective.js',
  './js/challenge.js',
  './js/calculator.js',
  './js/exercise.js',
  './js/dashboard-guru.js',
  './js/dashboard-siswa.js',
  './js/landing.js',
  './js/home.js',
  './js/app.js'
];

/* ----- INSTALL ----- */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .catch(err => console.warn('[SW] Gagal cache core assets:', err))
  );
  self.skipWaiting();
});

/* ----- ACTIVATE ----- */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ----- FETCH ----- */
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Skip non-GET
  if (req.method !== 'GET') return;

  // Skip Supabase / CDN eksternal (biar tidak cache API call)
  const url = new URL(req.url);
  if (url.hostname.includes('supabase.co') ||
      url.hostname.includes('jsdelivr.net') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  // Network-first untuk HTML/JS (biar update langsung kelihatan)
  if (req.destination === 'document' || req.url.endsWith('.js')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first untuk aset lain (CSS, gambar, font)
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

/* ----- MESSAGE: skip waiting ----- */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});