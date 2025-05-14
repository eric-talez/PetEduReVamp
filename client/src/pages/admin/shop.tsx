
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Filter, ThumbsUp, DollarSign, User, Eye, Store, BarChart, ShoppingCart } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAuth } from '@/lib/auth-compat';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductRecommendationDetailModal } from '@/components/ProductRecommendationDetailModal';
import { shopApi, Product as ShopProduct, TrainerInfo, ProductRecommendationInfo } from '@/lib/shop-api';

// 기본 상품 인터페이스
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
}

// 훈련사 추천 상품 정보
interface TrainerRecommendation {
  productId: string;
  productName: string;
  trainerId: number;
  trainerName: string;
  referralCode: string;
  commissionRate: number;
  totalSales: number;
  totalCommission: number;
  salesCount: number;
  recommendedAt: string;
}

export default function AdminShopPage() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<TrainerRecommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('sales');
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState<TrainerInfo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // 상세 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 상품 목록 가져오기
        const productsData = await shopApi.getProducts();
        const formattedProducts: Product[] = productsData.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.stock || 0,
          category: p.category,
          status: p.stock > 0 ? 'active' : 'inactive'
        }));
        setProducts(formattedProducts);
        
        // 카테고리 목록 (중복 제거)
        const categoryValues = productsData
          .map(product => product.category)
          .filter((category): category is string => category !== undefined && category !== null);
        
        setCategories(Array.from(new Set(categoryValues)));
        
        // 훈련사 목록 가져오기 (차후 API 업데이트 필요)
        // 지금은 임시로 사용
        const trainersData: TrainerInfo[] = [
          { id: 1, name: '김훈련', specialty: ['행동 교정', '기본 훈련'], experience: 5, rating: 4.8 },
          { id: 2, name: '박트레이너', specialty: ['어질리티', '펫 케어'], experience: 3, rating: 4.5 }
        ];
        setTrainers(trainersData);
        
        // 훈련사 추천 상품 데이터 가져오기
        // API 완성 시 실제 데이터로 대체
        const recommendationsData: TrainerRecommendation[] = [
          {
            productId: "prod_1",
            productName: "프리미엄 강아지 사료",
            trainerId: 1,
            trainerName: "김훈련",
            referralCode: "T1_P1",
            commissionRate: 10,
            totalSales: 450000,
            totalCommission: 45000,
            salesCount: 10,
            recommendedAt: "2024-04-15"
          },
          {
            productId: "prod_2",
            productName: "반려견 장난감 세트",
            trainerId: 2,
            trainerName: "박트레이너",
            referralCode: "T2_P2",
            commissionRate: 8,
            totalSales: 125000,
            totalCommission: 10000,
            salesCount: 5,
            recommendedAt: "2024-04-10"
          }
        ];
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
        toast({
          title: "데이터 로드 실패",
          description: "상품 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // 추천 상품 필터링
  const filteredRecommendations = recommendations
    .filter(rec => {
      // 검색어 필터링
      if (searchTerm && !rec.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rec.trainerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // 훈련사 필터링
      if (selectedTrainer !== null && rec.trainerId !== selectedTrainer) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // 정렬
      if (sortBy === 'sales') {
        return b.totalSales - a.totalSales;
      } else if (sortBy === 'commission') {
        return b.totalCommission - a.totalCommission;
      } else if (sortBy === 'count') {
        return b.salesCount - a.salesCount;
      } else if (sortBy === 'rate') {
        return b.commissionRate - a.commissionRate;
      } else if (sortBy === 'recent') {
        return new Date(b.recommendedAt).getTime() - new Date(a.recommendedAt).getTime();
      }
      return 0;
    });

  // 상세 정보 모달 열기
  const openDetailModal = (productId: string, trainerId: number) => {
    setSelectedProductId(productId);
    setSelectedTrainerId(trainerId);
    setModalOpen(true);
  };

  // 권한 검사
  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">쇼핑몰 관리</h1>
        <Button className="gap-2">
          <Plus size={20} />
          새 상품 등록
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">
            <ShoppingCart className="h-4 w-4 mr-2" />
            상품 관리
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <ThumbsUp className="h-4 w-4 mr-2" />
            훈련사 추천 상품
          </TabsTrigger>
        </TabsList>
        
        {/* 상품 관리 탭 */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>상품 목록</CardTitle>
              <CardDescription>
                쇼핑몰의 전체 상품을 관리합니다. 상품 추가, 수정, 삭제 기능을 제공합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-4">
                <Input
                  placeholder="상품명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={selectedCategory || ''} onValueChange={(value) => setSelectedCategory(value === '' ? null : value)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">모든 카테고리</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>가격</TableHead>
                      <TableHead>재고</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          <div className="flex justify-center items-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            데이터 로딩 중...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">등록된 상품이 없습니다.</TableCell>
                      </TableRow>
                    ) : (
                      products
                        .filter(product => 
                          (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                          (selectedCategory === null || product.category === selectedCategory)
                        )
                        .map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.price.toLocaleString()}원</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                {product.status === 'active' ? '판매중' : '판매중지'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="mr-2">
                                <Pencil size={18} />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 size={18} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 훈련사 추천 상품 탭 */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>훈련사 추천 상품</CardTitle>
              <CardDescription>
                훈련사가 추천한 상품 목록과 정산 정보를 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="상품명 또는 훈련사 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <Select value={selectedTrainer?.toString() || ''} onValueChange={(value) => setSelectedTrainer(value === '' ? null : Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="훈련사 선택" />
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
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="정렬 기준" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">매출액 높은순</SelectItem>
                      <SelectItem value="commission">수수료 높은순</SelectItem>
                      <SelectItem value="count">판매량 높은순</SelectItem>
                      <SelectItem value="rate">수수료율 높은순</SelectItem>
                      <SelectItem value="recent">최근 추천순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품명</TableHead>
                      <TableHead>훈련사</TableHead>
                      <TableHead>수수료율</TableHead>
                      <TableHead>총 매출액</TableHead>
                      <TableHead>총 수수료</TableHead>
                      <TableHead>판매수량</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex justify-center items-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            데이터 로딩 중...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredRecommendations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">추천 상품 데이터가 없습니다.</TableCell>
                      </TableRow>
                    ) : (
                      filteredRecommendations.map((rec) => (
                        <TableRow key={`${rec.productId}_${rec.trainerId}`}>
                          <TableCell className="font-medium">{rec.productName}</TableCell>
                          <TableCell>{rec.trainerName}</TableCell>
                          <TableCell>{rec.commissionRate}%</TableCell>
                          <TableCell>{rec.totalSales.toLocaleString()}원</TableCell>
                          <TableCell>{rec.totalCommission.toLocaleString()}원</TableCell>
                          <TableCell>{rec.salesCount}개</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="mr-2"
                              onClick={() => openDetailModal(rec.productId, rec.trainerId)}
                            >
                              <Eye size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="mr-2">
                              <Pencil size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 size={18} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 상세 정보 모달 */}
      {modalOpen && selectedProductId && selectedTrainerId && (
        <ProductRecommendationDetailModal
          productId={selectedProductId}
          trainerId={selectedTrainerId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
