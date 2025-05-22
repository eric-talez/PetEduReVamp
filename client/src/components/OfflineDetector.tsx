import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OfflineDetectorProps {
  children: React.ReactNode;
  messageOnline?: string;
  messageOffline?: string;
  showOnlineStatus?: boolean;
}

/**
 * 온라인/오프라인 상태를 감지하고 표시하는 컴포넌트
 * 
 * 오프라인 상태일 때 경고 메시지를 표시하고, 선택적으로 온라인 상태 메시지를 표시합니다.
 * 네트워크 상태 변경을 실시간으로 감지합니다.
 */
const OfflineDetector: React.FC<OfflineDetectorProps> = ({
  children,
  messageOnline = '인터넷 연결이 복구되었습니다.',
  messageOffline = '인터넷 연결이 끊겼습니다. 일부 기능이 제한될 수 있습니다.',
  showOnlineStatus = false,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineMessage(true);
      // 온라인 상태 메시지를 잠시 후 자동으로 숨김
      const timer = setTimeout(() => {
        setShowOnlineMessage(false);
      }, 5000); // 5초 후 자동으로 사라짐
      
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineMessage(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <Alert variant="destructive" className="mb-4 animate-in fade-in duration-500">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>오프라인 모드</AlertTitle>
          <AlertDescription>
            {messageOffline}
          </AlertDescription>
        </Alert>
      )}

      {isOnline && showOnlineMessage && showOnlineStatus && (
        <Alert variant="default" className="mb-4 animate-in fade-in slide-in-from-top duration-300 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">온라인 상태</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {messageOnline}
          </AlertDescription>
        </Alert>
      )}

      {children}
    </>
  );
};

export default OfflineDetector;
import { useEffect, useState } from 'react';

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      <p className="flex items-center">
        <span className="mr-2">🔌</span>
        인터넷 연결이 끊겼습니다
      </p>
    </div>
  );
}
