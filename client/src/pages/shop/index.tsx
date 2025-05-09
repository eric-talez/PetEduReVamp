import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Menu as MenuIcon, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/theme-context';
import { useCart } from '@/context/cart-context';

/**
 * 쇼핑몰 메인 컴포넌트 (직접 구현)
 * - 모든 shop/* 경로 요청의 진입점 
 * - 인증 여부와 관계없이 접근 가능
 * - 독립적인 컴포넌트로 구현하여 라우팅 문제 해결
 */
export default function ShopIndex() {
  const [categories] = useState([
    { id: 1, name: '사료', count: 120 },
    { id: 2, name: '간식', count: 85 },
    { id: 3, name: '영양제', count: 64 },
    { id: 4, name: '장난감', count: 92 },
    { id: 5, name: '의류', count: 38 },
    { id: 6, name: '하우스', count: 27 },
    { id: 7, name: '목줄/하네스', count: 45 },
    { id: 8, name: '미용/케어', count: 53 }
  ]);
  
  const [popularProducts] = useState([
    { id: 1, name: '프리미엄 닭고기 사료', price: 45000, discountRate: 10, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=사료' },
    { id: 2, name: '강아지 덴탈 껌', price: 12000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=간식' },
    { id: 3, name: '반려견 종합 영양제', price: 35000, discountRate: 15, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=영양제' },
    { id: 4, name: '인터랙티브 장난감', price: 25000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=장난감' }
  ]);
  
  const { theme } = useTheme();
  const { isAuthenticated, userName } = useAuth();
  const { cartItems } = useCart();
  
  useEffect(() => {
    console.log("shop/index.tsx가 로드됨:", new Date().toISOString());
    document.title = "PetEdu 쇼핑몰 | 반려동물 전문 쇼핑몰";
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 쇼핑몰 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">PetEdu 쇼핑</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = "/shop/cart"}>
                      장바구니 ({cartItems.length})
                    </Button>
                    <span className="text-sm">{userName} 님</span>
                  </div>
                ) : (
                  <Button variant="default" size="sm" onClick={() => window.location.href = "/auth"}>
                    로그인
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => window.location.href = "/"}
                  aria-label="메인으로 돌아가기"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-full max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-10 pr-4 py-2" 
                  placeholder="상품을 검색해보세요" 
                  type="search"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 카테고리 내비게이션 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 overflow-x-auto py-3">
            {categories.map((category) => (
              <a 
                key={category.id}
                href={`/shop/category/${category.id}`}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary whitespace-nowrap"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`카테고리 클릭: ${category.name}`);
                }}
              >
                {category.name} ({category.count})
              </a>
            ))}
          </div>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 배너 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-8 mb-8">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold mb-4">반려동물을 위한 모든 것</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              PetEdu 쇼핑에서 반려동물을 위한 최고의 제품을 만나보세요. 
              신규 회원 10% 할인 혜택을 놓치지 마세요!
            </p>
            <Button onClick={() => window.location.href = "/shop/category/new"}>
              신상품 보러가기
            </Button>
          </div>
        </div>
        
        {/* 인기 상품 섹션 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">인기 상품</h2>
            <Button variant="link">더보기</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discountRate > 0 && (
                        <span className="text-red-500 text-sm font-bold mr-2">{product.discountRate}%</span>
                      )}
                      <span className="font-bold">{(product.price * (1 - product.discountRate/100)).toLocaleString()}원</span>
                      {product.discountRate > 0 && (
                        <span className="text-gray-400 text-sm line-through ml-2">{product.price.toLocaleString()}원</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm">담기</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 카테고리별 상품 섹션 */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-2xl font-bold">카테고리별 상품</h2>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">반려견 사료</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">건식 사료</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">습식 사료</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">연령별 사료</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">처방식 사료</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">반려견 용품</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">하우스/이동장</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">의류/악세사리</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">장난감</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                  </div>
                  <p className="text-sm">목줄/하네스</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* 푸터 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-4">PetEdu 쇼핑</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                반려동물을 위한 최고의 제품을 제공합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold mb-3">고객센터</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">문의하기</a></li>
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">자주 묻는 질문</a></li>
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">배송 안내</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-3">쇼핑 정보</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">이용약관</a></li>
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">개인정보처리방침</a></li>
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">제휴 문의</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-3">소셜미디어</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">인스타그램</a></li>
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">페이스북</a></li>
                  <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">유튜브</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} PetEdu Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}