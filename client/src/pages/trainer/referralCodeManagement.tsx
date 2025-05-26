import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy,
  Users,
  DollarSign,
  Gift,
  QrCode,
  Plus,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ReferralCode {
  id: number;
  code: string;
  name: string;
  description?: string;
  discount: number;
  discountType: 'percentage' | 'amount';
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  totalRevenue: number;
  createdAt: string;
}

interface ReferralUsage {
  id: number;
  codeId: number;
  studentName: string;
  courseName: string;
  discountAmount: number;
  orderAmount: number;
  usedAt: string;
}

export default function ReferralCodeManagement() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [usages, setUsages] = useState<ReferralUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // 새 코드 생성 상태
  const [newCode, setNewCode] = useState({
    name: '',
    description: '',
    discount: 10,
    discountType: 'percentage' as 'percentage' | 'amount',
    usageLimit: 100,
    validUntil: ''
  });

  // 추천 코드 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCodes: ReferralCode[] = [
          {
            id: 1,
            code: 'TRAINER2024',
            name: '2024 신규 수강생 할인',
            description: '새로운 수강생을 위한 특별 할인 코드',
            discount: 15,
            discountType: 'percentage',
            usageLimit: 50,
            usageCount: 23,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isActive: true,
            totalRevenue: 3450000,
            createdAt: '2024-01-01'
          },
          {
            id: 2,
            code: 'PUPPY20',
            name: '퍼피 클래스 특가',
            description: '퍼피 사회화 클래스 전용 할인',
            discount: 20000,
            discountType: 'amount',
            usageLimit: 30,
            usageCount: 18,
            validFrom: '2024-03-01',
            validUntil: '2024-06-30',
            isActive: true,
            totalRevenue: 2160000,
            createdAt: '2024-03-01'
          },
          {
            id: 3,
            code: 'SUMMER10',
            name: '여름 시즌 할인',
            description: '여름 특별 프로모션',
            discount: 10,
            discountType: 'percentage',
            usageLimit: 100,
            usageCount: 67,
            validFrom: '2024-06-01',
            validUntil: '2024-08-31',
            isActive: false,
            totalRevenue: 8040000,
            createdAt: '2024-06-01'
          }
        ];

        const mockUsages: ReferralUsage[] = [
          {
            id: 1,
            codeId: 1,
            studentName: '김철수',
            courseName: '반려견 기본 훈련 마스터하기',
            discountAmount: 22500,
            orderAmount: 150000,
            usedAt: '2024-05-15'
          },
          {
            id: 2,
            codeId: 2,
            studentName: '이영희',
            courseName: '퍼피 사회화 클래스',
            discountAmount: 20000,
            orderAmount: 120000,
            usedAt: '2024-05-14'
          },
          {
            id: 3,
            codeId: 1,
            studentName: '정민수',
            courseName: '고급 트릭 훈련',
            discountAmount: 27000,
            orderAmount: 180000,
            usedAt: '2024-05-13'
          }
        ];
        
        setCodes(mockCodes);
        setUsages(mockUsages);
      } catch (error) {
        console.error('추천 코드 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '추천 코드 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // 페이지네이션 처리
  const totalPages = Math.ceil(codes.length / itemsPerPage);
  const paginatedCodes = codes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 코드 복사
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: '코드 복사됨',
      description: `추천 코드 "${code}"가 클립보드에 복사되었습니다.`,
    });
  };

  // 새 코드 생성
  const handleCreateCode = async () => {
    try {
      const code: ReferralCode = {
        id: Date.now(),
        code: `CODE${Date.now().toString().slice(-6)}`,
        name: newCode.name,
        description: newCode.description,
        discount: newCode.discount,
        discountType: newCode.discountType,
        usageLimit: newCode.usageLimit,
        usageCount: 0,
        validFrom: format(new Date(), 'yyyy-MM-dd'),
        validUntil: newCode.validUntil,
        isActive: true,
        totalRevenue: 0,
        createdAt: format(new Date(), 'yyyy-MM-dd')
      };

      setCodes(prev => [code, ...prev]);
      setIsCreatingCode(false);
      setNewCode({
        name: '',
        description: '',
        discount: 10,
        discountType: 'percentage',
        usageLimit: 100,
        validUntil: ''
      });

      toast({
        title: '추천 코드 생성',
        description: '새로운 추천 코드가 생성되었습니다.',
      });
    } catch (error) {
      toast({
        title: '코드 생성 실패',
        description: '추천 코드 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 코드 활성화/비활성화
  const handleToggleCode = (id: number) => {
    setCodes(prev => prev.map(code => 
      code.id === id ? {...code, isActive: !code.isActive} : code
    ));
    toast({
      title: '상태 변경됨',
      description: '추천 코드 상태가 변경되었습니다.',
    });
  };

  // 할인 표시
  const getDiscountText = (code: ReferralCode) => {
    return code.discountType === 'percentage' 
      ? `${code.discount}% 할인`
      : `${code.discount.toLocaleString()}원 할인`;
  };

  // 총 통계
  const totalActiveCodes = codes.filter(code => code.isActive).length;
  const totalUsageCount = codes.reduce((sum, code) => sum + code.usageCount, 0);
  const totalRevenue = codes.reduce((sum, code) => sum + code.totalRevenue, 0);

  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '추천 코드 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Share2 className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">추천 코드 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">추천 코드 관리</h1>
          <p className="text-muted-foreground">수강생을 위한 할인 코드를 생성하고 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          <Button onClick={() => setIsCreatingCode(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 코드 생성
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Share2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">활성 코드</p>
                <p className="text-2xl font-bold">{totalActiveCodes}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 사용 횟수</p>
                <p className="text-2xl font-bold">{totalUsageCount}회</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 수익</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">평균 할인율</p>
                <p className="text-2xl font-bold">
                  {codes.length > 0 
                    ? Math.round(codes.reduce((sum, code) => 
                        sum + (code.discountType === 'percentage' ? code.discount : 0), 0) / codes.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추천 코드 목록 */}
      {paginatedCodes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedCodes.map((code) => (
            <Card key={code.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      {code.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{code.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {code.isActive ? (
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                        활성
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        비활성
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 코드 */}
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">추천 코드</p>
                      <p className="text-xl font-bold font-mono">{code.code}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(code.code)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      복사
                    </Button>
                  </div>
                </div>

                {/* 할인 정보 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">할인 혜택</p>
                    <p className="font-medium text-lg text-green-600">
                      {getDiscountText(code)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">사용 현황</p>
                    <p className="font-medium">
                      {code.usageCount}
                      {code.usageLimit && ` / ${code.usageLimit}`}회
                    </p>
                  </div>
                </div>

                {/* 기간 정보 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">유효 기간</p>
                    <p className="font-medium">
                      {format(new Date(code.validFrom), 'yyyy.MM.dd')}
                      {code.validUntil && ` ~ ${format(new Date(code.validUntil), 'yyyy.MM.dd')}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">누적 수익</p>
                    <p className="font-medium text-blue-600">
                      {code.totalRevenue.toLocaleString()}원
                    </p>
                  </div>
                </div>

                {/* 진행률 바 */}
                {code.usageLimit && (
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>사용률</span>
                      <span>{Math.round((code.usageCount / code.usageLimit) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min((code.usageCount / code.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant={code.isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleCode(code.id)}
                  >
                    {code.isActive ? '비활성화' : '활성화'}
                  </Button>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Share2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">추천 코드가 없습니다</h3>
          <p className="text-muted-foreground mb-4">첫 번째 추천 코드를 생성해보세요.</p>
          <Button onClick={() => setIsCreatingCode(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 코드 생성
          </Button>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {/* 새 코드 생성 모달 */}
      {isCreatingCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>새 추천 코드 생성</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">코드 이름</label>
                <Input
                  value={newCode.name}
                  onChange={(e) => setNewCode(prev => ({...prev, name: e.target.value}))}
                  placeholder="예: 신규 회원 특별 할인"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">설명</label>
                <Input
                  value={newCode.description}
                  onChange={(e) => setNewCode(prev => ({...prev, description: e.target.value}))}
                  placeholder="코드에 대한 설명"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">할인 유형</label>
                  <select
                    value={newCode.discountType}
                    onChange={(e) => setNewCode(prev => ({...prev, discountType: e.target.value as 'percentage' | 'amount'}))}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="percentage">퍼센트 할인</option>
                    <option value="amount">금액 할인</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">할인 값</label>
                  <Input
                    type="number"
                    value={newCode.discount}
                    onChange={(e) => setNewCode(prev => ({...prev, discount: parseInt(e.target.value) || 0}))}
                    placeholder={newCode.discountType === 'percentage' ? '10' : '10000'}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">사용 제한</label>
                  <Input
                    type="number"
                    value={newCode.usageLimit}
                    onChange={(e) => setNewCode(prev => ({...prev, usageLimit: parseInt(e.target.value) || 0}))}
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">유효 기한</label>
                  <Input
                    type="date"
                    value={newCode.validUntil}
                    onChange={(e) => setNewCode(prev => ({...prev, validUntil: e.target.value}))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreatingCode(false)}>
                  취소
                </Button>
                <Button 
                  onClick={handleCreateCode}
                  disabled={!newCode.name || !newCode.discount}
                >
                  생성
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}