import { useState, useEffect } from 'react';
import { shopApi, Product } from '@/lib/shop-api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Pencil, Trash2, PackageSearch, Tag, DollarSign, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-compat';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProductManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'KRW',
    category: '',
    subcategory: '',
    tags: '',
    stock: 0,
    images: [''],
    isRecommended: false,
    trainerId: user?.trainerId || 0,
    instituteId: user?.instituteId || 0
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // 권한 확인
  const hasPermission = user?.role === 'admin' || user?.role === 'trainer' || user?.role === 'institute-admin';

  // 상품 목록 조회
  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', page, selectedCategory],
    queryFn: () => shopApi.getProducts(selectedCategory || undefined, page),
    enabled: hasPermission
  });

  // 검색 결과
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['product-search', searchQuery],
    queryFn: () => shopApi.searchProducts(searchQuery, 1),
    enabled: hasPermission && searchQuery.length > 2
  });

  // 상품 추가 뮤테이션
  const createProductMutation = useMutation({
    mutationFn: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
      shopApi.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: '상품 등록 성공',
        description: '새 상품이 성공적으로 등록되었습니다.',
      });
      setProductDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: '상품 등록 실패',
        description: `상품 등록 중 오류가 발생했습니다: ${error}`,
        variant: 'destructive',
      });
    }
  });

  // 상품 수정 뮤테이션
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      shopApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: '상품 수정 성공',
        description: '상품 정보가 성공적으로 수정되었습니다.',
      });
      setProductDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: '상품 수정 실패',
        description: `상품 수정 중 오류가 발생했습니다: ${error}`,
        variant: 'destructive',
      });
    }
  });

  // 상품 삭제 뮤테이션
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => shopApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: '상품 삭제 성공',
        description: '상품이 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '상품 삭제 실패',
        description: `상품 삭제 중 오류가 발생했습니다: ${error}`,
        variant: 'destructive',
      });
    }
  });

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'KRW',
      category: '',
      subcategory: '',
      tags: '',
      stock: 0,
      images: [''],
      isRecommended: false,
      trainerId: user?.trainerId || 0,
      instituteId: user?.instituteId || 0
    });
    setCurrentProduct(null);
  };

  // 상품 등록/수정 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 데이터 준비
    const productData = {
      ...formData,
      // 문자열 태그를 배열로 변환
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };
    
    if (currentProduct) {
      // 상품 수정
      updateProductMutation.mutate({ 
        id: currentProduct.id, 
        data: productData 
      });
    } else {
      // 상품 추가
      createProductMutation.mutate(productData as any);
    }
  };

  // 폼 필드 변경 이벤트 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  // 상품 수정 버튼 클릭
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      subcategory: product.subcategory || '',
      tags: product.tags.join(', '),
      stock: product.stock,
      images: product.images.length > 0 ? product.images : [''],
      isRecommended: product.isRecommended || false,
      trainerId: product.trainerId || user?.trainerId || 0,
      instituteId: product.instituteId || user?.instituteId || 0
    });
    setProductDialogOpen(true);
  };

  // 상품 추가 버튼 클릭
  const handleAddProduct = () => {
    resetForm();
    setProductDialogOpen(true);
  };

  // 상품 삭제 확인
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // 이미지 URL 추가 필드
  const handleAddImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  // 이미지 URL 변경
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // 이미지 필드 제거
  const handleRemoveImageField = (index: number) => {
    if (formData.images.length <= 1) return;
    
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // 추천 상품 토글
  const handleRecommendedToggle = () => {
    setFormData(prev => ({
      ...prev,
      isRecommended: !prev.isRecommended
    }));
  };

  if (!hasPermission) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            관리자 또는 훈련사 권한이 필요한 페이지입니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          새 상품 등록
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">전체 상품</TabsTrigger>
          <TabsTrigger value="search">상품 검색</TabsTrigger>
          {user?.role === 'trainer' && (
            <TabsTrigger value="recommended">내 추천 상품</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>상품 목록</CardTitle>
              <CardDescription>
                등록된 모든 상품 목록입니다. 상품을 편집하거나 삭제할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="category-filter">카테고리 필터</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="모든 카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">모든 카테고리</SelectItem>
                    <SelectItem value="pet-food">반려동물 사료</SelectItem>
                    <SelectItem value="pet-snack">반려동물 간식</SelectItem>
                    <SelectItem value="pet-toys">장난감</SelectItem>
                    <SelectItem value="pet-supplies">용품</SelectItem>
                    <SelectItem value="pet-training">훈련 도구</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    상품 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">번호</TableHead>
                        <TableHead>이미지</TableHead>
                        <TableHead>상품명</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>가격</TableHead>
                        <TableHead>재고</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products && products.length > 0 ? (
                        products.map((product, index) => (
                          <TableRow key={product.id}>
                            <TableCell>{(page - 1) * 20 + index + 1}</TableCell>
                            <TableCell>
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                  <PackageSearch className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.description?.substring(0, 50)}...</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Tag className="h-4 w-4 mr-1" />
                                {product.category}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {product.price.toLocaleString()} {product.currency}
                              </div>
                            </TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {user?.role === 'admin' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            등록된 상품이 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  이전
                </Button>
                <span>페이지 {page}</span>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!products || products.length < 20}
                >
                  다음
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>상품 검색</CardTitle>
              <CardDescription>
                상품 이름, 설명, 태그 등으로 검색할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="검색어를 입력하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['product-search', searchQuery] })}>
                  검색
                </Button>
              </div>

              {isSearching ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이미지</TableHead>
                        <TableHead>상품명</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>가격</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults && searchResults.length > 0 ? (
                        searchResults.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                  <PackageSearch className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.description?.substring(0, 50)}...</div>
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.price.toLocaleString()} {product.currency}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {user?.role === 'admin' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            검색 결과가 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  검색어를 입력하세요 (최소 3자 이상)
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === 'trainer' && (
          <TabsContent value="recommended">
            <Card>
              <CardHeader>
                <CardTitle>내 추천 상품</CardTitle>
                <CardDescription>
                  반려동물 교육자가 추천하는 상품 목록입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 추천 상품 목록 (훈련사 아이디로 필터링) */}
                특정 훈련사가 추천하는 상품 목록이 표시됩니다.
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* 상품 등록/수정 다이얼로그 */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct ? '상품 수정' : '새 상품 등록'}</DialogTitle>
            <DialogDescription>
              {currentProduct 
                ? '상품 정보를 수정합니다. 모든 필드를 확인해주세요.' 
                : '새로운, 상품정보를 입력하세요. *는 필수 항목입니다.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* 상품명 */}
            <div className="space-y-1">
              <Label htmlFor="name">상품명 *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* 상품 설명 */}
            <div className="space-y-1">
              <Label htmlFor="description">상품 설명 *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {/* 가격 및 통화 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="price">가격 *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="currency">통화</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => 
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="통화 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KRW">한국 원 (KRW)</SelectItem>
                    <SelectItem value="USD">미국 달러 (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 카테고리 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="category">카테고리 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => 
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet-food">반려동물 사료</SelectItem>
                    <SelectItem value="pet-snack">반려동물 간식</SelectItem>
                    <SelectItem value="pet-toys">장난감</SelectItem>
                    <SelectItem value="pet-supplies">용품</SelectItem>
                    <SelectItem value="pet-training">훈련 도구</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="subcategory">하위 카테고리</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 태그 */}
            <div className="space-y-1">
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="예: 강아지, 간식, 유기농"
              />
            </div>

            {/* 재고 */}
            <div className="space-y-1">
              <Label htmlFor="stock">재고 수량 *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            {/* 이미지 URL */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>상품 이미지 URL</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddImageField}
                >
                  이미지 추가
                </Button>
              </div>
              
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="이미지 URL 입력"
                  />
                  {formData.images.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveImageField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* 추천 상품 여부 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecommended"
                checked={formData.isRecommended}
                onChange={handleRecommendedToggle}
                className="rounded border-gray-300 focus:ring-2 focus:ring-primary h-4 w-4"
              />
              <Label htmlFor="isRecommended" className="cursor-pointer">
                추천 상품으로 등록
              </Label>
            </div>

            {/* 제출 버튼 */}
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setProductDialogOpen(false)}
              >
                취소
              </Button>
              <Button 
                type="submit"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {(createProductMutation.isPending || updateProductMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : currentProduct ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    수정 완료
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    상품 등록
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}