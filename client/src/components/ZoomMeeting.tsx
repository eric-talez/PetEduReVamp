import { useEffect, useRef, useState } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

interface ZoomMeetingProps {
  meetingNumber: string;
  password?: string;
  userName: string;
  userEmail?: string;
  role?: number; // 0 = participant, 1 = host
  onLeave?: () => void;
}

export default function ZoomMeeting({
  meetingNumber,
  password = '',
  userName,
  userEmail = '',
  role = 0,
  onLeave
}: ZoomMeetingProps) {
  const { toast } = useToast();
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    const initializeZoom = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // CSRF 토큰 조회
        const csrfRes = await fetch('/api/auth/csrf', { credentials: 'include' });
        const csrfData = await csrfRes.json();
        const csrfToken = csrfData.csrfToken || csrfData.data?.token;

        // Signature 요청
        const signatureRes = await fetch('/api/zoom/signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          credentials: 'include',
          body: JSON.stringify({
            meetingNumber: meetingNumber.replace(/-/g, ''),
            role
          })
        });

        if (!signatureRes.ok) {
          const errorData = await signatureRes.json();
          throw new Error(errorData.message || 'Signature 생성 실패');
        }

        const signatureData = await signatureRes.json();
        const { signature, sdkKey } = signatureData.data;

        if (!signature || !sdkKey) {
          throw new Error('Signature 또는 SDK Key가 없습니다');
        }

        // Zoom Meeting SDK 초기화
        const client = ZoomMtgEmbedded.createClient();
        clientRef.current = client;

        if (!meetingContainerRef.current) {
          throw new Error('Meeting container not found');
        }

        // SDK 초기화
        await client.init({
          zoomAppRoot: meetingContainerRef.current,
          language: 'ko-KO',
          patchJsMedia: true,
          leaveOnPageUnload: true
        });

        console.log('[Zoom] SDK 초기화 성공');

        // 미팅 참여
        await client.join({
          signature,
          sdkKey,
          meetingNumber: meetingNumber.replace(/-/g, ''),
          password,
          userName,
          userEmail,
          tk: '', // Optional registration token
          zak: '' // Optional Zoom Access Key for hosts
        });

        console.log('[Zoom] 미팅 참여 성공');
        
        toast({
          title: '화상 수업 참여',
          description: '미팅에 성공적으로 참여했습니다.',
        });

        setIsLoading(false);

      } catch (error: any) {
        console.error('[Zoom] 초기화/참여 오류:', error);
        const errorMessage = error.message || '미팅 참여 중 오류가 발생했습니다';
        setError(errorMessage);
        setIsLoading(false);
        
        toast({
          title: '미팅 참여 실패',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    };

    initializeZoom();

    // Cleanup
    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
        } catch (err) {
          console.error('[Zoom] Leave meeting error:', err);
        }
      }
    };
  }, [meetingNumber, password, userName, userEmail, role, toast]);

  const handleLeave = () => {
    if (clientRef.current) {
      try {
        clientRef.current.leaveMeeting();
        toast({
          title: '미팅 종료',
          description: '화상 수업을 종료했습니다.',
        });
      } catch (err) {
        console.error('[Zoom] Leave error:', err);
      }
    }
    if (onLeave) {
      onLeave();
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            미팅 참여 실패
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <Button onClick={onLeave} variant="outline" className="w-full">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-50">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-white text-lg">화상 수업에 참여하는 중...</p>
        </div>
      )}
      
      {/* 나가기 버튼 */}
      <Button
        onClick={handleLeave}
        variant="destructive"
        size="sm"
        className="absolute top-4 right-4 z-40"
        data-testid="button-leave-meeting"
      >
        <X className="w-4 h-4 mr-2" />
        나가기
      </Button>

      {/* Zoom Meeting Container */}
      <div 
        ref={meetingContainerRef}
        id="zoom-meeting-container"
        className="w-full h-full"
      />
    </div>
  );
}
