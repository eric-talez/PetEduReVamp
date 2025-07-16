import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, Trash2, Search, Plus, Save, X, FileText, BarChart3, Eye, Calendar, CreditCard, User, Building, Clock } from 'lucide-react';
import { InvoiceGenerator } from '@/components/InvoiceGenerator';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// 임시 데이터 - 실제로는 API에서 가져와야 함
const MOCK_PRODUCTS = [
  { id: 1, name: '기초 사회화 훈련 코스', category: '강의', price: 128000, commissionRate: 10 },
  { id: 2, name: '문제행동 교정 프로그램', category: '강의', price: 165000, commissionRate: 15 },
  { id: 3, name: '어질리티 초급 과정', category: '강의', price: 185000, commissionRate: 12 },
  { id: 4, name: '반려견 장난감 세트', category: '상품', price: 45000, commissionRate: 8 },
  { id: 5, name: '프리미엄 사료 (3kg)', category: '상품', price: 59000, commissionRate: 5 },
  { id: 6, name: '반려견 트레이닝 클리커', category: '상품', price: 12000, commissionRate: 7 },
];

// 구독 상품 데이터
const MOCK_SUBSCRIPTION_PRODUCTS = [
  { 
    id: 1, 
    name: 'Starter Plan', 
    tier: 'starter',
    description: '기본 기능 제공',
    basePrice: 150000, 
    discountRate: 0,
    finalPrice: 150000,
    features: ['기본 LMS 기능', '최대 50명 수용', '기본 지원'],
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Standard Plan', 
    tier: 'standard',
    description: '표준 기능 제공',
    basePrice: 300000, 
    discountRate: 10,
    finalPrice: 270000,
    features: ['전체 LMS 기능', '최대 200명 수용', '우선 지원', '분석 도구'],
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Professional Plan', 
    tier: 'professional',
    description: '전문 기능 제공',
    basePrice: 500000, 
    discountRate: 15,
    finalPrice: 425000,
    features: ['고급 LMS 기능', '최대 500명 수용', '전담 지원', '고급 분석', '커스터마이징'],
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Enterprise Plan', 
    tier: 'enterprise',
    description: '기업용 기능 제공',
    basePrice: 800000, 
    discountRate: 20,
    finalPrice: 640000,
    features: ['무제한 기능', '무제한 수용', '24/7 지원', '완전 커스터마이징', 'API 접근'],
    status: 'active'
  }
];

const MOCK_REFERRERS = [
  { id: 1, name: '김지훈', role: '훈련사', referralCode: 'TRAINER001', earningsTotal: 1250000, status: '지급대기' },
  { id: 2, name: '서울 애견훈련소', role: '기관', referralCode: 'INST002', earningsTotal: 2380000, status: '지급완료' },
  { id: 3, name: '박서연', role: '훈련사', referralCode: 'TRAINER003', earningsTotal: 950000, status: '지급대기' },
  { id: 4, name: '댕댕이 멍멍이', role: '제휴사', referralCode: 'AFFILIATE004', earningsTotal: 1650000, status: '지급완료' },
];

export default function CommissionManagement() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [subscriptionProducts, setSubscriptionProducts] = useState(MOCK_SUBSCRIPTION_PRODUCTS);
  const [referrers, setReferrers] = useState(MOCK_REFERRERS);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<number | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(0);
  const [newDiscountRate, setNewDiscountRate] = useState<number>(0);
  const [newBasePrice, setNewBasePrice] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [isSettlementDetailOpen, setIsSettlementDetailOpen] = useState(false);
  const [selectedSettlementDetail, setSelectedSettlementDetail] = useState<any>(null);
  const [generatedInvoices, setGeneratedInvoices] = useState<any[]>([]);
  
  // 상품 검색 및 필터링 기능
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '전체' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 수수료율 편집 시작
  const handleEditStart = (product: typeof MOCK_PRODUCTS[0]) => {
    setEditingProductId(product.id);
    setNewCommissionRate(product.commissionRate);
  };

  // 수수료율 저장
  const handleSaveCommissionRate = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, commissionRate: newCommissionRate } : product
    ));
    setEditingProductId(null);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  // 정산승인 처리
  const handleSettlementApproval = async (referrer: any) => {
    try {
      // 로딩 상태 표시
      setReferrers(prev => 
        prev.map(r => 
          r.id === referrer.id 
            ? { ...r, status: '처리중' }
            : r
        )
      );

      // 실제 정산 처리 API 호출
      const response = await fetch(`/api/commission/settlements/${referrer.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referrerId: referrer.id,
          amount: Math.round(referrer.earningsTotal * (referrer.role === '훈련사' ? 0.15 : referrer.role === '기관' ? 0.10 : 0.05)),
          period: '2025.01.01 ~ 2025.01.31'
        })
      });

      if (response.ok) {
        // 정산 승인 성공 시 상태 업데이트
        setReferrers(prev => 
          prev.map(r => 
            r.id === referrer.id 
              ? { ...r, status: '지급완료' }
              : r
          )
        );
        
        // 성공 메시지 표시
        alert(`${referrer.name}님의 정산이 성공적으로 처리되었습니다.`);
        
        // 계산서 발행 다이얼로그 열기
        setSelectedSettlement(referrer);
        setIsInvoiceDialogOpen(true);
      } else {
        throw new Error('정산 처리 실패');
      }
    } catch (error) {
      // 오류 발생 시 상태 되돌리기
      setReferrers(prev => 
        prev.map(r => 
          r.id === referrer.id 
            ? { ...r, status: '지급대기' }
            : r
        )
      );
      
      console.error('정산 처리 오류:', error);
      alert('정산 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 계산서 발행 완료 처리
  const handleInvoiceGenerated = (invoiceData: any) => {
    // 정산 상태를 '지급완료'로 변경
    setReferrers(prev => 
      prev.map(referrer => 
        referrer.id === selectedSettlement.id 
          ? { ...referrer, status: '지급완료' }
          : referrer
      )
    );
    
    // 생성된 계산서 저장
    setGeneratedInvoices(prev => [...prev, invoiceData]);
    
    // 성공 메시지 표시
    alert(`${selectedSettlement.name}님의 정산이 완료되었습니다.\n계산서 번호: ${invoiceData.id}`);
  };

  // 계산서 다이얼로그 닫기
  const handleInvoiceDialogClose = () => {
    setIsInvoiceDialogOpen(false);
    setSelectedSettlement(null);
  };

  // 정산 상세 정보 팝업 핸들러
  const handleSettlementDetailOpen = (referrer: any) => {
    setSelectedSettlementDetail(referrer);
    setIsSettlementDetailOpen(true);
  };

  const handleSettlementDetailClose = () => {
    setIsSettlementDetailOpen(false);
    setSelectedSettlementDetail(null);
  };

  // 구독 상품 편집 시작
  const handleEditSubscriptionStart = (subscription: typeof MOCK_SUBSCRIPTION_PRODUCTS[0]) => {
    setEditingSubscriptionId(subscription.id);
    setNewBasePrice(subscription.basePrice);
    setNewDiscountRate(subscription.discountRate);
  };

  // 구독 상품 저장
  const handleSaveSubscription = (subscriptionId: number) => {
    setSubscriptionProducts(subscriptionProducts.map(subscription => 
      subscription.id === subscriptionId 
        ? { 
            ...subscription, 
            basePrice: newBasePrice, 
            discountRate: newDiscountRate,
            finalPrice: Math.round(newBasePrice * (1 - newDiscountRate / 100))
          } 
        : subscription
    ));
    setEditingSubscriptionId(null);
  };

  // 구독 상품 편집 취소
  const handleCancelSubscriptionEdit = () => {
    setEditingSubscriptionId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">가격 관리</h1>
      </div>
      
      <Tabs defaultValue="products">
        <TabsList className="grid w-full md:w-auto grid-cols-5">
          <TabsTrigger value="products">상품별 수수료율</TabsTrigger>
          <TabsTrigger value="pricing">상품 가격 관리</TabsTrigger>
          <TabsTrigger value="subscriptions">구독 상품 관리</TabsTrigger>
          <TabsTrigger value="referrers">추천인 현황</TabsTrigger>
          <TabsTrigger value="settlements">정산 관리</TabsTrigger>
        </TabsList>
        
        {/* 상품별 수수료율 탭 */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>상품별 수수료율 설정</CardTitle>
              <CardDescription>
                각 상품 및 강의별 추천인 수수료율을 설정합니다. 설정된 비율에 따라 상품 가격의 일정 비율이 추천인에게 지급됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="상품명 검색"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      <SelectItem value="강의">강의</SelectItem>
                      <SelectItem value="상품">상품</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>가격</TableHead>
                      <TableHead>수수료율 (%)</TableHead>
                      <TableHead>실제 수수료</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant={product.category === '강의' ? 'default' : 'secondary'}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.price.toLocaleString()}원</TableCell>
                        <TableCell>
                          {editingProductId === product.id ? (
                            <div className="w-24">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={newCommissionRate}
                                onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                                className="h-8"
                              />
                            </div>
                          ) : (
                            <span>{product.commissionRate}%</span>
                          )}
                        </TableCell>
                        <TableCell>{Math.round(product.price * (product.commissionRate / 100)).toLocaleString()}원</TableCell>
                        <TableCell>
                          {editingProductId === product.id ? (
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handleSaveCommissionRate(product.id)}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleEditStart(product)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredProducts.length === 0 && (
                  <div className="py-6 text-center text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                * 수수료는 상품 가격의 일정 비율(%)로 계산됩니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 상품 가격 관리 탭 */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>상품 가격 관리</CardTitle>
              <CardDescription>
                강의, 상품, 서비스의 가격을 관리합니다. 할인 정책과 프로모션을 설정할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>기본 가격</TableHead>
                      <TableHead>할인율</TableHead>
                      <TableHead>최종 가격</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant={product.category === '강의' ? 'default' : 'secondary'}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.price.toLocaleString()}원</TableCell>
                        <TableCell>0%</TableCell>
                        <TableCell className="font-semibold">{product.price.toLocaleString()}원</TableCell>
                        <TableCell>
                          <Badge variant="default">활성</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 구독 상품 관리 탭 */}
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>구독 상품 가격 관리</CardTitle>
              <CardDescription>
                기관용 구독 플랜의 기본 가격과 할인율을 관리합니다. 할인율이 적용된 최종 가격이 자동으로 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionProducts.map(subscription => (
                  <Card key={subscription.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{subscription.name}</h3>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status === 'active' ? '활성' : '비활성'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {subscription.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">기본 가격</label>
                            {editingSubscriptionId === subscription.id ? (
                              <Input
                                type="number"
                                value={newBasePrice}
                                onChange={(e) => setNewBasePrice(Number(e.target.value))}
                                className="mt-1"
                                min="0"
                              />
                            ) : (
                              <p className="text-lg font-semibold">{subscription.basePrice.toLocaleString()}원</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">할인율</label>
                            {editingSubscriptionId === subscription.id ? (
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  type="number"
                                  value={newDiscountRate}
                                  onChange={(e) => setNewDiscountRate(Number(e.target.value))}
                                  min="0"
                                  max="100"
                                  className="flex-1"
                                />
                                <span className="text-sm">%</span>
                              </div>
                            ) : (
                              <p className="text-lg font-semibold text-orange-600">{subscription.discountRate}%</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">최종 가격</label>
                            <p className="text-lg font-bold text-green-600">
                              {editingSubscriptionId === subscription.id 
                                ? Math.round(newBasePrice * (1 - newDiscountRate / 100)).toLocaleString()
                                : subscription.finalPrice.toLocaleString()
                              }원
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">할인 금액</label>
                            <p className="text-lg font-semibold text-red-600">
                              {editingSubscriptionId === subscription.id 
                                ? Math.round(newBasePrice * (newDiscountRate / 100)).toLocaleString()
                                : Math.round(subscription.basePrice * (subscription.discountRate / 100)).toLocaleString()
                              }원
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">주요 기능</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {subscription.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {editingSubscriptionId === subscription.id ? (
                          <>
                            <Button
                              onClick={() => handleSaveSubscription(subscription.id)}
                              size="sm"
                              variant="outline"
                              className="h-8"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              저장
                            </Button>
                            <Button
                              onClick={handleCancelSubscriptionEdit}
                              size="sm"
                              variant="outline"
                              className="h-8"
                            >
                              <X className="h-4 w-4 mr-1" />
                              취소
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleEditSubscriptionStart(subscription)}
                            size="sm"
                            variant="outline"
                            className="h-8"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            편집
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 추천인 현황 탭 */}
        <TabsContent value="referrers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>추천인 현황</CardTitle>
              <CardDescription>
                시스템에 등록된 추천인과 각 추천인의 수익 현황을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>추천인 코드</TableHead>
                      <TableHead>총 수익</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrers.map(referrer => (
                      <TableRow key={referrer.id}>
                        <TableCell className="font-medium">{referrer.name}</TableCell>
                        <TableCell>
                          <Badge variant={referrer.role === '훈련사' ? 'default' : (referrer.role === '기관' ? 'secondary' : 'outline')}>
                            {referrer.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{referrer.referralCode}</TableCell>
                        <TableCell>{referrer.earningsTotal.toLocaleString()}원</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        
        {/* 정산 관리 탭 */}
        <TabsContent value="settlements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>정산 관리</CardTitle>
              <CardDescription>
                훈련사, 기관, 제휴사에 대한 정산 현황을 관리합니다. 정산 승인 및 지급 처리를 할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-xl">
                  <h3 className="text-sm mb-2">총 정산 금액</h3>
                  <div className="w-20 h-20 mx-auto mb-2">
                    <CircularProgressbar 
                      value={100} 
                      text="100%" 
                      styles={buildStyles({
                        textColor: "white",
                        pathColor: "#3b82f6",
                        trailColor: "#374151"
                      })}
                    />
                  </div>
                  <p className="text-lg font-bold text-center">₩6,230,000</p>
                </div>
                <div className="bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-xl">
                  <h3 className="text-sm mb-2">지급 완료</h3>
                  <div className="w-20 h-20 mx-auto mb-2">
                    <CircularProgressbar 
                      value={58} 
                      text="58%" 
                      styles={buildStyles({
                        textColor: "white",
                        pathColor: "#10b981",
                        trailColor: "#374151"
                      })}
                    />
                  </div>
                  <p className="text-lg font-bold text-center">₩3,630,000</p>
                </div>
                <div className="bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-xl">
                  <h3 className="text-sm mb-2">지급 대기</h3>
                  <div className="w-20 h-20 mx-auto mb-2">
                    <CircularProgressbar 
                      value={42} 
                      text="42%" 
                      styles={buildStyles({
                        textColor: "white",
                        pathColor: "#f59e0b",
                        trailColor: "#374151"
                      })}
                    />
                  </div>
                  <p className="text-lg font-bold text-center">₩2,600,000</p>
                </div>
                <div className="bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-xl">
                  <h3 className="text-sm mb-2">보류</h3>
                  <div className="w-20 h-20 mx-auto mb-2">
                    <CircularProgressbar 
                      value={0} 
                      text="0%" 
                      styles={buildStyles({
                        textColor: "white",
                        pathColor: "#ef4444",
                        trailColor: "#374151"
                      })}
                    />
                  </div>
                  <p className="text-lg font-bold text-center">₩0</p>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>정산 대상</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>정산 기간</TableHead>
                      <TableHead>총 수익</TableHead>
                      <TableHead>수수료율</TableHead>
                      <TableHead>정산 금액</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrers.map(referrer => (
                      <TableRow key={referrer.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => handleSettlementDetailOpen(referrer)}>
                        <TableCell className="font-medium">{referrer.name}</TableCell>
                        <TableCell>
                          <Badge variant={referrer.role === '훈련사' ? 'default' : 'secondary'}>
                            {referrer.role}
                          </Badge>
                        </TableCell>
                        <TableCell>2025.01.01 ~ 2025.01.31</TableCell>
                        <TableCell>{referrer.earningsTotal.toLocaleString()}원</TableCell>
                        <TableCell>
                          {referrer.role === '훈련사' ? '15%' : referrer.role === '기관' ? '10%' : '5%'}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {Math.round(referrer.earningsTotal * (referrer.role === '훈련사' ? 0.15 : referrer.role === '기관' ? 0.10 : 0.05)).toLocaleString()}원
                        </TableCell>
                        <TableCell>
                          <Badge variant={referrer.status === '지급완료' ? 'default' : referrer.status === '처리중' ? 'secondary' : 'outline'}>
                            {referrer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {referrer.status === '지급대기' ? (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSettlementApproval(referrer);
                                }}
                                disabled={referrer.status === '처리중'}
                                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                {referrer.status === '처리중' ? '처리 중...' : '정산 승인'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSettlementDetailOpen(referrer);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <Badge variant="default" className="text-xs">
                                {referrer.status}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSettlementDetailOpen(referrer);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 계산서 발행 다이얼로그 */}
      <InvoiceGenerator
        isOpen={isInvoiceDialogOpen}
        onClose={handleInvoiceDialogClose}
        settlement={selectedSettlement}
        onInvoiceGenerated={handleInvoiceGenerated}
      />

      {/* 정산 상세 정보 팝업 */}
      <Dialog open={isSettlementDetailOpen} onOpenChange={setIsSettlementDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              정산 상세 정보
            </DialogTitle>
          </DialogHeader>
          
          {selectedSettlementDetail && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        정산 대상 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">이름</span>
                        <span className="font-medium">{selectedSettlementDetail.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">유형</span>
                        <Badge variant={selectedSettlementDetail.role === '훈련사' ? 'default' : 'secondary'}>
                          {selectedSettlementDetail.role}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">추천 코드</span>
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {selectedSettlementDetail.referralCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">상태</span>
                        <Badge variant={selectedSettlementDetail.status === '지급완료' ? 'default' : selectedSettlementDetail.status === '처리중' ? 'secondary' : 'outline'}>
                          {selectedSettlementDetail.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        정산 금액 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">총 수익</span>
                        <span className="font-medium">{selectedSettlementDetail.earningsTotal.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">수수료율</span>
                        <span className="font-medium">
                          {selectedSettlementDetail.role === '훈련사' ? '15%' : selectedSettlementDetail.role === '기관' ? '10%' : '5%'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">정산 금액</span>
                        <span className="text-lg font-bold text-blue-600">
                          {Math.round(selectedSettlementDetail.earningsTotal * (selectedSettlementDetail.role === '훈련사' ? 0.15 : selectedSettlementDetail.role === '기관' ? 0.10 : 0.05)).toLocaleString()}원
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 정산 기간 및 처리 정보 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      정산 기간 및 처리 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">정산 기간</span>
                        <span className="font-medium">2025.01.01 ~ 2025.01.31</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">신청일</span>
                        <span className="font-medium">2025.01.15</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">처리 예정일</span>
                        <span className="font-medium">2025.02.05</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">최종 처리일</span>
                        <span className="font-medium">
                          {selectedSettlementDetail.status === '지급완료' ? '2025.02.03' : '-'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상세 수익 내역 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      상세 수익 내역
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">강의 수익</div>
                          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                            {Math.round(selectedSettlementDetail.earningsTotal * 0.6).toLocaleString()}원
                          </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <div className="text-sm text-green-600 dark:text-green-400 mb-1">상품 판매</div>
                          <div className="text-xl font-bold text-green-700 dark:text-green-300">
                            {Math.round(selectedSettlementDetail.earningsTotal * 0.3).toLocaleString()}원
                          </div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">기타 수익</div>
                          <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                            {Math.round(selectedSettlementDetail.earningsTotal * 0.1).toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 액션 버튼 */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleSettlementDetailClose}>
                    닫기
                  </Button>
                  {selectedSettlementDetail.status === '지급대기' && (
                    <Button onClick={() => {
                      handleSettlementDetailClose();
                      handleSettlementApproval(selectedSettlementDetail);
                    }}>
                      <FileText className="h-4 w-4 mr-2" />
                      정산 승인
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
