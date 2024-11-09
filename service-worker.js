const cacheName = 'v1';
const assets = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.svg'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assets);
        })
    );
});

// 监听请求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request).catch(() => caches.match('/'));
        })
    );
});
