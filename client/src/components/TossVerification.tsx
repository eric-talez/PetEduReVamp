import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { shopApi, TossVerificationResult } from '@/lib/shop-api';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface TossVerificationProps {
  onVerificationComplete?: (result: TossVerificationResult) => void;
  buttonText?: string;
  redirectUrl?: string;
  className?: string;
}

export function TossVerification({
  onVerificationComplete,
  buttonText = '본인인증 시작하기',
  redirectUrl = window.location.origin + '/verification-callback',
  className = ''
}: TossVerificationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  // URL에서 txId 파라미터 체크 (콜백 URL로 돌아왔을 경우)
  const urlParams = new URLSearchParams(window.location.search);
  const txIdFromUrl = urlParams.get('txId');

  // txId가 URL에 있을 경우 자동으로 검증 결과 확인
  const { data: verificationResult, isLoading: isVerifying } = useQuery({
    queryKey: ['toss-verification', txIdFromUrl],
    queryFn: async () => {
      if (!txIdFromUrl) return null;
      try {
        const result = await shopApi.verifyTossResult(txIdFromUrl);
        if (result.success) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
        if (onVerificationComplete) {
          onVerificationComplete(result);
        }
        return result;
      } catch (error) {
        console.error('본인인증 확인 중 오류 발생:', error);
        setVerificationStatus('error');
        toast({
          title: '본인인증 확인 실패',
          description: '인증 결과를 확인하는 중 오류가 발생했습니다.',
          variant: 'destructive'
        });
        return null;
      }
    },
    enabled: !!txIdFromUrl,
    refetchOnWindowFocus: false
  });

  const startVerification = async () => {
    setIsLoading(true);
    try {
      const result = await shopApi.startTossVerification(redirectUrl);
      
      // 외부 인증 페이지로 리다이렉트
      window.location.href = result.redirectUrl;
    } catch (error) {
      console.error('본인인증 시작 중 오류 발생:', error);
      toast({
        title: '본인인증 실패',
        description: '인증을 시작하는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  // 결과 표시 컴포넌트
  const renderVerificationResult = () => {
    if (!verificationResult) return null;

    if (verificationResult.success) {
      return (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
            <CheckCircle className="h-5 w-5" />
            <h3 className="font-medium">본인인증 완료</h3>
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">이름:</span> {verificationResult.userName}</p>
            {verificationResult.birthDate && (
              <p><span className="font-medium">생년월일:</span> {verificationResult.birthDate}</p>
            )}
            {verificationResult.phoneNumber && (
              <p><span className="font-medium">연락처:</span> {verificationResult.phoneNumber}</p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-medium">본인인증 실패</h3>
          </div>
          <p className="text-sm">{verificationResult.errorMessage || '알 수 없는 오류가 발생했습니다.'}</p>
        </div>
      );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>본인 인증</CardTitle>
        <CardDescription>
          안전한 서비스 이용을 위해 본인 인증이 필요합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>본인인증 결과를 확인하고 있습니다...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Label htmlFor="verification-info">인증 안내</Label>
              <p className="text-sm text-muted-foreground mt-1">
                토스 인증을 통해 본인 확인을 진행합니다. 인증 후에는 구매 및 결제 서비스를 이용하실 수 있습니다.
              </p>
            </div>
            {renderVerificationResult()}
          </>
        )}
      </CardContent>
      <CardFooter>
        {!verificationResult?.success && !isVerifying && (
          <Button 
            onClick={startVerification} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                인증 페이지로 이동 중...
              </>
            ) : (
              buttonText
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default TossVerification;