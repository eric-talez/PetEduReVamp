import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Lock, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-compat';

interface IdentityVerificationProps {
  /**
   * 본인인증 후 호출될 콜백 함수
   * @param verificationData 본인인증 결과 데이터 (CI, 이름, 생년월일 등)
   */
  onVerified?: (verificationData: VerificationData) => void;
  /**
   * 본인인증 취소시 호출될 콜백 함수
   */
  onCancel?: () => void;
  /**
   * 본인인증 버튼 텍스트
   */
  buttonText?: string;
  /**
   * 본인인증이 필요한 컨텍스트 설명
   */
  contextMessage?: string;
}

export interface VerificationData {
  ci: string;
  name: string;
  birth: string;
  phone: string;
  gender?: string;
  isAdult?: boolean;
}

/**
 * 본인인증 컴포넌트
 * Toss 본인확인 API를 사용하여 사용자 본인인증을 처리합니다.
 */
export function IdentityVerification({ 
  onVerified, 
  onCancel, 
  buttonText = '본인인증하기', 
  contextMessage = '정산 계좌 등록을 위해 본인인증이 필요합니다.'
}: IdentityVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const verificationSuccess = (data: VerificationData) => {
    setIsVerifying(false);
    setIsCompleted(true);
    setDialogOpen(false);
    toast({
      title: '본인인증 완료',
      description: '성공적으로 본인인증이 완료되었습니다.',
      variant: 'success',
    });
    onVerified && onVerified(data);
  };
  
  const handleVerificationStart = () => {
    setDialogOpen(true);
    setError(null);
  };
  
  const handleTossVerification = () => {
    setIsVerifying(true);
    setError(null);
    
    // state 값은 CSRF 방지용 임의의 문자열
    const state = Math.random().toString(36).substring(2, 15);
    
    // 로컬스토리지에 state 저장 (콜백에서 검증용)
    localStorage.setItem('toss_auth_state', state);
    
    // Toss 본인확인 창 띄우기
    const clientKey = process.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/verify/callback`);
    const authUrl = `https://auth.tosspayments.com/authorize?clientKey=${clientKey}&redirectUri=${redirectUri}&state=${state}`;
    
    // 팝업 창 열기
    const popupWindow = window.open(
      authUrl, 
      'tossAuth', 
      'width=500,height=700,scrollbars=yes'
    );
    
    // 팝업창 닫힘 감지
    const checkPopupClosed = setInterval(() => {
      if (popupWindow?.closed) {
        clearInterval(checkPopupClosed);
        setIsVerifying(false);
        
        // 로컬 스토리지에서 인증 결과 확인
        const verificationResult = localStorage.getItem('toss_auth_result');
        if (verificationResult) {
          try {
            const resultData = JSON.parse(verificationResult);
            if (resultData.success) {
              verificationSuccess(resultData.data);
              localStorage.removeItem('toss_auth_result');
            } else {
              setError(resultData.message || '본인인증에 실패했습니다.');
            }
          } catch (e) {
            setError('본인인증 처리 중 오류가 발생했습니다.');
          }
        } else {
          // 사용자가 인증을 완료하지 않고 창을 닫은 경우
          setError('본인인증이 취소되었습니다.');
          onCancel && onCancel();
        }
      }
    }, 500);
  };
  
  const handleCancel = () => {
    setDialogOpen(false);
    onCancel && onCancel();
  };
  
  return (
    <>
      {isCompleted ? (
        <Alert variant="success" className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>본인인증 완료</AlertTitle>
          <AlertDescription>
            {user?.name || '사용자'}님의 본인인증이 완료되었습니다.
          </AlertDescription>
        </Alert>
      ) : (
        <Button 
          onClick={handleVerificationStart}
          variant="default"
          className="flex items-center gap-2"
        >
          <UserCheck className="h-4 w-4" />
          {buttonText}
        </Button>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>본인인증</DialogTitle>
            <DialogDescription>
              {contextMessage}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  왜 본인인증이 필요한가요?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground">
                  <li>정산 과정에서 본인 계좌 확인을 위해 필요합니다</li>
                  <li>전자금융거래법에 따라 금융 거래 시 실명 확인이 필요합니다</li>
                  <li>부정 사용 및 사기 방지를 위한 안전장치입니다</li>
                </ul>
              </CardContent>
            </Card>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>인증 오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isVerifying}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleTossVerification}
              disabled={isVerifying}
              className="flex items-center gap-2"
            >
              {isVerifying ? '인증 진행 중...' : '토스 본인인증 시작'}
              {isVerifying && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}