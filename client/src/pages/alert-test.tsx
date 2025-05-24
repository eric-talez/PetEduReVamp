import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotification, NotificationType, NotificationChannel } from '@/hooks/useNotification';
import { SimplifiedNotificationCenter } from '@/components/ui/simplified-notification-center';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * 알림 시스템 테스트 페이지 (간소화 버전)
 */
export default function AlertTestPage() {
  const [title, setTitle] = useState('테스트 알림');
  const [message, setMessage] = useState('이것은 테스트 알림 메시지입니다.');
  const [type, setType] = useState<NotificationType>(NotificationType.SYSTEM);
  
  const {
    sendTestNotification,
    markAllAsRead,
    unreadCount,
  } = useNotification();
  
  const handleSendTestNotification = async () => {
    await sendTestNotification(type, [NotificationChannel.WEB]);
  };
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">알림 시스템 테스트</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>알림 보내기</CardTitle>
            <CardDescription>테스트 알림을 전송하여 시스템을 확인합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="알림 제목" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">내용</label>
              <Input 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="알림 내용" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">알림 유형</label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as NotificationType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="알림 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NotificationType.SYSTEM}>시스템</SelectItem>
                  <SelectItem value={NotificationType.MESSAGE}>메시지</SelectItem>
                  <SelectItem value={NotificationType.COURSE}>강좌</SelectItem>
                  <SelectItem value={NotificationType.PAYMENT}>결제</SelectItem>
                  <SelectItem value={NotificationType.MARKETING}>마케팅</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSendTestNotification}>
              테스트 알림 보내기
            </Button>
            <Button variant="outline" onClick={markAllAsRead}>
              모두 읽음 표시
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>알림 현황</CardTitle>
            <CardDescription>현재 알림 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">읽지 않은 알림</h3>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <div>
                <SimplifiedNotificationCenter />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              * 이 페이지는 알림 시스템 디버깅 용도입니다
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}