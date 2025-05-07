
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "../components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { 
  AlertCircle, 
  Bell, 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Info, 
  Package, 
  Settings, 
  Shield, 
  Star, 
  Tag, 
  Trash2 
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AppLayout } from "@/layout/AppLayout";

// 알림 유형별 아이콘 및 색상 매핑
const notificationTypeMap = {
  system: {
    icon: <Info className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  training: {
    icon: <Star className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  event: {
    icon: <Calendar className="w-5 h-5" />,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  payment: {
    icon: <Tag className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  security: {
    icon: <Shield className="w-5 h-5" />,
    color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  order: {
    icon: <Package className="w-5 h-5" />,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  pet: {
    icon: <Bell className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

// 알림 인터페이스
interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: keyof typeof notificationTypeMap;
  read: boolean;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  // 샘플 알림 데이터
  useEffect(() => {
    // 실제 애플리케이션에서는 API를 통해 알림 데이터를 가져와야 합니다
    const mockNotifications: Notification[] = [
      {
        id: "notif1",
        title: "수업 일정 알림",
        content: "내일 오후 3시 기초 훈련 클래스가 예정되어 있습니다. 반려견과 함께 참석해 주세요. 준비물: 리드줄, 간식, 물병, 매트. 주차는 건물 뒤편에서 가능합니다. 수업 시작 10분 전에 도착해서 반려견이 환경에 적응할 수 있게 해주세요.",
        timestamp: "2024-02-15T09:00:00",
        type: "event",
        read: false,
        link: "/calendar"
      },
      {
        id: "notif2",
        title: "결제 완료",
        content: "프리미엄 반려견 훈련용 클리커 구매가 완료되었습니다. 배송은 1-2일 내로 시작될 예정입니다.",
        timestamp: "2024-02-14T15:30:00",
        type: "payment",
        read: false,
        link: "/shop/orders"
      },
      {
        id: "notif3",
        title: "수강 신청 마감 임박",
        content: "관심 표시한 '반려견 행동 교정 마스터' 클래스 신청이 내일 마감됩니다. 지금 바로 등록하세요!",
        timestamp: "2024-02-13T10:15:00",
        type: "system",
        read: true,
        link: "/courses"
      },
      {
        id: "notif4",
        title: "이벤트 안내",
        content: "서울 강남 지역 반려동물 페스티벌이 이번 주말에 개최됩니다. 다양한 부스와 프로그램이 준비되어 있으니 반려동물과 함께 방문해보세요.",
        timestamp: "2024-02-12T13:45:00",
        type: "event",
        read: true,
        link: "/events"
      },
      {
        id: "notif5",
        title: "멍멍이의 훈련 피드백",
        content: "오늘 멍멍이의 '앉아' 훈련 진도가 많이 나아졌습니다. 집에서도 짧은 세션으로 연습해 주세요. 손 신호와 간식 보상을 함께 사용하는 것이 효과적입니다.",
        timestamp: "2024-02-11T17:20:00",
        type: "training",
        read: false,
        link: "/my-pets/training"
      },
      {
        id: "notif6",
        title: "시스템 점검 안내",
        content: "내일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다. 이 시간 동안 서비스 이용이 제한될 수 있습니다.",
        timestamp: "2024-02-10T09:00:00",
        type: "security",
        read: true
      },
      {
        id: "notif7",
        title: "구매하신 상품 배송 시작",
        content: "주문하신 '프리미엄 강아지 사료 5kg'이 배송을 시작했습니다. 배송 추적은 주문 내역에서 확인하실 수 있습니다.",
        timestamp: "2024-02-09T11:30:00",
        type: "order",
        read: true,
        link: "/shop/orders"
      },
      {
        id: "notif8",
        title: "멍멍이 건강 체크 알림",
        content: "멍멍이의 다음 건강 검진 날짜가 다음 주 화요일입니다. 예약을 확인해 주세요.",
        timestamp: "2024-02-08T08:15:00",
        type: "pet",
        read: false,
        link: "/my-pets/health"
      },
      {
        id: "notif9",
        title: "새로운 훈련 과정 추천",
        content: "멍멍이의 활동 수준과 훈련 진도에 맞춰 '중급 순종 훈련' 과정을 추천합니다. 관심이 있으시면 확인해 보세요.",
        timestamp: "2024-02-07T14:20:00",
        type: "training",
        read: true,
        link: "/courses"
      },
      {
        id: "notif10",
        title: "계정 보안 강화 안내",
        content: "최근 비밀번호가 변경된 지 90일이 지났습니다. 계정 보안을 위해 비밀번호 변경을 권장합니다.",
        timestamp: "2024-02-06T10:00:00",
        type: "security",
        read: false,
        link: "/settings/security"
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // 알림 확장/축소 토글
  const toggleExpand = (id: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 알림을 읽음으로 표시
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // 알림 삭제
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // 모든 알림을 읽음으로 표시
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // 필터링 및 검색된 알림 목록
  const filteredNotifications = notifications.filter(notif => {
    // 유형 필터링
    if (filter !== "all" && notif.type !== filter) {
      return false;
    }
    
    // 검색어 필터링
    if (searchQuery && !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notif.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">알림장</h1>
            <p className="text-gray-500 mt-1">모든 알림과 메시지를 확인하세요</p>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                className="flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                모두 읽음
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setNotifications([])}
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              전체 삭제
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {}}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 mr-4">
                <Bell className="h-6 w-6 text-blue-500 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">알림 정보</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  알림은 30일 동안 보관되며, 그 이후에는 자동으로 삭제됩니다. 지금 읽지 않은 알림이 {unreadCount}개 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-medium mb-4">필터</h3>
              
              <div className="space-y-2">
                <Button 
                  variant={filter === "all" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("all")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  모든 알림 ({notifications.length})
                </Button>
                <Button 
                  variant={filter === "system" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("system")}
                >
                  <Info className="mr-2 h-4 w-4" />
                  시스템 ({notifications.filter(n => n.type === "system").length})
                </Button>
                <Button 
                  variant={filter === "training" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("training")}
                >
                  <Star className="mr-2 h-4 w-4" />
                  훈련 피드백 ({notifications.filter(n => n.type === "training").length})
                </Button>
                <Button 
                  variant={filter === "event" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("event")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  일정 ({notifications.filter(n => n.type === "event").length})
                </Button>
                <Button 
                  variant={filter === "payment" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("payment")}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  결제 ({notifications.filter(n => n.type === "payment").length})
                </Button>
                <Button 
                  variant={filter === "order" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("order")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  주문 ({notifications.filter(n => n.type === "order").length})
                </Button>
                <Button 
                  variant={filter === "pet" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("pet")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  반려견 알림 ({notifications.filter(n => n.type === "pet").length})
                </Button>
                <Button 
                  variant={filter === "security" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setFilter("security")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  보안 ({notifications.filter(n => n.type === "security").length})
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="mb-4">
              <Input 
                placeholder="알림 검색..." 
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="unread">읽지 않음 ({unreadCount})</TabsTrigger>
                <TabsTrigger value="read">읽음 ({notifications.length - unreadCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <NotificationCard 
                        key={notification.id} 
                        notification={notification}
                        isExpanded={expandedNotifications.has(notification.id)}
                        onToggleExpand={() => toggleExpand(notification.id)}
                        onMarkAsRead={() => markAsRead(notification.id)}
                        onDelete={() => deleteNotification(notification.id)}
                      />
                    ))
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">알림이 없습니다</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {searchQuery ? 
                          `'${searchQuery}'에 대한 검색 결과가 없습니다.` : 
                          "이 카테고리에 알림이 없습니다."}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="unread">
                <div className="space-y-4">
                  {filteredNotifications.filter(n => !n.read).length > 0 ? (
                    filteredNotifications
                      .filter(n => !n.read)
                      .map((notification) => (
                        <NotificationCard 
                          key={notification.id} 
                          notification={notification}
                          isExpanded={expandedNotifications.has(notification.id)}
                          onToggleExpand={() => toggleExpand(notification.id)}
                          onMarkAsRead={() => markAsRead(notification.id)}
                          onDelete={() => deleteNotification(notification.id)}
                        />
                      ))
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">읽지 않은 알림이 없습니다</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        모든 알림을 확인했습니다.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="read">
                <div className="space-y-4">
                  {filteredNotifications.filter(n => n.read).length > 0 ? (
                    filteredNotifications
                      .filter(n => n.read)
                      .map((notification) => (
                        <NotificationCard 
                          key={notification.id} 
                          notification={notification}
                          isExpanded={expandedNotifications.has(notification.id)}
                          onToggleExpand={() => toggleExpand(notification.id)}
                          onMarkAsRead={() => markAsRead(notification.id)}
                          onDelete={() => deleteNotification(notification.id)}
                        />
                      ))
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">읽은 알림이 없습니다</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        아직 읽은 알림이 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// 알림 카드 컴포넌트
interface NotificationCardProps {
  notification: Notification;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

function NotificationCard({ 
  notification, 
  isExpanded, 
  onToggleExpand, 
  onMarkAsRead, 
  onDelete 
}: NotificationCardProps) {
  const { icon, color } = notificationTypeMap[notification.type];
  
  // 알림 읽음 표시
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead();
    }
    onToggleExpand();
  };
  
  return (
    <Card className={`p-4 border-l-4 transition-all ${!notification.read ? 'border-l-blue-500' : 'border-l-transparent'}`}>
      <div className="flex items-start">
        <div className={`rounded-full w-10 h-10 flex items-center justify-center mr-4 ${color}`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                {notification.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3 mr-1" />
                <span>
                  {format(new Date(notification.timestamp), 'yyyy년 M월 d일 a h:mm', { locale: ko })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {!notification.read && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  새 알림
                </Badge>
              )}
            </div>
          </div>
          
          <div className={`text-sm mt-2 ${isExpanded ? '' : 'line-clamp-2'} text-gray-600 dark:text-gray-400`}>
            {notification.content}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={handleClick}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  간략히 보기
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  자세히 보기
                </>
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              {notification.link && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7 px-2 py-0"
                  asChild
                >
                  <a href={notification.link}>바로 가기</a>
                </Button>
              )}
              
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs h-7 px-2 py-0"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                >
                  읽음 표시
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs h-7 px-2 py-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
