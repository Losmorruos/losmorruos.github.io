const CACHE = "los-morruos-app-v46";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./cabecera-los-morruos.jpg",
  "./logo-64.png",
  "./logo-128.png",
  "./logo-192.png",
  "./logo-512.png",
  "./rediseño-app.css?v=20261002",
  "./rediseño-app.js?v=20261002",
  "./logo-fg-automocion-alargado.svg",
  "./logo-fg-automocion.png",
  "./logo-padilla-spar.png",
  "./logo-padilla-spar.webp",
  "./logo-ayose-diaz.png",
  "./logo-la-grada.png",
  "./fg-automocion-recortado.jpg?v=20261004",
  "./padilla-spar-recortado.jpg?v=20261004",
  "./ayose-diaz-recortado.jpg?v=20261004",
  "./la-grada-recortado.jpg?v=20261004",
  "./africars-rent.jpg",
  "./data.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(async cache => {
      await Promise.all(
        ASSETS.map(async asset => {
          try {
            const response = await fetch(asset, { cache: "no-store" });
            if (response.ok) await cache.put(asset, response);
          } catch (_) {}
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(r => r || caches.match("./index.html"))
      )
  );
});