const CACHE_NAME = "giftme-cache-v3-maintenance";
const OFFLINE_URL = "/donate-site/";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c =>
      c.addAll([OFFLINE_URL, "/donate-site/maintenance.js"])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith("giftme-cache-") && k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode !== "navigate" && url.pathname !== "/donate-site/maintenance.js") return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request.mode === "navigate" ? OFFLINE_URL : "/donate-site/maintenance.js"))
  );
});
