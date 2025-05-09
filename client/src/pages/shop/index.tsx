
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Search, ShoppingBag, ChevronRight, Star, Tag, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  discountRate?: number;
  mall?: string;
}

const categories = [
  { id: 'all', name: '전체' },
  { id: 'food', name: '사료/간식' },
  { id: 'toy', name: '장난감' },
  { id: 'health', name: '건강/관리' },
  { id: 'fashion', name: '의류/악세서리' },
  { id: 'living', name: '홈/리빙' }
];

const sampleProducts: Product[] = [
  {
    id: 1,
    name: '프리미엄 반려견 사료',
    description: '영양가 높은 프리미엄 사료',
    price: 45000,
    image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=사료',
    category: 'food',
    rating: 4.8,
    reviewCount: 128,
    inStock: true,
    discountRate: 10,
    mall: '펫프렌즈'
  },
  // ... Add more sample products
];

// 이 파일은 ShopPage.tsx로 직접 연결합니다
import ShopPage from './ShopPage';

// 동일한 경로에 index.tsx와 ShopPage.tsx가 있으면 혼란을 일으킬 수 있으므로
// index.tsx는 단순히 ShopPage.tsx를 내보내기만 합니다
export default function ShopPageIndex() {
  // 중요: 이 컴포넌트에 접근할 때 실행됨
  console.log("Shop/index.tsx: ShopPage.tsx 컴포넌트로 직접 연결");
  
  // 쇼핑 페이지가 연결된 시점을 기록
  console.log("쇼핑 페이지 로딩 시작:", new Date().toISOString());
  
  // ShopPage 컴포넌트를 직접 반환
  return <ShopPage />;
}

// 아래 코드는 더 이상 사용하지 않습니다 - ShopBasicPage를 사용합니다
function OriginalShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10" 
              placeholder="검색어를 입력해주세요" 
            />
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/shop/cart'}>
            <ShoppingBag className="w-5 h-5 mr-2" />
            장바구니
          </Button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Featured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            인기 상품
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {sampleProducts.slice(0, 4).map(product => (
              <a 
                key={product.id} 
                href={`/shop/product/${product.id}`}
                className="group"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
                <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                <div className="text-primary font-bold">
                  {product.discountRate && (
                    <span className="mr-1">{product.discountRate}%</span>
                  )}
                  {product.price.toLocaleString()}원
                </div>
              </a>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            특가 상품
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {sampleProducts.slice(0, 4).map(product => (
              <a 
                key={product.id} 
                href={`/shop/product/${product.id}`}
                className="group"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
                <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                <div className="text-primary font-bold">
                  {product.discountRate && (
                    <span className="mr-1">{product.discountRate}%</span>
                  )}
                  {product.price.toLocaleString()}원
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sampleProducts.map(product => (
          <a 
            key={product.id} 
            href={`/shop/product/${product.id}`}
            className="group bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">{product.mall}</div>
              <h3 className="font-medium line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2">
                {product.discountRate && (
                  <Badge variant="danger">{product.discountRate}%</Badge>
                )}
                <span className="font-bold text-lg">
                  {product.price.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                {product.rating} ({product.reviewCount})
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
