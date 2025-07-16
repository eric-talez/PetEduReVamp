import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CreditCard, BookOpen, Clock, Star } from "lucide-react";

// Stripe 공개 키 로드
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CourseInfo {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  category: string;
  difficulty: string;
  duration: number;
  price: number;
  enrollmentCount: number;
  rating: number;
  thumbnailUrl: string;
}

const CheckoutForm = ({ courseInfo }: { courseInfo: CourseInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/course/${courseInfo.id}`,
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        toast({
          title: "결제 실패",
          description: error.message || "결제 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "결제 완료",
          description: "강의 구매가 완료되었습니다!",
        });
        navigate(`/course/${courseInfo.id}`);
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
          onClick={() => navigate("/courses")}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          강의 목록으로
        </Button>
        
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
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
              {courseInfo.price.toLocaleString()}원 결제하기
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const courseId = searchParams.get('courseId');
  const [clientSecret, setClientSecret] = useState("");

  // 강의 정보 조회
  const { data: courseInfo, isLoading: isCourseLoading } = useQuery({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId,
  });

  useEffect(() => {
    if (courseInfo) {
      // PaymentIntent 생성
      apiRequest("POST", "/api/create-payment-intent", {
        amount: courseInfo.price,
        courseId: courseInfo.id,
        courseTitle: courseInfo.title
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('PaymentIntent 생성 오류:', error);
        });
    }
  }, [courseInfo]);

  if (!courseId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">강의를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">올바른 강의 링크를 통해 접근해주세요.</p>
            <Button onClick={() => window.location.href = '/courses'}>
              강의 목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCourseLoading || !clientSecret) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>결제 준비 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!courseInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">강의를 찾을 수 없습니다</h2>
            <Button onClick={() => window.location.href = '/courses'}>
              강의 목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">강의 구매</h1>
          <p className="text-gray-600">안전한 결제 시스템으로 강의를 구매하세요</p>
        </div>

        <div className="grid gap-6">
          {/* 강의 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                구매할 강의
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{courseInfo.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{courseInfo.trainerName}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor(courseInfo.duration / 60)}시간 {courseInfo.duration % 60}분
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {courseInfo.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {courseInfo.price.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-500">
                    {courseInfo.enrollmentCount}명 수강중
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 결제 양식 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm courseInfo={courseInfo} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}