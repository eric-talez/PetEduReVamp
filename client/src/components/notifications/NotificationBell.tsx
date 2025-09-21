import { useState } from 'react';
import { Bell, BellRing, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from './NotificationProvider';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, sendTestNotification } = useNotification();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 알림 목록 조회
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/notifications');
      return response.json() as Promise<Notification[]>;
    },
    refetchInterval: 30000, // 30초마다 새로고침
  });

  // 알림 읽음 처리
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest('PATCH', `/api/notifications/${notificationId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // 모든 알림 읽음 처리
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', '/api/notifications/read-all');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: '모든 알림 읽음',
        description: '모든 알림이 읽음으로 처리되었습니다.',
      });
    },
  });

  // 알림 삭제
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest('DELETE', `/api/notifications/${notificationId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  const handleMarkAsRead = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notificationId);
  };

  const handleDelete = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  const handleTestNotification = () => {
    sendTestNotification({
      title: '테스트 알림',
      message: '실시간 알림 기능이 정상 작동 중입니다!',
      type: 'info'
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">
            알림 {unreadCount > 0 ? `(${unreadCount}개 읽지 않음)` : ''}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">알림</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestNotification}
                className="text-xs"
              >
                테스트
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                  className="text-xs"
                >
                  모두 읽음
                </Button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              알림을 불러오는 중...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              알림이 없습니다
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          title="읽음으로 표시"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => handleDelete(notification.id, e)}
                        title="삭제"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}