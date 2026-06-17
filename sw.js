
const CACHE_NAME = "hse-alcohol-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

/* =========================
   INSTALL EVENT (CACHE INIT)
========================= */
self.addEventListener("install", event => {
  console.log("SW: Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
  );

  self.skipWaiting();
});

/* =========================
   ACTIVATE EVENT (CLEAN OLD CACHE)
========================= */
self.addEventListener("activate", event => {
  console.log("SW: Activated");

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

/* =========================
   FETCH EVENT (OFFLINE SUPPORT)
========================= */
self.addEventListener("fetch", event => {

  event.respondWith(
    caches.match(event.request)
      .then(cached => {

        // return cache first
        if (cached) {
          return cached;
        }

        // fallback to network
        return fetch(event.request)
          .then(response => {

            // optional: cache dynamic requests
            return response;
          })
          .catch(() => {
            // offline fallback (optional)
            return caches.match("./index.html");
          });

      })
  );
});
