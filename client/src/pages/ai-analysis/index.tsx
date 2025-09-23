import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, PawPrint, Brain, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CareLog {
  id: number;
  petId: number;
  userId: number;
  date: string;
  note?: string;
  poopStatus?: string;
  mealStatus?: string;
  walkStatus?: string;
  mood?: string;
  energyLevel?: number;
  media?: any[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface AiAnalysis {
  id: number;
  petId: number;
  userId: number;
  resultJson: {
    summary: string;
    behavior?: string;
    health?: string;
    nutrition?: string;
    activity?: string;
    redFlags: string[];
    nextSteps: string[];
  };
  selectedSignals: {
    text: boolean;
    poop: boolean;
    meal: boolean;
    walk: boolean;
    media: boolean;
  };
  timeRange: string;
  model: string;
  createdAt: string;
}

export default function AiAnalysisPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7일 전
    end: new Date().toISOString().split('T')[0] // 오늘
  });
  const [selectedSignals, setSelectedSignals] = useState({
    text: true,
    poop: true,
    meal: true,
    walk: true,
    media: false
  });
  const [selectedLogIds, setSelectedLogIds] = useState<number[]>([]);

  // 임시 반려동물 목록 (실제로는 API에서 가져와야 함)
  const pets = [
    { id: 1, name: '멍멍이', species: '개', breed: '골든 리트리버' },
    { id: 2, name: '야옹이', species: '고양이', breed: '페르시안' },
    { id: 3, name: '코코', species: '개', breed: '푸들' }
  ];

  // API 쿼리
  const { data: careLogsData, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['/api/ai-analysis/care-logs', selectedPetId, dateRange.start, dateRange.end],
    queryFn: () => selectedPetId ? apiRequest(`/api/ai-analysis/care-logs?petId=${selectedPetId}&startDate=${dateRange.start}&endDate=${dateRange.end}`) : null,
    enabled: !!selectedPetId
  });

  const { data: analysisHistory } = useQuery({
    queryKey: ['/api/ai-analysis/history', selectedPetId],
    queryFn: () => selectedPetId ? apiRequest(`/api/ai-analysis/history?petId=${selectedPetId}`) : null,
    enabled: !!selectedPetId
  });

  // AI 분석 실행 mutation
  const analyzeDataMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/ai-analysis/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      toast({
        title: 'AI 분석 완료',
        description: '반려동물 데이터 분석이 성공적으로 완료되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-analysis/history', selectedPetId] });
    },
    onError: (error: any) => {
      toast({
        title: 'AI 분석 실패',
        description: error.message || 'AI 분석 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  });

  const handleSignalChange = (signal: string, checked: boolean) => {
    setSelectedSignals(prev => ({ ...prev, [signal]: checked }));
  };

  const handleLogSelection = (logId: number, checked: boolean) => {
    setSelectedLogIds(prev => 
      checked 
        ? [...prev, logId]
        : prev.filter(id => id !== logId)
    );
  };

  const handleAnalyze = () => {
    if (!selectedPetId) {
      toast({
        title: '반려동물을 선택해주세요',
        description: '분석할 반려동물을 먼저 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }

    if (selectedLogIds.length === 0) {
      toast({
        title: '분석할 데이터를 선택해주세요',
        description: '최소 1개의 알림장을 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }

    const hasSelectedSignals = Object.values(selectedSignals).some(v => v);
    if (!hasSelectedSignals) {
      toast({
        title: '분석할 항목을 선택해주세요',
        description: '텍스트, 배변상태, 식사상태, 산책상태, 미디어 중 최소 1개를 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }

    analyzeDataMutation.mutate({
      petId: selectedPetId,
      logIds: selectedLogIds,
      selectedSignals,
      dateRange: `${dateRange.start} to ${dateRange.end}`
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'soft': case 'low': case 'short': return 'bg-yellow-100 text-yellow-800';
      case 'diarrhea': case 'skipped': case 'long': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI 분석</h1>
          <p className="text-muted-foreground">반려동물 알림장 데이터를 AI로 분석하여 건강 상태와 행동 패턴을 파악해보세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 설정 패널 */}
        <div className="lg:col-span-1 space-y-4">
          <Card data-testid="analysis-settings-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                분석 설정
              </CardTitle>
              <CardDescription>
                반려동물과 분석할 기간을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 반려동물 선택 */}
              <div>
                <label className="text-sm font-medium mb-2 block">반려동물 선택</label>
                <Select value={selectedPetId?.toString() || ""} onValueChange={(value) => setSelectedPetId(parseInt(value))}>
                  <SelectTrigger data-testid="select-pet">
                    <SelectValue placeholder="반려동물을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name} ({pet.breed})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 날짜 범위 */}
              <div>
                <label className="text-sm font-medium mb-2 block">분석 기간</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="border rounded-md px-3 py-2 text-sm"
                    data-testid="date-start"
                  />
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="border rounded-md px-3 py-2 text-sm"
                    data-testid="date-end"
                  />
                </div>
              </div>

              {/* 분석 항목 선택 */}
              <div>
                <label className="text-sm font-medium mb-2 block">분석할 항목</label>
                <div className="space-y-2">
                  {[
                    { key: 'text', label: '텍스트 메모', icon: '📝' },
                    { key: 'poop', label: '배변 상태', icon: '💩' },
                    { key: 'meal', label: '식사 상태', icon: '🍽️' },
                    { key: 'walk', label: '산책 상태', icon: '🚶' },
                    { key: 'media', label: '미디어 자료', icon: '📸' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item.key}
                        checked={selectedSignals[item.key as keyof typeof selectedSignals]}
                        onCheckedChange={(checked) => handleSignalChange(item.key, checked as boolean)}
                        data-testid={`checkbox-${item.key}`}
                      />
                      <label htmlFor={item.key} className="text-sm cursor-pointer">
                        {item.icon} {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 분석 실행 버튼 */}
              <Button 
                onClick={handleAnalyze}
                disabled={analyzeDataMutation.isPending || !selectedPetId}
                className="w-full"
                data-testid="button-analyze"
              >
                {analyzeDataMutation.isPending ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    AI 분석 중...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    AI 분석 실행
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="care-logs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="care-logs" data-testid="tab-care-logs">알림장 선택</TabsTrigger>
              <TabsTrigger value="analysis" data-testid="tab-analysis">분석 결과</TabsTrigger>
            </TabsList>

            {/* 알림장 목록 탭 */}
            <TabsContent value="care-logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    등록된 알림장 ({selectedLogIds.length}개 선택됨)
                  </CardTitle>
                  <CardDescription>
                    분석할 알림장을 선택하세요. 날짜별로 그룹화되어 표시됩니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingLogs ? (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">알림장 데이터를 불러오는 중...</p>
                    </div>
                  ) : careLogsData?.dates?.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {careLogsData.dates.map((date: string) => (
                        <div key={date} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">
                            {format(new Date(date), 'M월 d일 (EEE)', { locale: ko })} 
                            <span className="text-sm text-muted-foreground ml-2">
                              ({careLogsData.counts[date]}개 항목)
                            </span>
                          </h4>
                          <div className="space-y-2">
                            {careLogsData.logsByDate[date]?.map((log: CareLog) => (
                              <div key={log.id} className="border rounded p-3 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    checked={selectedLogIds.includes(log.id)}
                                    onCheckedChange={(checked) => handleLogSelection(log.id, checked as boolean)}
                                    data-testid={`checkbox-log-${log.id}`}
                                  />
                                  <span className="text-sm font-medium">알림장 #{log.id}</span>
                                </div>
                                
                                {log.note && (
                                  <p className="text-sm text-gray-700 ml-6">📝 {log.note}</p>
                                )}
                                
                                <div className="flex flex-wrap gap-2 ml-6">
                                  {log.poopStatus && (
                                    <Badge className={getStatusBadgeColor(log.poopStatus)}>
                                      💩 {log.poopStatus}
                                    </Badge>
                                  )}
                                  {log.mealStatus && (
                                    <Badge className={getStatusBadgeColor(log.mealStatus)}>
                                      🍽️ {log.mealStatus}
                                    </Badge>
                                  )}
                                  {log.walkStatus && (
                                    <Badge className={getStatusBadgeColor(log.walkStatus)}>
                                      🚶 {log.walkStatus}
                                    </Badge>
                                  )}
                                  {log.energyLevel && (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      ⚡ {log.energyLevel}/5
                                    </Badge>
                                  )}
                                  {log.media && log.media.length > 0 && (
                                    <Badge className="bg-purple-100 text-purple-800">
                                      📸 {log.media.length}개
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {selectedPetId ? '해당 기간에 등록된 알림장이 없습니다.' : '반려동물을 먼저 선택해주세요.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 분석 결과 탭 */}
            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI 분석 결과
                  </CardTitle>
                  <CardDescription>
                    최근 분석 결과를 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysisHistory?.analyses?.length > 0 ? (
                    <div className="space-y-4">
                      {analysisHistory.analyses.slice(0, 3).map((analysis: AiAnalysis) => (
                        <div key={analysis.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">분석 #{analysis.id}</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(analysis.createdAt), 'M월 d일 HH:mm', { locale: ko })} | 
                                모델: {analysis.model}
                              </p>
                            </div>
                            <Badge variant="outline">{analysis.timeRange}</Badge>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-sm mb-1">📋 전체 요약</h5>
                              <p className="text-sm text-gray-700">{analysis.resultJson.summary}</p>
                            </div>

                            {analysis.resultJson.redFlags?.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-1 flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  주의사항
                                </h5>
                                <ul className="text-sm text-red-700 space-y-1">
                                  {analysis.resultJson.redFlags.map((flag: string, index: number) => (
                                    <li key={index} className="flex items-start gap-1">
                                      <span className="text-red-500 text-xs mt-1">•</span>
                                      {flag}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {analysis.resultJson.nextSteps?.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-1 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  권장사항
                                </h5>
                                <ul className="text-sm text-green-700 space-y-1">
                                  {analysis.resultJson.nextSteps.map((step: string, index: number) => (
                                    <li key={index} className="flex items-start gap-1">
                                      <span className="text-green-500 text-xs mt-1">•</span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        아직 분석 결과가 없습니다. AI 분석을 실행해보세요.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}