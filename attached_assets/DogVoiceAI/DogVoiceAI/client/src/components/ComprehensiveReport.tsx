
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import DogSelector, { type DogSubject } from "./DogSelector";
import {
  FileText,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Download,
  Sparkles,
  Heart,
  Target,
  Shield,
  Award,
  Volume2,
  Video,
  ChevronRight,
  ListChecks
} from "lucide-react";

interface VocalAnalysis {
  id: number;
  sessionId?: number;
  vocalizationType?: string;
  frequency?: number;
  amplitude?: number;
  duration?: number;
  emotionalState?: string;
  context?: string;
  confidence?: number;
  createdAt?: string;
}

interface BehavioralAnalysis {
  id: number;
  sessionId?: number;
  behaviorType?: string;
  intensity?: number;
  duration?: number;
  emotionalState?: string;
  bodyLanguage?: any;
  createdAt?: string;
}

interface ComprehensiveReportProps {
  dogId?: number;
  surveyData?: any;
  motionData?: any[];
  behaviorData?: any[];
}

export default function ComprehensiveReport({
  dogId: initialDogId,
  surveyData,
  motionData = [],
  behaviorData = []
}: ComprehensiveReportProps) {
  const [report, setReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'select' | 'generating' | 'complete'>('select');
  const [selectedVocalIds, setSelectedVocalIds] = useState<Set<number>>(new Set());
  const [selectedBehaviorIds, setSelectedBehaviorIds] = useState<Set<number>>(new Set());
  const [selectedDogId, setSelectedDogId] = useState<number | null>(initialDogId || null);
  const [selectedDog, setSelectedDog] = useState<DogSubject | null>(null);
  const { toast } = useToast();

  // 분석 데이터 가져오기
  const { data: vocalAnalyses = [] } = useQuery<VocalAnalysis[]>({
    queryKey: ['/api/research/vocal-analyses'],
  });

  const { data: behavioralAnalyses = [] } = useQuery<BehavioralAnalysis[]>({
    queryKey: ['/api/research/behavioral-analyses'],
  });

  // 전체 선택/해제
  const selectAllVocal = () => {
    if (selectedVocalIds.size === vocalAnalyses.length) {
      setSelectedVocalIds(new Set());
    } else {
      setSelectedVocalIds(new Set(vocalAnalyses.map(v => v.id)));
    }
  };

  const selectAllBehavior = () => {
    if (selectedBehaviorIds.size === behavioralAnalyses.length) {
      setSelectedBehaviorIds(new Set());
    } else {
      setSelectedBehaviorIds(new Set(behavioralAnalyses.map(b => b.id)));
    }
  };

  const toggleVocalSelection = (id: number) => {
    const newSet = new Set(selectedVocalIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedVocalIds(newSet);
  };

  const toggleBehaviorSelection = (id: number) => {
    const newSet = new Set(selectedBehaviorIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedBehaviorIds(newSet);
  };

  const generateReport = async () => {
    if (!selectedDogId) {
      toast({
        title: "강아지 선택 필요",
        description: "리포트를 생성할 강아지를 먼저 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    const selectedVocal = vocalAnalyses.filter(v => selectedVocalIds.has(v.id));
    const selectedBehavior = behavioralAnalyses.filter(b => selectedBehaviorIds.has(b.id));

    if (selectedVocal.length === 0 && selectedBehavior.length === 0) {
      toast({
        title: "데이터 선택 필요",
        description: "리포트에 포함할 분석 데이터를 최소 1개 이상 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    setStep('generating');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/comprehensive-report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogId: selectedDogId,
          surveyData,
          motionData: selectedVocal,
          behaviorData: selectedBehavior
        })
      });

      if (!response.ok) {
        throw new Error('리포트 생성 실패');
      }

      const generatedReport = await response.json();
      setReport(generatedReport);
      setStep('complete');

      toast({
        title: "종합 리포트 생성 완료",
        description: `${selectedVocal.length}개 음성분석 + ${selectedBehavior.length}개 행동분석을 기반으로 리포트가 생성되었습니다.`
      });

    } catch (error) {
      console.error('Report generation error:', error);
      setStep('select');
      toast({
        title: "생성 실패",
        description: "리포트 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetToSelection = () => {
    setStep('select');
    setReport(null);
  };

  const downloadReport = () => {
    if (!report) return;

    const reportText = `
강아지 종합 분석 리포트
생성일: ${new Date().toLocaleString('ko-KR')}

${report.executiveSummary}

전체 점수: ${report.overallScore}/100
웰빙 지수: ${report.wellbeingIndex}/10

[모션 분석 요약]
${JSON.stringify(report.motionAnalysisSummary, null, 2)}

[행동 분석 요약]
${JSON.stringify(report.behaviorAnalysisSummary, null, 2)}

[AI 추천사항]
${report.aiRecommendations.join('\n')}

[건강 경고]
${report.healthAlerts.join('\n')}

[훈련 조언]
${report.trainingAdvice.join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprehensive-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span>AI 종합 분석 리포트</span>
            </div>
            {step === 'select' && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                {vocalAnalyses.length + behavioralAnalyses.length}개 분석 데이터
              </Badge>
            )}
            {step === 'complete' && report && (
              <div className="flex gap-2">
                <Button
                  onClick={resetToSelection}
                  variant="secondary"
                  className="bg-white/20 text-white hover:bg-white/30"
                  size="sm"
                >
                  <ListChecks className="w-4 h-4 mr-1" />
                  다시 선택
                </Button>
                <Button
                  onClick={downloadReport}
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  다운로드
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* 1단계: 데이터 선택 */}
          {step === 'select' && (
            <div className="space-y-6">
              {/* 강아지 선택 */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                <DogSelector
                  selectedDogId={selectedDogId}
                  onSelectDog={(id, dog) => {
                    setSelectedDogId(id);
                    setSelectedDog(dog);
                  }}
                  showDetails={true}
                  label="리포트 대상 강아지"
                />
              </div>

              <div className="text-center mb-6">
                <ListChecks className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">분석 자료 선택</h3>
                <p className="text-gray-600 text-sm">
                  리포트에 포함할 분석 데이터를 선택하세요
                </p>
              </div>

              {/* 음성 분석 목록 */}
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="bg-blue-50 px-4 py-3 flex items-center justify-between cursor-pointer"
                  onClick={selectAllVocal}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">음성 분석 데이터</span>
                    <Badge variant="secondary">{vocalAnalyses.length}개</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600">
                      {selectedVocalIds.size}개 선택됨
                    </span>
                    <Checkbox 
                      checked={vocalAnalyses.length > 0 && selectedVocalIds.size === vocalAnalyses.length}
                      onCheckedChange={selectAllVocal}
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y">
                  {vocalAnalyses.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      분석된 음성 데이터가 없습니다
                    </div>
                  ) : (
                    vocalAnalyses.map((analysis) => (
                      <div 
                        key={analysis.id}
                        className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedVocalIds.has(analysis.id) ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => toggleVocalSelection(analysis.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {analysis.emotionalState || '감정 미분류'}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {analysis.vocalizationType || '음성'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex gap-3">
                            <span>주파수: {analysis.frequency?.toFixed(0) || '-'}Hz</span>
                            <span>신뢰도: {((analysis.confidence || 0) * 100).toFixed(0)}%</span>
                            {analysis.createdAt && (
                              <span>{format(new Date(analysis.createdAt), 'MM/dd HH:mm', { locale: ko })}</span>
                            )}
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedVocalIds.has(analysis.id)}
                          onCheckedChange={() => toggleVocalSelection(analysis.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 행동 분석 목록 */}
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="bg-green-50 px-4 py-3 flex items-center justify-between cursor-pointer"
                  onClick={selectAllBehavior}
                >
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-green-600" />
                    <span className="font-medium">행동 분석 데이터</span>
                    <Badge variant="secondary">{behavioralAnalyses.length}개</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600">
                      {selectedBehaviorIds.size}개 선택됨
                    </span>
                    <Checkbox 
                      checked={behavioralAnalyses.length > 0 && selectedBehaviorIds.size === behavioralAnalyses.length}
                      onCheckedChange={selectAllBehavior}
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y">
                  {behavioralAnalyses.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      분석된 행동 데이터가 없습니다
                    </div>
                  ) : (
                    behavioralAnalyses.map((analysis) => (
                      <div 
                        key={analysis.id}
                        className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedBehaviorIds.has(analysis.id) ? 'bg-green-50/50' : ''
                        }`}
                        onClick={() => toggleBehaviorSelection(analysis.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {analysis.emotionalState || '감정 미분류'}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {analysis.behaviorType || '행동'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex gap-3">
                            <span>강도: {analysis.intensity || '-'}/10</span>
                            {analysis.createdAt && (
                              <span>{format(new Date(analysis.createdAt), 'MM/dd HH:mm', { locale: ko })}</span>
                            )}
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedBehaviorIds.has(analysis.id)}
                          onCheckedChange={() => toggleBehaviorSelection(analysis.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 선택 요약 및 생성 버튼 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    <span className="font-medium">선택된 데이터: </span>
                    <span className="text-blue-600">{selectedVocalIds.size}개 음성</span>
                    <span className="mx-2">+</span>
                    <span className="text-green-600">{selectedBehaviorIds.size}개 행동</span>
                  </div>
                  <Badge variant={selectedVocalIds.size + selectedBehaviorIds.size > 0 ? "default" : "secondary"}>
                    총 {selectedVocalIds.size + selectedBehaviorIds.size}개
                  </Badge>
                </div>
                <Button 
                  onClick={generateReport} 
                  disabled={selectedVocalIds.size + selectedBehaviorIds.size === 0}
                  className="w-full min-h-[48px] bg-gradient-to-r from-purple-600 to-blue-600"
                  data-testid="generate-report-btn"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  선택한 데이터로 종합 리포트 생성
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* 2단계: 생성 중 */}
          {step === 'generating' && (
            <div className="py-12">
              <div className="text-center mb-6">
                <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">AI가 종합 분석 중입니다...</h3>
                <p className="text-gray-600">
                  {selectedVocalIds.size}개 음성 + {selectedBehaviorIds.size}개 행동 데이터를 분석하고 있습니다
                </p>
              </div>
              <Progress value={66} className="w-full" />
            </div>
          )}

          {/* 3단계: 리포트 완성 */}
          {step === 'complete' && report && (
            <div className="space-y-6">
              {/* 요약 및 점수 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-500" />
                      전체 평가
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">전체 점수</span>
                        <span className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
                          {report.overallScore}/100
                        </span>
                      </div>
                      <Progress value={report.overallScore} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">웰빙 지수</span>
                        <span className={`text-2xl font-bold ${getScoreColor(report.wellbeingIndex * 10)}`}>
                          {report.wellbeingIndex}/10
                        </span>
                      </div>
                      <Progress value={report.wellbeingIndex * 10} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-500" />
                      요약
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {report.executiveSummary}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 탭 콘텐츠 */}
              <Tabs defaultValue="motion" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="motion">모션 분석</TabsTrigger>
                  <TabsTrigger value="behavior">행동 분석</TabsTrigger>
                  <TabsTrigger value="survey">설문 인사이트</TabsTrigger>
                  <TabsTrigger value="correlation">상관관계</TabsTrigger>
                  <TabsTrigger value="recommendations">추천사항</TabsTrigger>
                </TabsList>

                <TabsContent value="motion" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-600" />
                        모션 분석 요약
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">전체 이동성</span>
                        <span className="text-gray-700">{report.motionAnalysisSummary.overallMobility}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">신체 상태</span>
                        <span className="text-gray-700">{report.motionAnalysisSummary.physicalCondition}</span>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">통증 징후</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.motionAnalysisSummary.painIndicators.map((indicator: string, idx: number) => (
                            <Badge key={idx} variant="destructive">{indicator}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">활동 패턴</h4>
                        <div className="space-y-1">
                          {report.motionAnalysisSummary.activityPatterns.map((pattern: string, idx: number) => (
                            <div key={idx} className="text-sm text-gray-600">• {pattern}</div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-600" />
                        행동 분석 요약
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">감정 상태</span>
                        <Badge>{report.behaviorAnalysisSummary.emotionalState}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">스트레스 수준</span>
                        <span className="text-gray-700">{report.behaviorAnalysisSummary.stressLevels}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">사회적 행동</span>
                        <span className="text-gray-700">{report.behaviorAnalysisSummary.socialBehavior}</span>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">주요 행동</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.behaviorAnalysisSummary.dominantBehaviors.map((behavior: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{behavior}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="survey" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-600" />
                        설문 인사이트
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">주요 발견사항</h4>
                        <div className="space-y-2">
                          {report.surveyInsights.keyFindings.map((finding: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-2 bg-blue-50 p-3 rounded">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">견주 우려사항 검증</h4>
                        <div className="space-y-2">
                          {report.surveyInsights.ownerConcernsValidation.map((validation: string, idx: number) => (
                            <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">• {validation}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">환경적 요인</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.surveyInsights.environmentalFactors.map((factor: string, idx: number) => (
                            <Badge key={idx} variant="outline">{factor}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="correlation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                        상관관계 분석
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.correlationFindings.map((finding: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-orange-500 pl-4 py-2">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium">{finding.observation}</h4>
                              <Badge variant={
                                finding.significance === 'high' ? 'destructive' :
                                finding.significance === 'medium' ? 'default' : 'secondary'
                              }>
                                {finding.significance === 'high' ? '높음' :
                                 finding.significance === 'medium' ? '중간' : '낮음'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{finding.correlation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {report.healthAlerts.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-red-600">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            건강 경고
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {report.healthAlerts.map((alert: string, idx: number) => (
                              <div key={idx} className="flex items-start space-x-2 bg-red-50 p-3 rounded border border-red-200">
                                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-red-800">{alert}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-600">
                          <Target className="w-5 h-5 mr-2" />
                          AI 추천사항
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {report.aiRecommendations.map((recommendation: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-2 bg-blue-50 p-3 rounded">
                              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-sm text-gray-700">{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-green-600">
                          <Shield className="w-5 h-5 mr-2" />
                          훈련 조언
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {report.trainingAdvice.map((advice: string, idx: number) => (
                            <div key={idx} className="text-sm text-gray-700 bg-green-50 p-3 rounded border-l-4 border-green-500">
                              {advice}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
