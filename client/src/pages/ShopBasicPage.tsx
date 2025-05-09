import React, { useState } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, Search, Filter, Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerSlider } from '@/components/BannerSlider';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/cart-context';

// 상품 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  discountRate?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  category: string;
  tags: string[];
  inStock: boolean;
}

// 샘플 상품 데이터
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "프리미엄 강아지 사료 5kg",
    price: 45000,
    discountedPrice: 36000,
    discountRate: 20,
    imageUrl: "https://placehold.co/300x300/e6f7ff/0099cc?text=Dog+Food",
    rating: 4.8,
    reviewCount: 125,
    isNew: true,
    isSale: true,
    category: "food",
    tags: ["premium", "all-ages", "grain-free"],
    inStock: true,
  },
  {
    id: 2,
    name: "고양이 자동 급식기",
    price: 89000,
    imageUrl: "https://placehold.co/300x300/fff5e6/ff9900?text=Cat+Feeder",
    rating: 4.6,
    reviewCount: 89,
    isHot: true,
    category: "accessory",
    tags: ["automatic", "smart", "timer"],
    inStock: true,
  },
  {
    id: 3,
    name: "반려동물 털 관리 브러쉬",
    price: 25000,
    discountedPrice: 18750,
    discountRate: 25,
    imageUrl: "https://placehold.co/300x300/f5f5f5/808080?text=Pet+Brush",
    rating: 4.5,
    reviewCount: 210,
    isSale: true,
    category: "grooming",
    tags: ["hair-removal", "easy-cleaning"],
    inStock: true,
  },
  {
    id: 4,
    name: "강아지 장난감 세트",
    price: 32000,
    imageUrl: "https://placehold.co/300x300/e6ffe6/009900?text=Dog+Toys",
    rating: 4.3,
    reviewCount: 67,
    isNew: true,
    category: "toy",
    tags: ["interactive", "durable", "chew-resistant"],
    inStock: true,
  },
  {
    id: 5,
    name: "고양이 스크래처 타워",
    price: 120000,
    discountedPrice: 99000,
    discountRate: 18,
    imageUrl: "https://placehold.co/300x300/f0e6ff/6600cc?text=Cat+Tower",
    rating: 4.9,
    reviewCount: 153,
    isHot: true,
    isSale: true,
    category: "furniture",
    tags: ["multi-level", "sisal", "cozy"],
    inStock: true,
  },
  {
    id: 6,
    name: "반려동물 목욕 샴푸",
    price: 18000,
    imageUrl: "https://placehold.co/300x300/e6f2ff/0066cc?text=Pet+Shampoo",
    rating: 4.7,
    reviewCount: 98,
    category: "grooming",
    tags: ["hypoallergenic", "natural"],
    inStock: true,
  },
  {
    id: 7,
    name: "강아지 하네스 리드줄",
    price: 28000,
    imageUrl: "https://placehold.co/300x300/ffe6e6/cc0000?text=Dog+Harness",
    rating: 4.4,
    reviewCount: 72,
    isNew: true,
    category: "accessory",
    tags: ["adjustable", "reflective", "comfortable"],
    inStock: true,
  },
  {
    id: 8,
    name: "고양이 화장실 매트",
    price: 15000,
    discountedPrice: 12000,
    discountRate: 20,
    imageUrl: "https://placehold.co/300x300/f2f2f2/666666?text=Litter+Mat",
    rating: 4.2,
    reviewCount: 45,
    isSale: true,
    category: "accessory",
    tags: ["waterproof", "easy-clean", "large"],
    inStock: false,
  },
];

// 카테고리 필터 옵션
const categories = [
  { id: "all", name: "전체" },
  { id: "food", name: "사료/간식" },
  { id: "accessory", name: "용품" },
  { id: "grooming", name: "미용/목욕" },
  { id: "toy", name: "장난감" },
  { id: "furniture", name: "가구" },
];

export default function ShopBasicPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addToCart } = useCart();
  
  // 필터링된 상품 목록
  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  // 장바구니 추가 핸들러
  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      quantity: 1,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 flex items-center">
          <ShoppingBag className="mr-2" />
          펫에듀 쇼핑
        </h1>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="상품 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <Link href="/shop/cart">
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* 배너 슬라이더 */}
      <div className="mb-8">
        <BannerSlider />
      </div>
      
      {/* 카테고리 필터 */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 p-1 min-w-max">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
              
              {/* 배지 표시 */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">NEW</span>
                )}
                {product.isHot && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">HOT</span>
                )}
                {product.isSale && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">SALE</span>
                )}
              </div>
              
              {/* 액션 버튼 */}
              <div className="absolute top-2 right-2">
                <button className="bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Heart className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 h-12">{product.name}</h3>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center text-amber-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs ml-1 text-gray-700 dark:text-gray-300">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              </div>
              
              <div className="mb-3">
                {product.discountedPrice ? (
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{product.discountedPrice.toLocaleString()}원</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">{product.price.toLocaleString()}원</span>
                    <span className="ml-2 text-sm text-red-500 font-medium">{product.discountRate}%</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">{product.price.toLocaleString()}원</span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  className="flex-1 h-9 text-xs sm:text-sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "장바구니 담기" : "품절"}
                </Button>
                <Button variant="outline" className="h-9 px-2">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" className="h-8 w-8 p-0">1</Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
          <span className="px-2 text-gray-500">...</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">8</Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </div>
  );
}