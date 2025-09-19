
import { useState } from 'react';
import { Bell, BellRing, Check, Trash2, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'system' | 'course' | 'event' | 'health' | 'payment' | 'message';
  isRead: boolean;
  createdAt: string;
  data?: any;
}

const notificationTypeLabels = {
  system: '시스템',
  course: '강좌',
  event: '이벤트',
  health: '건강',
  payment: '결제',
  message: '메시지'
};

const notificationTypeColors = {
  system: 'bg-gray-500',
  course: 'bg-blue-500',
  event: 'bg-green-500',
  health: 'bg-red-500',
  payment: 'bg-yellow-500',
  message: 'bg-purple-500'
};

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { unreadCount, sendTestNotification } = useNotifications();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 알림 목록 조회
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications', filterType, filterRead],
    queryFn: async () => {
      let url = '/api/notifications?limit=50';
      if (filterRead !== 'all') {
        url += `&status=${filterRead}`;
      }
      const response = await apiRequest('GET', url);
      return response.json() as Promise<Notification[]>;
    },
  });

  // 알림 읽음 처리
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest('PATCH', `/api/notifications/${notificationId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: '알림 읽음',
        description: '알림이 읽음으로 처리되었습니다.',
      });
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
      toast({
        title: '알림 삭제',
        description: '알림이 삭제되었습니다.',
      });
    },
  });

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' && notification.isRead) ||
                       (filterRead === 'unread' && !notification.isRead);
    const matchesSearch = searchTerm === '' || 
                         notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesRead && matchesSearch;
  });

  const handleTestNotification = () => {
    sendTestNotification({
      title: '테스트 알림',
      message: `현재 시간: ${new Date().toLocaleString('ko-KR')}`,
      type: 'system'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">알림을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6" />
              <CardTitle>알림장</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="danger">
                  {unreadCount}개 읽지 않음
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
              >
                테스트 알림
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                >
                  모두 읽음
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="알림 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="타입" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 타입</SelectItem>
                {Object.entries(notificationTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRead} onValueChange={setFilterRead}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="읽음 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="unread">읽지 않음</SelectItem>
                <SelectItem value="read">읽음</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 알림 목록 */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              표시할 알림이 없습니다.
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-colors ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {!notification.isRead && (
                      <BellRing className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`${notificationTypeColors[notification.type]} text-white`}
                        >
                          {notificationTypeLabels[notification.type]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      
                      <h3 className={`font-medium mb-1 ${!notification.isRead ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                        title="읽음으로 표시"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNotificationMutation.mutate(notification.id)}
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
