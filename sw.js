// ================================================================
// Service Worker - حصون الإيمان PWA
// يضمن عمل التطبيق بدون إنترنت بعد أول تحميل
// ================================================================

const CACHE_NAME = 'husunaliman-v2';

const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './styles.css',
  './game.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // ملفات JS المعيارية
  './js/app.js',
  './js/config/constants.js',
  './js/data/courses.js',
  './js/state/store.js',
  './js/state/actions.js',
  './js/services/storage.js',
  './js/services/scheduler.js',
  './js/services/parser.js',
  './js/components/home.js',
  './js/components/courses.js',
  './js/components/course-detail.js',
  './js/components/plan.js',
  './js/components/contact.js',
  './js/components/shared/CourseCard.js',
  './js/ui/modal.js',
  './js/ui/navigation.js',
  './js/ui/progress.js',
  // الخطوط والأيقونات
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing حصون الإيمان v2...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const localAssets = ASSETS_TO_CACHE.filter(url => !url.startsWith('http'));
      const externalAssets = ASSETS_TO_CACHE.filter(url => url.startsWith('http'));
      return cache.addAll(localAssets).then(() =>
        Promise.allSettled(
          externalAssets.map(url =>
            fetch(url).then(res => cache.put(url, res)).catch(() => {})
          )
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request.clone()).then((networkResponse) => {
        if (networkResponse?.status === 200 && networkResponse.type !== 'error') {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.destination === 'document') return caches.match('./index.html');
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
