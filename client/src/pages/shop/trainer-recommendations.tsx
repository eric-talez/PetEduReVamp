import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-compat';
import { useToast } from '@/hooks/use-toast';
import { shopApi, Product } from '@/lib/shop-api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, ThumbsUp, Search, Filter, Star, BadgeCheck, Share2, Heart, Loader2 } from 'lucide-react';

/**
 * 훈련사 추천 상품 페이지
 * - 훈련사가 추천하는 상품 목록 표시
 * - 상품 필터링 및 정렬 기능
 * - 추천 상품 상세 정보 보기
 */
export default function TrainerRecommendations() {
  const { isAuthenticated, userName } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // 상품 데이터 로드
  useEffect(() => {
    const loadRecommendedProducts = async () => {
      setIsLoading(true);
      try {
        // API 호출
        const recommendedProducts = await shopApi.getRecommendedProducts();
        setProducts(recommendedProducts);
      } catch (error) {
        console.error('추천 상품 로드 중 오류 발생:', error);
        toast({
          title: "데이터 로드 오류",
          description: "추천 상품을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        // 임시 데이터 사용 (실패 시)
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendedProducts();
  }, [toast]);

  // 훈련사 목록 (중복 제거)
  const trainerIds = products
    .map(product => product.trainerId)
    .filter((id): id is number => id !== undefined && id !== null);
  
  const uniqueTrainerIds = Array.from(new Set(trainerIds));
  
  const trainers = uniqueTrainerIds.map(trainerId => {
    const product = products.find(p => p.trainerId === trainerId);
    return {
      id: trainerId,
      name: `훈련사 ${trainerId}`, // 실제로는 훈련사 정보를 API에서 가져와야 함
    };
  });

  // 카테고리 목록 (중복 제거)
  const categoryValues = products
    .map(product => product.category)
    .filter((category): category is string => category !== undefined && category !== null);
  
  const categories = Array.from(new Set(categoryValues));

  // 필터링 및 정렬된 상품 목록
  const filteredProducts = products
    .filter(product => {
      // 검색어 필터링
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // 훈련사 필터링
      if (selectedTrainer && product.trainerId !== Number(selectedTrainer)) {
        return false;
      }
      
      // 카테고리 필터링
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // 정렬
      if (sortBy === 'popularity') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      } else if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

  // 페이지네이션
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 장바구니에 추가
  const addToCart = async (productId: string, referralCode?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "장바구니에 상품을 추가하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await shopApi.addToCart(productId, 1, referralCode);
      toast({
        title: "장바구니에 추가됨",
        description: "상품이 장바구니에 추가되었습니다.",
      });
    } catch (error) {
      console.error('장바구니 추가 중 오류 발생:', error);
      toast({
        title: "장바구니 추가 실패",
        description: "상품을 장바구니에 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 상품 공유
  const shareProduct = (productId: string, productName: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${productName} - FunnyTalez 추천 상품`,
        text: `${productName} - 훈련사 추천 상품을 확인해보세요!`,
        url: `https://store.funnytalez.com/product/${productId}`,
      })
      .catch(error => {
        console.error('공유하기 오류:', error);
      });
    } else {
      // 공유 API를 지원하지 않는 브라우저
      toast({
        title: "공유하기 기능 지원 안 함",
        description: "현재 브라우저에서는 공유하기 기능을 지원하지 않습니다.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">추천 상품을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">훈련사 추천 상품</h1>
          <p className="text-muted-foreground mt-1">
            전문 훈련사들이 직접 선별한 반려동물 상품 모음입니다.
          </p>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">검색</Label>
              <div className="relative mt-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="상품명 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="trainer-filter">훈련사</Label>
              <Select
                value={selectedTrainer || ''}
                onValueChange={(value) => setSelectedTrainer(value === '' ? null : value)}
              >
                <SelectTrigger id="trainer-filter" className="mt-1">
                  <SelectValue placeholder="모든 훈련사" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">모든 훈련사</SelectItem>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id.toString()}>
                      {trainer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">카테고리</Label>
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) => setSelectedCategory(value === '' ? null : value)}
              >
                <SelectTrigger id="category-filter" className="mt-1">
                  <SelectValue placeholder="모든 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">모든 카테고리</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-by">정렬</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="mt-1">
                  <SelectValue placeholder="인기순" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">인기순</SelectItem>
                  <SelectItem value="price-low">가격 낮은순</SelectItem>
                  <SelectItem value="price-high">가격 높은순</SelectItem>
                  <SelectItem value="rating">평점순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상품 목록 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">추천 상품이 없습니다.</p>
          <p className="mt-2">필터를 조정하거나 다른 검색어를 입력해보세요.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {paginatedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  {product.isRecommended && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <ThumbsUp className="h-3 w-3 mr-1" /> 추천
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="flex-grow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center">
                      {product.rating ? (
                        <>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-xl font-bold mt-2">₩{product.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`https://store.funnytalez.com/product/${product.id}`, '_blank')}
                  >
                    상세보기
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => addToCart(product.id, product.referralCode)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    담기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}