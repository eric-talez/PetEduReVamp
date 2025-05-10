import { useState } from 'react';
import { useAuth } from '../../SimpleApp';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/Badge';
import { 
  BarChart2, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  BookOpen
} from 'lucide-react';

// 모달 타입 정의
type ModalType = 'accountDetails' | 'paymentHistory' | 'export' | 'settings' | null;

// 차트 데이터 모의 객체
const mockChartData = {
  revenueData: [
    { month: '1월', amount: 1500000 },
    { month: '2월', amount: 1750000 },
    { month: '3월', amount: 1800000 },
    { month: '4월', amount: 2130000 },
    { month: '5월', amount: 2450000 }
  ],
  studentData: [
    { month: '1월', count: 45 },
    { month: '2월', count: 52 },
    { month: '3월', count: 60 },
    { month: '4월', count: 70 },
    { month: '5월', amount: 78 }
  ],
  courseDistribution: [
    { type: '그룹 강의', percentage: 60 },
    { type: '1:1 강의', percentage: 35 },
    { type: '온라인 강의', percentage: 5 }
  ]
};

export default function TrainerStats() {
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;
  const user = { name: auth.userName };
  const [activeTab, setActiveTab] = useState<string>('earnings');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('month');

  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // 지난 달 대비 증감률 계산
  const calculateGrowth = () => {
    const currentMonth = mockChartData.revenueData[mockChartData.revenueData.length - 1].amount;
    const previousMonth = mockChartData.revenueData[mockChartData.revenueData.length - 2].amount;
    const growthRate = ((currentMonth - previousMonth) / previousMonth) * 100;
    return {
      rate: growthRate.toFixed(1),
      isPositive: growthRate >= 0
    };
  };

  const growth = calculateGrowth();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">수익 및 통계</h1>
          <p className="text-gray-500 mt-1">수익 현황을 확인하고 정산 관리를 할 수 있습니다.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => openModal('settings')}>
            정산 계좌 설정
          </Button>
          <Button variant="outline" onClick={() => openModal('export')}>
            <Download className="mr-2 h-4 w-4" /> 보고서 내보내기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-gray-500">이번 달 수익</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">₩2,450,000</span>
            </div>
            <div className="mt-1 flex items-center text-sm">
              <TrendingUp className={`h-4 w-4 ${growth.isPositive ? 'text-green-500' : 'text-red-500'} mr-1`} />
              <span className={growth.isPositive ? 'text-green-500' : 'text-red-500'}>
                {growth.isPositive ? '+' : ''}{growth.rate}% 지난달 대비
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-gray-500">수강생 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">78명</span>
            </div>
            <div className="mt-1 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+11% 지난달 대비</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-gray-500">운영 중인 강의</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">5개</span>
            </div>
            <div className="mt-1 flex items-center text-sm">
              <span className="text-gray-500">그룹 3개, 1:1 2개</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-gray-500">다음 정산</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">5월 25일</span>
            </div>
            <div className="mt-1 flex items-center text-sm">
              <span className="text-gray-500">₩2,205,000 예상</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="earnings">수익 분석</TabsTrigger>
          <TabsTrigger value="payments">정산 내역</TabsTrigger>
          <TabsTrigger value="courses">강의별 수익</TabsTrigger>
          <TabsTrigger value="students">수강생 통계</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>월별 수익 추이</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedDateRange === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDateRange('month')}
                    >
                      월별
                    </Button>
                    <Button
                      variant={selectedDateRange === 'quarter' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDateRange('quarter')}
                    >
                      분기별
                    </Button>
                    <Button
                      variant={selectedDateRange === 'year' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDateRange('year')}
                    >
                      연간
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <LineChart className="h-10 w-10 mx-auto mb-2" />
                    <p>여기에 수익 차트가 표시됩니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>수익원 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <PieChart className="h-10 w-10 mx-auto mb-2" />
                      <p>여기에 수익원 분포 차트가 표시됩니다.</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        그룹 강의
                      </span>
                      <span>60% (₩1,470,000)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        1:1 강의
                      </span>
                      <span>35% (₩857,500)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                        온라인 강의
                      </span>
                      <span>5% (₩122,500)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>월별 상세 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>월</TableHead>
                        <TableHead>총 수익</TableHead>
                        <TableHead>수수료</TableHead>
                        <TableHead>순 수익</TableHead>
                        <TableHead>증감률</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2025년 5월</TableCell>
                        <TableCell>₩2,450,000</TableCell>
                        <TableCell>₩245,000</TableCell>
                        <TableCell>₩2,205,000</TableCell>
                        <TableCell className="text-green-600">+15%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2025년 4월</TableCell>
                        <TableCell>₩2,130,000</TableCell>
                        <TableCell>₩213,000</TableCell>
                        <TableCell>₩1,917,000</TableCell>
                        <TableCell className="text-green-600">+18%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2025년 3월</TableCell>
                        <TableCell>₩1,800,000</TableCell>
                        <TableCell>₩180,000</TableCell>
                        <TableCell>₩1,620,000</TableCell>
                        <TableCell className="text-green-600">+3%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>정산 내역</CardTitle>
              <CardDescription>월별 정산 내역 및 예정된 정산을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>정산월</TableHead>
                    <TableHead>정산일</TableHead>
                    <TableHead>총액</TableHead>
                    <TableHead>수수료</TableHead>
                    <TableHead>순액</TableHead>
                    <TableHead>계좌</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2025년 5월</TableCell>
                    <TableCell>2025.05.25</TableCell>
                    <TableCell>₩2,450,000</TableCell>
                    <TableCell>₩245,000</TableCell>
                    <TableCell>₩2,205,000</TableCell>
                    <TableCell>신한은행 (1234)</TableCell>
                    <TableCell>
                      <Badge variant="warning">예정</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openModal('paymentHistory')}>상세</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025년 4월</TableCell>
                    <TableCell>2025.04.25</TableCell>
                    <TableCell>₩2,130,000</TableCell>
                    <TableCell>₩213,000</TableCell>
                    <TableCell>₩1,917,000</TableCell>
                    <TableCell>신한은행 (1234)</TableCell>
                    <TableCell>
                      <Badge variant="success">완료</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openModal('paymentHistory')}>상세</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025년 3월</TableCell>
                    <TableCell>2025.03.25</TableCell>
                    <TableCell>₩1,800,000</TableCell>
                    <TableCell>₩180,000</TableCell>
                    <TableCell>₩1,620,000</TableCell>
                    <TableCell>신한은행 (1234)</TableCell>
                    <TableCell>
                      <Badge variant="success">완료</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openModal('paymentHistory')}>상세</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>강의별 수익</CardTitle>
              <CardDescription>각 강의별 수익 현황을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart2 className="h-10 w-10 mx-auto mb-2" />
                    <p>여기에 강의별 수익 차트가 표시됩니다.</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>강의명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>수강생 수</TableHead>
                      <TableHead>수강료</TableHead>
                      <TableHead>월 수익</TableHead>
                      <TableHead>비율</TableHead>
                      <TableHead>이전 달 대비</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">반려견 기초 훈련 마스터하기</TableCell>
                      <TableCell>그룹</TableCell>
                      <TableCell>12명</TableCell>
                      <TableCell>₩240,000</TableCell>
                      <TableCell>₩1,200,000</TableCell>
                      <TableCell>49%</TableCell>
                      <TableCell className="text-green-600">+25%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">문제행동 교정 과정</TableCell>
                      <TableCell>1:1</TableCell>
                      <TableCell>5명</TableCell>
                      <TableCell>₩280,000</TableCell>
                      <TableCell>₩1,250,000</TableCell>
                      <TableCell>51%</TableCell>
                      <TableCell className="text-green-600">+5%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>수강생 변화 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <LineChart className="h-10 w-10 mx-auto mb-2" />
                    <p>여기에 수강생 추이 차트가 표시됩니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>신규 등록 경로</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <PieChart className="h-10 w-10 mx-auto mb-2" />
                      <p>여기에 등록 경로 차트가 표시됩니다.</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        직접 검색
                      </span>
                      <span>40% (32명)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        추천인
                      </span>
                      <span>25% (20명)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                        플랫폼 검색
                      </span>
                      <span>35% (26명)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>유지율 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart2 className="h-10 w-10 mx-auto mb-2" />
                      <p>여기에 유지율 차트가 표시됩니다.</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>강의 완료율</span>
                      <span>85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>재수강률</span>
                      <span>40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>평균 수강 개월 수</span>
                      <span>3.5개월</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 정산 계좌 설정 모달 */}
      <Dialog open={activeModal === 'settings'} onOpenChange={() => activeModal === 'settings' && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정산 계좌 설정</DialogTitle>
            <DialogDescription>
              수익금을 정산 받을 계좌 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="bank" className="text-sm font-medium">은행명</label>
              <select 
                id="bank" 
                className="w-full p-2 border rounded-md" 
                defaultValue="신한은행"
              >
                <option>국민은행</option>
                <option>신한은행</option>
                <option>하나은행</option>
                <option>우리은행</option>
                <option>농협은행</option>
                <option>기업은행</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="account" className="text-sm font-medium">계좌번호</label>
              <input 
                id="account" 
                className="w-full p-2 border rounded-md" 
                placeholder="숫자만 입력하세요" 
                defaultValue="110123456789"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="holder" className="text-sm font-medium">예금주명</label>
              <input 
                id="holder" 
                className="w-full p-2 border rounded-md" 
                placeholder="예금주명을 입력하세요" 
                defaultValue="홍길동"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>취소</Button>
            <Button onClick={closeModal}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 보고서 내보내기 모달 */}
      <Dialog open={activeModal === 'export'} onOpenChange={() => activeModal === 'export' && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>보고서 내보내기</DialogTitle>
            <DialogDescription>
              필요한 보고서 형식과 기간을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">보고서 형식</label>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" defaultChecked />
                  <span>Excel (.xlsx)</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" />
                  <span>PDF (.pdf)</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" />
                  <span>CSV (.csv)</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">보고서 기간</label>
              <div className="flex space-x-2">
                <select className="p-2 border rounded-md">
                  <option>2025년</option>
                  <option>2024년</option>
                </select>
                <select className="p-2 border rounded-md">
                  <option>5월</option>
                  <option>4월</option>
                  <option>3월</option>
                  <option>2월</option>
                  <option>1월</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">포함할 내용</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>수익 요약</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>강의별 분석</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>수강생 통계</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>정산 내역</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>차트 및 그래프</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>원시 데이터</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>취소</Button>
            <Button onClick={closeModal}>내보내기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 정산 내역 상세 모달 */}
      <Dialog open={activeModal === 'paymentHistory'} onOpenChange={() => activeModal === 'paymentHistory' && closeModal()}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>정산 내역 상세</DialogTitle>
            <DialogDescription>
              2025년 4월 정산 상세 내역입니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">정산 개요</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">정산월:</span>
                      <span>2025년 4월</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">정산일:</span>
                      <span>2025.04.25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">총 수익:</span>
                      <span>₩2,130,000</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">플랫폼 수수료:</span>
                      <span>₩213,000 (10%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">순 수령액:</span>
                      <span className="font-medium">₩1,917,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">입금 계좌:</span>
                      <span>신한은행 110-123-456789</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">수익 상세 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>날짜</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead>수강생</TableHead>
                      <TableHead>금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2025.04.10</TableCell>
                      <TableCell>반려견 기초 훈련 마스터하기 수강료</TableCell>
                      <TableCell>이지은</TableCell>
                      <TableCell>₩240,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2025.04.12</TableCell>
                      <TableCell>반려견 기초 훈련 마스터하기 수강료</TableCell>
                      <TableCell>김민준</TableCell>
                      <TableCell>₩240,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2025.04.15</TableCell>
                      <TableCell>문제행동 교정 과정 수강료</TableCell>
                      <TableCell>박서현</TableCell>
                      <TableCell>₩280,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2025.04.20</TableCell>
                      <TableCell>문제행동 교정 과정 수강료</TableCell>
                      <TableCell>정우진</TableCell>
                      <TableCell>₩280,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => window.print()}>명세서 인쇄</Button>
            <Button onClick={closeModal}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}