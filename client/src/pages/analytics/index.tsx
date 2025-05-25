import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Calendar as CalendarIcon, Activity, Clipboard, Dog, Brain } from 'lucide-react';

// 날짜 범위 선택 컴포넌트
const DateRangeSelector = ({ startDate, endDate, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleRangeSelect = (range) => {
    let start, end;
    const today = new Date();
    
    switch (range) {
      case '7days':
        start = subDays(today, 7);
        end = today;
        break;
      case '30days':
        start = subDays(today, 30);
        end = today;
        break;
      case '90days':
        start = subDays(today, 90);
        end = today;
        break;
      case 'thisMonth':
        start = startOfMonth(today);
        end = today;
        break;
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      default:
        return;
    }
    
    onDateChange(start, end);
    setShowCalendar(false);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeSelect('7days')}
        >
          최근 7일
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeSelect('30days')}
        >
          최근 30일
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeSelect('90days')}
        >
          최근 90일
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeSelect('thisMonth')}
        >
          이번 달
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeSelect('lastMonth')}
        >
          지난 달
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCalendar(!showCalendar)}
          className="ml-auto"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          직접 선택
        </Button>
      </div>
      
      {showCalendar && (
        <div className="p-4 border rounded-lg bg-card mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">시작일</p>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && onDateChange(date, endDate)}
                locale={ko}
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">종료일</p>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && onDateChange(startDate, date)}
                locale={ko}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground">
        {startDate && endDate && (
          <>
            <span>선택 기간: {format(startDate, 'yyyy년 MM월 dd일', { locale: ko })}</span>
            <span> ~ </span>
            <span>{format(endDate, 'yyyy년 MM월 dd일', { locale: ko })}</span>
          </>
        )}
      </div>
    </div>
  );
};

// 사용자 활동 분석 컴포넌트
const UserActivityAnalytics = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/analytics/activity-logs', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      const response = await fetch(`/api/analytics/activity-logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('활동 로그를 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <div>
        <DateRangeSelector 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Array(2).fill(0).map((_, i) => (
            <Card key={i} className="h-[300px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[220px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div>
        <DateRangeSelector 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        
        <Card className="p-8 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">데이터를 불러올 수 없습니다</h3>
          <p className="text-muted-foreground mb-4">활동 로그를 가져오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Card>
      </div>
    );
  }
  
  // 활동 유형별 통계 데이터
  const activityTypeData = data?.activityTypeCounts 
    ? Object.entries(data.activityTypeCounts).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    : [];
  
  // 일별 활동 데이터
  const dailyActivityData = data?.dailyActivity || [];
  
  // 활동 시간대 데이터
  const hourlyActivityData = data?.hourlyActivity || [];
  
  return (
    <div>
      <DateRangeSelector 
        startDate={startDate} 
        endDate={endDate} 
        onDateChange={handleDateChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>총 활동 수</CardDescription>
            <CardTitle className="text-3xl">{data?.totalActivities || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안의 모든 활동 수입니다.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>평균 일일 활동</CardDescription>
            <CardTitle className="text-3xl">
              {data?.totalActivities && dailyActivityData.length
                ? Math.round(data.totalActivities / dailyActivityData.length)
                : 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안의 하루 평균 활동 수입니다.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>가장 활발한 활동</CardDescription>
            <CardTitle className="text-xl truncate">
              {activityTypeData.length > 0
                ? activityTypeData.sort((a, b) => b.value - a.value)[0]?.name
                : '데이터 없음'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안 가장 많이 한 활동입니다.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">활동 유형 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">일별 활동 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">시간대별 활동 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">최근 활동 기록</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentActivities && data.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.activityType.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(activity.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                    </p>
                    {activity.metadata && (
                      <p className="text-sm mt-1">
                        {JSON.stringify(activity.metadata)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>선택한 기간에 활동 기록이 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// 반려동물 건강 분석 컴포넌트
const PetHealthAnalytics = () => {
  const { user } = useAuth();
  const [selectedPet, setSelectedPet] = useState('');
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  // 사용자의 반려동물 목록 조회
  const { data: pets, isLoading: isPetsLoading } = useQuery({
    queryKey: ['/api/my-pets'],
    queryFn: async () => {
      const response = await fetch('/api/my-pets');
      if (!response.ok) {
        throw new Error('반려동물 목록을 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!user,
  });
  
  // 선택한 반려동물의 건강 로그 조회
  const { data: healthLogs, isLoading: isHealthLogsLoading, isError } = useQuery({
    queryKey: ['/api/analytics/pets', selectedPet, startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      const response = await fetch(`/api/analytics/pets/${selectedPet}/health-logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('건강 로그를 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!user && !!selectedPet,
  });
  
  if (isPetsLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-[200px]" />
        </div>
        
        <Card className="p-8">
          <Skeleton className="h-6 w-40 mx-auto mb-4" />
          <Skeleton className="h-4 w-60 mx-auto" />
        </Card>
      </div>
    );
  }
  
  if (!pets || pets.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Dog className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">등록된 반려동물이 없습니다</h3>
        <p className="text-muted-foreground mb-4">반려동물을 등록하고 건강 기록을 관리해보세요.</p>
        <Button>반려동물 등록하기</Button>
      </Card>
    );
  }
  
  if (!selectedPet && pets.length > 0) {
    setSelectedPet(pets[0].id.toString());
    return <div>Loading...</div>;
  }
  
  if (isHealthLogsLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Select value={selectedPet} onValueChange={setSelectedPet}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="반려동물 선택" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id.toString()}>
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <DateRangeSelector 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="h-[300px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[220px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Select value={selectedPet} onValueChange={setSelectedPet}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="반려동물 선택" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id.toString()}>
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <DateRangeSelector 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        
        <Card className="p-8 text-center">
          <Dog className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">데이터를 불러올 수 없습니다</h3>
          <p className="text-muted-foreground mb-4">건강 로그를 가져오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Card>
      </div>
    );
  }
  
  const selectedPetData = pets.find(pet => pet.id.toString() === selectedPet);
  
  // 건강 기록 유형별 통계 데이터
  const recordTypeData = healthLogs?.recordTypeCounts 
    ? Object.entries(healthLogs.recordTypeCounts).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    : [];
  
  // 체중 변화 추이 데이터
  const weightTrendData = healthLogs?.weightTrend || [];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Select value={selectedPet} onValueChange={setSelectedPet}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="반려동물 선택" />
          </SelectTrigger>
          <SelectContent>
            {pets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id.toString()}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <DateRangeSelector 
        startDate={startDate} 
        endDate={endDate} 
        onDateChange={handleDateChange} 
      />
      
      {selectedPetData && (
        <Card className="mb-8 overflow-hidden">
          <div className="md:grid md:grid-cols-[300px_1fr]">
            <CardHeader>
              <div className="flex items-center gap-4">
                {selectedPetData.imageUrl ? (
                  <img
                    src={selectedPetData.imageUrl}
                    alt={selectedPetData.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dog className="h-10 w-10 text-primary" />
                  </div>
                )}
                <div>
                  <CardTitle>{selectedPetData.name}</CardTitle>
                  <CardDescription>{selectedPetData.breed}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="border-t md:border-l md:border-t-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">나이</p>
                  <p className="text-lg font-medium">{selectedPetData.age}세</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">성별</p>
                  <p className="text-lg font-medium">{selectedPetData.gender === 'male' ? '수컷' : '암컷'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">최근 체중</p>
                  <p className="text-lg font-medium">
                    {weightTrendData.length > 0
                      ? `${weightTrendData[weightTrendData.length - 1].value} ${weightTrendData[weightTrendData.length - 1].unit}`
                      : '정보 없음'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>총 기록 수</CardDescription>
            <CardTitle className="text-3xl">{healthLogs?.totalRecords || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안의 모든 건강 기록 수입니다.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>가장 많은 기록</CardDescription>
            <CardTitle className="text-xl truncate">
              {recordTypeData.length > 0
                ? recordTypeData.sort((a, b) => b.value - a.value)[0]?.name
                : '데이터 없음'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안 가장 많이 기록한 건강 유형입니다.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>체중 변화</CardDescription>
            <CardTitle className="text-xl">
              {weightTrendData.length > 1
                ? `${(weightTrendData[weightTrendData.length - 1].value - weightTrendData[0].value).toFixed(1)} ${weightTrendData[0].unit}`
                : '데이터 부족'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안의 체중 변화량입니다.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {weightTrendData.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">체중 변화 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="체중" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">기록 유형 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recordTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">최근 건강 기록</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <FileText className="h-4 w-4" />
                보고서
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {healthLogs?.recentRecords && healthLogs.recentRecords.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {healthLogs.recentRecords.map((record, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clipboard className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{record.recordType.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(record.recordedAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                      </p>
                      {record.value && (
                        <p className="text-sm mt-1">
                          {record.value} {record.unit || ''}
                        </p>
                      )}
                      {record.notes && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clipboard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>선택한 기간에 건강 기록이 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 훈련 진행 분석 컴포넌트
const TrainingAnalytics = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/analytics/training-progress', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      const response = await fetch(`/api/analytics/training-progress?${params.toString()}`);
      if (!response.ok) {
        throw new Error('훈련 진행 데이터를 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <div>
        <DateRangeSelector 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Array(2).fill(0).map((_, i) => (
            <Card key={i} className="h-[300px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[220px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div>
        <DateRangeSelector 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        
        <Card className="p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">데이터를 불러올 수 없습니다</h3>
          <p className="text-muted-foreground mb-4">훈련 진행 데이터를 가져오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Card>
      </div>
    );
  }
  
  if (!data || !data.courseProgress || data.courseProgress.length === 0) {
    return (
      <div>
        <DateRangeSelector 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        
        <Card className="p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">훈련 기록이 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            선택한 기간 동안 완료한 강의나 퀴즈가 없습니다.
            훈련 과정을 시작하거나 다른 기간을 선택해보세요.
          </p>
          <Button>훈련 과정 살펴보기</Button>
        </Card>
      </div>
    );
  }
  
  const totalLessonsCompleted = data.courseProgress.reduce(
    (sum, course) => sum + course.lessonCompleted,
    0
  );
  
  const totalQuizCompleted = data.courseProgress.reduce(
    (sum, course) => sum + course.quizCompleted,
    0
  );
  
  const averageScore = data.courseProgress.reduce(
    (sum, course) => sum + course.averageScore,
    0
  ) / data.courseProgress.length;
  
  const courseCompletionData = data.courseProgress.map(course => ({
    name: course.courseTitle,
    lessons: course.lessonCompleted,
    quizzes: course.quizCompleted,
    assignments: course.assignmentCompleted
  }));
  
  const courseScoreData = data.courseProgress.map(course => ({
    name: course.courseTitle,
    score: course.averageScore
  }));
  
  return (
    <div>
      <DateRangeSelector 
        startDate={startDate} 
        endDate={endDate} 
        onDateChange={handleDateChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>완료한 강의</CardDescription>
            <CardTitle className="text-3xl">{totalLessonsCompleted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안 완료한 총 강의 수입니다.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>완료한 퀴즈</CardDescription>
            <CardTitle className="text-3xl">{totalQuizCompleted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안 완료한 총 퀴즈 수입니다.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>평균 점수</CardDescription>
            <CardTitle className="text-3xl">{averageScore.toFixed(1)}/100</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              선택 기간 동안의 퀴즈 평균 점수입니다.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">코스별 완료 항목</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lessons" name="강의" fill="#8884d8" />
                  <Bar dataKey="quizzes" name="퀴즈" fill="#82ca9d" />
                  <Bar dataKey="assignments" name="과제" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">코스별 평균 점수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="평균 점수" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">훈련 진행 상세</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              내보내기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">코스명</th>
                  <th className="text-center py-3 px-2">완료한 강의</th>
                  <th className="text-center py-3 px-2">완료한 퀴즈</th>
                  <th className="text-center py-3 px-2">완료한 과제</th>
                  <th className="text-center py-3 px-2">평균 점수</th>
                  <th className="text-center py-3 px-2">총 학습 시간</th>
                </tr>
              </thead>
              <tbody>
                {data.courseProgress.map((course, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-2 font-medium">{course.courseTitle}</td>
                    <td className="text-center py-3 px-2">{course.lessonCompleted}</td>
                    <td className="text-center py-3 px-2">{course.quizCompleted}</td>
                    <td className="text-center py-3 px-2">{course.assignmentCompleted}</td>
                    <td className="text-center py-3 px-2">{course.averageScore.toFixed(1)}/100</td>
                    <td className="text-center py-3 px-2">
                      {Math.floor(course.totalDuration / 3600)}시간 {Math.floor((course.totalDuration % 3600) / 60)}분
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 보고서 관리 컴포넌트
const ReportsManagement = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('all');
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/analytics/reports', reportType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (reportType !== 'all') {
        params.append('reportType', reportType);
      }
      
      const response = await fetch(`/api/analytics/reports?${params.toString()}`);
      if (!response.ok) {
        throw new Error('보고서 목록을 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">보고서 목록을 불러올 수 없습니다</h3>
        <p className="text-muted-foreground mb-4">보고서 데이터를 가져오는 중 오류가 발생했습니다.</p>
        <Button onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </Card>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="보고서 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 보고서</SelectItem>
            <SelectItem value="user_activity">활동 보고서</SelectItem>
            <SelectItem value="pet_health">반려동물 건강 보고서</SelectItem>
            <SelectItem value="training_progress">훈련 진행 보고서</SelectItem>
          </SelectContent>
        </Select>
        
        <Button className="gap-1">
          <FileText className="h-4 w-4" />
          새 보고서 생성
        </Button>
      </div>
      
      {(!data || !data.reports || data.reports.length === 0) ? (
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-semibold mb-2">보고서가 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            아직 생성된 보고서가 없습니다. 새 보고서를 생성해보세요.
          </p>
          <Button className="gap-1">
            <FileText className="h-4 w-4" />
            새 보고서 생성
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>
                      {report.reportType === 'user_activity' && '활동 보고서'}
                      {report.reportType === 'pet_health' && '반려동물 건강 보고서'}
                      {report.reportType === 'training_progress' && '훈련 진행 보고서'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>상세 보기</DropdownMenuItem>
                      <DropdownMenuItem>PDF로 내보내기</DropdownMenuItem>
                      <DropdownMenuItem>공유하기</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 focus:text-red-500">
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {report.description && (
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                )}
                {report.dateRange && (
                  <p className="text-xs text-muted-foreground">
                    분석 기간: {format(new Date(report.dateRange.start), 'yyyy년 MM월 dd일', { locale: ko })} ~ 
                    {format(new Date(report.dateRange.end), 'yyyy년 MM월 dd일', { locale: ko })}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  생성일: {format(new Date(report.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
                  {report.accessCount > 0 && ` • 조회수: ${report.accessCount}회`}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// 메인 분석 페이지 컴포넌트
export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  if (authLoading) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container py-6">
        <Card className="p-8 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-4">
            분석 기능을 이용하려면 로그인이 필요합니다.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            로그인 하러 가기
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">분석 및 보고서</h1>
        <Button className="gap-1">
          <Download className="h-4 w-4" />
          데이터 내보내기
        </Button>
      </div>
      
      <Tabs defaultValue="activity">
        <TabsList className="mb-8">
          <TabsTrigger value="activity" className="gap-1">
            <Activity className="h-4 w-4" />
            활동 분석
          </TabsTrigger>
          <TabsTrigger value="pet-health" className="gap-1">
            <Dog className="h-4 w-4" />
            반려동물 건강
          </TabsTrigger>
          <TabsTrigger value="training" className="gap-1">
            <Brain className="h-4 w-4" />
            훈련 진행
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1">
            <FileText className="h-4 w-4" />
            보고서
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <UserActivityAnalytics />
        </TabsContent>
        
        <TabsContent value="pet-health">
          <PetHealthAnalytics />
        </TabsContent>
        
        <TabsContent value="training">
          <TrainingAnalytics />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}