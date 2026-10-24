const CACHE_NAME='giftme-cache-v7-native';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('giftme-cache-')).map(k=>caches.delete(k)))),self.clients.claim()])));
// Public campaigns use saved snapshots; API/payment responses are never service-worker cached.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||e.request.mode!=='navigate')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin||!u.pathname.startsWith('/donate-site/'))return;e.respondWith(fetch(e.request).catch(()=>new Response('GiftMe needs an internet connection to load public campaigns.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));});
