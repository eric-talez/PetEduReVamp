import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Building2, CreditCard, DollarSign, Users, Video, CheckCircle, Clock, XCircle } from 'lucide-react';

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

interface Institute {
  id: number;
  name: string;
  email: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionPlanInfo: SubscriptionPlan;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  maxMembers: number;
  maxVideoHours: number;
  createdAt: string;
}

export default function InstituteRegistration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    businessNumber: '',
    directorName: '',
    directorEmail: '',
    subscriptionPlan: '',
    paymentMethod: 'card',
    isVerified: false
  });

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // 구독 플랜 조회
  const { data: subscriptionPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/subscription-plans'],
    queryFn: () => apiRequest('GET', '/api/subscription-plans')
  });

  // 기관 목록 조회
  const { data: institutesData, isLoading: institutesLoading } = useQuery({
    queryKey: ['/api/admin/institutes'],
    queryFn: () => apiRequest('GET', '/api/admin/institutes')
  });

  // 기관 등록 뮤테이션
  const registerInstituteMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/admin/institutes', data),
    onSuccess: (response) => {
      toast({
        title: '기관 등록 성공',
        description: '기관이 성공적으로 등록되었습니다.'
      });
      
      // 결제가 필요한 경우 결제 폼 표시
      if (response.paymentRequired) {
        setShowPaymentForm(true);
      } else {
        // 폼 초기화
        setFormData({
          name: '',
          description: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          businessNumber: '',
          directorName: '',
          directorEmail: '',
          subscriptionPlan: '',
          paymentMethod: 'card',
          isVerified: false
        });
        setSelectedPlan(null);
      }
      
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerInstituteMutation.mutate(formData);
  };

  const handlePlanSelect = (planCode: string) => {
    const plan = subscriptionPlans.find((p: SubscriptionPlan) => p.code === planCode);
    setSelectedPlan(plan || null);
    setFormData({ ...formData, subscriptionPlan: planCode });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="text-green-600 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />활성</Badge>;
      case 'pending_payment':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock className="w-3 h-3 mr-1" />결제대기</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-red-600 border-red-300"><XCircle className="w-3 h-3 mr-1" />비활성</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">기관 등록 관리</h1>
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span className="text-sm text-gray-600">총 {institutesData?.institutes?.length || 0}개 기관</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기관 등록 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>새 기관 등록</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">기관명*</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="기관명을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">이메일*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@institute.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="기관에 대한 설명을 입력하세요"
                    className="min-h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="02-1234-5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">웹사이트</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.institute.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="기관 주소를 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessNumber">사업자번호</Label>
                    <Input
                      id="businessNumber"
                      value={formData.businessNumber}
                      onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
                      placeholder="123-45-67890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="directorName">대표자명</Label>
                    <Input
                      id="directorName"
                      value={formData.directorName}
                      onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                      placeholder="대표자 이름"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 구독 플랜 선택 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">구독 플랜 선택*</h3>
                
                <Select value={formData.subscriptionPlan} onValueChange={handlePlanSelect}>
                  <SelectTrigger>
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

                {selectedPlan && (
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
                )}
              </div>

              <Separator />

              {/* 결제 방법 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">결제 방법</h3>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
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

              <Button 
                type="submit" 
                className="w-full"
                disabled={registerInstituteMutation.isPending || !formData.name || !formData.email || !formData.subscriptionPlan}
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
            </form>
          </CardContent>
        </Card>

        {/* 등록된 기관 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>등록된 기관</CardTitle>
          </CardHeader>
          <CardContent>
            {institutesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {institutesData?.institutes?.map((institute: Institute) => (
                  <Card key={institute.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{institute.name}</h4>
                        {getStatusBadge(institute.subscriptionStatus)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {institute.email}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-blue-600">
                          {institute.subscriptionPlanInfo?.name || institute.subscriptionPlan}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          월 {formatPrice(institute.subscriptionPlanInfo?.price || 0)}원
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>회원 {institute.maxMembers === -1 ? '무제한' : institute.maxMembers}명</span>
                        <span>화상 {institute.maxVideoHours === -1 ? '무제한' : institute.maxVideoHours}시간</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!institutesData?.institutes || institutesData.institutes.length === 0) && (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">등록된 기관이 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}