import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  User, 
  Star, 
  Heart, 
  Share2, 
  Award, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  BarChart, 
  Activity, 
  Loader2, 
  Percent 
} from 'lucide-react';
import { shopApi, Product, TrainerInfo, ProductRecommendationInfo } from '@/lib/shop-api';

interface ProductRecommendationDetailModalProps {
  productId: string;
  trainerId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductRecommendationDetailModal({
  productId,
  trainerId,
  isOpen,
  onClose
}: ProductRecommendationDetailModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [trainer, setTrainer] = useState<TrainerInfo | null>(null);
  const [recommendationInfo, setRecommendationInfo] = useState<ProductRecommendationInfo | null>(null);
  const [activeTab, setActiveTab] = useState('product');

  // 데이터 로드
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          // 병렬로 데이터 가져오기
          const [productData, trainerData, recommendationData] = await Promise.all([
            shopApi.getProduct(productId),
            shopApi.getTrainerInfo(trainerId),
            shopApi.getProductRecommendationInfo(productId, trainerId)
          ]);
          
          setProduct(productData);
          setTrainer(trainerData);
          setRecommendationInfo(recommendationData);
        } catch (error) {
          console.error('데이터 로드 실패:', error);
          toast({
            title: '데이터 로드 실패',
            description: '상품 정보를 불러오는 중 오류가 발생했습니다.',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      loadData();
    }
  }, [isOpen, productId, trainerId, toast]);

  // 장바구니에 추가
  const addToCart = async () => {
    if (!product) return;
    
    try {
      await shopApi.addToCart(product.id, 1, product.referralCode);
      toast({
        title: '장바구니에 추가됨',
        description: '상품이 장바구니에 추가되었습니다.',
      });
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      toast({
        title: '장바구니 추가 실패',
        description: '상품을 장바구니에 추가하는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 찜 목록에 추가
  const addToWishlist = async () => {
    if (!product) return;
    
    try {
      await shopApi.addToWishlist(product.id);
      toast({
        title: '찜 목록에 추가됨',
        description: '상품이 찜 목록에 추가되었습니다.',
      });
    } catch (error) {
      console.error('찜 목록 추가 실패:', error);
      toast({
        title: '찜 목록 추가 실패',
        description: '상품을 찜 목록에 추가하는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 상품 공유
  const shareProduct = () => {
    if (!product) return;
    
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - FunnyTalez 추천 상품`,
        text: `${product.name} - 훈련사 추천 상품을 확인해보세요!`,
        url: `https://store.funnytalez.com/product/${product.id}`,
      })
      .catch(error => {
        console.error('공유하기 오류:', error);
      });
    } else {
      toast({
        title: '공유하기 기능 지원 안 함',
        description: '현재 브라우저에서는 공유하기 기능을 지원하지 않습니다.',
        variant: 'destructive'
      });
    }
  };

  // 상품 상세 페이지로 이동
  const goToProductDetail = () => {
    if (!product) return;
    window.open(`https://store.funnytalez.com/product/${product.id}`, '_blank');
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">상품 정보를 불러오는 중...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // 데이터가 없을 때
  if (!product || !trainer || !recommendationInfo) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>정보 없음</DialogTitle>
            <DialogDescription>
              상품 또는 훈련사 정보를 찾을 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            훈련사 추천 상품 상세 정보
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="product" className="flex-1">상품 정보</TabsTrigger>
            <TabsTrigger value="trainer" className="flex-1">훈련사 정보</TabsTrigger>
            <TabsTrigger value="settlement" className="flex-1">정산 정보</TabsTrigger>
          </TabsList>
          
          {/* 상품 정보 탭 */}
          <TabsContent value="product" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {product.images && product.images.length > 0 ? (
                  <div className="overflow-hidden rounded-md">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full object-cover aspect-square"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-md">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
                
                {/* 추가 이미지 썸네일 */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                    {product.images.slice(1).map((img, index) => (
                      <div 
                        key={index} 
                        className="w-16 h-16 overflow-hidden rounded-md border cursor-pointer flex-shrink-0"
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} 이미지 ${index + 2}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex items-center">
                    {product.rating && (
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{product.rating.toFixed(1)}</span>
                        {product.reviewCount && (
                          <span className="text-xs ml-1 text-muted-foreground">({product.reviewCount})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-3xl font-bold mt-4">₩{product.price.toLocaleString()}</p>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">상품 설명</h3>
                    <p className="mt-1 text-muted-foreground whitespace-pre-line">{product.description}</p>
                  </div>
                  
                  {/* 훈련사 추천 사유 */}
                  <div className="bg-primary/5 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={trainer.profileImage} alt={trainer.name} />
                        <AvatarFallback>{trainer.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium">{trainer.name} 훈련사 추천 사유</h3>
                    </div>
                    <p className="mt-2 text-sm">
                      {recommendationInfo.reason || '이 상품은 반려견 훈련에 효과적인 제품으로, 전문 훈련사가 검증하고 추천합니다.'}
                    </p>
                  </div>
                  
                  {/* 태그 */}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">태그</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button onClick={goToProductDetail} className="flex-1">
                    상세 페이지 보기
                  </Button>
                  <Button onClick={addToCart} variant="default" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    장바구니
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button onClick={addToWishlist} variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    찜하기
                  </Button>
                  <Button onClick={shareProduct} variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    공유하기
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* 훈련사 정보 탭 */}
          <TabsContent value="trainer" className="pt-4">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={trainer.profileImage} alt={trainer.name} />
                  <AvatarFallback>{trainer.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{trainer.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {trainer.specialty && trainer.specialty.length > 0 && (
                      <span>{trainer.specialty.join(', ')}</span>
                    )}
                    {trainer.experience && (
                      <span>·</span>
                    )}
                    {trainer.experience && (
                      <span>경력 {trainer.experience}년</span>
                    )}
                  </div>
                  {trainer.rating && (
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{trainer.rating.toFixed(1)}</span>
                      {trainer.reviewCount && (
                        <span className="text-xs ml-1 text-muted-foreground">({trainer.reviewCount})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* 추가 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">소속 기관</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{trainer.instituteName || '개인 훈련사'}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">전문 분야</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specialty && trainer.specialty.length > 0 ? (
                        trainer.specialty.map((spec, index) => (
                          <Badge key={index} variant="secondary">{spec}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">등록된 전문 분야 없음</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 훈련사 소개 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">훈련사 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {trainer.bio || '등록된 소개글이 없습니다.'}
                  </p>
                </CardContent>
              </Card>
              
              {/* 훈련사 프로필 보기 버튼 */}
              <div className="flex justify-center">
                <Button onClick={() => window.location.href = `/trainers/${trainer.id}`} variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  훈련사 프로필 보기
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* 정산 정보 탭 */}
          <TabsContent value="settlement" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                      총 판매액
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₩{recommendationInfo.totalSales.toLocaleString()}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Percent className="h-5 w-5 mr-1 text-blue-500" />
                      수수료 비율
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{recommendationInfo.commissionRate}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-1 text-primary" />
                      총 수수료
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₩{recommendationInfo.totalCommission.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">세부 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">추천 상품명</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">추천 코드</span>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{recommendationInfo.referralCode}</code>
                  </div>
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">판매 건수</span>
                    <span className="font-medium">{recommendationInfo.salesCount}건</span>
                  </div>
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">추천 시작일</span>
                    <span className="font-medium">
                      {new Date(recommendationInfo.recommendedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">기관 정보</span>
                    <span className="font-medium">
                      {recommendationInfo.instituteName || '개인 훈련사'}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* 수익율 및 정산 프로그레스 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">수익율 분석</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">상품 가격 대비 수수료</span>
                      <span className="text-sm font-medium">{recommendationInfo.commissionRate}%</span>
                    </div>
                    <Progress value={recommendationInfo.commissionRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">총 매출 대비 수수료</span>
                      <span className="text-sm font-medium">
                        {((recommendationInfo.totalCommission / recommendationInfo.totalSales) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(recommendationInfo.totalCommission / recommendationInfo.totalSales) * 100} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}