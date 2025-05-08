import React from 'react';
import { ShoppingBag, Search, Filter, Star } from 'lucide-react';
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
    name: '강아지 장난감 세트',
    description: '내구성 있는 소재로 만든, 치아 건강과 스트레스 해소에 도움이 되는 장난감 세트입니다.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: '장난감',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    isNew: true
  },
  {
    id: 3,
    name: '반려동물 자동 급식기',
    description: '스마트폰으로 제어 가능한 자동 급식기로, 정해진 시간에 음식을 제공합니다.',
    price: 98000,
    discountRate: 15,
    image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    category: '용품',
    rating: 4.7,
    reviewCount: 56,
    inStock: true
  },
  {
    id: 4,
    name: '반려견 목욕 용품 세트',
    description: '피부에 자극이 없는 천연 성분으로 만든 샴푸와 컨디셔너, 빗 세트입니다.',
    price: 36500,
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    category: '미용',
    rating: 4.4,
    reviewCount: 42,
    inStock: true
  },
  {
    id: 5,
    name: '강아지 트레이닝 클리커',
    description: '전문가들이 사용하는 효과적인 훈련 도구로, 긍정적 강화 훈련에 적합합니다.',
    price: 12000,
    discountRate: 5,
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    category: '훈련',
    rating: 4.9,
    reviewCount: 136,
    inStock: true,
    isBestseller: true
  },
  {
    id: 6,
    name: '반려동물 GPS 추적기',
    description: '실시간 위치 추적과 활동 모니터링이 가능한 스마트 GPS 장치입니다.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: '안전',
    rating: 4.6,
    reviewCount: 78,
    inStock: false
  }
];

export default function SimpleShopPage() {
  const { addToCart } = useCart();

  console.log("SimpleShopPage 렌더링됨");
  console.log("현재 URL:", window.location.href);
  console.log("현재 경로명:", window.location.pathname);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discountRate 
        ? Math.round(product.price * (1 - product.discountRate / 100)) 
        : undefined,
      quantity: 1,
      imageUrl: product.image,
      inStock: product.inStock
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">쇼핑</h1>
        <button 
          onClick={() => window.location.href = '/shop/cart'} 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag size={20} />
          <span>장바구니</span>
        </button>
      </div>
      
      {/* 상품 검색 필터 */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="상품 검색..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" 
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="">모든 카테고리</option>
              <option value="food">사료/간식</option>
              <option value="toy">장난감</option>
              <option value="fashion">의류/패션</option>
              <option value="health">건강/위생</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Filter size={20} />
              <span className="hidden md:inline">필터</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* 배너 광고 */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-md">
        <div className="relative h-48 md:h-64 lg:h-72 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">여름 특별 할인 이벤트</h2>
            <p className="text-lg mb-4">반려동물 용품 최대 40% 할인</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md shadow-md hover:bg-gray-100 transition-colors w-fit">
              자세히 보기
            </button>
          </div>
        </div>
      </div>
      
      {/* 인기 상품 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">인기 상품</h2>
          <a href="#" className="text-primary hover:underline">모두 보기</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sampleProducts.filter(p => p.isBestseller).map(product => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </span>
                )}
                {product.isBestseller && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    인기
                  </span>
                )}
                {product.discountRate && (
                  <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discountRate}% OFF
                  </span>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
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
      </div>
      
      {/* 모든 상품 섹션 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">모든 상품</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sampleProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </span>
                )}
                {product.isBestseller && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    인기
                  </span>
                )}
                {product.discountRate && (
                  <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discountRate}% OFF
                  </span>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
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
  );
}