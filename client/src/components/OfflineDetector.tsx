import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * 네트워크 연결 상태를 감지하고 오프라인 상태일 때 알림을 표시하는 컴포넌트
 */
export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "온라인 상태로 전환되었습니다",
        description: "인터넷 연결이 복구되었습니다.",
        variant: "default",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "오프라인 상태입니다",
        description: "인터넷 연결을 확인해 주세요.",
        variant: "destructive",
        duration: Infinity, // 수동으로 닫을 때까지 유지
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 p-4 rounded-lg shadow-lg flex items-center space-x-3">
      <WifiOff className="h-5 w-5" />
      <div>
        <p className="font-medium">오프라인 상태입니다</p>
        <p className="text-sm">인터넷 연결을 확인해 주세요</p>
      </div>
    </div>
  );
}

export default OfflineDetector;