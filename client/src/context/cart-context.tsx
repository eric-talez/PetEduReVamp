import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// 장바구니 아이템 타입 정의
export interface CartItem {
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

// 장바구니 컨텍스트 타입 정의
interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'id' | 'isSelected'>) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  toggleItemSelection: (itemId: number, isSelected: boolean) => void;
  toggleAllSelection: (isSelected: boolean) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  selectedItemCount: number;
}

// 장바구니 컨텍스트 생성
const CartContext = createContext<CartContextType | undefined>(undefined);

// 장바구니 프로바이더 컴포넌트
export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 로컬 스토리지에서 장바구니 정보 로드
  useEffect(() => {
    const storedCart = localStorage.getItem('petedu_cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('장바구니 데이터 로드 오류:', error);
      }
    }
  }, []);

  // 장바구니 정보가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('petedu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 총 장바구니 아이템 수
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 선택된 아이템 수
  const selectedItemCount = cartItems.filter(item => item.isSelected).length;

  // 장바구니에 아이템 추가
  const addToCart = (item: Omit<CartItem, 'id' | 'isSelected'>) => {
    // 이미 장바구니에 있는 상품인지 확인
    const existingItemIndex = cartItems.findIndex(
      cartItem => 
        cartItem.productId === item.productId &&
        cartItem.color === item.color &&
        cartItem.size === item.size
    );

    if (existingItemIndex !== -1) {
      // 이미 존재하는 아이템의 수량만 증가
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedItems);
      
      toast({
        title: "장바구니에 추가되었습니다",
        description: `${item.name} (총 ${updatedItems[existingItemIndex].quantity}개)`,
      });
    } else {
      // 새 아이템 추가
      const newItem: CartItem = {
        ...item,
        id: Date.now(), // 고유 ID 생성
        isSelected: true // 기본적으로 선택됨
      };
      
      setCartItems(prev => [...prev, newItem]);
      
      toast({
        title: "장바구니에 추가되었습니다",
        description: `${item.name} (${item.quantity}개)`,
      });
    }
  };

  // 장바구니에서 아이템 제거
  const removeFromCart = (itemId: number) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    
    if (itemToRemove) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "상품이 장바구니에서 제거되었습니다",
        description: itemToRemove.name,
      });
    }
  };

  // 아이템 수량 업데이트
  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // 아이템 선택 상태 토글
  const toggleItemSelection = (itemId: number, isSelected: boolean) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, isSelected } : item
      )
    );
  };

  // 모든 아이템 선택/해제
  const toggleAllSelection = (isSelected: boolean) => {
    setCartItems(prev =>
      prev.map(item => ({ ...item, isSelected }))
    );
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "장바구니가 비워졌습니다",
    });
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

  // 최종 결제 금액 계산 (배송비 포함)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    // 3만원 이상 무료 배송, 미만 시 3,000원
    const shipping = subtotal >= 30000 ? 0 : 3000;
    return subtotal + shipping;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        toggleAllSelection,
        clearCart,
        calculateSubtotal,
        calculateTotal,
        selectedItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 컨텍스트를 사용하기 위한 커스텀 훅
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}