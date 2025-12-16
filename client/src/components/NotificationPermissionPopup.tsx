import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PERMISSION_ASKED_KEY = 'talez_notification_permission_asked';

export function NotificationPermissionPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    const alreadyAsked = localStorage.getItem(PERMISSION_ASKED_KEY);
    const currentPermission = Notification.permission;

    if (!alreadyAsked && currentPermission === 'default') {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowNotifications = async () => {
    setIsRequesting(true);
    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem(PERMISSION_ASKED_KEY, 'true');
      
      if (permission === 'granted') {
        new Notification('TALEZ 알림 설정 완료', {
          body: '이제 중요한 소식을 놓치지 않고 받아보실 수 있습니다!',
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
    } finally {
      setIsRequesting(false);
      setShowPopup(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(PERMISSION_ASKED_KEY, 'true');
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md" data-testid="notification-permission-dialog">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            알림을 받아보시겠어요?
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            TALEZ에서 보내는 중요한 소식을 놓치지 마세요!
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              • 훈련 일정 알림<br />
              • 새로운 강좌 소식<br />
              • 이벤트 및 할인 정보
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleAllowNotifications}
            disabled={isRequesting}
            className="w-full"
            size="lg"
            data-testid="button-allow-notifications"
          >
            {isRequesting ? '설정 중...' : '알림 허용하기'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleDismiss}
            className="w-full text-muted-foreground"
            data-testid="button-dismiss-notifications"
          >
            나중에 하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
