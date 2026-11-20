const CACHE_NAME = "pracoro-counter-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon_180.png",
  "./icon_192.png",
  "./icon_512.png"
];

self.addEventListener(
  "install",
  event => {

    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(APP_FILES);
        })
        .then(() => {
          return self.skipWaiting();
        })
    );

  }
);

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {

          return Promise.all(
            cacheNames
              .filter(
                cacheName =>
                  cacheName !== CACHE_NAME
              )
              .map(
                cacheName =>
                  caches.delete(cacheName)
              )
          );

        })
        .then(() => {
          return self.clients.claim();
        })
    );

  }
);

self.addEventListener(
  "fetch",
  event => {

    if(event.request.method !== "GET"){
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then(response => {

          const clone =
            response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {

              cache.put(
                event.request,
                clone
              );

            });

          return response;

        })
        .catch(() => {

          return caches.match(
            event.request
          );

        })
    );

  }
);
