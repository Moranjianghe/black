const cacheName = 'v1';
const assets = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png' // 确保你在此目录中有一个图标文件
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
