/* ============================================================
   PLANTÃO CHECK — Service Worker v1
   Cache estratégico para funcionamento offline
   ============================================================ */

const CACHE_NAME   = 'plantaocheck-v10';
const CACHE_STATIC = 'plantaocheck-static-v10';

// Arquivos essenciais para funcionamento offline
// Derive base path from sw.js location (works on GitHub Pages subdirs)
const BASE = self.location.pathname.replace('/sw.js', '');

const STATIC_ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/app.html',
  BASE + '/pre-atendimento.html',
  BASE + '/css/style.css',
  BASE + '/css/print.css',
  BASE + '/js/app.js',
  BASE + '/js/auth.js',
  BASE + '/js/checklists.js',
  BASE + '/js/templates.js',
  BASE + '/js/artigos.js',
  BASE + '/js/quesitos.js',
  BASE + '/js/supabase.js',
];

// ── INSTALL: pré-cache dos arquivos estáticos ─────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Alguns arquivos não puderam ser cacheados:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpa caches antigos ───────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: estratégia cache-first para estáticos,
//          network-first para API ──────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase e EmailJS: sempre tentar network, sem cache
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('emailjs.com') ||
    url.hostname.includes('api.emailjs.com')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'offline' }),
          { headers: { 'Content-Type': 'application/json' }, status: 503 }
        );
      })
    );
    return;
  }

  // Fontes e CDNs externos: cache-first com fallback
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdn.jsdelivr.net')
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return response;
        }).catch(() => cached || new Response('', { status: 503 }));
      })
    );
    return;
  }

  // Arquivos locais (.html, .css, .js): cache-first, revalida em background
  if (
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css')  ||
    url.pathname.endsWith('.js')   ||
    url.pathname === '/'
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then(c => c.put(event.request, clone));
          }
          return response;
        }).catch(() => null);

        return cached || networkFetch;
      })
    );
    return;
  }

  // Default: network com fallback para cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ── MENSAGENS DO CLIENTE ──────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});
