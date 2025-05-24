import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotification, NotificationType } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLocation } from 'wouter';
import { Separator } from '@/components/ui/separator';

export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead
  } = useNotification();
  
  const [open, setOpen] = useState(false);
  const [_, navigate] = useLocation();
  
  // 알림 클릭 처리
  const handleNotificationClick = (notification: any) => {
    // 읽음으로 표시
    markAsRead(notification.id);
    
    // URL이 있으면 해당 페이지로 이동
    if (notification.url) {
      navigate(notification.url);
    }
    
    // 팝오버 닫기
    setOpen(false);
  };
  
  // 알림 타입에 따른 배경색 결정
  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-background';
    
    switch (type) {
      case NotificationType.SYSTEM:
        return 'bg-secondary/20';
      case NotificationType.MESSAGE:
        return 'bg-primary/10';
      case NotificationType.PAYMENT:
        return 'bg-success/10';
      case NotificationType.MARKETING:
        return 'bg-warning/10';
      default:
        return 'bg-primary/10';
    }
  };
  
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
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">알림</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={markAllAsRead}
                >
                  <Check size={14} className="mr-1" />
                  모두 읽음
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="h-10 w-10 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">새로운 알림이 없습니다</p>
              </div>
            ) : (
              <>
                {/* 읽지 않은 알림 */}
                {notifications.some((n: any) => !n.isRead) && (
                  <>
                    <div className="mb-2">
                      <h4 className="text-xs text-muted-foreground font-medium mb-2">읽지 않음</h4>
                      {notifications
                        .filter((n: any) => !n.isRead)
                        .map((notification: any) => (
                          <div
                            key={notification.id}
                            className={`p-3 ${getNotificationBgColor(notification.type, notification.isRead)} rounded-md mb-2 cursor-pointer relative group transition-all hover:bg-primary/5`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary bg-muted flex-shrink-0">
                                <Bell size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-foreground truncate">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ko })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {notifications.some((n: any) => n.isRead) && <Separator className="my-3" />}
                  </>
                )}
                
                {/* 읽은 알림 */}
                {notifications.some((n: any) => n.isRead) && (
                  <div>
                    <h4 className="text-xs text-muted-foreground font-medium mb-2">이전 알림</h4>
                    {notifications
                      .filter((n: any) => n.isRead)
                      .map((notification: any) => (
                        <div
                          key={notification.id}
                          className={`p-3 ${getNotificationBgColor(notification.type, notification.isRead)} rounded-md mb-2 cursor-pointer relative group transition-all hover:bg-primary/5`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary bg-muted flex-shrink-0">
                              <Bell size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground truncate">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ko })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}