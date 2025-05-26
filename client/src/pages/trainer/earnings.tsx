import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/GlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface EarningRecord {
  id: number;
  date: string;
  courseName: string;
  studentName: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'completed' | 'pending' | 'processing';
  paymentMethod: 'card' | 'transfer' | 'cash';
}

interface MonthlySummary {
  month: string;
  totalRevenue: number;
  totalCommission: number;
  netEarnings: number;
  transactionCount: number;
}

export default function TrainerEarnings() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 수익 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockEarnings: EarningRecord[] = [
          {
            id: 1,
            date: '2024-05-15',
            courseName: '반려견 기본 훈련 마스터하기',
            studentName: '김철수',
            amount: 150000,
            commission: 22500,
            netAmount: 127500,
            status: 'completed',
            paymentMethod: 'card'
          },
          {
            id: 2,
            date: '2024-05-14',
            courseName: '문제행동 교정 특별과정',
            studentName: '이영희',
            amount: 200000,
            commission: 30000,
            netAmount: 170000,
            status: 'completed',
            paymentMethod: 'transfer'
          },
          {
            id: 3,
            date: '2024-05-13',
            courseName: '고급 트릭 훈련',
            studentName: '정민수',
            amount: 180000,
            commission: 27000,
            netAmount: 153000,
            status: 'processing',
            paymentMethod: 'card'
          },
          {
            id: 4,
            date: '2024-05-12',
            courseName: '퍼피 사회화 클래스',
            studentName: '한소희',
            amount: 120000,
            commission: 18000,
            netAmount: 102000,
            status: 'completed',
            paymentMethod: 'card'
          },
          {
            id: 5,
            date: '2024-05-10',
            courseName: '반려견 산책 에티켓',
            studentName: '장수현',
            amount: 100000,
            commission: 15000,
            netAmount: 85000,
            status: 'pending',
            paymentMethod: 'transfer'
          },
          {
            id: 6,
            date: '2024-04-28',
            courseName: '반려견 기본 훈련 마스터하기',
            studentName: '박지은',
            amount: 150000,
            commission: 22500,
            netAmount: 127500,
            status: 'completed',
            paymentMethod: 'card'
          },
          {
            id: 7,
            date: '2024-04-25',
            courseName: '어질리티 입문과정',
            studentName: '최민호',
            amount: 220000,
            commission: 33000,
            netAmount: 187000,
            status: 'completed',
            paymentMethod: 'transfer'
          }
        ];
        
        const mockMonthlySummary: MonthlySummary[] = [
          {
            month: '2024-05',
            totalRevenue: 750000,
            totalCommission: 112500,
            netEarnings: 637500,
            transactionCount: 5
          },
          {
            month: '2024-04',
            totalRevenue: 1240000,
            totalCommission: 186000,
            netEarnings: 1054000,
            transactionCount: 8
          },
          {
            month: '2024-03',
            totalRevenue: 980000,
            totalCommission: 147000,
            netEarnings: 833000,
            transactionCount: 6
          }
        ];
        
        setEarnings(mockEarnings);
        setMonthlySummary(mockMonthlySummary);
      } catch (error) {
        console.error('수익 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '수익 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // 필터링된 수익 데이터
  const filteredEarnings = selectedMonth === 'all' 
    ? earnings 
    : earnings.filter(earning => earning.date.substring(0, 7) === selectedMonth);

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage);
  const paginatedEarnings = filteredEarnings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 상태에 따른 배지 스타일
  const getStatusBadge = (status: EarningRecord['status']) => {
    switch(status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">완료</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">처리중</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">대기</Badge>;
      default:
        return <Badge variant="outline">미정</Badge>;
    }
  };

  // 결제 방법 표시
  const getPaymentMethodText = (method: EarningRecord['paymentMethod']) => {
    switch(method) {
      case 'card': return '카드결제';
      case 'transfer': return '계좌이체';
      case 'cash': return '현금결제';
      default: return '기타';
    }
  };

  // 총 수익 계산
  const totalRevenue = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);
  const totalCommission = filteredEarnings.reduce((sum, earning) => sum + earning.commission, 0);
  const totalNetEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.netAmount, 0);

  // 이번 달 수익
  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthSummary = monthlySummary.find(summary => summary.month === currentMonth);
  const lastMonthSummary = monthlySummary.find(summary => {
    const lastMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM');
    return summary.month === lastMonth;
  });

  const monthlyGrowth = lastMonthSummary && currentMonthSummary
    ? ((currentMonthSummary.netEarnings - lastMonthSummary.netEarnings) / lastMonthSummary.netEarnings * 100).toFixed(1)
    : '0';

  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '수익 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <DollarSign className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">수익 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">수익 관리</h1>
          <p className="text-muted-foreground">강의 수익과 정산 내역을 확인하고 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">이번 달 순수익</p>
                <p className="text-2xl font-bold">
                  {(currentMonthSummary?.netEarnings || 0).toLocaleString()}원
                </p>
                <div className="flex items-center text-xs mt-1">
                  {parseFloat(monthlyGrowth) > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">+{monthlyGrowth}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">{monthlyGrowth}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground ml-1">지난 달 대비</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 매출</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">플랫폼 수수료</p>
                <p className="text-2xl font-bold">{totalCommission.toLocaleString()}원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">거래 건수</p>
                <p className="text-2xl font-bold">{filteredEarnings.length}건</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 월별 수익 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 수익 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlySummary.map((summary) => (
              <div key={summary.month} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">
                    {format(new Date(summary.month + '-01'), 'yyyy년 MM월')}
                  </div>
                  <Badge variant="secondary">{summary.transactionCount}건</Badge>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {summary.netEarnings.toLocaleString()}원
                  </div>
                  <div className="text-sm text-muted-foreground">
                    매출 {summary.totalRevenue.toLocaleString()}원 - 수수료 {summary.totalCommission.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 필터 */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">기간 필터:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">전체 기간</option>
          {monthlySummary.map((summary) => (
            <option key={summary.month} value={summary.month}>
              {format(new Date(summary.month + '-01'), 'yyyy년 MM월')}
            </option>
          ))}
        </select>
      </div>

      {/* 수익 내역 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>수익 내역</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedEarnings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">날짜</th>
                    <th className="text-left py-3 px-2">강의명</th>
                    <th className="text-left py-3 px-2">수강생</th>
                    <th className="text-right py-3 px-2">매출액</th>
                    <th className="text-right py-3 px-2">수수료</th>
                    <th className="text-right py-3 px-2">순수익</th>
                    <th className="text-center py-3 px-2">결제방법</th>
                    <th className="text-center py-3 px-2">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEarnings.map((earning) => (
                    <tr key={earning.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        {format(new Date(earning.date), 'yyyy.MM.dd')}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{earning.courseName}</div>
                      </td>
                      <td className="py-3 px-2">{earning.studentName}</td>
                      <td className="py-3 px-2 text-right font-medium">
                        {earning.amount.toLocaleString()}원
                      </td>
                      <td className="py-3 px-2 text-right text-red-600">
                        -{earning.commission.toLocaleString()}원
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-green-600">
                        {earning.netAmount.toLocaleString()}원
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant="secondary">
                          {getPaymentMethodText(earning.paymentMethod)}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {getStatusBadge(earning.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">수익 내역이 없습니다</h3>
              <p className="text-muted-foreground mb-4">선택한 기간에 해당하는 수익 내역이 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}