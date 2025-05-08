import React from 'react';
import { ShoppingBag, Search, Star, Filter } from 'lucide-react';
import { useCart } from '@/context/cart-context';

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

  console.log("SimpleShopPage 컴포넌트가 렌더링됨");
  console.log("현재 URL:", window.location.href);

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
      <h1 className="text-3xl font-bold mb-8">쇼핑</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sampleProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">
                  {product.discountRate 
                    ? Math.round(product.price * (1 - product.discountRate / 100)).toLocaleString()
                    : product.price.toLocaleString()}원
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-primary text-white p-2 rounded-md hover:bg-primary/90"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}