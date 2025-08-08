// PWA (Progressive Web App) 기능

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initializePWA();
  }

  private async initializePWA() {
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker 등록 성공:', this.registration);
        
        // 업데이트 확인
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                this.notifyUpdate();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker 등록 실패:', error);
      }
    }

    // 설치 프롬프트 이벤트 리스너
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
    });

    // 앱 설치 확인
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      console.log('PWA 설치 완료');
    });

    // 스탠드얼론 모드 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
  }

  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('설치 프롬프트 오류:', error);
      return false;
    }
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  private notifyUpdate() {
    // 사용자에게 업데이트 알림
    if (confirm('새로운 버전이 있습니다. 지금 업데이트하시겠습니까?')) {
      window.location.reload();
    }
  }

  async updateServiceWorker() {
    if (this.registration) {
      await this.registration.update();
    }
  }
}

export const pwaManager = new PWAManager();

// 오프라인 지원
export function handleOfflineState() {
  window.addEventListener('online', () => {
    console.log('온라인 상태');
    // 온라인 복구 시 대기 중인 요청 처리
  });

  window.addEventListener('offline', () => {
    console.log('오프라인 상태');
    // 오프라인 상태 UI 표시
  });
}

// 백그라운드 동기화
export function requestBackgroundSync(tag: string) {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register(tag);
    }).catch((error) => {
      console.error('백그라운드 동기화 등록 실패:', error);
    });
  }
}

// 푸시 알림 설정
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });

    return subscription;
  } catch (error) {
    console.error('푸시 알림 구독 실패:', error);
    return null;
  }
}