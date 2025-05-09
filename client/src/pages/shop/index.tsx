import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Menu as MenuIcon, ChevronDown, Heart, User, ShoppingCart, Home, Tag, Truck, Shield, Star, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-context';
import { useLocation } from 'wouter';
import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';

/**
 * 테일즈 쇼핑 스타일의 쇼핑몰 메인 컴포넌트
 * - 모든 shop/* 경로 요청의 진입점 
 * - 인증 여부와 관계없이 접근 가능
 * - funnytalez.com/shop.html 디자인 참고
 * - 메인 서비스의 헤더와 사이드바 사용
 */
export default function ShopIndex() {
  const [, setLocation] = useLocation();
  const [categories] = useState([
    { id: 1, name: '사료', count: 120, icon: '🍖' },
    { id: 2, name: '간식', count: 85, icon: '🦴' },
    { id: 3, name: '영양제', count: 64, icon: '💊' },
    { id: 4, name: '장난감', count: 92, icon: '🎾' },
    { id: 5, name: '의류', count: 38, icon: '👕' },
    { id: 6, name: '하우스', count: 27, icon: '🏠' },
    { id: 7, name: '미용/케어', count: 53, icon: '✂️' },
    { id: 8, name: '목줄/하네스', count: 45, icon: '🔄' }
  ]);
  
  const [popularProducts] = useState([
    { id: 1, name: '프리미엄 닭고기 사료 대용량', price: 45000, discountRate: 10, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=사료', brand: '네이처스', rating: 4.8, reviews: 256, isFreeShipping: true, isNew: false },
    { id: 2, name: '강아지 덴탈 껌 10개입', price: 12000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=간식', brand: '펫투데이', rating: 4.5, reviews: 189, isFreeShipping: true, isNew: true },
    { id: 3, name: '반려견 종합 영양제 120정', price: 35000, discountRate: 15, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=영양제', brand: '헬시펫', rating: 4.9, reviews: 312, isFreeShipping: true, isNew: false },
    { id: 4, name: '인터랙티브 노즈워크 장난감', price: 25000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=장난감', brand: '퍼피플레이', rating: 4.7, reviews: 124, isFreeShipping: false, isNew: false },
    { id: 5, name: '반려견 패딩조끼 겨울용', price: 28000, discountRate: 5, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=의류', brand: '펫라이프', rating: 4.6, reviews: 95, isFreeShipping: true, isNew: true },
    { id: 6, name: '프리미엄 방석형 하우스 중형', price: 42000, discountRate: 20, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=하우스', brand: '코지홈', rating: 4.4, reviews: 78, isFreeShipping: true, isNew: false },
    { id: 7, name: '안전 하네스 산책용 (M사이즈)', price: 18000, discountRate: 0, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=하네스', brand: '세이프티', rating: 4.8, reviews: 156, isFreeShipping: false, isNew: false },
    { id: 8, name: '저자극 반려견 샴푸 500ml', price: 15000, discountRate: 10, imageUrl: 'https://placehold.co/300x300/f8fafc/475569?text=케어', brand: '퓨어펫', rating: 4.7, reviews: 203, isFreeShipping: true, isNew: true }
  ]);
  
  const [sliders] = useState([
    { id: 1, title: "반려동물 봄 신상품 모음전", subtitle: "견생주치가 추천하는 반려동물 맞춤 상품", imageUrl: "https://placehold.co/1200x400/e9f5e9/03c75a?text=반려동물+봄+신상품" },
    { id: 2, title: "프리미엄 사료 할인전", subtitle: "건강한 영양을 위한 최고급 사료 모음", imageUrl: "https://placehold.co/1200x400/e1f5ff/0078d7?text=프리미엄+사료+할인전" },
    { id: 3, title: "펫 장난감 특별기획전", subtitle: "활동성 높은 반려동물을 위한 다양한 장난감", imageUrl: "https://placehold.co/1200x400/f5e9e9/d70000?text=펫+장난감+특별기획전" }
  ]);
  
  // 슬라이더 관련 상태 및 함수
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };
  
  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const { theme } = useTheme();
  
  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 간단한 장바구니 상태 (테스트용)
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // 인증 상태 로드
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null as string | null,
    userName: null as string | null
  });
  
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
    document.title = "테일즈 서비스 쇼핑 - 반려동물 용품 전문몰";
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 메인 서비스의 TopBar 사용 */}
      <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* 메인 서비스의 Sidebar 사용 */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userRole={authState.userRole}
        isAuthenticated={authState.isAuthenticated}
      />
      
      <div className="pt-16"> {/* TopBar의 높이만큼 패딩 추가 */}
        {/* 메인 슬라이더 배너 */}
        <section className="banner-section bg-white dark:bg-gray-800 py-6">
          <div className="container mx-auto px-4 relative">
            <div className="relative overflow-hidden rounded-md">
              {sliders.map((slider, index) => (
                <div 
                  key={slider.id} 
                  className={`transition-all duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                >
                  <div className="relative h-[320px] md:h-[400px] rounded-md overflow-hidden">
                    <img 
                      src={slider.imageUrl} 
                      alt={slider.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
                      <div className="text-white max-w-lg ml-12">
                        <h2 className="text-3xl font-bold mb-3">{slider.title}</h2>
                        <p className="text-lg mb-6">{slider.subtitle}</p>
                        <Button 
                          className="bg-[#03c75a] hover:bg-[#02b04a] text-white rounded-full px-6"
                          onClick={(e) => {
                            e.preventDefault();
                            // 클릭 시 적절한 카테고리로 이동
                          }}
                        >
                          더 알아보기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 슬라이더 컨트롤 */}
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full z-10"
                onClick={prevSlide}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full z-10"
                onClick={nextSlide}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              {/* 슬라이더 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {sliders.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full ${index === currentSlide ? 'bg-[#03c75a]' : 'bg-gray-300'}`}
                    onClick={() => setCurrentSlide(index)}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* 카테고리 내비게이션 */}
        <section className="category-section bg-white dark:bg-gray-800 py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Tag className="h-5 w-5 text-[#03c75a] mr-2" />
              인기 카테고리
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {categories.map((category) => (
                <a 
                  key={category.id}
                  href={`/shop/category/${category.id}`}
                  className="flex flex-col items-center hover:text-[#03c75a] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(`/shop/category/${category.id}`);
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2 text-2xl">
                    {category.icon}
                  </div>
                  <span className="text-sm text-center">{category.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
        
        {/* 오늘의 특가 섹션 */}
        <section className="product-section bg-white dark:bg-gray-800 py-8 border-t border-gray-100 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <RefreshCw className="h-5 w-5 text-[#03c75a] mr-2" />
                오늘의 특가
              </h2>
              <a href="#" className="text-sm text-[#03c75a] hover:underline flex items-center">
                더보기 <ChevronDown className="h-4 w-4 ml-1 transform rotate-270" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularProducts.slice(0, 4).map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="relative pb-[100%] overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                      <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                    
                    {/* 배지 영역 */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.discountRate > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discountRate}% 할인
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-[#03c75a] text-white text-xs font-bold px-2 py-1 rounded">
                          신상품
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-[#03c75a] font-medium mb-1">{product.brand}</div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10 group-hover:text-[#03c75a]">{product.name}</h3>
                    
                    <div className="mb-2">
                      <div className="flex items-center">
                        {product.discountRate > 0 && (
                          <span className="text-red-500 text-sm font-bold mr-2">{product.discountRate}%</span>
                        )}
                        <span className="text-lg font-bold">{(product.price * (1 - product.discountRate/100)).toLocaleString()}원</span>
                      </div>
                      {product.discountRate > 0 && (
                        <span className="text-gray-400 text-sm line-through">{product.price.toLocaleString()}원</span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-xs">{product.rating}</span>
                      </div>
                      <span className="mx-1">·</span>
                      <span className="text-xs">리뷰 {product.reviews}</span>
                    </div>
                    
                    {product.isFreeShipping && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Truck className="h-3 w-3 mr-1" />
                        <span>무료배송</span>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      variant="ghost"
                      size="sm"
                    >
                      장바구니 담기
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 인기 상품 섹션 */}
        <section className="product-section bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Star className="h-5 w-5 text-[#03c75a] mr-2" />
                인기 상품
              </h2>
              <a href="#" className="text-sm text-[#03c75a] hover:underline flex items-center">
                더보기 <ChevronDown className="h-4 w-4 ml-1 transform rotate-270" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularProducts.slice(4, 8).map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="relative pb-[100%] overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                      <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                    
                    {/* 배지 영역 */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.discountRate > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discountRate}% 할인
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-[#03c75a] text-white text-xs font-bold px-2 py-1 rounded">
                          신상품
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-[#03c75a] font-medium mb-1">{product.brand}</div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10 group-hover:text-[#03c75a]">{product.name}</h3>
                    
                    <div className="mb-2">
                      <div className="flex items-center">
                        {product.discountRate > 0 && (
                          <span className="text-red-500 text-sm font-bold mr-2">{product.discountRate}%</span>
                        )}
                        <span className="text-lg font-bold">{(product.price * (1 - product.discountRate/100)).toLocaleString()}원</span>
                      </div>
                      {product.discountRate > 0 && (
                        <span className="text-gray-400 text-sm line-through">{product.price.toLocaleString()}원</span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-xs">{product.rating}</span>
                      </div>
                      <span className="mx-1">·</span>
                      <span className="text-xs">리뷰 {product.reviews}</span>
                    </div>
                    
                    {product.isFreeShipping && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Truck className="h-3 w-3 mr-1" />
                        <span>무료배송</span>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      variant="ghost"
                      size="sm"
                    >
                      장바구니 담기
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 쇼핑 혜택 정보 */}
        <div className="bg-white dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Shield className="h-10 w-10 text-[#03c75a] mr-4" />
                <div>
                  <h3 className="font-bold mb-1">안전한 결제</h3>
                  <p className="text-sm text-gray-500">다양한 결제 수단과 보안 시스템</p>
                </div>
              </div>
              <div className="flex items-center">
                <Truck className="h-10 w-10 text-[#03c75a] mr-4" />
                <div>
                  <h3 className="font-bold mb-1">빠른 배송</h3>
                  <p className="text-sm text-gray-500">3만원 이상 무료배송</p>
                </div>
              </div>
              <div className="flex items-center">
                <RefreshCw className="h-10 w-10 text-[#03c75a] mr-4" />
                <div>
                  <h3 className="font-bold mb-1">쉬운 교환/반품</h3>
                  <p className="text-sm text-gray-500">고객만족 100% 보장제</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}