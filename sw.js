```javascript
const CACHE_NAME = 'nn-food-v1';

// 安裝時快取必要的靜態檔案
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  // 對於呼叫 Google Apps Script 的 API 請求，我們不要快取，保證每次拿到的餐廳都是隨機最新的
  if (e.request.url.includes('script.google.com') || e.request.url.includes('googleapis.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  
  // 其餘網頁靜態資源，優先使用快取，支援離線顯示
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
