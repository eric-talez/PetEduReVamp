import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

/**
 * Firebase Cloud Messaging 클라이언트 서비스
 * 웹 앱에서 FCM 토큰 관리 및 포그라운드 메시지 수신
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 환경 변수 검증
function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId && 
    firebaseConfig.appId
  );
}

// Firebase 앱 초기화 (싱글톤 패턴, lazy initialization)
let app: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    console.warn('[FCM] Firebase 환경 변수가 설정되지 않았습니다');
    return null;
  }

  if (!app && getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error('[FCM] Firebase 앱 초기화 실패:', error);
      return null;
    }
  } else if (!app && getApps().length > 0) {
    app = getApps()[0];
  }

  return app;
}

let messagingInstance: ReturnType<typeof getMessaging> | null = null;

/**
 * Firebase Messaging 인스턴스 가져오기
 */
export function getMessagingInstance() {
  if (!messagingInstance && typeof window !== 'undefined') {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) {
      return null;
    }

    try {
      messagingInstance = getMessaging(firebaseApp);
    } catch (error) {
      console.error('[FCM] Messaging 인스턴스 생성 실패:', error);
      return null;
    }
  }
  return messagingInstance;
}

/**
 * FCM 토큰 요청 및 등록
 */
export async function requestFCMToken(): Promise<string | null> {
  try {
    // Firebase 환경 변수 확인
    if (!import.meta.env.VITE_FIREBASE_API_KEY || 
        !import.meta.env.VITE_FIREBASE_PROJECT_ID || 
        !import.meta.env.VITE_FIREBASE_APP_ID) {
      console.warn('[FCM] Firebase 환경 변수가 설정되지 않았습니다');
      return null;
    }

    // 브라우저 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[FCM] 알림 권한이 거부되었습니다');
      return null;
    }

    // Service Worker 등록 및 설정 전달
    let registration: ServiceWorkerRegistration;
    try {
      registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/' }
      );
      console.log('[FCM] Service Worker 등록됨:', registration);
      
      // Service Worker가 활성화될 때까지 대기
      await navigator.serviceWorker.ready;
      
      // Service Worker에 Firebase 설정 전달
      const activeWorker = registration.active || registration.waiting || registration.installing;
      if (activeWorker) {
        activeWorker.postMessage({
          type: 'FIREBASE_CONFIG',
          config: firebaseConfig,
        });
        console.log('[FCM] Service Worker에 설정 전달됨');
      }
    } catch (swError) {
      console.error('[FCM] Service Worker 등록 실패:', swError);
      return null;
    }

    // FCM 토큰 가져오기
    const messaging = getMessagingInstance();
    if (!messaging) {
      console.error('[FCM] Messaging 인스턴스를 가져올 수 없습니다');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('[FCM] 토큰 발급됨:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('[FCM] 토큰을 가져올 수 없습니다');
      return null;
    }
  } catch (error) {
    console.error('[FCM] 토큰 요청 실패:', error);
    return null;
  }
}

/**
 * 백엔드에 FCM 토큰 등록
 */
export async function registerFCMTokenWithBackend(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/fcm/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        deviceType: 'web',
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Token registration failed');
    }

    const data = await response.json();
    console.log('[FCM] 토큰이 백엔드에 등록되었습니다:', data);
    return true;
  } catch (error) {
    console.error('[FCM] 백엔드 토큰 등록 실패:', error);
    return false;
  }
}

/**
 * 백엔드에서 FCM 토큰 제거 (로그아웃 시)
 */
export async function unregisterFCMTokenFromBackend(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/fcm/unregister-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Token unregistration failed');
    }

    console.log('[FCM] 토큰이 백엔드에서 제거되었습니다');
    return true;
  } catch (error) {
    console.error('[FCM] 백엔드 토큰 제거 실패:', error);
    return false;
  }
}

/**
 * 포그라운드 메시지 수신 핸들러 등록
 */
export function onForegroundMessage(callback: (payload: any) => void) {
  const messaging = getMessagingInstance();
  if (!messaging) {
    console.warn('[FCM] Messaging 인스턴스를 사용할 수 없습니다');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('[FCM] 포그라운드 메시지 수신:', payload);
    callback(payload);
  });
}

/**
 * FCM 지원 여부 확인
 */
export function isFCMSupported(): boolean {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}
