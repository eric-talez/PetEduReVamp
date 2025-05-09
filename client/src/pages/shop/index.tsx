import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Menu as MenuIcon, ChevronDown, Heart, User, Settings, ShoppingCart, Home, Tag, Truck, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-context';
import { useLocation } from 'wouter';

/**
 * 네이버 쇼핑 스타일의 쇼핑몰 메인 컴포넌트
 * - 모든 shop/* 경로 요청의 진입점 
 * - 인증 여부와 관계없이 접근 가능
 * - HTML 스타일과 네이버 쇼핑 디자인 참고
 */
export default function ShopIndex() {
  const [, setLocation] = useLocation();
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
    { id: 1, name: '프리미엄 닭고기 사료', price: 45000, discountRate: 10, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=사료', mall: '펫푸드몰', rating: 4.8, reviews: 256 },
    { id: 2, name: '강아지 덴탈 껌', price: 12000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=간식', mall: '굿도그', rating: 4.5, reviews: 189 },
    { id: 3, name: '반려견 종합 영양제', price: 35000, discountRate: 15, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=영양제', mall: '펫헬스케어', rating: 4.9, reviews: 312 },
    { id: 4, name: '인터랙티브 장난감', price: 25000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=장난감', mall: '토이스토어', rating: 4.7, reviews: 124 },
    { id: 5, name: '반려견 패딩조끼', price: 28000, discountRate: 5, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=의류', mall: '펫패션', rating: 4.6, reviews: 95 },
    { id: 6, name: '방석형 하우스', price: 42000, discountRate: 20, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=하우스', mall: '펫홈', rating: 4.4, reviews: 78 },
    { id: 7, name: '안전 하네스', price: 18000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=하네스', mall: '안심케어', rating: 4.8, reviews: 156 },
    { id: 8, name: '반려견 샴푸', price: 15000, discountRate: 10, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=케어', mall: '클린펫', rating: 4.7, reviews: 203 }
  ]);
  
  const { theme } = useTheme();
  
  // 상태 관리
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null as string | null,
    userName: null as string | null
  });
  
  // 간단한 장바구니 상태 (테스트용)
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // 컴포넌트 마운트 시 window 객체에서 인증 상태 로드
  useEffect(() => {
    const windowAuth = window.__peteduAuthState;
    if (windowAuth) {
      setAuthState({
        isAuthenticated: windowAuth.isAuthenticated || false,
        userRole: windowAuth.userRole || null,
        userName: windowAuth.userName || null
      });
    }
    
    // 로컬 스토리지에서 장바구니 정보 로드 (있다면)
    try {
      const storedCart = localStorage.getItem('petedu_cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItemsCount(Array.isArray(parsedCart) ? parsedCart.length : 0);
      }
    } catch (error) {
      console.error('장바구니 데이터 로드 오류:', error);
    }
  }, []);
  
  useEffect(() => {
    console.log("shop/index.tsx가 로드됨:", new Date().toISOString());
    document.title = "PetEdu 쇼핑몰 | 반려동물 전문 쇼핑몰";
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 최상단 유틸리티 네비게이션 - 네이버 스타일 */}
      <div className="bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-end text-xs text-gray-500">
            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm">{authState.userName} 님</span>
                <a href="#" className="hover:text-primary" onClick={(e) => { e.preventDefault(); }}>마이페이지</a>
                <span>|</span>
                <a href="#" className="hover:text-primary" onClick={(e) => { e.preventDefault(); }}>로그아웃</a>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a href="#" className="hover:text-primary" onClick={(e) => { e.preventDefault(); setLocation("/auth"); }}>로그인</a>
                <span>|</span>
                <a href="#" className="hover:text-primary" onClick={(e) => { e.preventDefault(); setLocation("/auth"); }}>회원가입</a>
              </div>
            )}
            <span className="ml-3">|</span>
            <a href="#" className="ml-3 hover:text-primary" onClick={(e) => { e.preventDefault(); }}>고객센터</a>
          </div>
        </div>
      </div>
      
      {/* 쇼핑몰 헤더 - 네이버 스타일 */}
      <header className="bg-white dark:bg-gray-800 py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          {/* 헤더 상단 영역 - 로고, 검색, 유틸리티 */}
          <div className="flex items-center justify-between mb-4">
            {/* 로고 영역 */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="mr-2" 
                onClick={(e) => {
                  e.preventDefault();
                  setLocation("/");
                }}
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="flex items-center cursor-pointer" onClick={() => setLocation("/shop")}>
                <ShoppingBag className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-xl font-bold">PetEdu 쇼핑</span>
              </div>
            </div>
            
            {/* 검색창 영역 */}
            <div className="w-full max-w-xl relative mx-8">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  className="pl-10 pr-20 py-3 border-2 border-green-500 rounded-full focus:ring-2 focus:ring-green-500" 
                  placeholder="검색어를 입력해보세요"
                  type="search"
                />
                <Button 
                  variant="default" 
                  className="absolute right-0 rounded-r-full h-full bg-green-500 hover:bg-green-600 px-4"
                >
                  검색
                </Button>
              </div>
            </div>
            
            {/* 유틸리티 아이콘 영역 */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="flex flex-col items-center">
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">MY</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="flex flex-col items-center">
                <Heart className="h-5 w-5" />
                <span className="text-xs mt-1">찜</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex flex-col items-center relative"
                onClick={(e) => {
                  e.preventDefault();
                  setLocation("/shop/cart");
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
                <span className="text-xs mt-1">장바구니</span>
              </Button>
            </div>
          </div>
          
          {/* 네비게이션 영역 */}
          <nav className="flex items-center">
            <div className="mr-6">
              <Button 
                variant="ghost" 
                className="flex items-center text-green-500 font-bold"
              >
                <MenuIcon className="h-5 w-5 mr-1" />
                카테고리
              </Button>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <div className="flex space-x-6">
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 border-b-2 border-green-500 pb-2">홈</a>
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 pb-2">베스트</a>
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 pb-2">신상품</a>
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 pb-2">특가/혜택</a>
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 pb-2">반려견</a>
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 pb-2">반려묘</a>
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 pb-2">이벤트</a>
                <a href="#" className="whitespace-nowrap text-sm font-medium hover:text-green-500 pb-2">기획전</a>
              </div>
            </div>
          </nav>
        </div>
      </header>
      
      {/* 메인 슬라이더 배너 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold mb-4">반려동물을 위한<br />프리미엄 상품</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                PetEdu 쇼핑에서 반려동물을 위한 최고의 제품을 만나보세요. 
                이달의 프로모션: 신규 가입 시 10% 할인!
              </p>
              <div className="flex space-x-4">
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/shop/category/new");
                  }}
                >
                  신상품 보러가기
                </Button>
                <Button 
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50 px-6 py-2 rounded-full"
                >
                  혜택 더 알아보기
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://placehold.co/500x300/e1f5e1/22aa22?text=PetEdu+쇼핑" 
                alt="PetEdu 쇼핑 프로모션" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 카테고리 내비게이션 */}
      <div className="bg-white dark:bg-gray-800 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-4">인기 카테고리</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {categories.map((category) => (
              <a 
                key={category.id}
                href={`/shop/category/${category.id}`}
                className="flex flex-col items-center hover:text-green-500"
                onClick={(e) => {
                  e.preventDefault();
                  setLocation(`/shop/category/${category.id}`);
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                  <ShoppingBag className="h-8 w-8 text-green-500" />
                </div>
                <span className="text-sm text-center">{category.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* 오늘의 특가 섹션 */}
      <div className="bg-white dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Tag className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold">오늘의 특가</h2>
            </div>
            <a href="#" className="text-sm text-green-500 hover:underline">더보기 &gt;</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                    <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </Button>
                  {product.discountRate > 0 && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                      {product.discountRate}% 할인
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{product.mall}</div>
                  <h3 className="font-medium mb-2 line-clamp-2 h-10">{product.name}</h3>
                  <div className="mb-2">
                    <div className="flex items-center">
                      {product.discountRate > 0 && (
                        <span className="text-red-500 text-lg font-bold mr-2">{product.discountRate}%</span>
                      )}
                      <span className="text-lg font-bold">{(product.price * (1 - product.discountRate/100)).toLocaleString()}원</span>
                    </div>
                    {product.discountRate > 0 && (
                      <span className="text-gray-400 text-sm line-through">{product.price.toLocaleString()}원</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="ml-1">{product.rating}</span>
                    </div>
                    <span className="mx-1">·</span>
                    <span>리뷰 {product.reviews}</span>
                  </div>
                  <div className="flex items-center mt-3 text-xs text-gray-500">
                    <Truck className="h-3 w-3 mr-1" />
                    <span>무료배송</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 카테고리별 상품 추천 */}
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold">인기 상품</h2>
            <ChevronDown className="h-5 w-5 text-gray-500 ml-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.slice(4, 8).map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                    <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </Button>
                  {product.discountRate > 0 && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                      {product.discountRate}% 할인
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{product.mall}</div>
                  <h3 className="font-medium mb-2 line-clamp-2 h-10">{product.name}</h3>
                  <div className="mb-2">
                    <div className="flex items-center">
                      {product.discountRate > 0 && (
                        <span className="text-red-500 text-lg font-bold mr-2">{product.discountRate}%</span>
                      )}
                      <span className="text-lg font-bold">{(product.price * (1 - product.discountRate/100)).toLocaleString()}원</span>
                    </div>
                    {product.discountRate > 0 && (
                      <span className="text-gray-400 text-sm line-through">{product.price.toLocaleString()}원</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="ml-1">{product.rating}</span>
                    </div>
                    <span className="mx-1">·</span>
                    <span>리뷰 {product.reviews}</span>
                  </div>
                  <div className="flex items-center mt-3 text-xs text-gray-500">
                    <Truck className="h-3 w-3 mr-1" />
                    <span>무료배송</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 쇼핑 혜택 정보 */}
      <div className="bg-white dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Shield className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <h3 className="font-bold mb-1">안전한 결제</h3>
                <p className="text-sm text-gray-500">다양한 결제 수단과 보안 시스템</p>
              </div>
            </div>
            <div className="flex items-center">
              <Truck className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <h3 className="font-bold mb-1">빠른 배송</h3>
                <p className="text-sm text-gray-500">3만원 이상 무료배송</p>
              </div>
            </div>
            <div className="flex items-center">
              <Settings className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <h3 className="font-bold mb-1">쉬운 교환/반품</h3>
                <p className="text-sm text-gray-500">고객만족 100% 보장제</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 푸터 */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">PetEdu 쇼핑</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                반려동물을 위한 최고의 제품을 제공하는 전문 쇼핑몰입니다.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">고객센터</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-green-500">고객 문의</a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-500">자주 묻는 질문</a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-500">배송 조회</a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-500">교환/반품/환불</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">쇼핑 정보</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-green-500">이용약관</a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-500">개인정보처리방침</a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-500">판매자 정보</a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-500">입점 문의</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">고객센터 정보</h4>
              <p className="text-2xl font-bold text-green-500">1544-0000</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">평일 10:00 - 18:00 (점심시간 12:30 - 13:30)</p>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                1:1 문의하기
              </Button>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                <p>상호명: (주)페트에듀 | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
                <p>주소: 서울특별시 강남구 테헤란로 123, 4층 | 통신판매업신고: 제2025-서울강남-0000호</p>
                <p>개인정보보호책임자: 김철수 | 이메일: cs@petedu.com</p>
              </div>
              <div className="text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} PetEdu Platform. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}