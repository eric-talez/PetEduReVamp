import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../SimpleApp';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight, RefreshCw, CreditCard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';

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
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    toggleItemSelection, 
    toggleAllSelection, 
    calculateSubtotal, 
    calculateTotal, 
    selectedItemCount 
  } = useCart();

  const [referralCode, setReferralCode] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<ReferralCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(true);

  // 초기에 장바구니 모든 아이템 선택 상태 확인
  useEffect(() => {
    setAllSelected(cartItems.length > 0 && cartItems.every(item => item.isSelected));
  }, [cartItems]);

  // 모든 아이템 선택/해제
  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    toggleAllSelection(checked);
  };

  // 개별 아이템 선택/해제
  const handleSelectItem = (itemId: number, checked: boolean) => {
    toggleItemSelection(itemId, checked);
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

    if (selectedItemCount === 0) {
      toast({
        title: "상품을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    // 결제 페이지로 이동
    navigate('/shop/checkout');
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

  // 최종 결제 금액 계산 (추천인 코드 적용)
  const calculateFinalTotal = () => {
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
                    전체 선택 ({selectedItemCount}/{cartItems.length})
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  className="ml-auto text-sm"
                  onClick={() => {
                    const selectedItems = cartItems.filter(item => item.isSelected);
                    selectedItems.forEach(item => removeFromCart(item.id));
                    toast({
                      title: `${selectedItems.length}개 상품이 장바구니에서 삭제되었습니다`,
                    });
                  }}
                  disabled={selectedItemCount === 0}
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
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-3">
                      <div className="flex items-center border rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="w-10 text-center">{item.quantity}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 주문 요약 */}
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span>{calculateSubtotal().toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송비</span>
                <span>
                  {calculateShipping() === 0 ? (
                    <span className="text-green-600">무료</span>
                  ) : (
                    `${calculateShipping().toLocaleString()}원`
                  )}
                </span>
              </div>

              {appliedReferral && (
                <div className="flex justify-between text-primary">
                  <span className="flex items-center">
                    <Check className="mr-1 h-4 w-4" />
                    추천인 할인 ({appliedReferral.discount}%)
                  </span>
                  <span>-{calculateReferralDiscount().toLocaleString()}원</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span>{calculateFinalTotal().toLocaleString()}원</span>
              </div>

              <div className="mt-6">
                <div className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="추천인 코드 입력"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    disabled={!!appliedReferral}
                    className="flex-1"
                  />
                  {appliedReferral ? (
                    <Button
                      variant="outline"
                      onClick={removeReferralCode}
                    >
                      제거
                    </Button>
                  ) : (
                    <Button
                      onClick={applyReferralCode}
                      disabled={isLoading}
                    >
                      {isLoading ? '확인 중...' : '적용'}
                    </Button>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={selectedItemCount === 0}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  {selectedItemCount > 0 ? '결제하기' : '상품을 선택해주세요'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => navigate('/shop')}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  쇼핑 계속하기
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-sm text-gray-500">
            <p>· 30,000원 이상 구매 시 무료 배송</p>
            <p>· 추천인 코드는 해당 코드를 발급한 트레이너에게 수수료가 지급됩니다.</p>
            <p>· 결제 완료 후 취소는 마이페이지 > 주문내역에서 가능합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}