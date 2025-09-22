import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CreditCard, ShoppingBag, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState({
    type: 'product', // 'product' | 'course'
    items: [],
    totalAmount: 0,
    courseInfo: null
  });

  // URL 파라미터에서 주문 정보 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'product';
    const id = urlParams.get('id');
    const amount = parseInt(urlParams.get('amount') || '0');

    if (type === 'course' && id) {
      // 강의 정보 로드
      fetchCourseInfo(id).then(courseInfo => {
        setOrderData({
          type: 'course',
          items: [],
          totalAmount: amount,
          courseInfo
        });
      });
    } else {
      // 장바구니에서 상품 정보 로드
      loadCartItems();
    }
  }, []);

  const fetchCourseInfo = async (courseId: string) => {
    try {
      // TODO: 실제 API 엔드포인트로 변경해야 함
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('강의 정보를 가져오지 못했습니다.');
      }
      const course = await response.json();
      return course;
    } catch (error) {
      console.error('강의 정보 로드 오류:', error);
      toast({
        title: "오류",
        description: "강의 정보를 불러오는 데 실패했습니다.",
        variant: "destructive",
      });
      return null;
    }
  };

  const loadCartItems = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('petedu_cart') || '[]');
      const total = cartItems.reduce((sum: number, item: any) => 
        sum + (item.price * item.quantity), 0);

      setOrderData({
        type: 'product',
        items: cartItems,
        totalAmount: total,
        courseInfo: null
      });
    } catch (error) {
      console.error('장바구니 로드 오류:', error);
      toast({
        title: "오류",
        description: "장바구니를 불러오는 데 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const authState = window.__peteduAuthState;
      if (!authState?.isAuthenticated) {
        toast({
          title: "로그인이 필요합니다",
          variant: "destructive",
        });
        setLocation('/auth/login');
        return;
      }

      const paymentData = {
        userId: authState.userId,
        type: orderData.type,
        amount: orderData.totalAmount,
        items: orderData.type === 'course' 
          ? [{ courseId: orderData.courseInfo?.id, type: 'course', title: orderData.courseInfo?.title }]
          : orderData.items.map((item: any) => ({
              productId: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              option: item.option
            })),
        paymentMethod: 'card' // 현재는 카드 결제만 지원
      };

      // TODO: 실제 백엔드 API 엔드포인트로 변경해야 함
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "결제가 완료되었습니다",
          description: orderData.type === 'course' 
            ? "강의 수강이 시작됩니다."
            : "주문이 접수되었습니다.",
        });

        // 성공 페이지로 이동
        setLocation(`/shop/order-complete?orderId=${result.orderId}`);

        // 장바구니에서 구매한 상품 제거 (상품 구매 시)
        if (orderData.type === 'product') {
          const currentCart = JSON.parse(localStorage.getItem('petedu_cart') || '[]');
          const purchasedItemIds = new Set(orderData.items.map((item: any) => item.id));
          const updatedCart = currentCart.filter((item: any) => !purchasedItemIds.has(item.id));
          localStorage.setItem('petedu_cart', JSON.stringify(updatedCart));
          // 장바구니 업데이트 이벤트 발생
          window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { cartItems: updatedCart }
          }));
        }
        
      } else {
        throw new Error(result.message || '결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('결제 오류:', error);
      toast({
        title: "결제 실패",
        description: error.message || "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">결제하기</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 주문 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {orderData.type === 'course' ? (
                <GraduationCap className="h-5 w-5" />
              ) : (
                <ShoppingBag className="h-5 w-5" />
              )}
              {orderData.type === 'course' ? '강의 정보' : '주문 정보'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderData.type === 'course' && orderData.courseInfo ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">강의명</span>
                  <span>{orderData.courseInfo.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">강사</span>
                  <span>{orderData.courseInfo.instructor?.name || '정보 없음'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">수강료</span>
                  <span className="font-bold">{orderData.totalAmount.toLocaleString()}원</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {orderData.items.length === 0 ? (
                  <p className="text-sm text-gray-500">주문할 상품이 없습니다.</p>
                ) : (
                  orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} {item.option ? `(${item.option})` : ''} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))
                )}
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>총 결제금액</span>
              <span className="text-[#03c75a]">{orderData.totalAmount.toLocaleString()}원</span>
            </div>
          </CardContent>
        </Card>

        {/* 결제 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              결제 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 
              TODO: 실제 결제 모듈 연동 시 카드 정보 입력 필드는
              PG사에서 제공하는 SDK/라이브러리를 사용해야 합니다.
              여기서는 입력 필드만 예시로 표시합니다.
            */}
            <div>
              <label className="block text-sm font-medium mb-2">카드 번호</label>
              <Input placeholder="0000-0000-0000-0000" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">유효기간</label>
                <Input placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVC</label>
                <Input placeholder="000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">카드 소유자명</label>
              <Input placeholder="홍길동" />
            </div>

            <Button 
              className="w-full bg-[#03c75a] hover:bg-[#02b04a]" 
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing || orderData.items.length === 0 && !orderData.courseInfo}
            >
              {isProcessing ? '결제 처리 중...' : `${orderData.totalAmount.toLocaleString()}원 결제하기`}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              안전한 결제를 위해 PG사 결제창을 이용합니다. (현재는 데모 버전)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}