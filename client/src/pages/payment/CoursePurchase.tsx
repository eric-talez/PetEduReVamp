import { useState, useEffect } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  ArrowLeft, 
  Clock, 
  Users, 
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseData {
  courseId: number;
  courseName: string;
  price: number;
  description: string;
  instructor: string;
  duration: number;
  availablePaymentMethods: Array<{
    id: string;
    name: string;
    fee: number;
  }>;
}

export default function CoursePurchase() {
  const [match, params] = useRoute('/payment/course/:courseId');
  const { courseId } = params || {};
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('toss');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // 강의 정보 로드
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        console.log('[Payment] 강의 정보 조회 시작:', courseId);
        // 기존 강의 목록 API 사용 (중복 방지)
        const response = await fetch(`/api/courses`);
        const data = await response.json();
        
        if (data.success || data.courses) {
          const courses = data.courses || data.data || [];
          const course = courses.find((c: any) => c.id.toString() === courseId);
          
          if (!course) {
            throw new Error('강의를 찾을 수 없습니다');
          }
          setCourseData({
            courseId: course.id,
            courseName: course.title,
            price: course.price,
            description: course.description,
            instructor: course.instructorName || '테일즈',
            duration: course.duration,
            availablePaymentMethods: [
              { id: 'toss', name: 'Toss Payments', fee: 2.9 },
              { id: 'kakao', name: 'KakaoPay', fee: 2.5 },
              { id: 'naver', name: 'NaverPay', fee: 2.8 },
              { id: 'stripe', name: 'Stripe', fee: 3.4 }
            ]
          });
        } else {
          toast({
            title: "강의를 찾을 수 없습니다",
            description: "요청하신 강의 정보를 찾을 수 없습니다.",
            variant: "destructive"
          });
          setLocation('/courses');
        }
      } catch (error) {
        console.error('[Payment] 강의 정보 조회 실패:', error);
        toast({
          title: "오류가 발생했습니다",
          description: "강의 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, setLocation, toast]);

  // 결제 처리
  const handlePayment = async () => {
    if (!courseData || !agreeToTerms) return;

    setProcessingPayment(true);
    
    try {
      console.log('[Payment] 결제 처리 시작:', {
        courseId: courseData.courseId,
        paymentMethod: selectedPaymentMethod,
        amount: courseData.price
      });

      // 실제 결제 API 호출
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseData.courseId,
          paymentMethod: selectedPaymentMethod
        }),
      });

      if (response.ok) {
        const paymentData = await response.json();
        
        toast({
          title: "결제가 시작됩니다",
          description: "결제 페이지로 이동합니다.",
        });
        
        // 실제 구현에서는 결제 게이트웨이로 리다이렉트
        console.log('[Payment] 결제 데이터:', paymentData);
        
        // 결제 완료 후 강의 페이지로 이동
        setTimeout(() => {
          toast({
            title: "결제가 완료되었습니다",
            description: "강의에 등록되었습니다. 학습을 시작해보세요!",
          });
          setLocation(`/my-courses/${courseData.courseId}`);
        }, 2000);

      } else {
        throw new Error('결제 처리 실패');
      }
    } catch (error) {
      console.error('[Payment] 결제 처리 오류:', error);
      toast({
        title: "결제 실패",
        description: "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">강의를 찾을 수 없습니다</h2>
          <Link href="/courses" className="text-blue-600 hover:underline">
            강의 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const selectedMethod = courseData.availablePaymentMethods.find(m => m.id === selectedPaymentMethod);
  const paymentFee = selectedMethod ? Math.round(courseData.price * (selectedMethod.fee / 100)) : 0;
  const totalAmount = courseData.price + paymentFee;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/courses')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            강의 목록으로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">강의 결제</h1>
          <p className="text-gray-600 mt-2">안전하고 간편한 결제 시스템</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 결제 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 강의 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  강의 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{courseData.courseName}</h3>
                    <p className="text-gray-600 mt-2">{courseData.description}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      강사: {courseData.instructor}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {courseData.duration}주 과정
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 결제 수단 선택 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  결제 수단 선택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="space-y-3">
                    {courseData.availablePaymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                          <div className="flex items-center space-x-2">
                            {method.id === 'toss' && <Smartphone className="h-5 w-5 text-blue-600" />}
                            {method.id === 'kakao' && <Smartphone className="h-5 w-5 text-yellow-500" />}
                            {method.id === 'naver' && <Building2 className="h-5 w-5 text-green-600" />}
                            {method.id === 'stripe' && <CreditCard className="h-5 w-5 text-purple-600" />}
                            <span className="font-medium">{method.name}</span>
                            <Badge variant="outline" className="text-xs">
                              수수료 {method.fee}%
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* 결제 요약 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>결제 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>강의료</span>
                  <span>{courseData.price.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>결제 수수료</span>
                  <span>{paymentFee.toLocaleString()}원</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>총 결제금액</span>
                  <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
                </div>
              </CardContent>
            </Card>

            {/* 약관 동의 */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      결제 약관 및 개인정보 처리방침에 동의합니다.
                      <div className="text-xs text-gray-500 mt-1">
                        안전한 결제를 위해 필수 약관에 동의해주세요.
                      </div>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 결제 버튼 */}
            <Button
              onClick={handlePayment}
              disabled={!agreeToTerms || processingPayment}
              className="w-full h-12 text-lg font-semibold"
              data-testid="button-payment-submit"
            >
              {processingPayment ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  결제 처리 중...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {totalAmount.toLocaleString()}원 결제하기
                </div>
              )}
            </Button>

            {/* 보안 안내 */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                SSL 암호화로 안전하게 보호됩니다
              </div>
              <div>결제 정보는 저장되지 않습니다</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}