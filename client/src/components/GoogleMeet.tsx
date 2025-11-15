import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GoogleMeetProps {
  meetingUrl?: string;
  title: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  onLeave?: () => void;
}

export default function GoogleMeet({
  meetingUrl: providedMeetingUrl,
  title,
  startTime,
  endTime,
  description,
  onLeave
}: GoogleMeetProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState(providedMeetingUrl || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 미팅 URL이 제공되지 않은 경우 생성
    if (!providedMeetingUrl) {
      createMeeting();
    }
  }, [providedMeetingUrl]);

  const createMeeting = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // CSRF 토큰 조회
      const csrfRes = await fetch('/api/auth/csrf', { credentials: 'include' });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken || csrfData.data?.token;

      // Google Meet 링크 생성
      const response = await fetch('/api/google-meet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          startTime: startTime || new Date().toISOString(),
          endTime: endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          description
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google Meet 링크 생성 실패');
      }

      const data = await response.json();
      setMeetingUrl(data.data.meetingUrl);

      toast({
        title: 'Google Meet 준비 완료',
        description: '미팅 링크가 생성되었습니다.',
      });

      setIsLoading(false);

    } catch (error: any) {
      console.error('[Google Meet] 링크 생성 오류:', error);
      const errorMessage = error.message || 'Google Meet 링크 생성 중 오류가 발생했습니다';
      setError(errorMessage);
      setIsLoading(false);

      toast({
        title: 'Google Meet 생성 실패',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handleJoinMeeting = () => {
    if (meetingUrl) {
      window.open(meetingUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: '화상 수업 시작',
        description: 'Google Meet 창이 열렸습니다.',
      });
    }
  };

  const handleLeave = () => {
    if (onLeave) {
      onLeave();
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">미팅 생성 실패</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLeave} variant="outline" className="w-full">
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Google Meet 링크 생성 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 87.5 72" xmlns="http://www.w3.org/2000/svg">
              <path d="m87.5 14.8c0-8.2-6.6-14.8-14.8-14.8h-57.9c-8.2 0-14.8 6.6-14.8 14.8v42.5c0 8.2 6.6 14.8 14.8 14.8h57.9c8.2 0 14.8-6.6 14.8-14.8z" fill="#00832d"/>
              <path d="m38.3 38.8c-2.6 2.6-6.8 2.6-9.4 0l-16.4-16.4c-1.1-1.1-1.1-2.8 0-3.9 1.1-1.1 2.8-1.1 3.9 0l16.4 16.4c1.3 1.3 3.4 1.3 4.7 0l29.8-29.8c1.1-1.1 2.8-1.1 3.9 0 1.1 1.1 1.1 2.8 0 3.9z" fill="#fff"/>
            </svg>
            {title}
          </CardTitle>
          <CardDescription>
            {description || 'Google Meet으로 화상 수업에 참여하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {startTime && (
            <div className="text-sm text-muted-foreground">
              <p>시작 시간: {new Date(startTime).toLocaleString('ko-KR')}</p>
              {endTime && (
                <p>종료 시간: {new Date(endTime).toLocaleString('ko-KR')}</p>
              )}
            </div>
          )}

          {meetingUrl && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">미팅 링크:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-background p-2 rounded border">
                  {meetingUrl}
                </code>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(meetingUrl);
                    toast({
                      title: '링크 복사됨',
                      description: '미팅 링크가 클립보드에 복사되었습니다.',
                    });
                  }}
                  variant="outline"
                  size="sm"
                  data-testid="button-copy-link"
                >
                  복사
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleJoinMeeting}
              className="flex-1"
              size="lg"
              disabled={!meetingUrl}
              data-testid="button-join-meeting"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Google Meet 참여하기
            </Button>
            <Button
              onClick={handleLeave}
              variant="outline"
              size="lg"
              data-testid="button-leave-meeting"
            >
              <X className="w-5 h-5 mr-2" />
              나가기
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>* 새 탭에서 Google Meet이 열립니다</p>
            <p>* Google 계정으로 로그인이 필요할 수 있습니다</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
