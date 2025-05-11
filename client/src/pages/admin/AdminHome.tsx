import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Users,
  School,
  BookOpen,
  Activity,
  Settings,
  Bell,
  PieChart,
  TrendingUp,
  Shield,
  AlertTriangle,
  Database,
  Server,
  HelpCircle,
  FileText,
  Check
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Progress } from '@/components/ui/progress';

interface SystemStatusItem {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  load: number;
}

interface PlatformStatsItem {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
}

export default function AdminHome() {
  const { userName } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState<SystemStatusItem[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStatsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 시스템 상태 및 플랫폼 통계 데이터 로드 (임시 데이터)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 시스템 상태 데이터
        const mockSystemStatus: SystemStatusItem[] = [
          {
            name: '메인 서버',
            status: 'healthy',
            uptime: '99.99% (30일)',
            load: 32
          },
          {
            name: '데이터베이스',
            status: 'healthy',
            uptime: '99.98% (30일)',
            load: 45
          },
          {
            name: '스토리지 서버',
            status: 'warning',
            uptime: '99.7% (30일)',
            load: 78
          },
          {
            name: '백업 시스템',
            status: 'healthy',
            uptime: '100% (30일)',
            load: 12
          },
          {
            name: '인증 서비스',
            status: 'healthy',
            uptime: '99.95% (30일)',
            load: 25
          }
        ];
        
        // 플랫폼 통계 데이터
        const mockPlatformStats: PlatformStatsItem[] = [
          {
            name: '총 사용자',
            value: 12483,
            change: 5.2,
            changeType: 'increase'
          },
          {
            name: '총 기관',
            value: 127,
            change: 2.8,
            changeType: 'increase'
          },
          {
            name: '총 훈련사',
            value: 542,
            change: 8.7,
            changeType: 'increase'
          },
          {
            name: '총 강의',
            value: 1872,
            change: 12.4,
            changeType: 'increase'
          },
          {
            name: '일 사용자',
            value: 4215,
            change: 1.3,
            changeType: 'decrease'
          },
          {
            name: '신규 가입',
            value: 187,
            change: 7.6,
            changeType: 'increase'
          }
        ];
        
        setSystemStatus(mockSystemStatus);
        setPlatformStats(mockPlatformStats);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return 'bg-green-500';
    if (load < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleManageInstitutes = () => {
    setLocation('/admin/institutes');
  };

  const handleManageUsers = () => {
    setLocation('/admin/users');
  };

  const handleManageTrainers = () => {
    setLocation('/admin/trainers');
  };

  const handleSystemSettings = () => {
    setLocation('/admin/settings');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            보고서 생성
          </Button>
          <Button variant="default" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            시스템 설정
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">신규 사용자</CardTitle>
            <CardDescription>일일 등록자 수</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+187</div>
            <p className="text-xs text-muted-foreground">어제 대비 +7.6%</p>
            <div className="mt-4 h-1 w-full bg-secondary">
              <div className="h-1 bg-primary" style={{ width: '75%' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">오늘의 방문자</CardTitle>
            <CardDescription>활성 사용자</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,215</div>
            <p className="text-xs text-muted-foreground">어제 대비 -1.3%</p>
            <div className="mt-4 h-1 w-full bg-secondary">
              <div className="h-1 bg-primary" style={{ width: '68%' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">시스템 상태</CardTitle>
            <CardDescription>전체 서비스 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.6%</div>
            <p className="text-xs text-muted-foreground">최적 상태</p>
            <div className="mt-4 h-1 w-full bg-secondary">
              <div className="h-1 bg-green-500" style={{ width: '98.6%' }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="system">시스템 상태</TabsTrigger>
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
          <TabsTrigger value="institutions">기관 관리</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>플랫폼 통계</CardTitle>
                <CardDescription>최근 30일 동안의 주요 지표</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {platformStats.map((stat) => (
                    <div key={stat.name} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                      <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
                      <div className="flex items-center text-xs">
                        {stat.changeType === 'increase' ? (
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        ) : (
                          <TrendingUp className="h-3 w-3 mr-1 text-red-500 transform rotate-180" />
                        )}
                        <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                          {stat.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  상세 분석 보기
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
                <CardDescription>주요 관리 기능에 빠르게 접근하세요</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center" 
                  onClick={handleManageInstitutes}
                >
                  <School className="h-5 w-5 mb-1" />
                  <span>기관 관리</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={handleManageUsers}
                >
                  <Users className="h-5 w-5 mb-1" />
                  <span>사용자 관리</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={handleManageTrainers}
                >
                  <BookOpen className="h-5 w-5 mb-1" />
                  <span>훈련사 관리</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={handleSystemSettings}
                >
                  <Settings className="h-5 w-5 mb-1" />
                  <span>시스템 설정</span>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>최근 알림</CardTitle>
              <CardDescription>시스템 및 관리 알림</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-start p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-sm">스토리지 서버 용량 경고</p>
                      <p className="text-sm text-muted-foreground">스토리지 서버가 78% 사용 중입니다. 최적화 또는 확장이 필요합니다.</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2시간 전</span>
                </div>
                <div className="flex justify-between items-start p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-sm">보안 업데이트 완료</p>
                      <p className="text-sm text-muted-foreground">모든 시스템에 대한 보안 패치가 성공적으로 적용되었습니다.</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">어제</span>
                </div>
                <div className="flex justify-between items-start p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-sm">데이터베이스 백업 완료</p>
                      <p className="text-sm text-muted-foreground">전체 데이터베이스 백업이 성공적으로 완료되었습니다.</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2일 전</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                모든 알림 보기
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>시스템 상태</CardTitle>
              <CardDescription>서비스 및 서버 상태 모니터링</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {systemStatus.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className={`flex items-center ${getStatusColor(item.status)}`}>
                        {item.status === 'healthy' && (
                          <>
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                            <span>정상</span>
                          </>
                        )}
                        {item.status === 'warning' && (
                          <>
                            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></span>
                            <span>주의</span>
                          </>
                        )}
                        {item.status === 'critical' && (
                          <>
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                            <span>위험</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">가동률: {item.uptime}</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <div className="h-2 w-full bg-secondary rounded">
                          <div 
                            className={`h-2 ${getLoadColor(item.load)} rounded`} 
                            style={{ width: `${item.load}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        부하: {item.load}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                상태 모니터링
              </Button>
              <Button variant="default" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                시스템 진단
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>사용자 관리</CardTitle>
              <CardDescription>플랫폼 사용자 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:justify-between mb-6 space-y-4 md:space-y-0">
                <div className="flex-1 mr-0 md:mr-4">
                  <h3 className="text-lg font-semibold mb-2">사용자 현황</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">총 사용자</div>
                      <div className="text-2xl font-bold">12,483</div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">금일 활성</div>
                      <div className="text-2xl font-bold">4,215</div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">신규 가입</div>
                      <div className="text-2xl font-bold">187</div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">미인증</div>
                      <div className="text-2xl font-bold">42</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">사용자 분포</h3>
                  <div className="flex items-center space-x-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">일반 사용자 (76%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">훈련사 (12%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">기관 관리자 (8%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">시스템 관리자 (4%)</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 rounded-full border-8 border-blue-500 relative">
                      <div className="absolute inset-0 rounded-full border-t-8 border-r-8 border-green-500 -rotate-[285deg]"></div>
                      <div className="absolute inset-0 rounded-full border-t-8 border-amber-500 -rotate-[240deg]"></div>
                      <div className="absolute inset-0 rounded-full border-t-8 border-purple-500 -rotate-[205deg]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full"
                onClick={handleManageUsers}
              >
                <Users className="h-4 w-4 mr-2" />
                사용자 관리 페이지로 이동
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="institutions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>기관 관리</CardTitle>
              <CardDescription>등록된 교육 기관 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">기관 현황</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">인증 완료</div>
                        <div className="text-2xl font-bold">118</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">심사 중</div>
                        <div className="text-2xl font-bold">9</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">기관별 훈련사</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>알파 트레이닝 센터</span>
                        <span className="font-medium">38명</span>
                      </div>
                      <Progress value={38} max={100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>베타 애견 학교</span>
                        <span className="font-medium">27명</span>
                      </div>
                      <Progress value={27} max={100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>감마 펫 아카데미</span>
                        <span className="font-medium">24명</span>
                      </div>
                      <Progress value={24} max={100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>오메가 훈련 학교</span>
                        <span className="font-medium">19명</span>
                      </div>
                      <Progress value={19} max={100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>기타</span>
                        <span className="font-medium">434명</span>
                      </div>
                      <Progress value={65} max={100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full"
                onClick={handleManageInstitutes}
              >
                <School className="h-4 w-4 mr-2" />
                기관 관리 페이지로 이동
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}