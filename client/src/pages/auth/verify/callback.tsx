import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { DogLoading } from '@/components/DogLoading';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Toss 본인인증 콜백 페이지
 * 
 * Toss 본인확인 API에서 리다이렉트되어 인증 결과를 처리하는 페이지
 * 결과를 로컬 스토리지에 저장하고 팝업을 닫아 부모 창에 신호를 보냄
 */
export default function VerifyCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // URL 파라미터에서 인증 결과 파싱
  useEffect(() => {
    const processVerification = async () => {
      try {
        // URL에서 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        // 로컬 스토리지에서 state 값 확인 (CSRF 방지)
        const savedState = localStorage.getItem('toss_auth_state');
        
        // 오류 처리
        if (error) {
          throw new Error(errorDescription || '본인인증 처리 중 오류가 발생했습니다.');
        }
        
        // state 불일치 확인 (CSRF 공격 방지)
        if (!state || state !== savedState) {
          throw new Error('인증 요청 정보가 일치하지 않습니다. 다시 시도해주세요.');
        }
        
        if (!code) {
          throw new Error('인증 코드가 전달되지 않았습니다. 다시 시도해주세요.');
        }
        
        // 서버에 인증 코드 검증 요청
        const response = await fetch('/api/auth/verify-identity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '서버 검증에 실패했습니다.');
        }
        
        // 성공 응답 처리
        const data = await response.json();
        
        // 결과를 로컬 스토리지에 저장 (부모 창에서 확인 가능)
        localStorage.setItem('toss_auth_result', JSON.stringify({
          success: true,
          data: {
            ci: data.ci,
            name: data.name,
            birth: data.birth,
            phone: data.phone,
            gender: data.gender,
            isAdult: data.is_adult
          }
        }));
        
        // 상태 업데이트
        setStatus('success');
        
        // 1초 후 창 닫기 (부모 창에서 감지 가능)
        setTimeout(() => {
          window.close();
        }, 1500);
      } catch (err: any) {
        console.error('본인인증 처리 오류:', err);
        setStatus('error');
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
        
        // 오류 결과 저장
        localStorage.setItem('toss_auth_result', JSON.stringify({
          success: false,
          message: err.message || '알 수 없는 오류가 발생했습니다.'
        }));
        
        // 오류 메시지 표시
        toast({
          title: '본인인증 실패',
          description: err.message || '알 수 없는 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        // state 정보 삭제
        localStorage.removeItem('toss_auth_state');
      }
    };
    
    processVerification();
  }, [toast]);
  
  const handleClose = () => {
    window.close();
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {status === 'loading' && (
          <div className="text-center">
            <DogLoading message="본인인증 결과 처리 중..." size="medium" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              인증 결과를 처리하는 중입니다. 잠시만 기다려주세요.
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <Alert variant="success" className="flex flex-col items-center text-center py-6">
            <CheckCircle className="h-12 w-12 mb-2" />
            <AlertTitle className="text-xl">본인인증 완료</AlertTitle>
            <AlertDescription className="text-base">
              본인인증이 성공적으로 완료되었습니다.
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                잠시 후 자동으로 창이 닫힙니다.
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'error' && (
          <div className="space-y-4">
            <Alert variant="destructive" className="flex flex-col items-center text-center py-6">
              <XCircle className="h-12 w-12 mb-2" />
              <AlertTitle className="text-xl">본인인증 실패</AlertTitle>
              <AlertDescription className="text-base">
                {error || '본인인증 처리 중 오류가 발생했습니다.'}
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center">
              <Button onClick={handleClose} className="mt-2">
                창 닫기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}