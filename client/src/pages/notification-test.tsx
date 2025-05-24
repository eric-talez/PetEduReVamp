import React from 'react';
import { SimplifiedNotificationCenter } from '@/components/ui/simplified-notification-center';
import { NotificationBell } from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * 알림 시스템 테스트 페이지
 * 여러 알림 컴포넌트를 비교하고 테스트하기 위한 페이지
 */
export default function NotificationTestPage() {
  const { toast } = useToast();
  
  const showToast = () => {
    toast({
      title: '테스트 알림',
      description: '이것은 테스트 알림입니다.',
      variant: 'default',
    });
  };
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">알림 시스템 테스트 페이지</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">단순 알림 센터</h2>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">간소화된 알림 컴포넌트</p>
            <SimplifiedNotificationCenter />
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={showToast}>
              토스트 알림 표시
            </Button>
          </div>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">통합 알림 센터</h2>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">useNotification 훅 사용</p>
            <NotificationBell />
          </div>
        </div>
      </div>
      
      <div className="mt-10 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">알림 시스템 구현 현황</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>웹소켓을 통한 실시간 알림 수신</li>
          <li>읽음/읽지 않음 상태 관리</li>
          <li>알림 유형별 스타일링</li>
          <li>알림 전체 읽음 표시 기능</li>
          <li>토스트 알림 통합</li>
        </ul>
      </div>
    </div>
  );
}