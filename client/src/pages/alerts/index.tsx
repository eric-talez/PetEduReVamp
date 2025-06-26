import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'info',
      title: '새로운 강의 업데이트',
      message: '기본 훈련 강의에 새로운 내용이 추가되었습니다.',
      timestamp: '2025-05-30 14:30',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: '훈련 일정 변경',
      message: '내일 예정된 훈련 세션이 오후 3시로 변경되었습니다.',
      timestamp: '2025-05-30 12:15',
      isRead: false
    },
    {
      id: 3,
      type: 'success',
      title: '훈련 완료',
      message: '반려견 멍멍이의 기본 훈련이 성공적으로 완료되었습니다.',
      timestamp: '2025-05-29 16:45',
      isRead: true
    },
    {
      id: 4,
      type: 'error',
      title: '결제 실패',
      message: '월 구독료 결제가 실패했습니다. 결제 정보를 확인해주세요.',
      timestamp: '2025-05-29 09:20',
      isRead: false
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'info':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const markAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              알림
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              중요한 업데이트와 알림을 확인하세요.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {unreadCount}개 읽지 않음
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                모두 읽음 표시
              </Button>
            )}
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`transition-all duration-200 ${
                alert.isRead 
                  ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' 
                  : 'bg-white dark:bg-gray-800 shadow-md'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${
                          alert.isRead 
                            ? 'text-gray-600 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {alert.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        alert.isRead 
                          ? 'text-gray-500 dark:text-gray-500' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {alert.message}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.isRead && (
                      <Button
                        onClick={() => markAsRead(alert.id)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        읽음 표시
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteAlert(alert.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 빈 상태 */}
        {alerts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">알림이 없습니다</h3>
                <p>새로운 알림이 있을 때 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: '새로운 강의 추천',
      message: '김훈련사님의 새로운 기초 훈련 강의가 추가되었습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: '예약 확정',
      message: '내일 오후 2시 화상 상담이 확정되었습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: '건강검진 알림',
      message: '반려견 뽀삐의 건강검진 예정일이 다가왔습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">알림</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            모두 읽음 처리
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <span className="text-sm text-gray-500">
                      {notification.timestamp.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600">{notification.message}</p>
                  {!notification.read && (
                    <Badge variant="secondary" className="mt-2">
                      읽지 않음
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">알림이 없습니다</h3>
            <p className="text-gray-600">새로운 알림이 있으면 여기에 표시됩니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
