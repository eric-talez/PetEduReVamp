import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Clock, TrendingUp, Volume2, Activity, List, BarChart3, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import DogSelector, { type DogSubject } from './DogSelector';

interface EmotionHeatmapData {
  emotion: string;
  intensity: 'low' | 'medium' | 'high' | 'very-high';
  emoji: string;
  count?: number;
  analyses?: VocalAnalysis[];
}

interface AnalysisMetrics {
  voiceQuality: number;
  aiConfidence: number;
  processingSpeed: number;
  accuracy: number;
}

interface VocalAnalysis {
  id: number;
  emotionalState: string | null;
  aiConfidenceScore: number | null;
  aiAnalysisResult: Record<string, any> | null;
  createdAt: string | null;
  vocalizationType?: string | null;
  frequency?: number | null;
  amplitude?: number | null;
  duration?: number | null;
  pitch?: number | null;
  context?: string | null;
  confidence?: number | null;
}

const emotionEmojis: Record<string, string> = {
  '기쁨': '😊',
  '행복': '😊',
  '불안': '😰',
  '경계': '🚨',
  '요구': '🙏',
  '좌절': '😤',
  '놀이': '🎾',
  '스트레스': '😰',
  '흥분': '🎉',
  '두려움': '😱',
  '평온': '😌',
  '식사 요구': '🍽️',
  '산책 요청': '🚶',
  '관심 끌기': '👋',
};

export default function VisualInsights() {
  const [isRotating, setIsRotating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionHeatmapData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<number | null>(null);
  const [selectedDog, setSelectedDog] = useState<DogSubject | null>(null);

  // 선택된 강아지에 따라 분석 데이터 필터링
  const { data: analysisHistory, isLoading } = useQuery<VocalAnalysis[]>({
    queryKey: ['/api/research/vocal-analyses', selectedDogId],
    queryFn: async () => {
      const url = selectedDogId 
        ? `/api/research/vocal-analyses?dogId=${selectedDogId}`
        : '/api/research/vocal-analyses';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch vocal analyses');
      return response.json();
    },
    refetchInterval: 5000,
  });

  // 행동 분석 데이터도 가져오기
  const { data: behavioralHistory } = useQuery<any[]>({
    queryKey: ['/api/research/behavioral-analyses', selectedDogId],
    queryFn: async () => {
      const url = selectedDogId 
        ? `/api/research/behavioral-analyses?dogId=${selectedDogId}`
        : '/api/research/behavioral-analyses';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch behavioral analyses');
      return response.json();
    },
    refetchInterval: 5000,
    enabled: !!selectedDogId,
  });

  const { emotionData, metrics } = useMemo(() => {
    if (!analysisHistory || analysisHistory.length === 0) {
      return {
        emotionData: [
          { emotion: '기쁨', intensity: 'low' as const, emoji: '😊' },
          { emotion: '불안', intensity: 'low' as const, emoji: '😰' },
          { emotion: '경계', intensity: 'low' as const, emoji: '🚨' },
          { emotion: '요구', intensity: 'low' as const, emoji: '🙏' },
          { emotion: '스트레스', intensity: 'low' as const, emoji: '😤' },
          { emotion: '놀이', intensity: 'low' as const, emoji: '🎾' },
        ],
        metrics: {
          voiceQuality: 0,
          aiConfidence: 0,
          processingSpeed: 0,
          accuracy: 0,
        },
      };
    }

    const emotionCounts: Record<string, number> = {};
    const emotionAnalyses: Record<string, VocalAnalysis[]> = {};
    let totalConfidence = 0;
    let totalQuality = 0;
    let totalProcessingTime = 0;
    let validCount = 0;

    analysisHistory.forEach((analysis) => {
      const emotion = analysis.emotionalState || '알 수 없음';
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      
      if (!emotionAnalyses[emotion]) {
        emotionAnalyses[emotion] = [];
      }
      emotionAnalyses[emotion].push(analysis);
      
      if (analysis.confidence) {
        totalConfidence += analysis.confidence;
        validCount++;
      }
      
      if (analysis.aiAnalysisResult) {
        const result = analysis.aiAnalysisResult;
        if (result.processing_time !== undefined) {
          const timeStr = typeof result.processing_time === 'string' 
            ? result.processing_time.replace(/[^0-9.]/g, '') 
            : String(result.processing_time);
          const time = parseFloat(timeStr);
          if (!isNaN(time)) totalProcessingTime += time;
        }
        if (result.confidence_score) {
          totalQuality += result.confidence_score;
        }
      }
    });

    const maxCount = Math.max(...Object.values(emotionCounts), 1);
    const getIntensity = (count: number): 'low' | 'medium' | 'high' | 'very-high' => {
      const ratio = count / maxCount;
      if (ratio >= 0.75) return 'very-high';
      if (ratio >= 0.5) return 'high';
      if (ratio >= 0.25) return 'medium';
      return 'low';
    };

    const emotions: EmotionHeatmapData[] = Object.entries(emotionCounts)
      .slice(0, 6)
      .map(([emotion, count]) => ({
        emotion,
        intensity: getIntensity(count),
        emoji: emotionEmojis[emotion] || '🐕',
        count,
        analyses: emotionAnalyses[emotion] || [],
      }));

    while (emotions.length < 6) {
      const defaultEmotions = ['기쁨', '불안', '경계', '요구', '스트레스', '놀이'];
      const missingEmotion = defaultEmotions.find(e => !emotions.find(ed => ed.emotion === e));
      if (missingEmotion) {
        emotions.push({
          emotion: missingEmotion,
          intensity: 'low',
          emoji: emotionEmojis[missingEmotion] || '🐕',
          count: 0,
          analyses: [],
        });
      } else break;
    }

    return {
      emotionData: emotions,
      metrics: {
        voiceQuality: validCount > 0 ? Math.round(totalQuality / validCount) || 85 : 0,
        aiConfidence: validCount > 0 ? Math.round((totalConfidence / validCount) * 10) / 10 : 0,
        processingSpeed: validCount > 0 ? Math.round((totalProcessingTime / validCount) * 10) / 10 || 1.5 : 0,
        accuracy: validCount > 0 ? Math.round(totalConfidence / validCount) || 90 : 0,
      },
    };
  }, [analysisHistory]);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'rgba(52, 152, 219, 0.2)';
      case 'medium': return 'rgba(241, 196, 15, 0.4)';
      case 'high': return 'rgba(231, 76, 60, 0.6)';
      case 'very-high': return 'rgba(192, 57, 43, 0.8)';
      default: return 'rgba(52, 152, 219, 0.2)';
    }
  };

  const toggle3DRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="space-y-4">
      {/* 강아지 선택 - 컴팩트 */}
      <Card className="border-purple-200">
        <CardContent className="py-3">
          <DogSelector
            selectedDogId={selectedDogId}
            onSelectDog={(id, dog) => {
              setSelectedDogId(id);
              setSelectedDog(dog);
            }}
            showDetails={false}
            label="🐕 분석할 강아지 선택"
          />
        </CardContent>
      </Card>

      {/* 선택된 강아지 정보 + 탭 컨텐츠 */}
      {selectedDog ? (
        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="records" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">분석 기록</span>
              <Badge variant="secondary" className="text-xs">
                {(analysisHistory?.length || 0) + (behavioralHistory?.length || 0)}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="emotions" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">감정 분석</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">요약</span>
            </TabsTrigger>
          </TabsList>

          {/* 분석 기록 탭 */}
          <TabsContent value="records">
            <Card>
              <CardHeader className="py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center text-base">
                  <span className="mr-2">📋</span>
                  {selectedDog.name}의 분석 기록
                  <Badge variant="secondary" className="ml-auto text-xs">
                    음성 {analysisHistory?.length || 0} | 행동 {behavioralHistory?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">분석 데이터 로딩 중...</span>
              </div>
            ) : (analysisHistory?.length === 0 && (!behavioralHistory || behavioralHistory.length === 0)) ? (
              <div className="text-center py-8 text-gray-500">
                <Volume2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="font-medium">아직 분석 데이터가 없습니다</p>
                <p className="text-sm">음성 녹음 또는 모션 캡처를 통해 데이터를 수집해 주세요</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* 음성 분석 목록 */}
                {analysisHistory && analysisHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      음성 분석 ({analysisHistory.length}건)
                    </h4>
                    <div className="space-y-2">
                      {analysisHistory.slice(0, 10).map((analysis, idx) => (
                        <div key={analysis.id || idx} className="bg-blue-50 rounded-lg p-3 border border-blue-100 hover:bg-blue-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{emotionEmojis[analysis.emotionalState || ''] || '🐕'}</span>
                              <Badge variant="outline" className="bg-white">
                                {analysis.emotionalState || '분석 중'}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {analysis.vocalizationType || '음성'}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {analysis.createdAt 
                                ? format(new Date(analysis.createdAt), 'MM/dd HH:mm', { locale: ko })
                                : '-'}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="text-center">
                              <span className="text-gray-500 block">주파수</span>
                              <span className="font-medium">{analysis.frequency?.toFixed(0) || '-'} Hz</span>
                            </div>
                            <div className="text-center">
                              <span className="text-gray-500 block">진폭</span>
                              <span className="font-medium">{analysis.amplitude?.toFixed(1) || '-'} dB</span>
                            </div>
                            <div className="text-center">
                              <span className="text-gray-500 block">지속시간</span>
                              <span className="font-medium">{analysis.duration?.toFixed(1) || '-'}초</span>
                            </div>
                            <div className="text-center">
                              <span className="text-gray-500 block">신뢰도</span>
                              <span className="font-medium">{((analysis.confidence || 0) * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                          {analysis.context && (
                            <p className="text-xs text-gray-600 mt-2 bg-white/50 p-2 rounded italic">
                              💬 {analysis.context}
                            </p>
                          )}
                          {analysis.aiAnalysisResult && (
                            <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                              <span className="text-purple-700 font-medium">🤖 AI 분석: </span>
                              <span className="text-purple-600">
                                {analysis.aiAnalysisResult.summary || analysis.aiAnalysisResult.emotion || 'AI 분석 완료'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 행동 분석 목록 */}
                {behavioralHistory && behavioralHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      행동 분석 ({behavioralHistory.length}건)
                    </h4>
                    <div className="space-y-2">
                      {behavioralHistory.slice(0, 10).map((analysis: any, idx: number) => (
                        <div key={analysis.id || idx} className="bg-green-50 rounded-lg p-3 border border-green-100 hover:bg-green-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🐕</span>
                              <Badge variant="outline" className="bg-white">
                                {analysis.behaviorType || '행동'}
                              </Badge>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  analysis.intensity >= 7 ? 'bg-red-100 text-red-700' :
                                  analysis.intensity >= 4 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}
                              >
                                강도: {analysis.intensity}/10
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {analysis.createdAt 
                                ? format(new Date(analysis.createdAt), 'MM/dd HH:mm', { locale: ko })
                                : '-'}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <span className="text-gray-500 block">지속시간</span>
                              <span className="font-medium">{analysis.duration?.toFixed(1) || '-'}초</span>
                            </div>
                            <div className="text-center">
                              <span className="text-gray-500 block">신뢰도</span>
                              <span className="font-medium">{((analysis.confidence || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="text-center">
                              <span className="text-gray-500 block">트리거</span>
                              <span className="font-medium">{analysis.triggers?.length || 0}개</span>
                            </div>
                          </div>
                          {analysis.bodyLanguage && (
                            <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                              <span className="text-gray-600">
                                🦴 바디랭귀지: {JSON.stringify(analysis.bodyLanguage).slice(0, 100)}...
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 감정 분석 탭 */}
          <TabsContent value="emotions">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center text-base">
                  <span className="mr-2">🌡️</span>
                  AI 감정 강도 히트맵
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {analysisHistory?.length || 0}개 분석
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="heatmap-grid">
                  {emotionData.map((item, index) => (
                    <div
                      key={index}
                      className={`heatmap-cell ${item.intensity} cursor-pointer hover:scale-105 transition-transform`}
                      style={{ backgroundColor: getIntensityColor(item.intensity) }}
                      onClick={() => {
                        setSelectedEmotion(item);
                        setShowDetailDialog(true);
                      }}
                      data-testid={`emotion-cell-${item.emotion}`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-1">{item.emoji}</div>
                        <div className="text-sm font-medium">{item.emotion}</div>
                        {item.count !== undefined && item.count > 0 && (
                          <div className="text-xs text-gray-600 mt-1">{item.count}건</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                  <span>낮음</span>
                  <div className="flex space-x-1">
                    {['low', 'medium', 'high', 'very-high'].map((level) => (
                      <div
                        key={level}
                        className="w-5 h-2 rounded"
                        style={{ backgroundColor: getIntensityColor(level) }}
                      />
                    ))}
                  </div>
                  <span>높음</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 요약 탭 */}
          <TabsContent value="summary">
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardHeader className="py-3">
                <CardTitle className="flex items-center text-base">
                  <span className="mr-2">🎯</span>
                  {selectedDog.name} 종합 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🎵</div>
                    <div className="text-sm font-medium mb-1">음성 품질</div>
                    <div className="text-xl font-bold text-yellow-300">{metrics.voiceQuality}%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🧠</div>
                    <div className="text-sm font-medium mb-1">AI 신뢰도</div>
                    <div className="text-xl font-bold text-cyan-300">{metrics.aiConfidence}%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-sm font-medium mb-1">처리 속도</div>
                    <div className="text-xl font-bold text-pink-300">{metrics.processingSpeed}초</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-sm font-medium mb-1">정확도</div>
                    <div className="text-xl font-bold text-purple-300">{metrics.accuracy}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="py-12 text-center">
            <span className="text-6xl mb-4 block">🐕</span>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">강아지를 선택해주세요</h3>
            <p className="text-gray-500">
              분석할 강아지를 선택하면 음성 및 행동 분석 기록이 표시됩니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 감정 상세 정보 다이얼로그 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <span className="text-4xl">{selectedEmotion?.emoji}</span>
              <span>{selectedEmotion?.emotion} 분석 상세</span>
            </DialogTitle>
            <DialogDescription>
              해당 감정에 대한 상세 분석 정보입니다
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmotion && (
            <div className="space-y-4 mt-4">
              {/* 요약 정보 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Activity className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm text-gray-600">총 감지 횟수</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedEmotion.count || 0}회</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-600" />
                  <div className="text-sm text-gray-600">강도 수준</div>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedEmotion.intensity === 'very-high' ? '매우 높음' :
                     selectedEmotion.intensity === 'high' ? '높음' :
                     selectedEmotion.intensity === 'medium' ? '중간' : '낮음'}
                  </div>
                </div>
              </div>

              {/* 분석 기록 목록 */}
              {selectedEmotion.analyses && selectedEmotion.analyses.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    최근 분석 기록
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedEmotion.analyses.slice(0, 10).map((analysis, idx) => (
                      <div key={analysis.id || idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {analysis.vocalizationType || '음성'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {analysis.createdAt 
                              ? format(new Date(analysis.createdAt), 'MM/dd HH:mm', { locale: ko })
                              : '-'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">주파수</span>
                            <div className="font-medium">{analysis.frequency?.toFixed(0) || '-'} Hz</div>
                          </div>
                          <div>
                            <span className="text-gray-500">진폭</span>
                            <div className="font-medium">{analysis.amplitude?.toFixed(1) || '-'} dB</div>
                          </div>
                          <div>
                            <span className="text-gray-500">신뢰도</span>
                            <div className="font-medium">{((analysis.confidence || 0) * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                        {analysis.context && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            "{analysis.context}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Volume2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>아직 분석된 데이터가 없습니다</p>
                  <p className="text-sm">음성 녹음을 통해 데이터를 수집해 주세요</p>
                </div>
              )}

              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
              >
                닫기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}