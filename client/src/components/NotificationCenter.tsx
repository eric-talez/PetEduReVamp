import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

// 알림 타입 정의
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  link?: string;
  category: 'system' | 'course' | 'pet' | 'social' | 'payment';
}

// 샘플 알림 데이터
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: '시스템 업데이트',
    message: '시스템이 성공적으로 업데이트되었습니다.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
    read: false,
    category: 'system'
  },
  {
    id: '2',
    title: '결제 완료',
    message: '강아지 훈련 기초 강좌 결제가 완료되었습니다.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    read: false,
    category: 'payment',
    link: '/shop/order-history'
  },
  {
    id: '3',
    title: '강좌 시작 예정',
    message: '내일 오전 10시에 예약된 강좌가 있습니다.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
    read: true,
    category: 'course',
    link: '/my-courses'
  },
  {
    id: '4',
    title: '반려동물 건강 알림',
    message: '뽀삐의 예방접종 일정이 다가오고 있습니다.',
    type: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    read: false,
    category: 'pet',
    link: '/my-pets'
  },
  {
    id: '5',
    title: '새로운 메시지',
    message: '훈련사 김철수님이 새 메시지를 보냈습니다.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
    read: true,
    category: 'social',
    link: '/messages'
  }
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }
  
  return date.toLocaleDateString('ko-KR');
}

function getIconForType(type: NotificationType) {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <Clock className="h-5 w-5 text-amber-500" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'system': return '시스템';
    case 'course': return '강좌';
    case 'pet': return '반려동물';
    case 'social': return '소셜';
    case 'payment': return '결제';
    default: return '기타';
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { preferences } = useUserPreferences();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      // 알림 센터를 닫고 링크로 이동
      setOpen(false);
      window.location.href = notification.link;
    }
  };
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.category === activeTab);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[540px] p-0 overflow-hidden">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle>알림 센터</SheetTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead} 
                disabled={!unreadCount}
              >
                모두 읽음 표시
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllNotifications} 
                disabled={!notifications.length}
              >
                모두 지우기
              </Button>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid grid-cols-5 px-4 py-2">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="unread">읽지 않음</TabsTrigger>
            <TabsTrigger value="system">시스템</TabsTrigger>
            <TabsTrigger value="course">강좌</TabsTrigger>
            <TabsTrigger value="pet">반려동물</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="h-[calc(100vh-13rem)]">
            <ScrollArea className="h-full">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                  <Bell className="h-12 w-12 mb-2 opacity-20" />
                  <p>알림이 없습니다.</p>
                </div>
              ) : (
                <div>
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        flex items-start gap-3 p-4 border-b cursor-pointer transition-colors
                        ${notification.read ? 'bg-background' : 'bg-primary/5'}
                        hover:bg-muted
                      `}
                    >
                      <div className="shrink-0 mt-1">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{notification.title}</h4>
                          <time className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </time>
                        </div>
                        <p className="text-sm text-muted-foreground my-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(notification.category)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
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
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}