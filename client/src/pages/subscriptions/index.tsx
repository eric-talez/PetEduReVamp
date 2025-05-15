import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, CheckCircle, Package, Gift, AlertCircle, Clock, Calendar, ChevronRight, Info, Star, Tag, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { DogLoading } from '../../components/DogLoading';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  discountPercent?: number;
}

interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'paused';
  startDate: string;
  endDate: string;
  renewalDate: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: {
    id: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  invoiceUrl?: string;
}

// 샘플 데이터 - 실제 구현에서는 API에서 가져와야 함
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: '베이직 멤버십',
    description: '반려동물 기본 교육과 관리에 필요한 기본 기능',
    price: 5900,
    interval: 'monthly',
    features: [
      '기본 교육 과정 접근',
      '영상 강의 5개/월',
      '커뮤니티 접근',
      '기본 훈련 보고서',
    ],
  },
  {
    id: 'premium',
    name: '프리미엄 멤버십',
    description: '가장 인기있는 플랜으로 맞춤형 훈련과 상담을 제공합니다',
    price: 12900,
    interval: 'monthly',
    features: [
      '모든 교육 과정 접근',
      '무제한 영상 강의',
      '라이브 1:1 상담 2회/월',
      '상세 훈련 보고서',
      'AI 분석 리포트',
      '24시간 채팅 상담',
    ],
    isPopular: true,
    isCurrent: true,
  },
  {
    id: 'family',
    name: '패밀리 멤버십',
    description: '여러 마리의 반려동물을 키우는 가족을 위한 특별 요금제',
    price: 19900,
    interval: 'monthly',
    features: [
      '최대 3마리 반려동물 등록',
      '모든 프리미엄 기능 포함',
      '라이브 1:1 상담 4회/월',
      '우선 예약 서비스',
      '특별 이벤트 초대',
      '전용 훈련사 배정',
    ],
    discountPercent: 30,
  },
];

// 현재 구독 정보 샘플
const CURRENT_SUBSCRIPTION: UserSubscription = {
  id: 'sub_123456',
  planId: 'premium',
  status: 'active',
  startDate: '2023-06-15T00:00:00Z',
  endDate: '2024-06-15T00:00:00Z',
  renewalDate: '2023-07-15T00:00:00Z',
  cancelAtPeriodEnd: false,
  paymentMethod: {
    id: 'pm_123456',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
  },
};

// 결제 내역 샘플
const TRANSACTION_HISTORY: Transaction[] = [
  {
    id: 'txn_123456',
    date: '2023-06-15T00:00:00Z',
    amount: 12900,
    description: '프리미엄 멤버십 - 6월',
    status: 'completed',
    invoiceUrl: '#',
  },
  {
    id: 'txn_123455',
    date: '2023-05-15T00:00:00Z',
    amount: 12900,
    description: '프리미엄 멤버십 - 5월',
    status: 'completed',
    invoiceUrl: '#',
  },
  {
    id: 'txn_123454',
    date: '2023-04-15T00:00:00Z',
    amount: 12900,
    description: '프리미엄 멤버십 - 4월',
    status: 'completed',
    invoiceUrl: '#',
  },
];

export default function SubscriptionManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    // 실제 구현에서는 API에서 데이터를 가져와야 함
    const fetchData = async () => {
      try {
        // API 호출을 시뮬레이션하기 위한 지연
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSubscription(CURRENT_SUBSCRIPTION);
        setPlans(SUBSCRIPTION_PLANS);
        setTransactions(TRANSACTION_HISTORY);
        setIsLoading(false);
      } catch (error) {
        console.error('구독 정보를 불러오는 중 오류 발생:', error);
        toast({
          title: '구독 정보 로드 실패',
          description: '구독 정보를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentPlan = () => {
    if (!subscription) return null;
    return plans.find(plan => plan.id === subscription.planId);
  };

  const handleCancelSubscription = () => {
    toast({
      title: '구독 취소',
      description: '구독 취소 기능은 현재 개발 중입니다. 고객센터에 문의해주세요.',
    });
  };

  const handleUpgradeSubscription = (planId: string) => {
    toast({
      title: '구독 변경',
      description: `${planId} 플랜으로 변경 중입니다. 이 기능은 현재 개발 중입니다.`,
    });
  };

  const handleUpdatePaymentMethod = () => {
    toast({
      title: '결제 수단 업데이트',
      description: '결제 수단 업데이트 기능은 현재 개발 중입니다.',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <DogLoading size="lg" message="구독 정보를 불러오는 중..." />
      </div>
    );
  }

  const currentPlan = getCurrentPlan();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">구독 관리</h1>
      <p className="text-muted-foreground mb-6">멤버십 구독 정보 확인 및 관리</p>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">구독 개요</TabsTrigger>
          <TabsTrigger value="plans">멤버십 플랜</TabsTrigger>
          <TabsTrigger value="billing">결제 내역</TabsTrigger>
          <TabsTrigger value="settings">구독 설정</TabsTrigger>
        </TabsList>

        {/* 구독 개요 탭 */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                현재 멤버십
                {subscription?.status === 'active' && (
                  <Badge variant="default" className="ml-2 bg-green-500">활성</Badge>
                )}
              </CardTitle>
              <CardDescription>구독 상태 및 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription?.status === 'active' ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{currentPlan?.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentPlan?.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatCurrency(currentPlan?.price || 0)}</div>
                      <div className="text-sm text-muted-foreground">매월</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 p-4 bg-muted rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">구독 시작일</span>
                      </div>
                      <p className="text-sm">{formatDate(subscription.startDate)}</p>
                    </div>
                    <div className="flex-1 p-4 bg-muted rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">다음 결제일</span>
                      </div>
                      <p className="text-sm">{formatDate(subscription.renewalDate)}</p>
                    </div>
                    <div className="flex-1 p-4 bg-muted rounded-lg">
                      <div className="flex items-center mb-2">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">결제 수단</span>
                      </div>
                      <p className="text-sm">{subscription.paymentMethod.brand.toUpperCase()} •••• {subscription.paymentMethod.last4}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">포함된 혜택</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentPlan?.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">활성화된 구독이 없습니다</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">멤버십에 가입하여 다양한 혜택을 누려보세요</p>
                  <Button>멤버십 가입하기</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="sm:flex-1">플랜 변경</Button>
              <Button variant="outline" className="sm:flex-1" onClick={handleUpdatePaymentMethod}>결제 수단 변경</Button>
              {subscription?.status === 'active' && (
                <Button variant="ghost" className="sm:flex-1" onClick={handleCancelSubscription}>구독 취소</Button>
              )}
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">마지막 결제</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions[0] ? (
                  <>
                    <div className="text-2xl font-bold">{formatCurrency(transactions[0].amount)}</div>
                    <p className="text-sm text-muted-foreground">{formatDate(transactions[0].date)}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">결제 내역이 없습니다</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('billing')}>
                  모든 결제 내역 보기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">이용 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">영상 강의</span>
                  <span className="text-sm font-medium">12/무제한</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">1:1 상담</span>
                  <span className="text-sm font-medium">1/2회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">AI 분석</span>
                  <span className="text-sm font-medium">5/10회</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  자세히 보기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">멤버십 혜택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Gift className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">회원 전용 이벤트</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">프리미엄 콘텐츠</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">10% 쇼핑몰 할인</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  모든 혜택 보기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* 멤버십 플랜 탭 */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-1 px-3 rounded-full">
                    인기 플랜
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground ml-1">/ 월</span>
                  </div>
                  
                  {plan.discountPercent && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {plan.discountPercent}% 할인 적용
                    </Badge>
                  )}
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  {plan.isCurrent ? (
                    <Button disabled className="w-full">현재 구독 중</Button>
                  ) : (
                    <Button 
                      variant={plan.isPopular ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => handleUpgradeSubscription(plan.id)}
                    >
                      {plan.price > (currentPlan?.price || 0) ? '업그레이드' : '변경하기'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>연간 결제 시 10% 할인</AlertTitle>
            <AlertDescription>
              연간 구독으로 전환하면 모든 플랜에서 10% 할인 혜택을 받을 수 있습니다.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* 결제 내역 탭 */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
              <CardDescription>구독 결제 내역 및 청구서</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>결제일</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'completed' ? 'outline' : 'destructive'} className={
                          transaction.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''
                        }>
                          {transaction.status === 'completed' ? '완료' : transaction.status === 'pending' ? '처리 중' : '실패'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                        {transaction.invoiceUrl && (
                          <Button variant="ghost" size="sm">
                            영수증
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>결제 수단</CardTitle>
              <CardDescription>저장된 결제 수단 관리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription?.paymentMethod ? (
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-6 mr-4 flex items-center justify-center bg-slate-800 rounded">
                      {subscription.paymentMethod.brand === 'visa' && <span className="text-white text-xs font-bold">VISA</span>}
                      {subscription.paymentMethod.brand === 'mastercard' && <span className="text-white text-xs font-bold">MC</span>}
                      {subscription.paymentMethod.brand === 'amex' && <span className="text-white text-xs font-bold">AMEX</span>}
                    </div>
                    <div>
                      <div className="font-medium">
                        {subscription.paymentMethod.brand.toUpperCase()} •••• {subscription.paymentMethod.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        만료: {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-auto mr-4">기본</Badge>
                  <Button variant="ghost" size="sm" onClick={handleUpdatePaymentMethod}>
                    변경
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">저장된 결제 수단이 없습니다</p>
                  <Button>결제 수단 추가</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 구독 설정 탭 */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>구독 설정</CardTitle>
              <CardDescription>구독 관련 설정 및 옵션 관리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="font-medium">자동 갱신</h3>
                    <p className="text-sm text-muted-foreground">구독 자동 갱신 여부를 설정합니다</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto-renew"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={!subscription?.cancelAtPeriodEnd}
                      onChange={() => {
                        toast({
                          title: '자동 갱신 설정 변경',
                          description: '이 기능은 현재 개발 중입니다.',
                        });
                      }}
                    />
                    <label htmlFor="auto-renew" className="ml-2 text-sm font-medium">
                      {subscription?.cancelAtPeriodEnd ? '비활성화됨' : '활성화됨'}
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="font-medium">이메일 알림</h3>
                    <p className="text-sm text-muted-foreground">결제 및 구독 관련 이메일 알림을 설정합니다</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={true}
                      onChange={() => {
                        toast({
                          title: '이메일 알림 설정 변경',
                          description: '이 기능은 현재 개발 중입니다.',
                        });
                      }}
                    />
                    <label htmlFor="email-notifications" className="ml-2 text-sm font-medium">
                      활성화됨
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-medium mb-2">구독 취소</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    구독을 취소하면 현재 결제 기간이 끝날 때까지 서비스를 이용할 수 있으며, 그 이후에는 자동 갱신되지 않습니다.
                  </p>
                  <Button variant="destructive" onClick={handleCancelSubscription}>
                    구독 취소
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>계정 정보</CardTitle>
              <CardDescription>구독과 연결된 계정 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">사용자 이름</span>
                <span className="text-sm font-medium">{auth.userName || '사용자'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">이메일</span>
                <span className="text-sm font-medium">user@example.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">멤버십 등급</span>
                <span className="text-sm font-medium">{currentPlan?.name || '없음'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">가입일</span>
                <span className="text-sm font-medium">{subscription ? formatDate(subscription.startDate) : '-'}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">계정 정보 수정</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}