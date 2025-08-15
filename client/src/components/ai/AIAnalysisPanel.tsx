import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Brain, Heart, GraduationCap, Activity, Zap, AlertTriangle } from 'lucide-react';

interface AnalysisResult {
  result: string;
  provider: string;
  model: string;
  confidence: number;
  cost: number;
}

interface UsageStats {
  todayUsage: number;
  dailyLimit: number;
  remainingQuota: number;
  usagePercentage: number;
}

interface AIAnalysisResponse {
  success: boolean;
  analysis: AnalysisResult;
  usageStats: UsageStats;
  timestamp: string;
}

interface ServiceStatus {
  status: string;
  services: {
    openai: { available: boolean; latency?: number };
    gemini: { available: boolean; latency?: number };
  };
}

export function AIAnalysisPanel() {
  const [input, setInput] = useState('');
  const [analysisType, setAnalysisType] = useState<'behavior' | 'health' | 'training'>('behavior');
  const [priority, setPriority] = useState<'cost' | 'quality'>('cost');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 서비스 상태 조회
  const { data: serviceStatus } = useQuery({
    queryKey: ['/api/ai-proxy/status'],
    refetchInterval: 30000, // 30초마다 갱신
  });

  // 사용량 통계 조회
  const { data: usageStats } = useQuery({
    queryKey: ['/api/ai-proxy/usage'],
    refetchInterval: 10000, // 10초마다 갱신
  });

  // AI 분석 뮤테이션
  const analysisMutation = useMutation({
    mutationFn: async (analysisRequest: {
      input: string;
      analysisType: string;
      priority: string;
    }) => {
      const response = await fetch('/api/ai-proxy/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI 분석 중 오류가 발생했습니다.');
      }

      return response.json() as Promise<AIAnalysisResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "분석 완료",
        description: `${data.analysis.provider} 모델로 분석이 완료되었습니다.`,
      });
      // 사용량 통계 갱신
      queryClient.invalidateQueries({ queryKey: ['/api/ai-proxy/usage'] });
    },
    onError: (error: Error) => {
      toast({
        title: "분석 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!input.trim()) {
      toast({
        title: "입력 필요",
        description: "분석할 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    analysisMutation.mutate({
      input: input.trim(),
      analysisType,
      priority,
    });
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'behavior':
        return <Brain className="h-4 w-4" />;
      case 'health':
        return <Heart className="h-4 w-4" />;
      case 'training':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'bg-green-100 text-green-800';
      case 'gemini':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 서비스 상태 */}
      {serviceStatus && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI 서비스 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    serviceStatus.services.openai.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm">
                  OpenAI {serviceStatus.services.openai.latency && 
                    `(${serviceStatus.services.openai.latency}ms)`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    serviceStatus.services.gemini.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm">
                  Gemini {serviceStatus.services.gemini.latency && 
                    `(${serviceStatus.services.gemini.latency}ms)`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사용량 현황 */}
      {usageStats?.stats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                오늘 사용량
              </span>
              <Badge variant="secondary">
                {usageStats.stats.todayUsage} / {usageStats.stats.dailyLimit}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={usageStats.stats.usagePercentage} 
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-2">
              남은 할당량: {usageStats.stats.remainingQuota}회
            </p>
            {usageStats.stats.usagePercentage > 80 && (
              <Alert className="mt-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  일일 사용량이 {Math.round(usageStats.stats.usagePercentage)}%에 도달했습니다.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI 분석 인터페이스 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getAnalysisTypeIcon(analysisType)}
            AI 분석 도구
          </CardTitle>
          <CardDescription>
            반려동물의 행동, 건강, 훈련에 대한 전문적인 AI 분석을 받아보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 분석 타입 선택 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">분석 유형</label>
              <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="behavior">행동 분석</SelectItem>
                  <SelectItem value="health">건강 상담</SelectItem>
                  <SelectItem value="training">훈련 계획</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">분석 품질</label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost">빠른 분석 (비용 최적화)</SelectItem>
                  <SelectItem value="quality">정밀 분석 (품질 우선)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 입력 영역 */}
          <div>
            <label className="text-sm font-medium">분석 내용</label>
            <Textarea
              placeholder={
                analysisType === 'behavior'
                  ? "반려동물의 행동을 자세히 설명해주세요. 예: 강아지가 밤에 계속 짖어요..."
                  : analysisType === 'health'
                  ? "건강 관련 증상을 설명해주세요. 예: 식욕이 없고 축 늘어져 있어요..."
                  : "훈련 목표와 반려동물 정보를 알려주세요. 예: 3살 골든리트리버, 산책 시 줄 당김 교정..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {input.length} / 1000 글자
            </p>
          </div>

          {/* 분석 버튼 */}
          <Button 
            onClick={handleAnalyze}
            disabled={analysisMutation.isPending || !input.trim()}
            className="w-full"
          >
            {analysisMutation.isPending ? '분석 중...' : 'AI 분석 시작'}
          </Button>
        </CardContent>
      </Card>

      {/* 분석 결과 */}
      {analysisMutation.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>분석 결과</span>
              <div className="flex items-center gap-2">
                <Badge className={getProviderBadgeColor(analysisMutation.data.analysis.provider)}>
                  {analysisMutation.data.analysis.provider.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  신뢰도 {Math.round(analysisMutation.data.analysis.confidence * 100)}%
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              {analysisMutation.data.analysis.model} • 
              비용: ${analysisMutation.data.analysis.cost.toFixed(6)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {analysisMutation.data.analysis.result.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 에러 표시 */}
      {analysisMutation.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {analysisMutation.error.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}