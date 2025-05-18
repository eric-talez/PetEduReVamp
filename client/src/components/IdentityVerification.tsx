import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Lock, UserCheck, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-compat';
import { Progress } from "@/components/ui/progress";

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
  const auth = useAuth();
  const userName = auth?.userName || '사용자';
  
  const verificationSuccess = (data: VerificationData) => {
    setIsVerifying(false);
    setIsCompleted(true);
    setDialogOpen(false);
    toast({
      title: '본인인증 완료',
      description: '성공적으로 본인인증이 완료되었습니다.',
      variant: 'default',
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
  
  // 인증 진행 단계 (1: 시작, 2: 인증진행, 3: 완료)
  const [verificationStep, setVerificationStep] = useState(1);
  
  // 인증 진행률 계산 
  const getProgressValue = () => {
    if (isCompleted) return 100;
    if (isVerifying) return 75;
    if (dialogOpen) return 33;
    return 0;
  };
  
  return (
    <>
      {isCompleted ? (
        <Alert className="mb-4 border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>본인인증 완료</AlertTitle>
          <AlertDescription>
            {userName}님의 본인인증이 완료되었습니다.
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
          
          {/* 인증 단계 표시 */}
          <div className="my-2">
            <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>인증 요청</span>
              <span>정보 확인</span>
              <span>인증 완료</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
            
            <div className="mt-3 flex justify-between items-center">
              <div className={`flex flex-col items-center ${verificationStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${verificationStep >= 1 ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="text-xs mt-1">요청</span>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-300" />
              
              <div className={`flex flex-col items-center ${verificationStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${verificationStep >= 2 ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="text-xs mt-1">진행</span>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-300" />
              
              <div className={`flex flex-col items-center ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isCompleted ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="text-xs mt-1">완료</span>
              </div>
            </div>
          </div>
          
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
              onClick={() => {
                setVerificationStep(2);
                handleTossVerification();
              }}
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