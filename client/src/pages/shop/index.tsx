import { useEffect, useState } from 'react';
import { ShoppingBag, Search, Star, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/cart-context';

// 샘플 상품 데이터
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountRate?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: '프리미엄 반려견 사료',
    description: '높은 단백질 함량과 균형 잡힌 영양소로 건강한 식단을 제공합니다.',
    price: 42000,
    discountRate: 10,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80',
    category: '사료',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isBestseller: true
  },
  {
    id: 2,
    name: '반려견 터그 토이',
    description: '내구성 있는 재질로 만들어진 터그 토이로 함께 놀이를 즐겨보세요.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    category: '장난감',
    rating: 4.5,
    reviewCount: 89,
    inStock: true
  },
  {
    id: 3,
    name: '반려견 브러쉬',
    description: '부드러운 솔로 털 빠짐을 줄이고 반려견에게 마사지를 제공합니다.',
    price: 15000,
    discountRate: 20,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=770&q=80',
    category: '그루밍',
    rating: 4.2,
    reviewCount: 56,
    inStock: true
  },
  {
    id: 4,
    name: '반려견 침대',
    description: '푹신한 소재로 제작된 반려견 침대로 편안한 잠자리를 제공합니다.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    category: '침구류',
    rating: 4.9,
    reviewCount: 102,
    inStock: false
  },
  {
    id: 5,
    name: '강아지 리드줄',
    description: '튼튼하고 편안한 그립감의 리드줄로 산책을 더욱 즐겁게 만듭니다.',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
    category: '액세서리',
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    isNew: true
  },
  {
    id: 6,
    name: '간식 디스펜서 장난감',
    description: '놀이와 간식을 동시에 즐길 수 있는 지능 발달 장난감입니다.',
    price: 32000,
    discountRate: 15,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: '장난감',
    rating: 4.4,
    reviewCount: 65,
    inStock: true
  },
  {
    id: 7, 
    name: '오가닉 강아지 간식',
    description: '유기농 원료로 만든 건강한 강아지 간식으로 특별한 보상을 해보세요.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1589924691265-2f2d4b6a363e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: '간식',
    rating: 4.7,
    reviewCount: 91,
    inStock: true,
    isBestseller: true
  },
  {
    id: 8,
    name: '강아지 치약 & 칫솔 세트',
    description: '구강 건강을 위한 특별 제작된 치약과 칫솔 세트입니다.',
    price: 18000,
    discountRate: 5,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    category: '그루밍',
    rating: 4.3,
    reviewCount: 48,
    inStock: true,
    isNew: true
  }
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const { isAuthenticated, user } = useAuth();
  const userRole = user?.role || null;
  const { addToCart } = useCart();

  useEffect(() => {
    console.log("쇼핑 페이지 렌더링됨");
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
    if (activeCategory !== 'all' && product.category !== activeCategory) {
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
    if (isAuthenticated) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.image,
        inStock: product.inStock
      });
      
      console.log(`장바구니에 추가: ${product.name}`);
      
      // 추천 코드가 있으면 추적
      if (referralCode) {
        console.log(`추천 코드 ${referralCode}로 추가됨`);
      }
    } else {
      // 비로그인 사용자는 로그인 페이지로 이동
      window.location.href = '/auth/login';
    }
  };

  const categories = [
    { id: 'all', name: '전체 상품' },
    { id: '사료', name: '사료' },
    { id: '간식', name: '간식' },
    { id: '장난감', name: '장난감' },
    { id: '그루밍', name: '그루밍' },
    { id: '침구류', name: '침구류' },
    { id: '액세서리', name: '액세서리' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* 사이드바 (데스크톱 뷰) */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">카테고리</h2>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  className={`w-full text-left py-2 px-3 rounded-md ${
                    activeCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">필터</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">가격대</h3>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="최소" 
                    className="w-1/2 p-2 border rounded-md"
                  />
                  <input 
                    type="number" 
                    placeholder="최대" 
                    className="w-1/2 p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">평점</h3>
                <div className="flex items-center">
                  <input type="checkbox" id="rating4" className="mr-2" />
                  <label htmlFor="rating4" className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4].map(i => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="ml-1">이상</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">상태</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="inStock" className="mr-2" />
                    <label htmlFor="inStock">재고 있음</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="onSale" className="mr-2" />
                    <label htmlFor="onSale">할인 상품</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 검색 및 필터 헤더 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">반려견 용품 쇼핑</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              고품질 반려견 용품을 합리적인 가격으로 만나보세요.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="제품 검색..."
                  className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              {/* 모바일 필터 버튼 */}
              <button className="md:hidden flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <SlidersHorizontal size={18} className="mr-2" />
                필터
              </button>
              
              {/* 정렬 옵션 */}
              <select className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option value="trending">인기순</option>
                <option value="newest">최신순</option>
                <option value="priceAsc">가격 낮은순</option>
                <option value="priceDesc">가격 높은순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
            
            {/* 모바일 카테고리 */}
            <div className="md:hidden mt-4 overflow-x-auto whitespace-nowrap pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`mr-2 px-3 py-1 rounded-full text-sm ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* 추천 코드 표시 */}
          {referralCode && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md">
              <p className="text-sm">추천 코드 <span className="font-bold">{referralCode}</span>가 적용되었습니다.</p>
            </div>
          )}
          
          {/* 제품 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                  )}
                  {product.isBestseller && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">BEST</span>
                  )}
                  {product.discountRate && (
                    <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discountRate}% OFF
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      {product.discountRate ? (
                        <div>
                          <span className="text-gray-500 line-through text-sm">
                            {product.price.toLocaleString()}원
                          </span>
                          <div className="font-bold text-lg">
                            {Math.round(product.price * (1 - product.discountRate / 100)).toLocaleString()}원
                          </div>
                        </div>
                      ) : (
                        <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
                      )}
                    </div>
                    
                    <button 
                      className={`p-2 rounded-md ${
                        product.inStock 
                          ? 'bg-primary text-white hover:bg-primary/90' 
                          : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      }`}
                      onClick={() => product.inStock && handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                  
                  {!product.inStock && (
                    <p className="text-red-500 text-sm mt-2">품절되었습니다</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* 페이지네이션 */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center">
              <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 mr-2">
                이전
              </button>
              <button className="px-3 py-1 rounded-md bg-primary text-white mr-2">1</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 mr-2">2</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 mr-2">3</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700">
                다음
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* 훈련사 전용 섹션 */}
      {userRole === 'trainer' && (
        <div className="mt-8 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">훈련사 회원을 위한 특별 제품</h2>
          <p className="mb-4">Tales 인증 훈련사는 유니폼과 명함을 주문할 수 있습니다.</p>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex-1">
              <h3 className="font-medium">Tales 유니폼</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                공식 인증 훈련사 유니폼으로 전문성을 높이세요.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold">58,000원</span>
                <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">
                  구매하기
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex-1">
              <h3 className="font-medium">Tales 명함 (100매)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                전문 디자인된 명함으로 고객에게 신뢰감을 주세요.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold">25,000원</span>
                <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 디버깅 정보 */}
      <div className="mt-8 p-4 text-center">
        <p>쇼핑 페이지가 정상적으로 로드되었습니다!</p>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mt-2 inline-block">
          <p>Path: <code>{window.location.pathname}</code></p>
        </div>
      </div>
    </div>
  );
}