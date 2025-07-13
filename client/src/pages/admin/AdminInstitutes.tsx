import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Plus, Eye, Edit, Trash2, Building, MapPin, Users, CreditCard, DollarSign, Video, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface SubscriptionPlan {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  maxMembers: number;
  maxVideoHours: number;
  features: {
    basicLMS: boolean;
    basicVideoConsultation: boolean;
    basicStatistics: boolean;
    aiRecommendation: boolean;
    customBranding: boolean;
    apiIntegration: boolean;
    dedicatedSupport: boolean;
    whiteLabel: boolean;
  };
}

export default function AdminInstitutes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [newInstitute, setNewInstitute] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    businessNumber: "",
    directorName: "",
    directorEmail: "",
    subscriptionPlan: "",
    paymentMethod: "card",
    isVerified: false
  });

  // 구독 플랜 조회
  const { data: subscriptionPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/subscription-plans'],
    queryFn: () => apiRequest('GET', '/api/subscription-plans')
  });

  // 기관 등록 뮤테이션
  const registerInstituteMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/admin/institutes', data),
    onSuccess: (response) => {
      toast({
        title: '기관 등록 성공',
        description: '기관이 성공적으로 등록되었습니다.'
      });
      
      // 폼 초기화
      setNewInstitute({
        name: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        businessNumber: "",
        directorName: "",
        directorEmail: "",
        subscriptionPlan: "",
        paymentMethod: "card",
        isVerified: false
      });
      setSelectedPlan(null);
      setIsAddInstituteOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/institutes'] });
    },
    onError: (error: any) => {
      toast({
        title: '등록 실패',
        description: error.message || '기관 등록 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  });

  // 기관 추가 함수
  const handleAddInstitute = () => {
    if (!newInstitute.name || !newInstitute.email || !newInstitute.subscriptionPlan) {
      toast({
        title: '입력 오류',
        description: '기관명, 이메일, 구독 플랜은 필수 항목입니다.',
        variant: 'destructive'
      });
      return;
    }
    
    registerInstituteMutation.mutate(newInstitute);
  };

  const handlePlanSelect = (planCode: string) => {
    const plan = subscriptionPlans.find((p: SubscriptionPlan) => p.code === planCode);
    setSelectedPlan(plan || null);
    setNewInstitute({ ...newInstitute, subscriptionPlan: planCode });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getFeatureIcon = (feature: string, enabled: boolean) => {
    if (!enabled) return null;
    
    switch (feature) {
      case 'basicLMS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'aiRecommendation':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'customBranding':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'apiIntegration':
        return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'dedicatedSupport':
        return <CheckCircle className="w-4 h-4 text-pink-500" />;
      case 'whiteLabel':
        return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // 실제 기관 데이터 가져오기
  const { data: institutesData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/institutes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/institutes');
      if (!response.ok) {
        throw new Error('기관 데이터를 불러올 수 없습니다');
      }
      const result = await response.json();
      console.log('[DEBUG] 기관 데이터 응답:', result);
      return result.success ? result.institutes : result.institutes || [];
    },
    staleTime: 5 * 60 * 1000, // 5분
  });

  const institutes = institutesData || [];

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">기관 정보를 불러올 수 없습니다</h2>
            <p className="text-muted-foreground">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">비활성</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">정지</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">기관 관리</h1>
          <p className="text-muted-foreground">등록된 훈련 기관들을 관리합니다</p>
        </div>
        <Dialog open={isAddInstituteOpen} onOpenChange={setIsAddInstituteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 기관 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>새 기관 등록</DialogTitle>
              <DialogDescription>
                새로운 훈련 기관을 플랫폼에 등록합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">기관명 *</Label>
                  <Input
                    id="name"
                    value={newInstitute.name}
                    onChange={(e) => setNewInstitute({ ...newInstitute, name: e.target.value })}
                    className="col-span-3"
                    placeholder="서울반려견아카데미"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newInstitute.email}
                    onChange={(e) => setNewInstitute({ ...newInstitute, email: e.target.value })}
                    className="col-span-3"
                    placeholder="admin@institute.com"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">설명</Label>
                  <Textarea
                    id="description"
                    value={newInstitute.description}
                    onChange={(e) => setNewInstitute({ ...newInstitute, description: e.target.value })}
                    className="col-span-3"
                    placeholder="기관에 대한 설명을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">연락처</Label>
                  <Input
                    id="phone"
                    value={newInstitute.phone}
                    onChange={(e) => setNewInstitute({ ...newInstitute, phone: e.target.value })}
                    className="col-span-3"
                    placeholder="02-1234-5678"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">주소</Label>
                  <Input
                    id="address"
                    value={newInstitute.address}
                    onChange={(e) => setNewInstitute({ ...newInstitute, address: e.target.value })}
                    className="col-span-3"
                    placeholder="서울시 강남구"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right">웹사이트</Label>
                  <Input
                    id="website"
                    value={newInstitute.website}
                    onChange={(e) => setNewInstitute({ ...newInstitute, website: e.target.value })}
                    className="col-span-3"
                    placeholder="https://www.institute.com"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="businessNumber" className="text-right">사업자번호</Label>
                  <Input
                    id="businessNumber"
                    value={newInstitute.businessNumber}
                    onChange={(e) => setNewInstitute({ ...newInstitute, businessNumber: e.target.value })}
                    className="col-span-3"
                    placeholder="123-45-67890"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="directorName" className="text-right">대표자명</Label>
                  <Input
                    id="directorName"
                    value={newInstitute.directorName}
                    onChange={(e) => setNewInstitute({ ...newInstitute, directorName: e.target.value })}
                    className="col-span-3"
                    placeholder="김원장"
                  />
                </div>
              </div>

              <Separator />

              {/* 구독 플랜 선택 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">구독 플랜 선택 *</h3>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">플랜</Label>
                  <Select value={newInstitute.subscriptionPlan} onValueChange={handlePlanSelect}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="구독 플랜을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionPlans.map((plan: SubscriptionPlan) => (
                        <SelectItem key={plan.code} value={plan.code}>
                          <div className="flex items-center justify-between w-full">
                            <span>{plan.name}</span>
                            <span className="text-primary font-semibold ml-2">
                              월 {formatPrice(plan.price)}원
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPlan && (
                  <div className="col-span-4 ml-4">
                    <Card className="border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{selectedPlan.name}</h4>
                          <Badge variant="outline" className="text-primary">
                            월 {formatPrice(selectedPlan.price)}원
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{selectedPlan.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">
                              최대 {selectedPlan.maxMembers === -1 ? '무제한' : selectedPlan.maxMembers}명
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Video className="w-4 h-4 text-green-500" />
                            <span className="text-sm">
                              월 {selectedPlan.maxVideoHours === -1 ? '무제한' : selectedPlan.maxVideoHours}시간
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">포함 기능:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(selectedPlan.features).map(([key, enabled]) => (
                              <div key={key} className="flex items-center space-x-2">
                                {getFeatureIcon(key, enabled)}
                                <span className={`text-xs ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                  {key === 'basicLMS' && '기본 LMS'}
                                  {key === 'basicVideoConsultation' && '화상 상담'}
                                  {key === 'basicStatistics' && '기본 통계'}
                                  {key === 'aiRecommendation' && 'AI 추천'}
                                  {key === 'customBranding' && '커스텀 브랜딩'}
                                  {key === 'apiIntegration' && 'API 연동'}
                                  {key === 'dedicatedSupport' && '전담 지원'}
                                  {key === 'whiteLabel' && '화이트라벨'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <Separator />

              {/* 결제 방법 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">결제 방법</h3>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">결제 수단</Label>
                  <div className="col-span-3">
                    <RadioGroup
                      value={newInstitute.paymentMethod}
                      onValueChange={(value) => setNewInstitute({ ...newInstitute, paymentMethod: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>신용카드</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>계좌이체</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="invoice" id="invoice" />
                        <Label htmlFor="invoice" className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>세금계산서</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddInstitute}
                disabled={registerInstituteMutation.isPending || !newInstitute.name || !newInstitute.email || !newInstitute.subscriptionPlan}
              >
                {registerInstituteMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    등록 중...
                  </>
                ) : (
                  '기관 등록'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 기관 수</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(institutes) ? institutes.length : 0}</div>
            <p className="text-xs text-muted-foreground">
              활성 {Array.isArray(institutes) ? institutes.filter((i: any) => i.isActive === true).length : 0}개
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 훈련사</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(institutes) ? institutes.reduce((total: number, inst: any) => total + (inst.trainersCount || (inst.trainerId ? 1 : 0)), 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              전체 기관 소속
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 교육생</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(institutes) ? institutes.reduce((total: number, inst: any) => total + (inst.studentsCount || 0), 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              모든 기관 합계
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 규모</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(institutes) && institutes.length > 0 ? 
                Math.round(institutes.reduce((total: number, inst: any) => total + (inst.trainersCount || (inst.trainerId ? 1 : 0)), 0) / institutes.length) : 0}명
            </div>
            <p className="text-xs text-muted-foreground">
              기관당 평균 훈련사
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>기관 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="기관명, 코드, 원장명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
                <SelectItem value="suspended">정지</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              고급 필터
            </Button>
          </div>

          {/* 기관 테이블 */}
          <div className="border rounded-lg">
            <div className="grid grid-cols-9 gap-4 p-4 font-medium border-b bg-muted/50">
              <div>기관명</div>
              <div>대표자</div>
              <div>위치</div>
              <div>구독 플랜</div>
              <div>훈련사</div>
              <div>교육생</div>
              <div>상태</div>
              <div>결제 상태</div>
              <div>작업</div>
            </div>
            {Array.isArray(institutes) && institutes.length > 0 ? (
              institutes.map((institute: any) => (
                <div key={institute.id} className="grid grid-cols-9 gap-4 p-4 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{institute.name || '이름 없음'}</div>
                    <div className="text-sm text-muted-foreground">{institute.email || '-'}</div>
                  </div>
                  <div>
                    <div className="font-medium">{institute.directorName || institute.director || '미지정'}</div>
                    <div className="text-sm text-muted-foreground">{institute.phone || '-'}</div>
                  </div>
                  <div className="text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {institute.address || institute.location || '위치 미지정'}
                  </div>
                  <div>
                    <div className="font-medium">
                      {institute.subscriptionPlanInfo?.name || institute.subscriptionPlan || '미지정'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      월 {institute.subscriptionPlanInfo?.price ? formatPrice(institute.subscriptionPlanInfo.price) : '0'}원
                    </div>
                  </div>
                  <div className="text-center font-medium">
                    <div>{institute.trainersCount || (institute.trainerId ? 1 : 0)}명</div>
                    <div className="text-xs text-muted-foreground">
                      최대 {institute.maxMembers === -1 ? '무제한' : institute.maxMembers}명
                    </div>
                  </div>
                  <div className="text-center font-medium">
                    <div>{institute.studentsCount || 0}명</div>
                    <div className="text-xs text-muted-foreground">
                      {institute.usedVideoHours || 0}h/{institute.maxVideoHours === -1 ? '∞' : institute.maxVideoHours}h
                    </div>
                  </div>
                  <div>{getStatusBadge(institute.isActive ? 'active' : 'inactive')}</div>
                  <div>
                    <Badge 
                      variant={institute.subscriptionStatus === 'active' ? 'default' : 'secondary'}
                      className={institute.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {institute.subscriptionStatus === 'active' ? '활성' : '대기'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        console.log('기관 상세보기:', institute.name);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        console.log('기관 편집:', institute.name);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        console.log('기관 삭제:', institute.name);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                등록된 기관이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}