// Firebase Cloud Messaging Service Worker
// 백그라운드에서 푸시 알림 수신 처리

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase 설정은 런타임에 동적으로 로드됨
// postMessage를 통해 메인 스레드에서 설정 전달

let firebaseConfig = null;
let messaging = null;

// 메인 스레드로부터 Firebase 설정 수신
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    firebaseConfig = event.data.config;
    
    try {
      firebase.initializeApp(firebaseConfig);
      messaging = firebase.messaging();
      console.log('[SW] Firebase Messaging 초기화됨');
      
      // 백그라운드 메시지 수신 핸들러
      messaging.onBackgroundMessage((payload) => {
        console.log('[SW] 백그라운드 메시지 수신:', payload);
        
        const notificationTitle = payload.notification?.title || 'TALEZ 알림';
        const notificationOptions = {
          body: payload.notification?.body || '새로운 알림이 있습니다',
          icon: '/logo.svg',
          badge: '/logo.svg',
          data: payload.data || {},
          tag: payload.data?.notificationId || 'default', // 중복 알림 방지
          requireInteraction: false, // 자동으로 사라지도록
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });
    } catch (error) {
      console.error('[SW] Firebase 초기화 실패:', error);
    }
  }
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 알림 클릭됨:', event.notification);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.actionUrl || '/';
  
  // 현재 열려 있는 탭 중 앱이 있는지 확인
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // 이미 열려 있는 탭이 있으면 포커스
      for (let client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            data: event.notification.data
          });
          return client.focus();
        }
      }
      
      // 열려 있는 탭이 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

console.log('[SW] Firebase Messaging Service Worker 로드됨');
