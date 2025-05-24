import { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications, Notification } from '@/hooks/use-notifications';
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
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [open, setOpen] = useState(false);
  const [_, navigate] = useLocation();
  
  // 알림 클릭 처리
  const handleNotificationClick = (notification: Notification) => {
    // 읽음으로 표시
    markAsRead(notification.id);
    
    // 링크가 있으면 해당 페이지로 이동
    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
    
    // 팝오버 닫기
    setOpen(false);
  };
  
  // 알림 타입에 따른 배경색 결정
  const getNotificationBgColor = (type: Notification['type'], isRead: boolean) => {
    if (isRead) return 'bg-background';
    
    switch (type) {
      case 'success':
        return 'bg-success/10';
      case 'warning':
        return 'bg-warning/10';
      case 'error':
        return 'bg-destructive/10';
      case 'system':
        return 'bg-secondary/20';
      default:
        return 'bg-primary/10';
    }
  };
  
  // 알림 타입에 따른 아이콘 색상 결정
  const getNotificationIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      case 'system':
        return 'text-secondary-foreground';
      default:
        return 'text-primary';
    }
  };
  
  // 단일 알림 렌더링
  const renderNotification = (notification: Notification) => {
    const bgColorClass = getNotificationBgColor(notification.type, notification.isRead);
    const iconColorClass = getNotificationIconColor(notification.type);
    
    return (
      <div
        key={notification.id}
        className={`p-3 ${bgColorClass} rounded-md mb-2 cursor-pointer relative group transition-all hover:bg-primary/5`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start gap-2">
          {/* 발신자 프로필 이미지 (있는 경우) */}
          {notification.sender && notification.sender.avatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={notification.sender.avatar} 
                alt={notification.sender.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass} bg-muted flex-shrink-0`}>
              <Bell size={18} />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground truncate">
              {notification.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: ko })}
            </p>
          </div>
          
          {/* 삭제 버튼 (호버 시 표시) - 중복 노출 방지를 위해 aria-label 추가 */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`알림 삭제: ${notification.title}`}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(notification.id);
            }}
          >
            <Trash2 size={16} className="text-muted-foreground" />
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={`알림 ${unreadCount > 0 ? `(${unreadCount}개 읽지 않음)` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="danger" 
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
                  aria-label="모든 알림 읽음으로 표시"
                  onClick={markAllAsRead}
                >
                  <Check size={14} className="mr-1" />
                  모두 읽음
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  aria-label="모든 알림 삭제"
                  onClick={clearAllNotifications}
                >
                  <Trash2 size={14} className="mr-1" />
                  모두 삭제
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
                {notifications.some(n => !n.isRead) && (
                  <>
                    <div className="mb-2">
                      <h4 className="text-xs text-muted-foreground font-medium mb-2">읽지 않음</h4>
                      {notifications
                        .filter(n => !n.isRead)
                        .map(renderNotification)}
                    </div>
                    {notifications.some(n => n.isRead) && <Separator className="my-3" />}
                  </>
                )}
                
                {/* 읽은 알림 */}
                {notifications.some(n => n.isRead) && (
                  <div>
                    <h4 className="text-xs text-muted-foreground font-medium mb-2">이전 알림</h4>
                    {notifications
                      .filter(n => n.isRead)
                      .map(renderNotification)}
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