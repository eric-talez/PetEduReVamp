import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Trash2, Search, Plus, Save, X } from 'lucide-react';

// 임시 데이터 - 실제로는 API에서 가져와야 함
const MOCK_PRODUCTS = [
  { id: 1, name: '기초 사회화 훈련 코스', category: '강의', price: 128000, commissionRate: 10 },
  { id: 2, name: '문제행동 교정 프로그램', category: '강의', price: 165000, commissionRate: 15 },
  { id: 3, name: '어질리티 초급 과정', category: '강의', price: 185000, commissionRate: 12 },
  { id: 4, name: '반려견 장난감 세트', category: '상품', price: 45000, commissionRate: 8 },
  { id: 5, name: '프리미엄 사료 (3kg)', category: '상품', price: 59000, commissionRate: 5 },
  { id: 6, name: '반려견 트레이닝 클리커', category: '상품', price: 12000, commissionRate: 7 },
];

const MOCK_REFERRERS = [
  { id: 1, name: '김지훈', role: '훈련사', referralCode: 'TRAINER001', earningsTotal: 1250000 },
  { id: 2, name: '서울 애견훈련소', role: '기관', referralCode: 'INST002', earningsTotal: 2380000 },
  { id: 3, name: '박서연', role: '훈련사', referralCode: 'TRAINER003', earningsTotal: 950000 },
  { id: 4, name: '댕댕이 멍멍이', role: '제휴사', referralCode: 'AFFILIATE004', earningsTotal: 1650000 },
];

const MOCK_COMMISSION_HISTORY = [
  { id: 1, date: '2025-05-01', referrer: '김지훈', product: '기초 사회화 훈련 코스', amount: 12800, status: '지급완료' },
  { id: 2, date: '2025-05-01', referrer: '서울 애견훈련소', product: '문제행동 교정 프로그램', amount: 24750, status: '지급완료' },
  { id: 3, date: '2025-05-02', referrer: '박서연', product: '반려견 장난감 세트', amount: 3600, status: '지급대기' },
  { id: 4, date: '2025-05-03', referrer: '댕댕이 멍멍이', product: '프리미엄 사료 (3kg)', amount: 2950, status: '지급대기' },
  { id: 5, date: '2025-05-04', referrer: '서울 애견훈련소', product: '기초 사회화 훈련 코스', amount: 12800, status: '지급대기' },
];

export default function CommissionManagement() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [referrers, setReferrers] = useState(MOCK_REFERRERS);
  const [commissionHistory, setCommissionHistory] = useState(MOCK_COMMISSION_HISTORY);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">수수료 관리</h1>
      </div>
      
      <Tabs defaultValue="products">
        <TabsList className="grid w-full md:w-auto grid-cols-5">
          <TabsTrigger value="products">상품별 수수료율</TabsTrigger>
          <TabsTrigger value="pricing">상품 가격 관리</TabsTrigger>
          <TabsTrigger value="referrers">추천인 현황</TabsTrigger>
          <TabsTrigger value="history">수수료 지급 내역</TabsTrigger>
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
        
        {/* 수수료 지급 내역 탭 */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>수수료 지급 내역</CardTitle>
              <CardDescription>
                추천 코드를 통한 구매에 대한 수수료 지급 내역을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>날짜</TableHead>
                      <TableHead>추천인</TableHead>
                      <TableHead>상품</TableHead>
                      <TableHead>금액</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionHistory.map(history => (
                      <TableRow key={history.id}>
                        <TableCell>{history.date}</TableCell>
                        <TableCell className="font-medium">{history.referrer}</TableCell>
                        <TableCell>{history.product}</TableCell>
                        <TableCell>{history.amount.toLocaleString()}원</TableCell>
                        <TableCell>
                          <Badge 
                            variant={history.status === '지급완료' ? 'default' : 'outline'}
                          >
                            {history.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {history.status === '지급대기' && (
                            <Button size="sm" variant="outline">
                              지급처리
                            </Button>
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
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">총 정산 금액</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₩6,230,000</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">지급 완료</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">₩3,630,000</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">지급 대기</h3>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">₩2,600,000</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="font-semibold text-red-900 dark:text-red-100">보류</h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">₩0</p>
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
                      <TableRow key={referrer.id}>
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
                          <Badge variant={referrer.id % 2 === 0 ? 'default' : 'outline'}>
                            {referrer.id % 2 === 0 ? '지급완료' : '지급대기'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {referrer.id % 2 !== 0 && (
                            <Button size="sm" variant="outline">
                              정산 승인
                            </Button>
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
    </div>
  );
}
