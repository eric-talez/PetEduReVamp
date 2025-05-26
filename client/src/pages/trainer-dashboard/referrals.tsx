import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  Check,
  RefreshCw, 
  Gift, 
  Share2, 
  Clipboard, 
  DollarSign, 
  Award,
  FileText,
  ArrowUpRight,
  BarChart
} from "lucide-react";
import { useAuth } from "../../SimpleApp";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// 추천 타입 정의
interface Referral {
  id: string;
  code: string;
  createdAt: string;
  usedCount: number;
  totalCommission: number;
  status: 'active' | 'expired' | 'disabled';
  description?: string;
  products: ReferredProduct[];
}

// 추천된 제품 타입 정의
interface ReferredProduct {
  id: number;
  name: string;
  purchasedAt: string;
  price: number;
  commission: number;
  commissionRate: number;
  customerName: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function TrainerReferralsPage() {
  const auth = useAuth();
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralDescription, setReferralDescription] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("active");
  const [currentFilter, setCurrentFilter] = useState<string>("all-time");

  // 모의 데이터 초기화 (실제로는 API에서 데이터를 가져오도록 구현)
  useEffect(() => {
    // 로컬 스토리지에서 가져오기
    const storedReferrals = localStorage.getItem('trainerReferrals');
    
    if (storedReferrals) {
      setReferrals(JSON.parse(storedReferrals));
    } else {
      // 초기 데이터 (실제 구현에서는 필요 없음)
      const initialReferrals: Referral[] = [
        {
          id: "ref-1",
          code: "TR" + auth.userName?.toUpperCase().substring(0, 3) + "2023",
          createdAt: "2023-12-15T10:30:00",
          usedCount: 12,
          totalCommission: 156000,
          status: 'active',
          description: "기본 추천 코드",
          products: [
            {
              id: 1,
              name: "프리미엄 반려견 훈련용 클리커",
              purchasedAt: "2023-12-20T14:25:00",
              price: 15000,
              commission: 1500,
              commissionRate: 10,
              customerName: "김철수",
              status: 'completed'
            },
            {
              id: 2,
              name: "반려견 지능 개발 장난감 세트",
              purchasedAt: "2023-12-22T09:15:00",
              price: 35000,
              commission: 5250,
              commissionRate: 15,
              customerName: "이영희",
              status: 'completed'
            },
            {
              id: 3,
              name: "프리미엄 가죽 리드줄",
              purchasedAt: "2023-12-25T11:45:00",
              price: 45000,
              commission: 5400,
              commissionRate: 12,
              customerName: "박지영",
              status: 'completed'
            }
          ]
        },
        {
          id: "ref-2",
          code: "SPECIAL" + Math.floor(1000 + Math.random() * 9000),
          createdAt: "2024-01-05T15:20:00",
          usedCount: 5,
          totalCommission: 85000,
          status: 'active',
          description: "1월 이벤트용 코드",
          products: [
            {
              id: 4,
              name: "유기농 강아지 간식 모음",
              purchasedAt: "2024-01-10T16:55:00",
              price: 28000,
              commission: 5600,
              commissionRate: 20,
              customerName: "최동훈",
              status: 'completed'
            },
            {
              id: 5,
              name: "반려견 행동 교정 훈련 매뉴얼",
              purchasedAt: "2024-01-12T10:30:00",
              price: 22000,
              commission: 5500,
              commissionRate: 25,
              customerName: "정미란",
              status: 'completed'
            }
          ]
        },
        {
          id: "ref-3",
          code: "WINTER" + Math.floor(1000 + Math.random() * 9000),
          createdAt: "2024-02-01T09:00:00",
          usedCount: 0,
          totalCommission: 0,
          status: 'expired',
          description: "겨울 시즌 한정 코드",
          products: []
        }
      ];
      
      setReferrals(initialReferrals);
      localStorage.setItem('trainerReferrals', JSON.stringify(initialReferrals));
    }
  }, [auth.userName]);

  // 새로운 추천 코드 생성
  const generateReferralCode = () => {
    setIsGenerating(true);
    
    // API 호출을 시뮬레이션
    setTimeout(() => {
      const prefix = "TR" + (auth.userName?.toUpperCase().substring(0, 3) || "USR");
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newCode = prefix + randomSuffix;
      
      setReferralCode(newCode);
      setIsGenerating(false);
    }, 1000);
  };

  // 새 추천 코드 저장하기
  const saveReferralCode = () => {
    if (!referralCode) return;
    
    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      code: referralCode,
      createdAt: new Date().toISOString(),
      usedCount: 0,
      totalCommission: 0,
      status: 'active',
      description: referralDescription,
      products: []
    };
    
    const updatedReferrals = [...referrals, newReferral];
    setReferrals(updatedReferrals);
    
    // 로컬 스토리지에 저장 (실제로는 API 호출)
    localStorage.setItem('trainerReferrals', JSON.stringify(updatedReferrals));
    
    // 입력 필드 초기화
    setReferralCode("");
    setReferralDescription("");
  };

  // 추천 코드 복사
  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // 특정 추천 코드에 대한 공유 링크 생성
  const generateShareLink = (code: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/shop?ref=${code}`;
  };

  // 추천 코드 상태 변경 (활성화/비활성화)
  const toggleReferralStatus = (id: string) => {
    const updatedReferrals = referrals.map(referral => {
      if (referral.id === id) {
        const newStatus = referral.status === 'active' ? 'disabled' : 'active';
        return { ...referral, status: newStatus };
      }
      return referral;
    });
    
    setReferrals(updatedReferrals);
    localStorage.setItem('trainerReferrals', JSON.stringify(updatedReferrals));
  };

  // 필터링된 추천 코드 목록
  const filteredReferrals = referrals.filter(referral => {
    if (activeTab === 'all') return true;
    return referral.status === activeTab;
  });

  // 총 커미션 계산
  const totalCommission = referrals.reduce((sum, referral) => {
    return sum + referral.totalCommission;
  }, 0);

  // 총 구매 횟수 계산
  const totalPurchases = referrals.reduce((sum, referral) => {
    return sum + referral.usedCount;
  }, 0);

  // 기간별 필터링된 데이터 (실제로는 API 호출로 처리)
  const getFilteredCommission = () => {
    // 실제 구현에서는 서버에서 날짜 범위에 맞는 데이터를 가져옴
    // 여기서는 간단히 구현
    switch (currentFilter) {
      case 'this-month':
        return totalCommission * 0.4; // 40%만 이번 달 커미션으로 가정
      case 'last-month':
        return totalCommission * 0.3; // 30%만 지난 달 커미션으로 가정
      case 'this-year':
        return totalCommission * 0.8; // 80%가 올해 커미션으로 가정
      default:
        return totalCommission; // 전체 기간
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">추천인 코드 관리</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            고객에게 제공할 추천인 코드를 생성하고 커미션 현황을 확인하세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-primary/10 p-3 mr-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 커미션</p>
              <h3 className="text-2xl font-bold">{getFilteredCommission().toLocaleString()}원</h3>
            </div>
          </div>
          <div className="mt-4">
            <select 
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all-time">전체 기간</option>
              <option value="this-month">이번 달</option>
              <option value="last-month">지난 달</option>
              <option value="this-year">올해</option>
            </select>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-50 dark:bg-green-900/20 p-3 mr-4">
              <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">활성 코드</p>
              <h3 className="text-2xl font-bold">{referrals.filter(r => r.status === 'active').length}개</h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${(referrals.filter(r => r.status === 'active').length / Math.max(1, referrals.length)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              전체 {referrals.length}개 중
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3 mr-4">
              <BarChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 구매 횟수</p>
              <h3 className="text-2xl font-bold">{totalPurchases}회</h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>최근 30일</span>
              <span>{Math.floor(totalPurchases * 0.6)}회</span>
            </div>
            <Progress value={60} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">새 추천 코드 생성</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="referral-code" className="mb-1 block">추천 코드</Label>
                <div className="flex items-center">
                  <Input
                    id="referral-code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="추천 코드를 입력하거나 생성하세요"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    className="ml-2 shrink-0"
                    onClick={generateReferralCode}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="referral-description" className="mb-1 block">설명 (선택사항)</Label>
                <Input
                  id="referral-description"
                  value={referralDescription}
                  onChange={(e) => setReferralDescription(e.target.value)}
                  placeholder="이 코드의 용도를 설명하세요"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={saveReferralCode}
                disabled={!referralCode}
              >
                <Gift className="mr-2 h-4 w-4" />
                추천 코드 저장
              </Button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">추천 방법 안내</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span>고객에게 추천 코드를 공유하세요</span>
                </li>
                <li className="flex items-start">
                  <span className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span>고객이 쇼핑 시 코드를 입력하면 커미션이 적립됩니다</span>
                </li>
                <li className="flex items-start">
                  <span className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span>정산은 매월 15일에 자동으로 이루어집니다</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6">
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">내 추천 코드</h2>
                <TabsList>
                  <TabsTrigger value="active">활성</TabsTrigger>
                  <TabsTrigger value="disabled">비활성</TabsTrigger>
                  <TabsTrigger value="expired">만료</TabsTrigger>
                  <TabsTrigger value="all">전체</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="m-0">
                {filteredReferrals.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReferrals.map((referral) => (
                      <div 
                        key={referral.id} 
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-lg mr-2">{referral.code}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => copyReferralCode(referral.code)}
                              >
                                {copied ? 
                                  <span className="flex items-center text-green-600 dark:text-green-400"><Check className="h-3.5 w-3.5 mr-1" /> 복사됨</span> : 
                                  <span className="flex items-center text-gray-500"><Copy className="h-3.5 w-3.5 mr-1" /> 복사</span>
                                }
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(referral.createdAt).toLocaleDateString('ko-KR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })} 생성
                              {referral.description && ` · ${referral.description}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                referral.status === 'active' ? 'success' : 
                                referral.status === 'expired' ? 'warning' : 'destructive'
                              }
                            >
                              {referral.status === 'active' ? '활성' : 
                                referral.status === 'expired' ? '만료' : '비활성'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex space-x-4">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">사용 횟수:</span>
                              <span className="ml-1 font-medium">{referral.usedCount}회</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">총 커미션:</span>
                              <span className="ml-1 font-medium">{referral.totalCommission.toLocaleString()}원</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyReferralCode(generateShareLink(referral.code))}
                            >
                              <Share2 className="h-3.5 w-3.5 mr-1.5" />
                              공유 링크
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleReferralStatus(referral.id)}
                              disabled={referral.status === 'expired'}
                            >
                              {referral.status === 'active' ? '비활성화' : '활성화'}
                            </Button>
                          </div>
                        </div>
                        
                        {referral.products.length > 0 && (
                          <div className="mt-4">
                            <Separator className="my-3" />
                            <p className="text-sm font-medium mb-2">최근 구매 내역 ({referral.products.length})</p>
                            <div className="space-y-2">
                              {referral.products.slice(0, 2).map(product => (
                                <div key={`${referral.id}-${product.id}`} className="flex justify-between items-center text-sm">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-2">
                                      <ShoppingBag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{product.name}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {product.customerName} · 
                                        {new Date(product.purchasedAt).toLocaleDateString('ko-KR', { 
                                          month: 'short', 
                                          day: 'numeric' 
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{product.commission.toLocaleString()}원</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {product.commissionRate}% 적립
                                    </p>
                                  </div>
                                </div>
                              ))}
                              
                              {referral.products.length > 2 && (
                                <Button variant="link" size="sm" className="px-0 h-auto text-sm">
                                  더 보기 <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 inline-flex mb-4">
                      <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">추천 코드가 없습니다</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                      새로운 추천 코드를 생성하여 고객에게 공유하고 커미션을 받아보세요.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}