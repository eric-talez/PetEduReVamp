import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Home, Package, Check, Info, ArrowLeft, ShoppingBag, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CheckoutPage() {
  const [location, navigate] = useLocation();
  const { cartItems, calculateSubtotal, selectedItemCount, clearCart } = useCart();
  const { isAuthenticated, userName } = useAuth();
  const { toast } = useToast();
  
  const [paymentTab, setPaymentTab] = useState('card');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderComplete, setOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    addressDetail: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    agreeTerms: false,
    agreePrivacy: false,
  });
  
  const [orderNumber, setOrderNumber] = useState('');
  
  // 주문 번호 생성
  function generateOrderNumber() {
    const timestamp = new Date().getTime();
    const randomDigits = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${randomDigits}`;
  }
  
  useEffect(() => {
    // 장바구니에 선택된 상품이 없으면 장바구니 페이지로 리다이렉트
    if (selectedItemCount === 0 && !orderComplete) {
      toast({
        title: "결제할 상품이 없습니다",
        description: "장바구니에서 상품을 선택해주세요.",
        variant: "destructive",
      });
      navigate('/shop/cart');
    }
    
    // 비로그인 상태면 로그인 페이지로 리다이렉트
    if (!isAuthenticated && !orderComplete) {
      toast({
        title: "로그인이 필요합니다",
        description: "결제를 진행하려면 로그인해주세요.",
        variant: "destructive",
      });
      navigate('/auth/login');
    }
  }, [isAuthenticated, selectedItemCount, navigate, orderComplete]);
  
  // 배송비 계산
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 30000 ? 0 : 3000;
  };
  
  // 최종 결제 금액 계산
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };
  
  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  // 선택 필드 변경 핸들러
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // 주문 완료 처리
  const handleCompleteOrder = () => {
    // 폼 검증
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // 결제 처리 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);
      setOrderComplete(true);
      setIsProcessing(false);
      
      // 장바구니 비우기
      clearCart();
      
      toast({
        title: "주문이 완료되었습니다",
        description: `주문번호: ${newOrderNumber}`,
      });
    }, 2000);
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    // 필수 입력 필드 검사
    const requiredFields = ['fullName', 'phone', 'email', 'address', 'zipCode'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "필수 정보를 입력해주세요",
          description: "배송 정보를 모두 입력해주세요.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    // 카드 결제 시 카드 정보 검사
    if (paymentTab === 'card') {
      const cardFields = ['cardNumber', 'cardName', 'cardExpiry', 'cardCvc'];
      for (const field of cardFields) {
        if (!formData[field as keyof typeof formData]) {
          toast({
            title: "카드 정보를 입력해주세요",
            description: "결제 정보를 모두 입력해주세요.",
            variant: "destructive",
          });
          return false;
        }
      }
    }
    
    // 약관 동의 검사
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast({
        title: "약관에 동의해주세요",
        description: "필수 약관에 모두 동의해주세요.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  // 주문 완료 화면
  if (orderComplete) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            주문번호: <span className="font-medium">{orderNumber}</span>
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h2 className="font-medium mb-4">주문 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">받는 사람:</p>
                <p className="font-medium">{formData.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">연락처:</p>
                <p className="font-medium">{formData.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">이메일:</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">배송지:</p>
                <p className="font-medium">{formData.address} {formData.addressDetail}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => navigate('/')}>
              홈으로 이동
            </Button>
            <Button variant="outline" onClick={() => navigate('/my-page/orders')}>
              주문 내역 확인
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/shop" className="hover:text-primary">쇼핑</a>
        <ChevronRight className="w-4 h-4 mx-1" />
        <a href="/shop/cart" className="hover:text-primary">장바구니</a>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-700 font-medium">결제</span>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">결제 정보 입력</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 주문 정보 & 결제 수단 */}
        <div className="lg:w-2/3">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">받는 사람 *</Label>
                  <Input 
                    id="fullName" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="실명을 입력해주세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="'-' 없이 입력해주세요"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="주문 내역을 받을 이메일을 입력해주세요"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">우편번호 *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="zipCode" 
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="우편번호"
                      className="flex-1"
                    />
                    <Button variant="outline" type="button">
                      주소 검색
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">주소 *</Label>
                <Input 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="기본 주소"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressDetail">상세 주소</Label>
                <Input 
                  id="addressDetail" 
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleInputChange}
                  placeholder="상세 주소 (선택사항)"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                배송 방법
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={shippingMethod} 
                onValueChange={setShippingMethod}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex flex-col">
                      <span>일반 배송</span>
                      <span className="text-sm text-gray-500">2~3일 소요 예정</span>
                    </Label>
                  </div>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? 
                      '무료' : 
                      `${calculateShipping().toLocaleString()}원`
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex flex-col">
                      <span>빠른 배송</span>
                      <span className="text-sm text-gray-500">익일 배송 (오후 3시 이전 주문 시)</span>
                    </Label>
                  </div>
                  <span className="font-medium">5,000원</span>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                결제 수단
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" value={paymentTab} onValueChange={setPaymentTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="card">카드 결제</TabsTrigger>
                  <TabsTrigger value="bank">무통장 입금</TabsTrigger>
                  <TabsTrigger value="mobile">모바일 결제</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4">
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod} 
                    className="flex flex-wrap gap-4 mb-6"
                  >
                    <div className="flex items-center border rounded-lg p-3">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="ml-2">신용카드</Label>
                    </div>
                    <div className="flex items-center border rounded-lg p-3">
                      <RadioGroupItem value="debit" id="debit" />
                      <Label htmlFor="debit" className="ml-2">체크카드</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">카드 번호</Label>
                    <Input 
                      id="cardNumber" 
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="0000-0000-0000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">카드 소유자 이름</Label>
                    <Input 
                      id="cardName" 
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="카드에 표시된 이름"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">만료일</Label>
                      <Input 
                        id="cardExpiry" 
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input 
                        id="cardCvc" 
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="installment">할부 선택</Label>
                    <Select>
                      <SelectTrigger id="installment">
                        <SelectValue placeholder="일시불" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">일시불</SelectItem>
                        <SelectItem value="2">2개월</SelectItem>
                        <SelectItem value="3">3개월</SelectItem>
                        <SelectItem value="4">4개월</SelectItem>
                        <SelectItem value="5">5개월</SelectItem>
                        <SelectItem value="6">6개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="bank" className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">무통장 입금 안내</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      아래 계좌로 입금해 주시면 확인 후 배송이 시작됩니다.
                    </p>
                    <p className="text-sm font-medium mt-2">
                      국민은행: 123-456-789012 (주식회사 페트에듀)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankDepositor">입금자명</Label>
                    <Input 
                      id="bankDepositor" 
                      placeholder="입금자 성함을 입력해주세요"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="mobile" className="space-y-4">
                  <div className="text-center p-6">
                    <div className="mx-auto w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400">QR 코드</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      모바일 결제를 위해 QR코드를 스캔해주세요.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* 주문 요약 */}
        <div className="lg:w-1/3">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
              <CardDescription>
                총 {selectedItemCount}개 상품
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 주문 상품 요약 */}
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {cartItems.filter(item => item.isSelected).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity}개</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {item.discountedPrice ? 
                          (item.discountedPrice * item.quantity).toLocaleString() : 
                          (item.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* 금액 정보 */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span>{calculateSubtotal().toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배송비</span>
                  <span>
                    {shippingMethod === 'express' ? '5,000원' : 
                      (calculateShipping() === 0 ? 
                        <span className="text-green-600">무료</span> : 
                        `${calculateShipping().toLocaleString()}원`
                      )
                    }
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>
                    {(calculateSubtotal() + 
                      (shippingMethod === 'express' ? 5000 : calculateShipping())
                    ).toLocaleString()}원
                  </span>
                </div>
              </div>
              
              {/* 약관 동의 */}
              <div className="space-y-3 mt-4">
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="agreeTerms" 
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 mr-2"
                  />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    주문 내용을 확인하였으며, 구매 조건 및 결제에 동의합니다 (필수)
                  </Label>
                </div>
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="agreePrivacy" 
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleInputChange}
                    className="mt-1 mr-2"
                  />
                  <Label htmlFor="agreePrivacy" className="text-sm">
                    개인정보 처리방침에 동의합니다 (필수)
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCompleteOrder}
                disabled={isProcessing}
              >
                {isProcessing ? '처리 중...' : '결제하기'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/shop/cart')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                장바구니로 돌아가기
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}