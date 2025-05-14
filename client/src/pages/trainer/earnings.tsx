import { useState, useEffect } from 'react';
import { useAuth } from '../../SimpleApp';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
  HelpCircle,
  Share2,
  PieChart,
  BarChart,
  TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns';

interface Transaction {
  id: number;
  date: string;
  type: 'course' | 'referral' | 'payout';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  referenceId?: string;
  courseName?: string;
  courseId?: number;
  studentName?: string;
  studentId?: number;
  productName?: string;
}

interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
  courseEarnings: number;
  referralEarnings: number;
  previousMonthEarnings: number;
  monthlyGrowth: number;
}

interface EarningsReport {
  year: number;
  month: number;
  earnings: {
    total: number;
    course: number;
    referral: number;
  };
}

export default function TrainerIncome() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    pendingEarnings: 0,
    thisMonthEarnings: 0,
    courseEarnings: 0,
    referralEarnings: 0,
    previousMonthEarnings: 0,
    monthlyGrowth: 0
  });
  const [monthlyReports, setMonthlyReports] = useState<EarningsReport[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);

  // 거래 내역 및 요약 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 거래 내역 데이터
        const mockTransactions: Transaction[] = [
          {
            id: 1,
            date: '2024-05-01',
            type: 'course',
            description: '반려견 기본 훈련 과정 수강료',
            amount: 120000,
            status: 'completed',
            referenceId: 'CRS-2024-0501',
            courseName: '반려견 기본 훈련 과정',
            courseId: 1,
            studentName: '김철수',
            studentId: 101
          },
          {
            id: 2,
            date: '2024-05-03',
            type: 'course',
            description: '문제행동 교정 특별과정 수강료',
            amount: 150000,
            status: 'completed',
            referenceId: 'CRS-2024-0503',
            courseName: '문제행동 교정 특별과정',
            courseId: 2,
            studentName: '이영희',
            studentId: 102
          },
          {
            id: 3,
            date: '2024-05-05',
            type: 'referral',
            description: '프리미엄 강아지 사료 추천 수수료',
            amount: 8000,
            status: 'completed',
            referenceId: 'REF-2024-0505',
            productName: '프리미엄 강아지 사료'
          },
          {
            id: 4,
            date: '2024-05-08',
            type: 'course',
            description: '고급 트릭 훈련 수강료',
            amount: 200000,
            status: 'completed',
            referenceId: 'CRS-2024-0508',
            courseName: '고급 트릭 훈련',
            courseId: 3,
            studentName: '정민수',
            studentId: 104
          },
          {
            id: 5,
            date: '2024-05-10',
            type: 'payout',
            description: '5월 첫째주 정산',
            amount: -270000,
            status: 'completed',
            referenceId: 'PAY-2024-0510'
          },
          {
            id: 6,
            date: '2024-05-12',
            type: 'course',
            description: '퍼피 사회화 클래스 수강료',
            amount: 100000,
            status: 'pending',
            referenceId: 'CRS-2024-0512',
            courseName: '퍼피 사회화 클래스',
            courseId: 4,
            studentName: '한소희',
            studentId: 105
          },
          {
            id: 7,
            date: '2024-05-15',
            type: 'referral',
            description: '강아지 장난감 세트 추천 수수료',
            amount: 5000,
            status: 'pending',
            referenceId: 'REF-2024-0515',
            productName: '강아지 장난감 세트'
          }
        ];
        
        // 임시 수입 요약 데이터
        const mockSummary: EarningsSummary = {
          totalEarnings: 583000,
          pendingEarnings: 105000,
          thisMonthEarnings: 313000,
          courseEarnings: 570000,
          referralEarnings: 13000,
          previousMonthEarnings: 270000,
          monthlyGrowth: 15.9
        };
        
        // 임시 월간 보고서 데이터
        const mockMonthlyReports: EarningsReport[] = [
          {
            year: 2024,
            month: 1,
            earnings: {
              total: 230000,
              course: 220000,
              referral: 10000
            }
          },
          {
            year: 2024,
            month: 2,
            earnings: {
              total: 240000,
              course: 225000,
              referral: 15000
            }
          },
          {
            year: 2024,
            month: 3,
            earnings: {
              total: 270000,
              course: 250000,
              referral: 20000
            }
          },
          {
            year: 2024,
            month: 4,
            earnings: {
              total: 270000,
              course: 260000,
              referral: 10000
            }
          },
          {
            year: 2024,
            month: 5,
            earnings: {
              total: 313000,
              course: 300000,
              referral: 13000
            }
          }
        ];
        
        setTransactions(mockTransactions);
        setEarningsSummary(mockSummary);
        setMonthlyReports(mockMonthlyReports);
      } catch (error) {
        console.error('수입 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '수입 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // 필터링된 거래 내역 업데이트
  useEffect(() => {
    let result = [...transactions];
    
    // 탭 필터링
    if (activeTab === 'course') {
      result = result.filter(transaction => transaction.type === 'course');
    } else if (activeTab === 'referral') {
      result = result.filter(transaction => transaction.type === 'referral');
    } else if (activeTab === 'payout') {
      result = result.filter(transaction => transaction.type === 'payout');
    } else if (activeTab === 'pending') {
      result = result.filter(transaction => transaction.status === 'pending');
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        transaction => 
          transaction.description.toLowerCase().includes(query) ||
          transaction.referenceId?.toLowerCase().includes(query) ||
          transaction.courseName?.toLowerCase().includes(query) ||
          transaction.studentName?.toLowerCase().includes(query) ||
          transaction.productName?.toLowerCase().includes(query)
      );
    }
    
    // 거래 유형 필터링
    if (filterType) {
      result = result.filter(transaction => transaction.type === filterType);
    }
    
    // 상태 필터링
    if (filterStatus) {
      result = result.filter(transaction => transaction.status === filterStatus);
    }
    
    // 날짜 범위 필터링
    if (dateRange.start) {
      result = result.filter(transaction => 
        new Date(transaction.date) >= new Date(dateRange.start || '')
      );
    }
    
    if (dateRange.end) {
      result = result.filter(transaction => 
        new Date(transaction.date) <= new Date(dateRange.end || '')
      );
    }
    
    // 날짜 기준 내림차순 정렬
    result.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setFilteredTransactions(result);
  }, [transactions, activeTab, searchQuery, filterType, filterStatus, dateRange]);
  
  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // 거래 내역 상세 보기
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  };
  
  // 숫자 포맷팅 (통화)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '수입 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };
  
  // 필터 초기화
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType(null);
    setFilterStatus(null);
    setDateRange({ start: null, end: null });
    setActiveTab('all');
  };
  
  // CSV 다운로드
  const handleDownloadCSV = () => {
    // 실제 구현 시 API 호출 또는 프론트엔드 로직으로 대체
    toast({
      title: 'CSV 다운로드',
      description: '거래 내역이 다운로드되었습니다.',
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* 거래 내역 상세 모달 */}
      <Dialog open={showTransactionDetail} onOpenChange={setShowTransactionDetail}>
        <DialogContent className="max-w-lg">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle>거래 상세 정보</DialogTitle>
                <DialogDescription>
                  거래 ID: {selectedTransaction.referenceId}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">거래 유형</p>
                    <p className="text-base font-medium">
                      {selectedTransaction.type === 'course' ? '강좌 수입' : 
                       selectedTransaction.type === 'referral' ? '추천 수수료' : '출금'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">상태</p>
                    <Badge 
                      variant={selectedTransaction.status === 'completed' ? 'default' : 
                              selectedTransaction.status === 'pending' ? 'outline' : 'destructive'}
                    >
                      {selectedTransaction.status === 'completed' ? '완료' : 
                       selectedTransaction.status === 'pending' ? '대기 중' : '실패'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">날짜</p>
                    <p className="text-base">{selectedTransaction.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">금액</p>
                    <p className={`text-base font-medium ${selectedTransaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">설명</p>
                  <p className="text-base">{selectedTransaction.description}</p>
                </div>
                
                {selectedTransaction.type === 'course' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">강좌명</p>
                      <p className="text-base">{selectedTransaction.courseName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">수강생</p>
                      <p className="text-base">{selectedTransaction.studentName}</p>
                    </div>
                  </div>
                )}
                
                {selectedTransaction.type === 'referral' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">추천 상품</p>
                    <p className="text-base">{selectedTransaction.productName}</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button>확인</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">수익 통계</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleDownloadCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            CSV 다운로드
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        </div>
      </div>
      
      {/* 요약 카드 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted/50"></CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex justify-between">
                <span>총 수익</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>모든 수업 및 추천 수수료에서 발생한 총 수익</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(earningsSummary.totalEarnings)}</div>
              <div className="flex items-center mt-4 text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">+{earningsSummary.monthlyGrowth.toFixed(1)}%</span>
                <span className="ml-1">전월 대비</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex justify-between">
                <span>이번 달 수익</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(earningsSummary.thisMonthEarnings)}</div>
              <div className="flex items-center mt-4 text-xs text-muted-foreground">
                <div className="flex justify-between w-full">
                  <div className="flex flex-col">
                    <span>수업</span>
                    <span className="font-medium text-sm">{formatCurrency(earningsSummary.courseEarnings)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span>추천</span>
                    <span className="font-medium text-sm">{formatCurrency(earningsSummary.referralEarnings)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex justify-between">
                <span>대기 수익</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(earningsSummary.pendingEarnings)}</div>
              <div className="flex items-center mt-4 text-xs text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>다음 정산 예정일: 2024-05-25</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* 월별 수익 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 수익 추이</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 w-full animate-pulse bg-muted/50 rounded"></div>
          ) : (
            <div className="h-64 w-full">
              <div className="flex justify-between items-end h-full">
                {monthlyReports.map((report, index) => (
                  <div key={index} className="flex flex-col items-center w-16">
                    <div className="relative h-52 w-12 flex flex-col justify-end bg-muted/10 rounded">
                      <div 
                        className="absolute bottom-0 w-full bg-primary/70 rounded-sm"
                        style={{ height: `${(report.earnings.referral / report.earnings.total) * 100}%` }}
                      ></div>
                      <div 
                        className="w-full bg-primary rounded-sm"
                        style={{ height: `${(report.earnings.course / report.earnings.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs font-medium">
                      {report.month}월
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(report.earnings.total).replace('₩', '')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-sm mr-1"></div>
                  <span>수업 수익</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary/70 rounded-sm mr-1"></div>
                  <span>추천 수익</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 거래 내역 탭 */}
      <Card>
        <CardHeader>
          <CardTitle>거래 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="course">수업</TabsTrigger>
              <TabsTrigger value="referral">추천</TabsTrigger>
              <TabsTrigger value="payout">출금</TabsTrigger>
              <TabsTrigger value="pending">대기 중</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-between items-center">
              <Input 
                className="max-w-xs"
                placeholder="거래 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <Select 
                  value={filterType || ''} 
                  onValueChange={(value) => setFilterType(value || null)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="유형 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">모든 유형</SelectItem>
                    <SelectItem value="course">수업</SelectItem>
                    <SelectItem value="referral">추천</SelectItem>
                    <SelectItem value="payout">출금</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={filterStatus || ''} 
                  onValueChange={(value) => setFilterStatus(value || null)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">모든 상태</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="pending">대기 중</SelectItem>
                    <SelectItem value="failed">실패</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  초기화
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-muted/50 rounded"></div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">날짜</TableHead>
                      <TableHead>설명</TableHead>
                      <TableHead>참조 ID</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          거래 내역이 없습니다
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((transaction) => (
                        <TableRow key={transaction.id} onClick={() => handleViewTransaction(transaction)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.referenceId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {transaction.type === 'course' ? '수업' : 
                               transaction.type === 'referral' ? '추천' : '출금'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.status === 'completed' ? 'default' : 
                                      transaction.status === 'pending' ? 'outline' : 'destructive'}
                            >
                              {transaction.status === 'completed' ? '완료' : 
                               transaction.status === 'pending' ? '대기 중' : '실패'}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
              
              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      이전
                    </Button>
                    <div className="text-sm font-medium">
                      {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* 다른 탭 컨텐츠는 'all' 탭과 동일한 내용 */}
            <TabsContent value="course">
              <div className="text-center p-4 text-muted-foreground">
                '모든' 탭과 동일한 내용이지만, 수업 유형으로 필터링된 내역입니다
              </div>
            </TabsContent>
            <TabsContent value="referral">
              <div className="text-center p-4 text-muted-foreground">
                '모든' 탭과 동일한 내용이지만, 추천 유형으로 필터링된 내역입니다
              </div>
            </TabsContent>
            <TabsContent value="payout">
              <div className="text-center p-4 text-muted-foreground">
                '모든' 탭과 동일한 내용이지만, 출금 유형으로 필터링된 내역입니다
              </div>
            </TabsContent>
            <TabsContent value="pending">
              <div className="text-center p-4 text-muted-foreground">
                '모든' 탭과 동일한 내용이지만, 대기 중인 상태로 필터링된 내역입니다
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* 정보 아코디언 */}
      <Card>
        <CardHeader>
          <CardTitle>정산 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>정산 주기 및 방식</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>정산은 매월 1일과 15일에 진행됩니다. 정산일 기준 5영업일 이내에 등록된 계좌로 입금됩니다.</p>
                  <p>수업 수익은 수업 완료 후 7일 이내에 정산 대상이 되며, 추천 수수료는 상품 배송 완료 후 14일 이내에 정산 대상이 됩니다.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>수수료 정책</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>수업 수수료: 수업 가격의 20%가 플랫폼 수수료로 차감됩니다.</p>
                  <p>추천 수수료: 상품 가격의 5~10%가 추천 수수료로 지급됩니다.</p>
                  <p>소득세 및 주민세: 관련 세금은 정산 시 자동으로 원천징수됩니다.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>정산 계좌 정보</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">현재 등록된 계좌</p>
                    <p className="font-medium">신한은행 110-123-456789 (홍길동)</p>
                  </div>
                  <Button variant="outline" size="sm">
                    계좌 정보 변경
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}