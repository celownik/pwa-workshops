const assets = serviceWorkerOption.assets;
const CACHE_NAME = 'vivino-cache-v1';

self.addEventListener('install', function(event) {
  console.log('SW installed');

  event.waitUntil(precache());
});

self.addEventListener('activate', (event) => {

});

self.addEventListener('fetch', (event) => {

});

//cache assets
function precache() {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(
      assets
    );
  });
}
