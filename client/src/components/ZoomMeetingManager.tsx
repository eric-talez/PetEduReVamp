
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Copy, Video, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZoomMeetingManagerProps {
  userRole: string;
  userName: string;
}

export default function ZoomMeetingManager({ userRole, userName }: ZoomMeetingManagerProps) {
  const [meetingId, setMeetingId] = useState('');
  const [password, setPassword] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateMeeting = () => {
    if (!meetingId.trim()) {
      toast({
        title: "회의 번호 필요",
        description: "Zoom 개인 회의 번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsShareDialogOpen(true);
  };

  const copyMeetingInfo = () => {
    const meetingInfo = `
🎯 TALEZ 화상수업 안내

👨‍🏫 훈련사: ${userName}
📹 Zoom 회의 참가
📞 회의 ID: ${meetingId}
${password ? `🔐 비밀번호: ${password}` : ''}

💻 참가 방법:
1. Zoom 앱에서 "회의 참가" 클릭
2. 회의 ID 입력: ${meetingId}
${password ? `3. 비밀번호 입력: ${password}` : ''}

📱 모바일: zoom.us/j/${meetingId}
💻 웹브라우저: https://zoom.us/j/${meetingId}

⏰ 수업 시간에 맞춰 참가해주세요!
    `.trim();

    navigator.clipboard.writeText(meetingInfo).then(() => {
      toast({
        title: "복사 완료",
        description: "회의 정보가 클립보드에 복사되었습니다.",
      });
    });
  };

  const shareToKakao = () => {
    const meetingInfo = `🎯 TALEZ 화상수업\n👨‍🏫 ${userName} 훈련사\n📞 회의 ID: ${meetingId}\n${password ? `🔐 비밀번호: ${password}` : ''}`;
    
    // 카카오톡 공유 (카카오 SDK가 로드된 경우)
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: meetingInfo,
        link: {
          mobileWebUrl: `https://zoom.us/j/${meetingId}`,
          webUrl: `https://zoom.us/j/${meetingId}`,
        },
      });
    } else {
      // 카카오 SDK가 없으면 일반 복사
      copyMeetingInfo();
    }
  };

  if (userRole !== 'trainer') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            화상수업
          </CardTitle>
          <CardDescription>
            훈련사가 화상수업을 시작하면 참가 정보를 받으실 수 있습니다.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          화상수업 관리
        </CardTitle>
        <CardDescription>
          Zoom 개인 회의 번호를 입력하고 수강생들과 공유하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meetingId">Zoom 개인 회의 번호 *</Label>
          <Input
            id="meetingId"
            placeholder="예: 123-456-7890"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">회의 비밀번호 (선택사항)</Label>
          <Input
            id="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleCreateMeeting} className="w-full" disabled={!meetingId.trim()}>
          <Share2 className="mr-2 h-4 w-4" />
          회의 정보 공유하기
        </Button>

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>화상수업 정보 공유</DialogTitle>
              <DialogDescription>
                아래 정보를 수강생들에게 공유해주세요.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">📹 TALEZ 화상수업</h4>
                <p><strong>훈련사:</strong> {userName}</p>
                <p><strong>회의 ID:</strong> {meetingId}</p>
                {password && <p><strong>비밀번호:</strong> {password}</p>}
                <p><strong>참가 링크:</strong> https://zoom.us/j/{meetingId}</p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={copyMeetingInfo} variant="outline" className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  복사하기
                </Button>
                <Button onClick={shareToKakao} className="flex-1">
                  💬 카카오톡 공유
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// 글로벌 타입 확장
declare global {
  interface Window {
    Kakao?: any;
  }
}
