import React from 'react';
import { AIAnalysisPanel } from '@/components/ai/AIAnalysisPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Heart, GraduationCap, Sparkles, Bot, Zap } from 'lucide-react';

export default function AIAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI 분석 도우미
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          첨단 AI 기술로 반려동물의 행동, 건강, 훈련에 대한 전문적인 분석과 맞춤형 조언을 받아보세요.
        </p>
      </div>

      {/* 기능 소개 카드 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-2">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-blue-600">행동 분석</CardTitle>
            <CardDescription>
              반려동물의 행동 패턴을 분석하고 문제 행동에 대한 해결책을 제시합니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-red-100 hover:border-red-200 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-red-100 rounded-full w-fit mb-2">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">건강 상담</CardTitle>
            <CardDescription>
              건강 관련 증상을 분석하고 수의학적 관점에서 조언을 제공합니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-2">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">훈련 계획</CardTitle>
            <CardDescription>
              개별 반려동물에 맞는 체계적이고 단계적인 훈련 계획을 수립합니다.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* AI 기술 특징 */}
      <Card className="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI 기술 특징
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                멀티모델 AI 시스템
              </h4>
              <p className="text-sm text-muted-foreground">
                OpenAI와 Google Gemini의 최신 AI 모델을 활용하여 최고 품질의 분석을 제공합니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                비용 최적화 시스템
              </h4>
              <p className="text-sm text-muted-foreground">
                저비용 모델 우선 사용으로 경제적이면서도 정확한 분석을 제공합니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                전문가 수준 조언
              </h4>
              <p className="text-sm text-muted-foreground">
                수의사와 반려동물 행동 전문가의 지식을 기반으로 한 신뢰할 수 있는 조언을 제공합니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-500" />
                개인 맞춤 솔루션
              </h4>
              <p className="text-sm text-muted-foreground">
                반려동물의 개별 특성을 고려한 맞춤형 훈련 계획과 건강 관리 방법을 제안합니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 AI 분석 패널 */}
      <AIAnalysisPanel />

      {/* 주의사항 */}
      <Card className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200">
            ⚠️ 중요한 안내사항
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700 dark:text-amber-300">
          <ul className="space-y-2 text-sm">
            <li>• AI 분석 결과는 참고용 정보이며, 수의사의 전문적인 진료를 대체할 수 없습니다.</li>
            <li>• 응급상황이나 심각한 증상이 의심되는 경우, 즉시 가까운 동물병원에 방문하시기 바랍니다.</li>
            <li>• 훈련 계획 실행 시 반려동물과 가족 구성원의 안전을 최우선으로 고려해주세요.</li>
            <li>• 개별 반려동물의 특성에 따라 결과가 다를 수 있으므로, 지속적인 관찰과 조정이 필요합니다.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}