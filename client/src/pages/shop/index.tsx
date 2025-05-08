
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/cart-context';
import { ShoppingBag, Search, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: '프리미엄 반려견 사료',
    description: '영양가 높은 프리미엄 사료',
    price: 45000,
    image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=사료',
    category: '사료',
    rating: 4.8,
    reviewCount: 128,
    inStock: true
  },
  {
    id: 2,
    name: '반려견 장난감 세트',
    description: '내구성 좋은 장난감 세트',
    price: 25000,
    image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=장난감',
    category: '장난감',
    rating: 4.5,
    reviewCount: 89,
    inStock: true
  }
];

export default function ShopPage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">반려견 용품</h1>
        <Button 
          onClick={() => window.location.href = '/shop/cart'} 
          className="flex items-center gap-2"
        >
          <ShoppingBag size={20} />
          <span>장바구니</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              type="text" 
              placeholder="상품 검색..." 
              className="pl-10" 
            />
          </div>
          <select className="px-4 py-2 border rounded-lg">
            <option value="">모든 카테고리</option>
            <option value="food">사료/간식</option>
            <option value="toy">장난감</option>
            <option value="health">건강/위생</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sampleProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{product.description}</p>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
              <Button
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  imageUrl: product.image,
                  inStock: product.inStock
                })}
                disabled={!product.inStock}
              >
                장바구니 담기
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
