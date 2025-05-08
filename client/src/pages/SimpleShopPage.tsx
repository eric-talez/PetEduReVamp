import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, Search, ChevronRight, TrendingUp, 
  Heart, Percent, Tag, Gift, Star, Clock, Award, Truck 
} from 'lucide-react';
import { useCart } from '../context/cart-context';

// 쇼핑몰 카테고리
const categories = [
  { id: 'dog-food', name: '사료', icon: <Package size={20} /> },
  { id: 'snacks', name: '간식', icon: <Gift size={20} /> },
  { id: 'toys', name: '장난감', icon: <Tag size={20} /> },
  { id: 'clothes', name: '의류', icon: <ShoppingBag size={20} /> },
  { id: 'health', name: '영양제', icon: <Heart size={20} /> },
  { id: 'training', name: '훈련용품', icon: <Award size={20} /> },
  { id: 'grooming', name: '미용용품', icon: <Star size={20} /> },
  { id: 'travel', name: '이동장', icon: <Truck size={20} /> },
];

// 배너 데이터
const shopBanners = [
  {
    title: "반려견 프리미엄 사료 특가",
    description: "건강한 식단으로 반려견의 건강을 챙겨주세요. 30% 할인 중!",
    image: "https://images.unsplash.com/photo-1585846888361-fd3479e854f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    link: "/shop/category/food"
  },
  {
    title: "신상품 캐리어 & 이동장",
    description: "여행과 병원 방문이 편해지는 프리미엄 이동장 모음",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    link: "/shop/category/carriers"
  },
  {
    title: "여름맞이 쿨매트 기획전",
    description: "더운 여름을 시원하게! 인기 쿨매트 최대 40% 할인",
    image: "https://images.unsplash.com/photo-1583511666372-62fc211f8377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    link: "/shop/category/summer"
  }
];

// 쇼핑몰 상품 데이터
const products = [
  {
    id: 1,
    name: "프리미엄 자연방목 사료",
    description: "100% 자연 방목 소고기로 만든 프리미엄 사료",
    price: 75000,
    discountRate: 20,
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "dog-food",
    rating: 4.8,
    reviewCount: 256,
    isNew: false,
    isBestSeller: true,
    stock: 150
  },
  {
    id: 2,
    name: "애견 겨울 패딩 자켓",
    description: "겨울철 따뜻하게 입을 수 있는 고급 패딩 자켓",
    price: 45000,
    discountRate: 0,
    image: "https://images.unsplash.com/photo-1605244863941-3a3ed921c60d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "clothes",
    rating: 4.5,
    reviewCount: 128,
    isNew: true,
    isBestSeller: false,
    stock: 75
  },
  {
    id: 3,
    name: "프리미엄 펫 칫솔 세트",
    description: "치석 제거에 효과적인 360도 칫솔 세트",
    price: 25000,
    discountRate: 10,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "grooming",
    rating: 4.7,
    reviewCount: 92,
    isNew: false,
    isBestSeller: false,
    stock: 200
  },
  {
    id: 4,
    name: "고급 가죽 목줄 세트",
    description: "튼튼하고 세련된 디자인의 가죽 목줄과 리드줄 세트",
    price: 68000,
    discountRate: 15,
    image: "https://images.unsplash.com/photo-1567014993643-0c7217c9f7df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "training",
    rating: 4.9,
    reviewCount: 186,
    isNew: false,
    isBestSeller: true,
    stock: 50
  },
  {
    id: 5,
    name: "강아지 노즈워크 매트",
    description: "지능 발달에 도움을 주는 노즈워크 트레이닝 매트",
    price: 35000,
    discountRate: 0,
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "toys",
    rating: 4.6,
    reviewCount: 72,
    isNew: true,
    isBestSeller: false,
    stock: 120
  },
  {
    id: 6,
    name: "프리미엄 영양제 세트",
    description: "관절, 피부, 소화 건강을 위한 종합 영양제 세트",
    price: 89000,
    discountRate: 25,
    image: "https://images.unsplash.com/photo-1583337426008-2fef51aa841e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "health",
    rating: 4.8,
    reviewCount: 143,
    isNew: false,
    isBestSeller: true,
    stock: 85
  },
  {
    id: 7,
    name: "대형견용 럭셔리 침대",
    description: "대형견을 위한 넓고 푹신한 메모리폼 침대",
    price: 120000,
    discountRate: 10,
    image: "https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "furniture",
    rating: 4.9,
    reviewCount: 78,
    isNew: false,
    isBestSeller: false,
    stock: 30
  },
  {
    id: 8,
    name: "유기농 간식 세트",
    description: "화학첨가물 없는 100% 유기농 간식 모음",
    price: 32000,
    discountRate: 0,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "snacks",
    rating: 4.7,
    reviewCount: 215,
    isNew: true,
    isBestSeller: true,
    stock: 200
  }
];

// 트렌드 아이템
const trendItems = [
  "🔥 반려견 여름 쿨매트", "💧 물병 자동 급수기", "🎾 노즈워크 장난감", 
  "👔 여름용 통풍 의류", "🍖 프리미엄 수제 간식", "🏠 접이식 휴대용 하우스"
];

// 인기 쇼핑 키워드
const popularKeywords = [
  "소형견 옷", "대형견 사료", "노즈워크", "강아지 장난감", 
  "목줄", "애견 카시트", "펫 카메라", "야외 훈련용품"
];

// 할인 정보
const promotions = [
  {
    title: "신규 회원 쿠폰팩",
    description: "회원가입 시 즉시 사용 가능한 15% 할인 쿠폰",
    color: "bg-blue-100 dark:bg-blue-900"
  },
  {
    title: "무료 배송 이벤트",
    description: "5만원 이상 구매 시 전국 무료배송",
    color: "bg-green-100 dark:bg-green-900"
  },
  {
    title: "정기구독 20% 할인",
    description: "매월 자동 배송되는 상품 정기구독",
    color: "bg-purple-100 dark:bg-purple-900"
  }
];

// 상품 컴포넌트
function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  
  const discountedPrice = product.discountRate > 0 
    ? Math.round(product.price * (1 - product.discountRate / 100)) 
    : null;
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: discountedPrice || undefined,
      quantity: 1,
      imageUrl: product.image,
      inStock: product.stock > 0
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover" 
        />
        
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
        )}
        
        {product.isBestSeller && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">BEST</span>
        )}
        
        {product.discountRate > 0 && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{product.discountRate}% OFF</span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            {discountedPrice ? (
              <>
                <span className="text-gray-400 line-through text-sm">{product.price.toLocaleString()}원</span>
                <span className="font-bold text-red-500 ml-1">{discountedPrice.toLocaleString()}원</span>
              </>
            ) : (
              <span className="font-bold">{product.price.toLocaleString()}원</span>
            )}
          </div>
          <button 
            className="px-3 py-1 bg-primary hover:bg-primary/80 text-white rounded-full text-sm"
            onClick={handleAddToCart}
          >
            장바구니
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SimpleShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  
  useEffect(() => {
    console.log("SimpleShopPage 마운트됨 - useEffect 실행");
    console.log("현재 URL:", window.location.href);
    console.log("현재 경로:", window.location.pathname);
    setIsLoaded(true);
    
    // 배너 자동 순환
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % shopBanners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 카테고리 필터링된 상품 목록
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;
    
  // 베스트셀러 상품 목록
  const bestSellerProducts = products.filter(product => product.isBestSeller);
  
  // 할인 상품 목록
  const discountedProducts = products.filter(product => product.discountRate > 0)
    .sort((a, b) => b.discountRate - a.discountRate);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 검색창 */}
      <div className="mb-8 flex">
        <div className="relative flex-grow max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="원하는 펫 용품을 검색해보세요"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 rounded-full">
            <Search size={20} />
          </button>
        </div>
      </div>
      
      {/* 배너 슬라이더 */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-xl">
          <div className="relative h-[400px] overflow-hidden rounded-xl shadow-md">
            <img
              src={shopBanners[bannerIndex].image}
              alt={shopBanners[bannerIndex].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{shopBanners[bannerIndex].title}</h2>
                <p className="text-lg mb-4">{shopBanners[bannerIndex].description}</p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
          
          {/* 배너 인디케이터 */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {shopBanners.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === bannerIndex ? "bg-primary" : "bg-white/50"
                }`}
                onClick={() => setBannerIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* 카테고리 네비게이션 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category.icon}
              <span className="mt-2 text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 추천 상품 */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">추천 상품</h2>
          <a href="/shop/all" className="text-sm text-primary flex items-center">
            더보기 <ChevronRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* 베스트셀러 */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">베스트셀러</h2>
          <a href="/shop/best" className="text-sm text-primary flex items-center">
            더보기 <ChevronRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* 특가 할인 */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">특가 할인</h2>
          <a href="/shop/discount" className="text-sm text-primary flex items-center">
            더보기 <ChevronRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {discountedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* 디버그 정보 - 개발 중에만 표시 */}
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2">디버그 정보</h3>
        <p>컴포넌트: SimpleShopPage (완전한 쇼핑 페이지로 업그레이드됨)</p>
        <p>파일 위치: client/src/pages/SimpleShopPage.tsx</p>
        <p>현재 경로: {window.location.pathname}</p>
        <p>전체 URL: {window.location.href}</p>
        <p>상품 갯수: {products.length}</p>
        <p>필터링된 상품: {filteredProducts.length}</p>
        <p>현재 선택 카테고리: {selectedCategory || '없음'}</p>
      </div>
    </div>
  );
}