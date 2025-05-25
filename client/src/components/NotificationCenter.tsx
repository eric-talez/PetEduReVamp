import { useState, useEffect } from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, AlertCircle, X, Check } from 'lucide-react';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

/**
 * 알림의 아이콘을 결정하는 함수
 */
function getNotificationIcon(type: string) {
  switch (type) {
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'system':
      return <Bell className="h-4 w-4 text-primary" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

/**
 * 알림 시간을 표시하는 함수
 */
function formatNotificationTime(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  // 1분 이내
  if (diff < 60 * 1000) {
    return '방금 전';
  }
  
  // 1시간 이내
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}분 전`;
  }
  
  // 24시간 이내
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}시간 전`;
  }
  
  // 7일 이내
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}일 전`;
  }
  
  // 그 이상
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric' 
  };
  return timestamp.toLocaleDateString('ko-KR', options);
}

/**
 * 단일 알림 컴포넌트
 */
const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.linkTo) {
      setLocation(notification.linkTo);
    }
  };
  
  return (
    <div 
      className={cn(
        "p-3 flex gap-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer relative group",
        !notification.isRead && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex-grow">
        <h4 className={cn(
          "text-sm font-medium text-gray-900 dark:text-gray-100",
          !notification.isRead && "font-semibold"
        )}>
          {notification.title}
        </h4>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {notification.message}
        </p>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {formatNotificationTime(notification.timestamp)}
          </span>
          
          {!notification.isRead && (
            <Badge variant="secondary" className="text-xs px-1 py-0 h-5">
              새 알림
            </Badge>
          )}
        </div>
      </div>
      
      <button 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
      >
        <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
      </button>
    </div>
  );
};

/**
 * 알림 목록 컴포넌트
 */
const NotificationList = ({ 
  notifications, 
  onMarkAsRead, 
  onDelete,
  emptyMessage
}: { 
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage: string;
}) => {
  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto max-h-[350px] divide-y divide-gray-100 dark:divide-gray-800">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

/**
 * 알림 센터 컴포넌트
 */
export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    connected,
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // 알림 카테고리별로 필터링
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const systemNotifications = notifications.filter(n => n.type === 'system');
  
  // 알림 팝업이 열릴 때 연결 상태 로깅
  useEffect(() => {
    if (open) {
      console.log('Notification center opened, connected:', connected);
    }
  }, [open, connected]);
  
  // 인증되지 않은 사용자는 알림 센터를 표시하지 않음
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
          aria-label="알림"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[350px] p-0 sm:w-[380px]" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-semibold">알림</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => markAllAsRead()}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                모두 읽음 표시
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => clearAllNotifications()}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              모두 지우기
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-100 dark:border-gray-800">
            <TabsList className="grid grid-cols-3 w-full bg-transparent h-auto p-0">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
              >
                전체
                <Badge 
                  variant="secondary" 
                  className="ml-1.5 px-1 py-0 h-5 min-w-[1.25rem] text-xs"
                >
                  {allNotifications.length}
                </Badge>
              </TabsTrigger>
              
              <TabsTrigger 
                value="unread" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
              >
                읽지 않음
                <Badge 
                  variant="secondary" 
                  className="ml-1.5 px-1 py-0 h-5 min-w-[1.25rem] text-xs"
                >
                  {unreadNotifications.length}
                </Badge>
              </TabsTrigger>
              
              <TabsTrigger 
                value="system" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
              >
                시스템
                <Badge 
                  variant="secondary" 
                  className="ml-1.5 px-1 py-0 h-5 min-w-[1.25rem] text-xs"
                >
                  {systemNotifications.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0 focus:outline-none">
            <NotificationList 
              notifications={allNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              emptyMessage="알림이 없습니다"
            />
          </TabsContent>
          
          <TabsContent value="unread" className="mt-0 focus:outline-none">
            <NotificationList 
              notifications={unreadNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              emptyMessage="읽지 않은 알림이 없습니다"
            />
          </TabsContent>
          
          <TabsContent value="system" className="mt-0 focus:outline-none">
            <NotificationList 
              notifications={systemNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              emptyMessage="시스템 알림이 없습니다"
            />
          </TabsContent>
        </Tabs>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs border-t border-red-100 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 inline-block mr-1" />
            알림 서비스 연결 오류: {error.message}
          </div>
        )}
        
        {loading && !error && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs border-t border-gray-100 dark:border-gray-700 flex items-center justify-center">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full mr-2"></div>
            알림을 불러오는 중...
          </div>
        )}
        
        {!connected && !loading && !error && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs border-t border-amber-100 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400 inline-block mr-1" />
            알림 서비스에 연결되어 있지 않습니다. 실시간 알림을 받을 수 없습니다.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}