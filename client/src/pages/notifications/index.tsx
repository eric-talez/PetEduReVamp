import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNotifications } from '@/hooks/use-notifications';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Check, 
  Filter, 
  RefreshCw, 
  Trash2,
  Info,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function NotificationsPage() {
  const { 
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    sendTestNotification
  } = useNotifications();
  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // 알림 목록 API 호출
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/notifications', filter, showUnreadOnly],
    queryFn: async () => {
      const status = showUnreadOnly ? 'unread' : filter === 'all' ? undefined : filter;
      const response = await fetch(`/api/notifications?status=${status || ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    }
  });
  
  // 테스트 알림 전송
  const handleSendTestNotification = () => {
    sendTestNotification.mutate({
      title: '테스트 알림',
      message: '이것은 테스트 알림입니다.',
      type: 'info',
      linkTo: '/notifications'
    });
  };
  
  // 알림 필터링
  const filteredNotifications = notifications.filter(notification => {
    // 읽음 필터
    if (showUnreadOnly && notification.isRead) return false;
    
    // 타입 필터
    if (filter !== 'all' && notification.type !== filter) return false;
    
    // 검색어 필터
    if (search && !notification.title.toLowerCase().includes(search.toLowerCase()) && 
        !notification.message.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // 알림 타입에 따른 아이콘
  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-3 h-3 rounded-full bg-green-500" />;
      case 'error':
        return <div className="w-3 h-3 rounded-full bg-red-500" />;
      case 'warning':
        return <div className="w-3 h-3 rounded-full bg-amber-500" />;
      case 'info':
      default:
        return <div className="w-3 h-3 rounded-full bg-blue-500" />;
    }
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">알림 센터</h1>
          <p className="text-muted-foreground mt-1">
            모든 알림을 한 곳에서 관리하세요
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={!unreadCount}
          >
            <Check className="h-4 w-4 mr-2" />
            모두 읽음 표시
          </Button>
          
          <Button 
            variant="outline" 
            onClick={clearAllNotifications}
            disabled={!notifications.length}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            모두 지우기
          </Button>
          
          {process.env.NODE_ENV !== 'production' && (
            <Button onClick={handleSendTestNotification} disabled={sendTestNotification.isPending}>
              <Bell className="h-4 w-4 mr-2" />
              테스트 알림 전송
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-72">
          <Input
            placeholder="알림 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="unread-only" 
            checked={showUnreadOnly}
            onCheckedChange={setShowUnreadOnly}
          />
          <Label htmlFor="unread-only">읽지 않은 알림만 보기</Label>
        </div>
        
        <div className="flex items-center ml-auto">
          <Button variant="ghost" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="info">정보</TabsTrigger>
          <TabsTrigger value="success">성공</TabsTrigger>
          <TabsTrigger value="warning">경고</TabsTrigger>
          <TabsTrigger value="error">오류</TabsTrigger>
          <TabsTrigger value="system">시스템</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter} className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">알림을 불러오는 중...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">알림이 없습니다</h3>
              <p className="text-muted-foreground text-center mt-1">
                {showUnreadOnly 
                  ? '읽지 않은 알림이 없습니다.' 
                  : filter !== 'all' 
                    ? `'${filter}' 유형의 알림이 없습니다.` 
                    : '알림이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`
                    border-l-4 
                    ${notification.isRead ? '' : 'bg-primary/5 dark:bg-primary/10'} 
                    ${
                      notification.type === 'info' ? 'border-l-blue-500' :
                      notification.type === 'success' ? 'border-l-green-500' :
                      notification.type === 'warning' ? 'border-l-amber-500' :
                      notification.type === 'error' ? 'border-l-red-500' :
                      'border-l-slate-500'
                    }
                  `}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {getIconForType(notification.type)}
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        {!notification.isRead && (
                          <Badge variant="default" className="ml-2">새 알림</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8"
                            title="읽음으로 표시"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 text-muted-foreground"
                          title="알림 삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {notification.timestamp instanceof Date
                        ? format(notification.timestamp, 'PPpp', { locale: ko })
                        : '시간 정보 없음'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{notification.message}</p>
                    {notification.linkTo && (
                      <Button
                        variant="link"
                        className="px-0 h-auto text-sm mt-2"
                        onClick={() => {
                          markAsRead(notification.id);
                          window.location.href = notification.linkTo || '';
                        }}
                      >
                        자세히 보기
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}