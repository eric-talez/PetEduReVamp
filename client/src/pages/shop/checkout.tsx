import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  CreditCard,
  ShoppingBag,
  ChevronRight,
  Home,
  Truck,
  Info,
  Shield,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeftIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { LoadingErrorWrapper } from '@/components/ui/loading-error-wrapper';

export default function Checkout() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // 결제 정보 상태
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 주문 정보 입력 상태
  const [orderInfo, setOrderInfo] = useState({
    recipientName: '',
    phone: '',
    email: '',
    zipCode: '',
    address1: '',
    address2: '',
    deliveryRequest: '',
    paymentMethod: 'card',
    saveAddressInfo: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeAge: false
  });
  
  // 페이지 로드 시 결제 정보 불러오기
  useEffect(() => {
    try {
      const checkoutItemsJson = sessionStorage.getItem('checkout_items');
      if (!checkoutItemsJson) {
        setError('결제 정보를 찾을 수 없습니다. 장바구니로 돌아가 다시 시도해주세요.');
        setIsLoading(false);
        return;
      }
      
      const parsedData = JSON.parse(checkoutItemsJson);
      if (!parsedData.items || !Array.isArray(parsedData.items) || parsedData.items.length === 0) {
        setError('결제할 상품이 없습니다. 장바구니로 돌아가 다시 시도해주세요.');
        setIsLoading(false);
        return;
      }
      
      setCheckoutData(parsedData);
      
      // 인증된 사용자인 경우 기본 주문 정보 설정
      const windowAuth = window.__peteduAuthState;
      if (windowAuth && windowAuth.isAuthenticated) {
        setOrderInfo(prev => ({
          ...prev,
          recipientName: windowAuth.userName || '',
          email: windowAuth.userName ? `${windowAuth.userName.replace(/\s+/g, '').toLowerCase()}@example.com` : '' // 임시 이메일 생성
        }));
      }
      
    } catch (err) {
      console.error('결제 정보 로드 오류:', err);
      setError('결제 정보를 로드하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 입력 필드 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderInfo({ ...orderInfo, [name]: value });
  };
  
  // 체크박스 핸들러
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setOrderInfo({ ...orderInfo, [name]: checked });
  };
  
  // 결제 방법 핸들러
  const handlePaymentMethodChange = (value: string) => {
    setOrderInfo({ ...orderInfo, paymentMethod: value });
  };
  
  // 우편번호 검색 (실제로는 외부 API 연동 필요)
  const searchZipCode = () => {
    // 임시 구현: 실제로는 다음 우편번호 API 등 연동 필요
    toast({
      title: "우편번호 검색",
      description: "실제 구현 시 다음/카카오 우편번호 API 연동이 필요합니다.",
    });
    
    // 테스트용 데이터
    setOrderInfo({
      ...orderInfo,
      zipCode: '12345',
      address1: '서울시 강남구 테헤란로 123'
    });
  };
  
  // 결제 진행
  const processPayment = () => {
    // 필수 입력 검증
    if (!orderInfo.recipientName) {
      toast({
        title: "수령인 이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    if (!orderInfo.phone) {
      toast({
        title: "연락처를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    if (!orderInfo.email) {
      toast({
        title: "이메일을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    if (!orderInfo.zipCode || !orderInfo.address1) {
      toast({
        title: "배송지 정보를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    // 약관 동의 검증
    if (!orderInfo.agreeTerms || !orderInfo.agreePrivacy || !orderInfo.agreeAge) {
      toast({
        title: "필수 약관에 모두 동의해주세요",
        variant: "destructive",
      });
      return;
    }
    
    // 로딩 상태로 변경
    setIsLoading(true);
    
    // 결제 처리 (실제로는 API 호출)
    setTimeout(() => {
      try {
        // 결제 성공 가정
        const orderNumber = `ORDER-${Date.now()}`;
        
        // 주문 완료 후 장바구니에서 구매 상품 제거
        const cartItemsString = localStorage.getItem('petedu_cart') || '[]';
        const cartItems = JSON.parse(cartItemsString);
        const purchasedItemIds = checkoutData.items.map((item: any) => item.id);
        const remainingItems = cartItems.filter((item: any) => !purchasedItemIds.includes(item.id));
        
        localStorage.setItem('petedu_cart', JSON.stringify(remainingItems));
        
        // 주문 정보 저장 (실제 구현에서는 서버에 저장)
        const orderData = {
          orderNumber,
          orderInfo,
          items: checkoutData.items,
          paymentDetails: {
            subtotal: checkoutData.subtotal,
            shippingFee: checkoutData.shippingFee,
            discountTotal: checkoutData.discountTotal,
            total: checkoutData.total
          },
          commissionSummary: checkoutData.commissionSummary,
          status: 'paid',
          orderDate: new Date().toISOString()
        };
        
        // 로컬 스토리지에 주문 내역 저장 (데모용)
        const ordersHistory = JSON.parse(localStorage.getItem('petedu_orders') || '[]');
        ordersHistory.push(orderData);
        localStorage.setItem('petedu_orders', JSON.stringify(ordersHistory));
        
        // 세션 스토리지에서 결제 정보 제거
        sessionStorage.removeItem('checkout_items');
        
        // 이벤트 발생 (장바구니 아이콘 업데이트)
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { cartItems: remainingItems } 
        }));
        
        // 주문 완료 페이지로 이동
        navigate(`/shop/order-complete?order=${orderNumber}`);
        
      } catch (err) {
        console.error('결제 처리 오류:', err);
        setIsLoading(false);
        toast({
          title: "결제 처리 중 오류가 발생했습니다",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    }, 2000);
  };
  
  // 장바구니로 돌아가기
  const goBackToCart = () => {
    navigate('/shop/cart');
  };
  
  // 로딩 중이거나 오류 발생 시 표시
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#03c75a] border-solid mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">처리 중입니다...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">결제 정보 오류</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error}
          </p>
          <Button 
            onClick={goBackToCart}
            variant="outline"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            장바구니로 돌아가기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">결제하기</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 주문 정보 입력 폼 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 배송지 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                배송지 정보
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="recipientName">수령인 이름 *</Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    value={orderInfo.recipientName}
                    onChange={handleInputChange}
                    placeholder="수령인 이름을 입력하세요"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={orderInfo.phone}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={orderInfo.email}
                    onChange={handleInputChange}
                    placeholder="example@example.com"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex gap-2">
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={orderInfo.zipCode}
                      onChange={handleInputChange}
                      placeholder="우편번호"
                      className="mt-1"
                      readOnly
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={searchZipCode}
                      className="mt-1 whitespace-nowrap"
                    >
                      주소 검색
                    </Button>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Input
                      id="address1"
                      name="address1"
                      value={orderInfo.address1}
                      onChange={handleInputChange}
                      placeholder="기본 주소"
                      className="mt-1"
                      readOnly
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Input
                      id="address2"
                      name="address2"
                      value={orderInfo.address2}
                      onChange={handleInputChange}
                      placeholder="상세 주소"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="deliveryRequest">배송 요청사항</Label>
                  <Textarea
                    id="deliveryRequest"
                    name="deliveryRequest"
                    value={orderInfo.deliveryRequest}
                    onChange={handleInputChange}
                    placeholder="배송 기사님께 전달할 메시지를 입력하세요"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveAddressInfo"
                    checked={orderInfo.saveAddressInfo}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("saveAddressInfo", checked as boolean)
                    }
                  />
                  <label
                    htmlFor="saveAddressInfo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    이 배송지 정보를 저장합니다
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 결제 수단 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                결제 수단 선택
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <RadioGroup 
                value={orderInfo.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label htmlFor="payment-card">신용카드</Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="trans" id="payment-trans" />
                  <Label htmlFor="payment-trans">계좌이체</Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="phone" id="payment-phone" />
                  <Label htmlFor="payment-phone">휴대폰 결제</Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="kakao" id="payment-kakao" />
                  <Label htmlFor="payment-kakao">카카오페이</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          {/* 이용약관 동의 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">이용약관 동의</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={orderInfo.agreeTerms}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("agreeTerms", checked as boolean)
                    }
                  />
                  <div>
                    <label
                      htmlFor="agreeTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      [필수] 구매조건 확인 및 결제진행 동의
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      주문내용을 확인하였으며, 결제 진행에 동의합니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={orderInfo.agreePrivacy}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("agreePrivacy", checked as boolean)
                    }
                  />
                  <div>
                    <label
                      htmlFor="agreePrivacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      [필수] 개인정보 수집 및 이용 동의
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      주문 및 배송 등 서비스 이용을 위한 개인정보 수집에 동의합니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeAge"
                    checked={orderInfo.agreeAge}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("agreeAge", checked as boolean)
                    }
                  />
                  <div>
                    <label
                      htmlFor="agreeAge"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      [필수] 만 14세 이상 확인
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      만 14세 이상 고객만 구매할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 오른쪽: 주문 요약 */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
              <CardDescription>
                {checkoutData?.items.length || 0}개 상품
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* 주문 상품 목록 */}
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-4">
                {checkoutData?.items.map((item: any) => (
                  <div key={`${item.id}-${item.option}`} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <ShoppingBag className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {item.option} x {item.quantity}
                        </span>
                        <span className="text-sm font-medium">
                          {((item.price + (item.extraPrice || 0)) * item.quantity).toLocaleString()}원
                        </span>
                      </div>
                      
                      {/* 추천 코드 표시 */}
                      {item.referralCode && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs text-[#03c75a] border-[#03c75a]">
                            {item.referralSource === 'institute' ? '기관' : '트레이너'} 추천
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 가격 정보 */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">상품 금액</span>
                  <span>{checkoutData?.subtotal.toLocaleString()}원</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">배송비</span>
                  <span>
                    {checkoutData?.shippingFee > 0 
                      ? `${checkoutData.shippingFee.toLocaleString()}원` 
                      : '무료'}
                  </span>
                </div>
                
                {checkoutData?.discountTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">할인 금액</span>
                    <span className="text-red-600">-{checkoutData.discountTotal.toLocaleString()}원</span>
                  </div>
                )}
              </div>
              
              {/* 추천 수수료 요약 */}
              {checkoutData?.commissionSummary && Object.keys(checkoutData.commissionSummary).length > 0 && (
                <Accordion type="single" collapsible className="w-full border rounded-md">
                  <AccordionItem value="commissions" className="border-none">
                    <AccordionTrigger className="px-3 py-2 text-sm">
                      추천 수수료 정보 보기
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3">
                      <div className="space-y-3 text-xs">
                        {Object.entries(checkoutData.commissionSummary).map(([code, data]: [string, any]) => (
                          <div key={code} className="pb-2 border-b last:border-b-0">
                            <div className="font-medium mb-1 flex items-center gap-2">
                              <Badge variant="outline" className="text-[9px]">
                                {data.source === 'institute' ? '기관' : '트레이너'}
                              </Badge>
                              <span>{data.name}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>수수료율: {data.commissionRate}%</span>
                              <span>{Math.round(data.commissionAmount).toLocaleString()}원</span>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-1">
                          <div className="flex justify-between font-medium">
                            <span>총 수수료</span>
                            <span>
                              {Object.values(checkoutData.commissionSummary).reduce((sum: number, data: any) => 
                                sum + Math.round(data.commissionAmount), 0
                              ).toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              
              {/* 최종 금액 */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>결제 금액</span>
                  <span className="text-xl">{checkoutData?.total.toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col gap-4">
              <Button 
                className="w-full bg-[#03c75a] hover:bg-[#02b04a] text-white"
                onClick={processPayment}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                결제하기
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={goBackToCart}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                장바구니로 돌아가기
              </Button>
            </CardFooter>
          </Card>
          
          {/* 안내사항 */}
          <div className="mt-6 text-sm space-y-4">
            <div className="flex items-start">
              <Shield className="h-4 w-4 text-[#03c75a] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                안전 결제: SSL 보안 통신을 이용한 안전한 결제 시스템을 이용합니다.
              </span>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-[#03c75a] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                주문 완료 후 평일 기준 1-2일 내 출고됩니다. 주말 및 공휴일은 배송이 지연될 수 있습니다.
              </span>
            </div>
            
            <div className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-[#03c75a] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                구매 완료 시 수수료 내역이 기관 및 트레이너 정산 내역에 자동으로 반영됩니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}