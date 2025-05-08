import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Star, RefreshCw, Tag, Truck, Gift, Heart, ShoppingCart, AlertCircle, PawPrint } from "lucide-react";
import { useAuth } from "../../SimpleApp";
import { useCart } from "@/context/cart-context";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  referralCommission?: number;
  inStock: boolean;
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const auth = useAuth();
  const { cartCount, addToCart } = useCart();
  
  // 제품 데이터
  const products: Product[] = [
    {
      id: 1,
      name: "프리미엄 반려견 훈련용 클리커",
      category: "training",
      price: 15000,
      rating: 4.8,
      reviewCount: 126,
      imageUrl: "https://images.unsplash.com/photo-1598875384021-4a23470c7997?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "훈련사들이 추천하는 고품질 클리커. 명확한 소리로 반려견 훈련 효과를 높여줍니다.",
      isBestSeller: true,
      referralCommission: 10,
      inStock: true
    },
    {
      id: 2,
      name: "반려견 지능 개발 장난감 세트",
      category: "toys",
      price: 35000,
      discountRate: 15,
      rating: 4.6,
      reviewCount: 89,
      imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "반려견의 지능 개발을 돕는 다양한 퍼즐 장난감 세트. 지루함 해소와 두뇌 발달에 효과적입니다.",
      isOnSale: true,
      referralCommission: 15,
      inStock: true
    },
    {
      id: 3,
      name: "프리미엄 가죽 리드줄",
      category: "accessories",
      price: 45000,
      rating: 4.9,
      reviewCount: 203,
      imageUrl: "https://images.unsplash.com/photo-1581434271564-7e273485524c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "고급 이탈리안 가죽으로 제작된 내구성 강한 리드줄. 편안한 그립감과 세련된 디자인.",
      isBestSeller: true,
      referralCommission: 12,
      inStock: true
    },
    {
      id: 4,
      name: "유기농 강아지 간식 모음",
      category: "food",
      price: 28000,
      rating: 4.7,
      reviewCount: 156,
      imageUrl: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "100% 유기농 재료로 만든 건강한 간식 모음. 알레르기가 있는 반려견에게도 안전합니다.",
      isNew: true,
      referralCommission: 20,
      inStock: true
    },
    {
      id: 5,
      name: "반려견 행동 교정 훈련 매뉴얼",
      category: "training",
      price: 22000,
      discountRate: 10,
      rating: 4.5,
      reviewCount: 78,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "전문 훈련사가 작성한 상세한 행동 교정 가이드. 문제 행동별 단계적 훈련 방법을 제공합니다.",
      referralCommission: 25,
      inStock: true
    },
    {
      id: 6,
      name: "반려견 자동 급식기",
      category: "accessories",
      price: 89000,
      rating: 4.4,
      reviewCount: 112,
      imageUrl: "https://images.unsplash.com/photo-1603189949082-94d05ee232e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "스마트폰으로 제어 가능한 자동 급식기. 정해진 시간에 정확한 양의 사료를 제공합니다.",
      isNew: true,
      referralCommission: 8,
      inStock: false
    },
    {
      id: 7,
      name: "프리미엄 반려견 쿠션",
      category: "home",
      price: 68000,
      discountRate: 20,
      rating: 4.8,
      reviewCount: 95,
      imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "메모리폼 소재의 편안한 반려견 쿠션. 관절이 약한 노령견에게 추천합니다.",
      isOnSale: true,
      referralCommission: 15,
      inStock: true
    },
    {
      id: 8,
      name: "반려견 털 관리 브러쉬 세트",
      category: "grooming",
      price: 42000,
      rating: 4.6,
      reviewCount: 132,
      imageUrl: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "다양한 털 길이와 유형에 맞는 브러쉬 세트. 효과적인 털 관리와 마사지 효과를 제공합니다.",
      isBestSeller: true,
      referralCommission: 18,
      inStock: true
    }
  ];

  // URL에서 추천인 코드 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('ref');
    if (code) {
      setReferralCode(code);
      console.log(`추천인 코드 감지: ${code}`);
      
      // 로컬 스토리지에 추천 코드 저장 (구매 시 적용)
      localStorage.setItem('referralCode', code);
    }
  }, [location]);

  // 필터링된 제품 목록
  const filteredProducts = products.filter(product => {
    // 카테고리 필터링
    if (activeTab !== "all" && product.category !== activeTab) {
      return false;
    }
    
    // 검색어 필터링
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // 장바구니에 추가
  const handleAddToCart = (product: Product) => {
    // cart-context의 함수를 활용하여 장바구니에 상품 추가
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discountRate ? Math.round(product.price * (1 - product.discountRate / 100)) : undefined,
      quantity: 1,
      imageUrl: product.imageUrl,
      inStock: product.inStock
    });
    
    // 추천 코드가 있는 경우 로그
    if (referralCode) {
      console.log(`구매 시 추천인 ${referralCode}에게 커미션이 적용됩니다.`);
    }
  };

  // 장바구니 페이지로 이동
  const goToCart = () => {
    navigate('/shop/cart');
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">반려견 용품</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            품질 검증된 반려견 용품과 전문가 추천 제품을 한곳에서
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <div 
            className="relative mr-4 cursor-pointer" 
            onClick={goToCart}
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          
          {referralCode && (
            <Badge variant="outline" className="mr-4 flex items-center gap-1">
              <Gift className="w-3 h-3" />
              추천코드 적용됨
            </Badge>
          )}
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="제품 검색..."
              className="pl-9 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="training">훈련용품</TabsTrigger>
          <TabsTrigger value="toys">장난감</TabsTrigger>
          <TabsTrigger value="accessories">액세서리</TabsTrigger>
          <TabsTrigger value="food">간식/사료</TabsTrigger>
          <TabsTrigger value="grooming">그루밍</TabsTrigger>
          <TabsTrigger value="home">생활용품</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200">
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <Badge variant="default" className="px-2 py-1 bg-blue-500">신상품</Badge>
                      )}
                      {product.isBestSeller && (
                        <Badge variant="success" className="px-2 py-1">베스트셀러</Badge>
                      )}
                      {product.isOnSale && (
                        <Badge variant="danger" className="px-2 py-1">할인 중</Badge>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Product ${product.id} added to wishlist`);
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center mb-1">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="mx-1 text-gray-300 dark:text-gray-600">|</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">리뷰 {product.reviewCount}개</span>
                    </div>
                    
                    <h3 className="font-semibold line-clamp-1 mb-1">{product.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      {product.discountRate ? (
                        <>
                          <span className="font-bold text-lg">
                            {Math.round(product.price * (1 - product.discountRate / 100)).toLocaleString()}원
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            {product.price.toLocaleString()}원
                          </span>
                          <Badge variant="danger" className="ml-2 px-1.5 py-0.5 text-[10px]">
                            {product.discountRate}% 할인
                          </Badge>
                        </>
                      ) : (
                        <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px] mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.referralCommission && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30">
                          <Tag className="h-3 w-3" />
                          추천시 {product.referralCommission}% 적립
                        </Badge>
                      )}
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        무료배송
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        className="flex-1"
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {product.inStock ? "장바구니" : "품절"}
                      </Button>
                      
                      {auth.isAuthenticated && auth.userRole === 'trainer' && (
                        <Button variant="outline" className="flex-1">
                          <Gift className="mr-2 h-4 w-4" />
                          추천하기
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                다른 검색어나 카테고리를 선택해 보세요.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                필터 초기화
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {referralCode && (
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="text-lg font-semibold flex items-center text-primary">
            <Gift className="mr-2 h-5 w-5" />
            추천인 코드가 적용되었습니다
          </h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            현재 추천인 코드 <strong className="text-primary">{referralCode}</strong>가 적용된 상태입니다. 
            상품 구매 시 추천인에게 커미션이 지급되며, 귀하에게는 할인 혜택이 제공됩니다.
          </p>
        </div>
      )}
      
      {auth.isAuthenticated && auth.userRole === 'pet-owner' && (
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
          <h2 className="text-xl font-bold flex items-center text-amber-800 dark:text-amber-400 mb-4">
            <PawPrint className="mr-2 h-5 w-5" />
            반려동물 맞춤 추천 상품
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-amber-200 dark:border-amber-800/30">
              <div className="p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Star className="h-4 w-4 fill-amber-500 mr-1" />
                  당신의 반려견에게 딱 맞는 상품
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  등록된 반려견 정보를 기반으로 맞춤형 상품을 추천해드립니다.
                </p>
                <Button variant="outline" className="w-full">반려견 정보 업데이트</Button>
              </div>
            </Card>
            
            <Card className="overflow-hidden border-amber-200 dark:border-amber-800/30">
              <div className="p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Gift className="h-4 w-4 text-amber-500 mr-1" />
                  반려견 생일 선물 추천
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  다가오는 반려견의 생일을 위한 특별한 선물을 골라보세요.
                </p>
                <Button variant="outline" className="w-full">선물 보기</Button>
              </div>
            </Card>
            
            <Card className="overflow-hidden border-amber-200 dark:border-amber-800/30">
              <div className="p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <ShoppingBag className="h-4 w-4 text-amber-500 mr-1" />
                  정기 구독 상품
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  매월 필요한 반려견 용품을 자동으로 받아보세요. 10% 할인 혜택!
                </p>
                <Button variant="outline" className="w-full">구독 상품 보기</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}