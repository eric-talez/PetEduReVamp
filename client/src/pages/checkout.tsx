import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface CourseInfo {
  id: number;
  title: string;
  price: number;
  description: string;
  duration: number;
}

interface ProductInfo {
  id: number;
  name: string;
  price: number;
  description: string;
}

const CheckoutForm: React.FC<{
  itemInfo: CourseInfo | ProductInfo;
  itemType: 'course' | 'product';
}> = ({ itemInfo, itemType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast({
          title: "결제 실패",
          description: error.message || "결제 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "결제 완료",
          description: itemType === 'course' ? "강의 구매가 완료되었습니다!" : "상품 구매가 완료되었습니다!",
        });
        if (itemType === 'course') {
          navigate(`/course/${itemInfo.id}`);
        } else {
          navigate(`/shop/order-complete?productId=${itemInfo.id}`);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "결제 오류",
        description: "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <PaymentElement />
      </div>
      
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          size="default"
          onClick={() => navigate(itemType === 'course' ? "/courses" : "/shop")}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {itemType === 'course' ? '강의 목록으로' : '쇼핑 목록으로'}
        </Button>
        
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          variant="default"
          size="lg"
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              결제 처리 중...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              {isTestMode ? '100' : itemInfo.price.toLocaleString()}원 결제하기
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [location] = useLocation();
  
  const searchString = window.location.search;
  const searchParams = new URLSearchParams(searchString);
  
  const courseId = searchParams.get('courseId');
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');
  const productPrice = searchParams.get('price');
  const itemType = searchParams.get('type') as 'course' | 'product';
  const isTestMode = searchParams.get('test') === 'true';
  const [clientSecret, setClientSecret] = useState("");

  // 강의 정보 조회
  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ['/api/admin/curriculums'],
    enabled: !!courseId,
  });

  // 강의 정보 추출
  const courseInfo: CourseInfo | null = courseData && (courseData as any).curriculums ? 
    (courseData as any).curriculums.find((course: any) => 
      course.id === parseInt(courseId || '0')
    ) ? {
      id: parseInt(courseId || '0'),
      title: (courseData as any).curriculums.find((course: any) => course.id === parseInt(courseId || '0'))?.title || '',
      price: (courseData as any).curriculums.find((course: any) => course.id === parseInt(courseId || '0'))?.price || 0,
      description: (courseData as any).curriculums.find((course: any) => course.id === parseInt(courseId || '0'))?.description || '',
      duration: (courseData as any).curriculums.find((course: any) => course.id === parseInt(courseId || '0'))?.duration || 0,
    } : null : null;

  // 상품 정보 생성
  const productInfo: ProductInfo | null = productId ? {
    id: parseInt(productId),
    name: productName || '상품',
    price: parseInt(productPrice || '0'),
    description: '상품 설명',
  } : null;

  const itemInfo = itemType === 'course' ? courseInfo : productInfo;

  useEffect(() => {
    if (itemInfo) {
      // 테스트 모드일 경우 100원, 아니면 원래 가격
      const paymentAmount = isTestMode ? 100 : itemInfo.price;
      
      // Payment Intent 생성
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount * 100, // 원을 센트로 변환
          currency: 'krw',
          itemType,
          itemId: itemInfo.id,
          isTestMode,
        }),
      })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(error => console.error('Payment Intent 생성 실패:', error));
    }
  }, [itemInfo, itemType, isTestMode]);

  if ((itemType === 'course' && isCourseLoading) || !itemInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
            <p>결제 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">결제하기</h1>
          
          <div className="border-b pb-4 mb-4">
            <h2 className="font-semibold">
              {itemType === 'course' ? '강의' : '상품'}: {
                itemType === 'course' 
                  ? (itemInfo as CourseInfo).title 
                  : (itemInfo as ProductInfo).name
              }
            </h2>
            {isTestMode && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded mt-2">
                <p className="text-sm text-blue-700 font-semibold mb-2">🧪 테스트 결제 모드</p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>• 실제 결제되지 않습니다</p>
                  <p>• 테스트 카드: <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code></p>
                  <p>• 만료일: 아무 미래 날짜 (예: 12/25)</p>
                  <p>• CVC: 아무 3자리 숫자 (예: 123)</p>
                </div>
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {itemType === 'course' 
                ? (itemInfo as CourseInfo).description 
                : (itemInfo as ProductInfo).description
              }
            </p>
            <div className="flex justify-between items-center mt-3">
              <div>
                <span className="text-lg font-bold">
                  {isTestMode ? '100' : itemInfo.price.toLocaleString()}원
                </span>
                {isTestMode && (
                  <div className="text-sm text-orange-600 mt-1">
                    💡 테스트 모드: 100원 테스트 결제
                  </div>
                )}
              </div>
              {itemType === 'course' && (
                <span className="text-sm text-gray-500">
                  {(itemInfo as CourseInfo).duration}분
                </span>
              )}
            </div>
          </div>
          
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm itemInfo={itemInfo} itemType={itemType} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}