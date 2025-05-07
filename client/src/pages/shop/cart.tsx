import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../SimpleApp';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight, RefreshCw, CreditCard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// 장바구니 아이템 타입 정의
interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  imageUrl: string;
  color?: string;
  size?: string;
  inStock: boolean;
  isSelected: boolean;
}

// 추천인 코드 타입 정의
interface ReferralCode {
  code: string;
  discount: number;
  valid: boolean;
}

export default function CartPage() {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allSelected, setAllSelected] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<ReferralCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 장바구니 아이템 데이터 로드 (실제로는 API에서 가져와야 함)
  useEffect(() => {
    // 모의 데이터
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        productId: 1,
        name: "프리미엄 반려견 훈련용 클리커",
        price: 15000,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1598875384021-4a23470c7997?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        inStock: true,
        isSelected: true
      },
      {
        id: 2,
        productId: 3,
        name: "프리미엄 가죽 리드줄",
        price: 45000,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1581434271564-7e273485524c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        color: "브라운",
        size: "M",
        inStock: true,
        isSelected: true
      },
      {
        id: 3,
        productId: 2,
        name: "반려견 지능 개발 장난감 세트",
        price: 35000,
        discountedPrice: 29750, // 15% 할인
        quantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        inStock: true,
        isSelected: true
      }
    ];

    setCartItems(mockCartItems);
  }, []);

  // 모든 아이템 선택/해제
  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    setCartItems(prevItems => 
      prevItems.map(item => ({ ...item, isSelected: checked }))
    );
  };

  // 개별 아이템 선택/해제
  const handleSelectItem = (itemId: number, checked: boolean) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, isSelected: checked } : item
      )
    );

    // 모든 아이템 선택 여부 확인
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, isSelected: checked } : item
    );
    setAllSelected(updatedItems.every(item => item.isSelected));
  };

  // 수량 변경
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 아이템 삭제
  const removeItem = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({
      title: "상품이 장바구니에서 삭제되었습니다",
    });
  };

  // 선택된 아이템 삭제
  const removeSelectedItems = () => {
    const selectedCount = cartItems.filter(item => item.isSelected).length;
    if (selectedCount === 0) return;

    setCartItems(prevItems => prevItems.filter(item => !item.isSelected));
    toast({
      title: `${selectedCount}개 상품이 장바구니에서 삭제되었습니다`,
    });
  };

  // 추천인 코드 적용
  const applyReferralCode = () => {
    if (!referralCode.trim()) {
      toast({
        title: "추천인 코드를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // 실제로는 API 호출을 통해 추천인 코드 검증을 해야 함
    setTimeout(() => {
      // 예시: 모든 코드가 유효하다고 가정
      setAppliedReferral({
        code: referralCode,
        discount: 10, // 10% 할인
        valid: true
      });
      setIsLoading(false);
      toast({
        title: "추천인 코드가 적용되었습니다",
        description: "10% 할인이 적용됩니다",
      });
    }, 1000);
  };

  // 추천인 코드 제거
  const removeReferralCode = () => {
    setAppliedReferral(null);
    setReferralCode('');
    toast({
      title: "추천인 코드가 제거되었습니다",
    });
  };

  // 결제 처리
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인이 필요합니다",
        description: "결제를 진행하려면 로그인해주세요",
        variant: "destructive",
      });
      return;
    }

    const selectedItems = cartItems.filter(item => item.isSelected);
    if (selectedItems.length === 0) {
      toast({
        title: "상품을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    // 결제 페이지로 이동
    navigate('/shop/checkout');
  };

  // 선택된 상품의 총 금액 계산
  const calculateSubtotal = () => {
    return cartItems
      .filter(item => item.isSelected)
      .reduce((total, item) => {
        const itemPrice = item.discountedPrice || item.price;
        return total + itemPrice * item.quantity;
      }, 0);
  };

  // 배송비 계산 (3만원 이상 무료, 그 이하는 3,000원)
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 30000 ? 0 : 3000;
  };

  // 추천인 코드 할인 계산
  const calculateReferralDiscount = () => {
    if (!appliedReferral) return 0;
    return Math.round(calculateSubtotal() * (appliedReferral.discount / 100));
  };

  // 최종 결제 금액 계산
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() - calculateReferralDiscount();
  };

  // 장바구니가 비어있을 때
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto text-center py-12">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h1>
          <p className="text-gray-600 mb-6">
            장바구니에 상품을 추가하고 반려견과 함께 행복한 시간을 보내세요!
          </p>
          <Button onClick={() => navigate('/shop')}>
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/shop" className="hover:text-primary">쇼핑</a>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-700 font-medium">장바구니</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">장바구니</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 장바구니 목록 */}
        <div className="lg:w-2/3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <div className="flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={allSelected && cartItems.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="ml-2">
                    전체 선택 ({cartItems.filter(item => item.isSelected).length}/{cartItems.length})
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  className="ml-auto text-sm"
                  onClick={removeSelectedItems}
                  disabled={!cartItems.some(item => item.isSelected)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  선택 삭제
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex py-4 border-b last:border-0"
                >
                  <div className="flex items-center mr-4">
                    <Checkbox
                      checked={item.isSelected}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </div>

                  <div className="flex-shrink-0 mr-4">
                    <a href={`/shop/product/${item.productId}`}>
                      <div className="w-20 h-20 rounded-md overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </a>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <a
                          href={`/shop/product/${item.productId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.name}
                        </a>
                        
                        {(item.color || item.size) && (
                          <div className="text-sm text-gray-500 mt-1">
                            {item.color && <span>색상: {item.color}</span>}
                            {item.color && item.size && <span> / </span>}
                            {item.size && <span>사이즈: {item.size}</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end mt-2 md:mt-0">
                        <div className="flex items-center">
                          {item.discountedPrice ? (
                            <>
                              <span className="font-medium">
                                {(item.discountedPrice * item.quantity).toLocaleString()}원
                              </span>
                              <span className="ml-1 text-sm text-gray-500 line-through">
                                {(item.price * item.quantity).toLocaleString()}원
                              </span>
                            </>
                          ) : (
                            <span className="font-medium">
                              {(item.price * item.quantity).toLocaleString()}원
                            </span>
                          )}
                        </div>

                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/shop')}>
                쇼핑 계속하기
              </Button>
              <Button onClick={handleCheckout} disabled={!cartItems.some(item => item.isSelected)}>
                {cartItems.filter(item => item.isSelected).length}개 상품 주문하기
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 주문 요약 */}
        <div className="lg:w-1/3">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 추천인 코드 입력 */}
              <div>
                <Label className="mb-2 block">추천인 코드</Label>
                <div className="flex">
                  <Input
                    placeholder="추천인 코드 입력"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    disabled={!!appliedReferral || isLoading}
                    className="mr-2"
                  />
                  {appliedReferral ? (
                    <Button
                      variant="outline"
                      onClick={removeReferralCode}
                      className="whitespace-nowrap"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      취소
                    </Button>
                  ) : (
                    <Button
                      onClick={applyReferralCode}
                      disabled={isLoading}
                      className="whitespace-nowrap"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        "적용"
                      )}
                    </Button>
                  )}
                </div>
                {appliedReferral && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    {appliedReferral.discount}% 할인 적용됨
                  </div>
                )}
              </div>

              <Separator />

              {/* 가격 정보 */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span>{calculateSubtotal().toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배송비</span>
                  <span>
                    {calculateShipping() === 0
                      ? "무료"
                      : `${calculateShipping().toLocaleString()}원`}
                  </span>
                </div>
                {appliedReferral && (
                  <div className="flex justify-between text-green-600">
                    <span>추천인 할인 ({appliedReferral.discount}%)</span>
                    <span>-{calculateReferralDiscount().toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span>{calculateTotal().toLocaleString()}원</span>
              </div>

              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleCheckout}
                disabled={!cartItems.some(item => item.isSelected)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                결제하기
              </Button>

              <div className="text-xs text-gray-500 mt-2">
                결제하기 버튼을 클릭하면 구매 조건에 동의하는 것으로 간주합니다.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}