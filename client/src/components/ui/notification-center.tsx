import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Settings, Mail, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  useNotification,
  NotificationType,
  NotificationChannel,
  Notification as NotificationItem
} from '@/hooks/useNotification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

/**
 * 알림 센터 컴포넌트
 * 
 * 사용자의 모든 알림을 표시하고 관리하는 컴포넌트입니다.
 * - 알림 목록 표시
 * - 알림 읽음 처리
 * - 알림 설정 관리
 */
export function NotificationCenter() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    settings,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    updateSettings,
    sendTestNotification
  } = useNotification();

  // 알림 클릭 처리
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    // URL이 있으면 해당 페이지로 이동
    if (notification.url) {
      window.location.href = notification.url;
    }
    
    // 메시지일 경우 메시지 화면으로 이동
    if (notification.type === NotificationType.MESSAGE) {
      window.location.href = '/messages';
    }
  };

  // 알림 유형별 아이콘
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM:
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Bell className="h-4 w-4 text-blue-600" /></div>;
      case NotificationType.MESSAGE:
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><Mail className="h-4 w-4 text-green-600" /></div>;
      case NotificationType.COURSE:
        return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg></div>;
      case NotificationType.PAYMENT:
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>;
      case NotificationType.MARKETING:
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></div>;
      case NotificationType.NOTEBOOK:
        return <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>;
      case NotificationType.VIDEO_CALL:
        return <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Bell className="h-4 w-4 text-gray-600" /></div>;
    }
  };

  // 알림 날짜 포맷팅
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  };

  // 알림 설정 변경 처리
  const handleSettingChange = (type: 'channel' | 'type', key: string, value: boolean) => {
    if (!settings) return;
    
    if (type === 'channel') {
      updateSettings({
        channels: {
          ...settings.channels,
          [key]: value
        }
      });
    } else {
      updateSettings({
        types: {
          ...settings.types,
          [key]: {
            ...settings.types[key as NotificationType],
            enabled: value
          }
        }
      });
    }
  };

  // 테스트 알림 발송
  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification(
        NotificationType.SYSTEM,
        [NotificationChannel.WEB]
      );
    } catch (error) {
      console.error('테스트 알림 발송 오류:', error);
    }
  };

  // 주기적인 알림 새로고침
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      refreshNotifications();
    }, 60000); // 1분마다 새로고침
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // 알림이 열릴 때 새로고침
  useEffect(() => {
    if (open && isAuthenticated) {
      refreshNotifications();
    }
  }, [open, isAuthenticated]);

  // 인증되지 않은 경우 빈 알림 센터 표시
  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="icon" className="relative" onClick={() => {
        toast({
          title: "로그인이 필요합니다",
          description: "알림을 확인하려면 로그인해주세요.",
          variant: "default",
        });
      }}>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>알림 센터</SheetTitle>
            <div className="flex items-center space-x-1">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1 h-8"
                  onClick={() => markAllAsRead()}
                >
                  <Check className="h-3.5 w-3.5" />
                  모두 읽음
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="notifications" className="flex flex-col flex-grow">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              알림
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              설정
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="flex-grow overflow-hidden m-0">
            <ScrollArea className="h-full w-full p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-gray-500 mt-2">알림을 불러오고 있습니다...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg">알림이 없습니다</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                    새로운 알림이 도착하면 여기에 표시됩니다.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={handleSendTestNotification}
                  >
                    테스트 알림 보내기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-muted/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium line-clamp-1 ${!notification.isRead ? 'text-primary' : ''}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="flex-grow overflow-hidden m-0 p-0">
            <ScrollArea className="h-full w-full">
              <div className="p-4">
                <h3 className="text-sm font-medium mb-3">알림 채널</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">웹 알림</p>
                        <p className="text-xs text-muted-foreground">웹사이트 내에서 알림을 받습니다.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings?.channels.web || false} 
                      onCheckedChange={(checked) => handleSettingChange('channel', 'web', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">이메일 알림</p>
                        <p className="text-xs text-muted-foreground">중요한 알림을 이메일로 받습니다.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings?.channels.email || false} 
                      onCheckedChange={(checked) => handleSettingChange('channel', 'email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">푸시 알림</p>
                        <p className="text-xs text-muted-foreground">모바일 기기로 푸시 알림을 받습니다.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings?.channels.push || false} 
                      onCheckedChange={(checked) => handleSettingChange('channel', 'push', checked)}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-sm font-medium mb-3">알림 유형</h3>
                <div className="space-y-3">
                  {settings && Object.entries(settings.types).map(([type, config]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(type as NotificationType)}
                        <div>
                          <p className="text-sm font-medium">
                            {(() => {
                              switch (type) {
                                case NotificationType.SYSTEM: return '시스템 알림';
                                case NotificationType.MESSAGE: return '메시지 알림';
                                case NotificationType.COURSE: return '강좌 알림';
                                case NotificationType.PAYMENT: return '결제 알림';
                                case NotificationType.MARKETING: return '마케팅 알림';
                                case NotificationType.NOTEBOOK: return '알림장 알림';
                                case NotificationType.REVIEW: return '리뷰 알림';
                                case NotificationType.COMMENT: return '댓글 알림';
                                case NotificationType.VIDEO_CALL: return '화상 수업 알림';
                                case NotificationType.TRAINING: return '훈련 알림';
                                default: return type;
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={config?.enabled || false} 
                        onCheckedChange={(checked) => handleSettingChange('type', type, checked)}
                      />
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendTestNotification}
                  >
                    테스트 알림 보내기
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}