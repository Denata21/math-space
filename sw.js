/* ============================================================
   SERVICE WORKER — Cache offline
   ============================================================ */

const CACHE_NAME = 'math-space-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './data/materials.js',
  './data/questions.js',
  './data/formulas.js',
  './js/app.js',
  './js/admin.js',
  './js/calculator.js',
  './js/exercise.js',
  './js/material.js',
  './js/formula-engine.js',
  './js/formula-ui.js',
  './js/progress.js',
  './js/importexport.js',
  './js/theme.js',
  './js/grafik-statistika.js',
  './js/calc-kesebangunan.js',
  './js/mode-guru.js',
  './js/calculators/calc-statistika.js',
  './js/calculators/calc-pencacahan.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});