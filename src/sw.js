const assets = serviceWorkerOption.assets;
const CACHE_NAME = 'vivino-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('SW installed');

  event.waitUntil(precache());
});

//delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // proxy our fetch requests and:
   // - return response from cache if found
   // - return index.html fallback for sub-routes
   // - ignore requests and responses coming
   //   from our dev server, and chrome-extensions
   // - fetch other requests and cache them if needed

  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    return cache.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      if (!navigator.isOnline && isHtmlRequest(event.request)) {
        return cache.match(new Request('/index.html'));
      }

      if (shouldIgnoreRequest(event.request)) {
        return fetch(event.request);
      }

      return fetchAndUpdate(event.request);
    });
  }));
});

function shouldIgnoreRequest(request) {
  return URLS_TO_IGNORE
    .map((urlPart) => request.url.includes(urlPart))
    .indexOf(true) > -1;
}

function isHtmlRequest(request) {
  return request.headers.get('accept').includes('text/html');
}

function fetchCors(request) {
  return fetch(new Request(request), { mode: 'cors', credentials: 'same-origin' });
}

function fetchAndUpdate(request) {
  // DevTools opening will trigger these o-i-c requests, which this SW can't handle.
  // There's probaly more going on here, but I'd rather just ignore this problem. :)
  // https://github.com/paulirish/caltrainschedule.io/issues/49
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;

  return caches.open(CACHE_NAME).then((cache) => {
    return fetchCors(request).then((response) => {
      // foreign requests may be res.type === 'opaque' and missing a url
      if (!response.url) return response;

      cache.put(request, response.clone());
      return response;
    });
  });
}

//cache assets
function precache() {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(
      assets
    );
  });
}
