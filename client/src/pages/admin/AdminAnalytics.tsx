import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  BookOpen,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

// 색상 팔레트
const COLORS = ['#2BAA61', '#FFA726', '#29B5F6', '#E74D3C', '#9C27B0', '#4CAF50'];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const [isLoading, setIsLoading] = useState(false);
  
  // 실제 API 데이터를 시뮬레이션하는 상태
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 156,
      activeUsers: 89,
      totalRevenue: 15450000,
      totalOrders: 234,
      completedTraining: 67,
      activeTraining: 23
    },
    userGrowth: [
      { month: '1월', users: 45, activeUsers: 28 },
      { month: '2월', users: 52, activeUsers: 34 },
      { month: '3월', users: 68, activeUsers: 41 },
      { month: '4월', users: 79, activeUsers: 52 },
      { month: '5월', users: 98, activeUsers: 63 },
      { month: '6월', users: 123, activeUsers: 78 },
      { month: '7월', users: 145, activeUsers: 89 }
    ],
    revenueData: [
      { month: '1월', revenue: 1200000, orders: 28, training: 800000 },
      { month: '2월', revenue: 1450000, orders: 34, training: 950000 },
      { month: '3월', revenue: 1680000, orders: 41, training: 1120000 },
      { month: '4월', revenue: 1950000, orders: 52, training: 1340000 },
      { month: '5월', revenue: 2200000, orders: 63, training: 1580000 },
      { month: '6월', revenue: 2650000, orders: 78, training: 1890000 },
      { month: '7월', revenue: 2950000, orders: 89, training: 2100000 }
    ],
    trainingCategories: [
      { name: '기본 훈련', value: 35, color: '#2BAA61' },
      { name: '문제행동 교정', value: 28, color: '#FFA726' },
      { name: '고급 훈련', value: 20, color: '#29B5F6' },
      { name: '사회화 훈련', value: 17, color: '#E74D3C' }
    ],
    userDemographics: [
      { age: '20-30세', count: 45 },
      { age: '31-40세', count: 62 },
      { age: '41-50세', count: 38 },
      { age: '51-60세', count: 11 }
    ],
    regionData: [
      { region: '서울', users: 67, revenue: 8900000 },
      { region: '경기', users: 45, revenue: 5600000 },
      { region: '부산', users: 23, revenue: 2800000 },
      { region: '대구', users: 15, revenue: 1900000 },
      { region: '기타', users: 6, revenue: 750000 }
    ]
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    // 실제 환경에서는 API 호출
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">심층 분석</h1>
          <p className="text-muted-foreground">플랫폼 성과와 사용자 행동을 분석합니다</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">최근 7일</SelectItem>
              <SelectItem value="30days">최근 30일</SelectItem>
              <SelectItem value="90days">최근 3개월</SelectItem>
              <SelectItem value="1year">최근 1년</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 개요 통계 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="총 사용자"
          value={analyticsData.overview.totalUsers.toLocaleString()}
          change="+12.5% 전월 대비"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="활성 사용자"
          value={analyticsData.overview.activeUsers.toLocaleString()}
          change="+8.3% 전월 대비"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="총 수익"
          value={formatCurrency(analyticsData.overview.totalRevenue)}
          change="+23.1% 전월 대비"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="총 주문"
          value={analyticsData.overview.totalOrders.toLocaleString()}
          change="+15.2% 전월 대비"
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="완료된 훈련"
          value={analyticsData.overview.completedTraining.toLocaleString()}
          change="+18.7% 전월 대비"
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="진행 중인 훈련"
          value={analyticsData.overview.activeTraining.toLocaleString()}
          change="-5.2% 전월 대비"
          icon={Calendar}
          trend="down"
        />
      </div>

      {/* 상세 분석 탭 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="users">사용자</TabsTrigger>
          <TabsTrigger value="revenue">수익</TabsTrigger>
          <TabsTrigger value="training">훈련</TabsTrigger>
          <TabsTrigger value="geography">지역</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>사용자 증가 추이</CardTitle>
                <CardDescription>월별 신규 사용자 및 활성 사용자</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#2BAA61" name="총 사용자" />
                    <Line type="monotone" dataKey="activeUsers" stroke="#FFA726" name="활성 사용자" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>훈련 카테고리 분포</CardTitle>
                <CardDescription>훈련 유형별 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.trainingCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.trainingCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>월별 수익 추이</CardTitle>
              <CardDescription>쇼핑몰 수익 vs 훈련 수익</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="training"
                    stackId="1"
                    stroke="#2BAA61"
                    fill="#2BAA61"
                    name="훈련 수익"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="2"
                    stroke="#FFA726"
                    fill="#FFA726"
                    name="총 수익"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 사용자 탭 */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>연령대별 사용자 분포</CardTitle>
                <CardDescription>사용자의 연령대 분석</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.userDemographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#29B5F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>사용자 활동 패턴</CardTitle>
                <CardDescription>시간대별 접속 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">아침 (06-12시)</span>
                    <Badge variant="secondary">24%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">오후 (12-18시)</span>
                    <Badge variant="secondary">35%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">저녁 (18-24시)</span>
                    <Badge variant="secondary">31%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">새벽 (00-06시)</span>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>사용자 참여도 지표</CardTitle>
              <CardDescription>핵심 지표별 성과</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={[
                  { subject: '앱 사용 빈도', A: 85, fullMark: 100 },
                  { subject: '훈련 참여율', A: 78, fullMark: 100 },
                  { subject: '구매 전환율', A: 65, fullMark: 100 },
                  { subject: '리뷰 작성율', A: 42, fullMark: 100 },
                  { subject: '추천 점수', A: 89, fullMark: 100 },
                  { subject: '재방문율', A: 76, fullMark: 100 }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="참여도" dataKey="A" stroke="#2BAA61" fill="#2BAA61" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 수익 탭 */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>월별 상세 수익 분석</CardTitle>
              <CardDescription>카테고리별 수익 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#2BAA61" strokeWidth={3} name="총 수익" />
                  <Line type="monotone" dataKey="training" stroke="#FFA726" strokeWidth={3} name="훈련 수익" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>수익 성장률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+23.1%</div>
                <p className="text-xs text-muted-foreground">전월 대비</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>평균 주문 가격</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(66000)}</div>
                <p className="text-xs text-muted-foreground">+8.5% 전월 대비</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>고객 생애 가치</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(324000)}</div>
                <p className="text-xs text-muted-foreground">+15.2% 전월 대비</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 훈련 탭 */}
        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>훈련 완료율</CardTitle>
                <CardDescription>카테고리별 완료 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trainingCategories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${category.value * 2}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{category.value * 2}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>훈련사 성과</CardTitle>
                <CardDescription>상위 훈련사 랭킹</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: '김지연 훈련사', sessions: 45, rating: 4.9 },
                    { name: '박민수 훈련사', sessions: 38, rating: 4.8 },
                    { name: '이서현 훈련사', sessions: 32, rating: 4.7 },
                    { name: '최동훈 훈련사', sessions: 28, rating: 4.6 }
                  ].map((trainer, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{trainer.name}</p>
                        <p className="text-xs text-muted-foreground">세션: {trainer.sessions}회</p>
                      </div>
                      <Badge>{trainer.rating}⭐</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 지역 탭 */}
        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>지역별 사용자 및 수익</CardTitle>
              <CardDescription>주요 지역 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={analyticsData.regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip 
                    formatter={(value, name) => 
                      name === 'revenue' ? formatCurrency(Number(value)) : value
                    } 
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="users" fill="#2BAA61" name="사용자 수" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#FFA726" strokeWidth={3} name="수익" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}