import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/**
 * 단순화된 알림 센터 컴포넌트
 * 알림 시스템 기능 테스트를 위해 최소한의 기능만 구현
 */
export function SimplifiedNotificationCenter() {
  const [open, setOpen] = useState(false);
  const [unreadCount] = useState(3); // 고정된 값 사용

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-4 h-4 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <h3 className="font-medium text-sm mb-2">알림</h3>
        <div className="space-y-2">
          <div className="p-3 bg-primary/10 rounded-md">
            <h4 className="font-medium text-sm">시스템 알림</h4>
            <p className="text-sm text-muted-foreground">
              새로운 기능이 추가되었습니다. 업데이트를 확인해보세요.
            </p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <h4 className="font-medium text-sm">결제 완료</h4>
            <p className="text-sm text-muted-foreground">
              프리미엄 구독이 성공적으로 완료되었습니다.
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-md">
            <h4 className="font-medium text-sm">신규 메시지</h4>
            <p className="text-sm text-muted-foreground">
              새로운 메시지가 도착했습니다.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}