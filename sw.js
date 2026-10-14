const CACHE = "los-morruos-app-v50";
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

  const isData = url.pathname.endsWith("/data.json");
  const isNavigation = event.request.mode === "navigate";

  // Los datos siempre se intentan actualizar desde la publicación; si falla
  // la conexión, se usa la última copia guardada.
  if (isData) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put("./data.json", copy)).catch(() => {});
          }
          return response;
        })
        .catch(async () => (await caches.match("./data.json")) || Response.error())
    );
    return;
  }

  // HTML y recursos estáticos: responder desde caché cuando sea posible y
  // refrescar en segundo plano para que las siguientes aperturas sean rápidas.
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    const refresh = fetch(event.request, { cache: "no-store" }).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
      }
      return response;
    });

    if (cached) {
      event.waitUntil(refresh.catch(() => {}));
      return cached;
    }

    try {
      return await refresh;
    } catch (_) {
      return (await caches.match("./index.html")) || Response.error();
    }
  })());
});