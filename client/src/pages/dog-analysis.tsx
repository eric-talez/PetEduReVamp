import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dog, Brain, FileVideo, BarChart3, FileText, Activity } from "lucide-react";

import FileUploadAnalysis from "@/components/dog-analysis/FileUploadAnalysis";
import BehavioralAnalysis from "@/components/dog-analysis/BehavioralAnalysis";
import PatternAnalysis from "@/components/dog-analysis/PatternAnalysis";
import ComprehensiveReport from "@/components/dog-analysis/ComprehensiveReport";
import FileBasedRealTimeAnalysis from "@/components/dog-analysis/FileBasedRealTimeAnalysis";

export default function DogAnalysisPage() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dog className="w-10 h-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">강아지 AI 행동 분석</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            DogVoiceAI 기술을 활용하여 강아지의 행동, 음성, 자세를 분석합니다.
            동영상이나 음성 파일을 업로드하여 AI가 강아지의 상태를 분석합니다.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileVideo className="w-4 h-4" />
              <span className="hidden sm:inline">파일 분석</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">실시간 분석</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">행동 분석</span>
            </TabsTrigger>
            <TabsTrigger value="pattern" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">패턴 분석</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">종합 리포트</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <FileUploadAnalysis />
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <FileBasedRealTimeAnalysis />
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <BehavioralAnalysis />
          </TabsContent>

          <TabsContent value="pattern" className="space-y-6">
            <PatternAnalysis />
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <ComprehensiveReport />
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              GPT-4.1 AI 분석 안내
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🎬 동영상 분석</h4>
                <p>동영상에서 프레임을 추출하여 강아지의 자세, 표정, 행동을 분석합니다.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">🎯 실시간 모션 분석</h4>
                <p>관절 포인트 추적으로 움직임 속도, 자세 기울기, 활동 유형을 분석합니다.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎤 음성 분석</h4>
                <p>짖는 소리, 울음 소리 등 음성을 분석하여 감정 상태를 파악합니다.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">📊 종합 리포트</h4>
                <p>수집된 데이터를 종합하여 강아지의 건강 및 행동 상태를 리포트합니다.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
