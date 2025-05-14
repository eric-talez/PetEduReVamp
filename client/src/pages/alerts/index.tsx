import { useState, useEffect } from 'react';
import { useAuth } from '../../SimpleApp';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Clock, Settings, Filter, UserRoundCheck, LayoutGrid, ListFilter } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Alert {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'system' | 'course' | 'trainer' | 'payment' | 'event';
  actionUrl?: string;
}

export default function AlertsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // API 요청 대신 목업 데이터 사용
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: '시스템 공지사항',
        content: '서비스 점검이 예정되어 있습니다. 5월 15일 오전 2시부터 4시까지 이용이 제한될 수 있습니다.',
        date: '2025-05-13T10:00:00',
        isRead: false,
        type: 'system',
      },
      {
        id: '2',
        title: '강좌 알림',
        content: '내일 예정된 "반려견 기초 훈련" 수업이 있습니다. 준비물을 확인해주세요.',
        date: '2025-05-14T09:30:00',
        isRead: true,
        type: 'course',
        actionUrl: '/my-courses/1'
      },
      {
        id: '3',
        title: '훈련사 메시지',
        content: '김훈련 훈련사님이 메시지를 보냈습니다: "다음 수업 시간에 대해 상담하고 싶습니다."',
        date: '2025-05-14T08:15:00',
        isRead: false,
        type: 'trainer',
        actionUrl: '/messages/5'
      },
      {
        id: '4',
        title: '결제 알림',
        content: '귀하의 프리미엄 멤버십이 성공적으로 갱신되었습니다.',
        date: '2025-05-12T14:20:00',
        isRead: true,
        type: 'payment',
        actionUrl: '/profile/payments'
      },
      {
        id: '5',
        title: '이벤트 알림',
        content: '여름 특별 세미나 "반려동물과 함께하는 여름 나기" 신청이 오픈되었습니다!',
        date: '2025-05-11T11:45:00',
        isRead: false,
        type: 'event',
        actionUrl: '/events/summer-seminar'
      }
    ];

    setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : activeTab === 'unread' 
      ? alerts.filter(alert => !alert.isRead) 
      : alerts.filter(alert => alert.type === activeTab);

  const markAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, isRead: true } 
          : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    toast({
      title: "알림 읽음 처리 완료",
      description: "모든 알림이 읽음 처리되었습니다.",
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings className="h-5 w-5" />;
      case 'course': return <LayoutGrid className="h-5 w-5" />;
      case 'trainer': return <UserRoundCheck className="h-5 w-5" />;
      case 'payment': return <ListFilter className="h-5 w-5" />;
      case 'event': return <Clock className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">알림</h1>
          <p className="text-muted-foreground mt-1">
            시스템 알림, 강좌 업데이트 및 다양한 알림을 확인하세요.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          className="mt-4 md:mt-0"
          disabled={!alerts.some(a => !a.isRead)}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          모두 읽음 처리
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="unread">안 읽은 알림</TabsTrigger>
            <TabsTrigger value="system">시스템</TabsTrigger>
            <TabsTrigger value="course">강좌</TabsTrigger>
            <TabsTrigger value="trainer">훈련사</TabsTrigger>
            <TabsTrigger value="payment">결제</TabsTrigger>
            <TabsTrigger value="event">이벤트</TabsTrigger>
          </TabsList>
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">필터:</span>
          </div>
        </div>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">알림 로딩 중...</span>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center my-4">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">알림이 없습니다</h3>
              <p className="text-muted-foreground mt-1">
                이 필터에 해당하는 알림이 없습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <Card key={alert.id} className={`transition-all ${!alert.isRead ? 'border-l-4 border-l-primary' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-2 p-2 bg-muted rounded-full">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {format(new Date(alert.date), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={alert.isRead ? "outline" : "default"}>
                    {alert.isRead ? '읽음' : '안 읽음'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>{alert.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                {alert.actionUrl && (
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => window.location.href = alert.actionUrl!}>
                    자세히 보기
                  </Button>
                )}
                {!alert.isRead && (
                  <Button size="sm" onClick={() => markAsRead(alert.id)}>
                    읽음 표시
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}