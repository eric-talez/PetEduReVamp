import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/cart-context';

// 간단한 상품 유형 정의
export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

// 샘플 상품 데이터
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "프리미엄 강아지 사료",
    price: 45000,
    image: "https://placehold.co/300x300/e2e8f0/1e293b?text=사료",
    category: "사료",
    description: "최고급 재료로 만든 프리미엄 사료"
  },
  {
    id: 2,
    name: "반려견 장난감 세트",
    price: 25000,
    image: "https://placehold.co/300x300/e2e8f0/1e293b?text=장난감",
    category: "장난감",
    description: "내구성 좋은 장난감 세트"
  },
  {
    id: 3,
    name: "털 관리 브러쉬",
    price: 18000,
    image: "https://placehold.co/300x300/e2e8f0/1e293b?text=브러쉬",
    category: "그루밍",
    description: "효과적인 털 관리를 위한 브러쉬"
  },
  {
    id: 4,
    name: "반려견 전용 방석",
    price: 55000,
    image: "https://placehold.co/300x300/e2e8f0/1e293b?text=방석",
    category: "침구류",
    description: "편안한 수면을 위한 고급 방석"
  }
];

export default function ShopNewPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const { isAuthenticated, user } = useAuth();
  const userRole = user?.role || null;
  const { addToCart } = useCart();

  useEffect(() => {
    console.log("ShopNewPage 렌더링됨");
    console.log("현재 URL:", window.location.href);
    console.log("현재 경로명:", window.location.pathname);
    
    // URL에서 추천 코드 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('ref');
    if (code) {
      setReferralCode(code);
      console.log(`추천 코드 감지: ${code}`);
    }
  }, []);

  // 카테고리 필터링
  const filteredProducts = sampleProducts.filter(product => {
    // 카테고리 필터
    if (activeTab !== 'all' && product.category !== activeTab) {
      return false;
    }
    
    // 검색어 필터
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // 제품 카트에 추가
  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
      inStock: true
    });
    
    console.log(`장바구니에 추가: ${product.name}`);
    
    // 추천 코드가 있으면 추적
    if (referralCode) {
      console.log(`추천 코드 ${referralCode}로 추가됨`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">반려견 용품 쇼핑</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        고품질 반려견 용품을 합리적인 가격으로 만나보세요.
      </p>

      {/* 검색 바 */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="제품 검색..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setSearchQuery('')}
          >
            {searchQuery && 'X'}
          </button>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === '사료' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('사료')}
        >
          사료
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === '장난감' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('장난감')}
        >
          장난감
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === '그루밍' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('그루밍')}
        >
          그루밍
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === '침구류' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('침구류')}
        >
          침구류
        </button>
      </div>

      {/* 추천 코드 표시 */}
      {referralCode && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md">
          <p className="text-sm">추천 코드 <span className="font-bold">{referralCode}</span>가 적용되었습니다.</p>
        </div>
      )}

      {/* 상품 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">{product.price.toLocaleString()}원</span>
                <button 
                  className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90"
                  onClick={() => handleAddToCart(product)}
                >
                  장바구니 추가
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 훈련사 전용 섹션 */}
      {userRole === 'trainer' && (
        <div className="mt-8 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">훈련사 회원을 위한 특별 섹션</h2>
          <p className="mb-4">인증된 훈련사는 Tales 유니폼과 명함을 주문할 수 있습니다.</p>
          <button className="bg-primary text-white px-4 py-2 rounded-md">전문가 용품 보기</button>
        </div>
      )}

      {/* 디버깅 정보 */}
      <div className="mt-6 text-center">
        <p>쇼핑 신규 페이지가 정상적으로 로드되었습니다!</p>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mt-2 inline-block">
          <p>Path: <code>{window.location.pathname}</code></p>
        </div>
      </div>
    </div>
  );
}