import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotification, NotificationType, NotificationChannel } from '@/hooks/useNotification';
import { useToast } from '@/hooks/use-toast';

export default function NotificationTestPage() {
  const { toast } = useToast();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    sendTestNotification 
  } = useNotification();

  // 테스트 알림 전송
  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification(
        NotificationType.SYSTEM,
        [NotificationChannel.WEB]
      );
      
      toast({
        title: '테스트 알림 생성 성공',
        description: '테스트 알림이 생성되었습니다.',
        variant: 'default'
      });
    } catch (error) {
      console.error('테스트 알림 생성 오류:', error);
      toast({
        title: '테스트 알림 생성 실패',
        description: '알림 생성 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">알림 시스템 테스트</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>알림 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">읽지 않은 알림: <span className="font-bold text-primary">{unreadCount}</span></p>
            <p>총 알림: <span className="font-bold">{notifications.length}</span></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>알림 동작</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={handleSendTestNotification}>
              테스트 알림 생성하기
            </Button>
            
            <Button variant="outline" onClick={() => markAllAsRead()}>
              모든 알림 읽음 표시
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>알림 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">알림이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`p-4 rounded-lg border ${notification.isRead ? 'bg-background' : 'bg-muted'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-primary' : ''}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        읽음 표시
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}