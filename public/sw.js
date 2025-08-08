// Service Worker for TALEZ PWA

const CACHE_NAME = 'talez-v1.0.0';
const STATIC_CACHE = 'talez-static-v1';
const DYNAMIC_CACHE = 'talez-dynamic-v1';

// 캐시할 정적 자원들
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.svg',
  '/logo-dark.svg',
  '/favicon.ico',
  '/static/css/main.css',
  '/static/js/main.js'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker 설치 중...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('정적 파일 캐싱 중...');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('캐시 저장 실패:', error);
      })
  );
  
  // 새 Service Worker 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('Service Worker 활성화됨');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 모든 클라이언트에서 새 Service Worker 제어
  self.clients.claim();
});

// Fetch 이벤트 (네트워크 요청 가로채기)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API 요청은 네트워크 우선, 캐시 대체
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 성공적인 응답만 캐시
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 응답
          return caches.match(request);
        })
    );
    return;
  }
  
  // 정적 자원은 캐시 우선
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // 유효한 응답만 캐시
              if (response.status === 200 && response.type === 'basic') {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // 오프라인 페이지 반환
              return caches.match('/offline.html');
            });
        })
    );
  }
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  console.log('백그라운드 동기화:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 대기 중인 요청들 처리
      processOfflineRequests()
    );
  }
});

// 푸시 알림
self.addEventListener('push', (event) => {
  console.log('푸시 메시지 수신:', event.data?.text());
  
  const options = {
    body: event.data?.text() || '새로운 알림이 있습니다.',
    icon: '/logo.svg',
    badge: '/logo-symbol.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/logo-symbol.svg'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/logo-symbol.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('TALEZ', options)
  );
});

// 알림 클릭
self.addEventListener('notificationclick', (event) => {
  console.log('알림 클릭:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 오프라인 요청 처리
async function processOfflineRequests() {
  // IndexedDB에서 대기 중인 요청들을 가져와서 처리
  // 실제 구현에서는 IndexedDB 사용
  console.log('오프라인 요청 처리 중...');
}

// 메시지 처리
self.addEventListener('message', (event) => {
  console.log('메시지 수신:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 에러 처리
self.addEventListener('error', (event) => {
  console.error('Service Worker 에러:', event.error);
});

// 처리되지 않은 Promise 거부
self.addEventListener('unhandledrejection', (event) => {
  console.error('처리되지 않은 Promise 거부:', event.reason);
  event.preventDefault();
});