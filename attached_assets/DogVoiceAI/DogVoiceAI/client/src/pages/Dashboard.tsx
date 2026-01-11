import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AudioRecorder from "@/components/AudioRecorder";
import FileUploadAnalysis from "@/components/FileUploadAnalysis";
import RealTimeMotionAnalysis from "@/components/RealTimeMotionAnalysis";
import PatternAnalysis from "@/components/PatternAnalysis";
import ResearchSubjects from "@/components/ResearchSubjects";
import ComprehensiveReport from "@/components/ComprehensiveReport";
import VisualInsights from "@/components/VisualInsights";
import { useAuth } from "@/hooks/use-auth";
import talezLogo from "@assets/talez-logo.png";
import { 
  Mic, 
  Video, 
  Brain, 
  Database,
  TrendingUp,
  Activity,
  Sparkles,
  FileText,
  Users,
  PawPrint,
  LogOut,
  User,
  Shield,
  ChevronDown
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("audio");
  const [statsOpen, setStatsOpen] = useState(true);
  const { user, logout } = useAuth();
  
  const { data: statistics } = useQuery({
    queryKey: ['/api/research/statistics']
  });

  const stats = statistics as any || {
    totalSubjects: 0,
    totalSessions: 0,
    totalBehavioralAnalyses: 0,
    totalVocalAnalyses: 0
  };

  const navItems = [
    { id: "audio", icon: Mic, label: "음성" },
    { id: "video", icon: Video, label: "모션" },
    { id: "patterns", icon: Brain, label: "패턴" },
    { id: "report", icon: FileText, label: "리포트" },
    { id: "subjects", icon: PawPrint, label: "대상견" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-yellow-50/30 mobile-page-container">
      {/* 헤더 - Talez 브랜딩 */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={talezLogo} 
                alt="Talez" 
                className="h-10 md:h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-[#4A4A4A]">
                  강아지 행동 분석
                </h1>
                <p className="text-xs text-gray-500">AI 기반 반려동물 연구 플랫폼</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Badge 
                variant="outline" 
                className="text-xs md:text-sm px-2 md:px-3 py-1 border-[#8BC34A] text-[#8BC34A]"
              >
                <Activity className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="hidden sm:inline">분석 중</span>
              </Badge>
              
              {user && (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span>{user.firstName || user.email || '사용자'}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        data-testid="button-admin"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">관리자</span>
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logout()}
                    className="text-gray-500 hover:text-red-500"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">로그아웃</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* 통계 카드 - 펼침/닫힘 기능 */}
        <Collapsible open={statsOpen} onOpenChange={setStatsOpen} className="mb-6">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm hover:bg-white transition-colors mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#8BC34A]" />
                <span className="font-medium text-gray-700">분석 통계</span>
                <Badge variant="secondary" className="text-xs">
                  {stats.totalSubjects + stats.totalSessions + stats.totalVocalAnalyses + stats.totalBehavioralAnalyses}건
                </Badge>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${statsOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#8BC34A]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">분석 강아지</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#8BC34A]">{stats.totalSubjects}</p>
                    </div>
                    <Database className="w-8 h-8 md:w-10 md:h-10 text-[#8BC34A] opacity-30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#E5C73A]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">총 세션</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#E5C73A]">{stats.totalSessions}</p>
                    </div>
                    <Activity className="w-8 h-8 md:w-10 md:h-10 text-[#E5C73A] opacity-30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#F5811F]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">음성 분석</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#F5811F]">{stats.totalVocalAnalyses}</p>
                    </div>
                    <Mic className="w-8 h-8 md:w-10 md:h-10 text-[#F5811F] opacity-30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#4A4A4A]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">행동 분석</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#4A4A4A]">{stats.totalBehavioralAnalyses}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-[#4A4A4A] opacity-30" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* 메인 분석 탭 - 데스크톱에서만 표시 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:grid w-full grid-cols-6 mb-6 bg-white/80 p-1 rounded-xl shadow-sm">
            <TabsTrigger 
              value="audio" 
              className="data-[state=active]:bg-[#8BC34A] data-[state=active]:text-white rounded-lg"
            >
              <Mic className="w-4 h-4 mr-2" />
              음성 분석
            </TabsTrigger>
            <TabsTrigger 
              value="video"
              className="data-[state=active]:bg-[#8BC34A] data-[state=active]:text-white rounded-lg"
            >
              <Video className="w-4 h-4 mr-2" />
              모션 분석
            </TabsTrigger>
            <TabsTrigger 
              value="patterns"
              className="data-[state=active]:bg-[#8BC34A] data-[state=active]:text-white rounded-lg"
            >
              <Brain className="w-4 h-4 mr-2" />
              학습 패턴
            </TabsTrigger>
            <TabsTrigger 
              value="insights"
              className="data-[state=active]:bg-[#8BC34A] data-[state=active]:text-white rounded-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              인사이트
            </TabsTrigger>
            <TabsTrigger 
              value="report"
              className="data-[state=active]:bg-[#8BC34A] data-[state=active]:text-white rounded-lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              리포트
            </TabsTrigger>
            <TabsTrigger 
              value="subjects"
              className="data-[state=active]:bg-[#8BC34A] data-[state=active]:text-white rounded-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              대상견
            </TabsTrigger>
          </TabsList>

          {/* 음성 분석 */}
          <TabsContent value="audio" className="space-y-4 md:space-y-6">
            <AudioRecorder />
          </TabsContent>

          {/* 모션 분석 */}
          <TabsContent value="video" className="space-y-4 md:space-y-6">
            <Tabs defaultValue="realtime" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100">
                <TabsTrigger 
                  value="realtime" 
                  data-testid="tab-realtime-motion"
                  className="data-[state=active]:bg-[#F5811F] data-[state=active]:text-white"
                >
                  <Video className="w-4 h-4 mr-2" />
                  실시간 분석
                </TabsTrigger>
                <TabsTrigger 
                  value="upload" 
                  data-testid="tab-upload-motion"
                  className="data-[state=active]:bg-[#F5811F] data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  파일 업로드
                </TabsTrigger>
              </TabsList>
              <TabsContent value="realtime">
                <RealTimeMotionAnalysis />
              </TabsContent>
              <TabsContent value="upload">
                <FileUploadAnalysis />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* 학습 패턴 */}
          <TabsContent value="patterns" className="space-y-4 md:space-y-6">
            <PatternAnalysis />
            <ResearchSubjects />
          </TabsContent>

          {/* 인사이트 탭 */}
          <TabsContent value="insights" className="space-y-4 md:space-y-6">
            <VisualInsights />
          </TabsContent>

          {/* 종합 리포트 탭 */}
          <TabsContent value="report" className="space-y-4 md:space-y-6">
            <ComprehensiveReport 
              surveyData={{
                dailyRoutine: { walkTime: "아침/저녁", feedingTimes: 2 },
                exerciseLevel: "높음",
                behaviorConcerns: ["과도한 짖음", "분리불안"],
                healthIssues: [],
                stressFactors: ["큰 소리", "낯선 사람"],
                ownerObservations: "최근 활동량이 증가하고 짖는 빈도가 줄었습니다."
              }}
              motionData={[
                { timestamp: 0, speed: 2.5, posture: "정상", painIndicators: [] },
                { timestamp: 5, speed: 3.1, posture: "활발", painIndicators: [] }
              ]}
              behaviorData={[
                { behavior: "놀이 행동", confidence: 0.92, emotion: "즐거움", intensity: 8 },
                { behavior: "경계 행동", confidence: 0.78, emotion: "긴장", intensity: 6 }
              ]}
            />
          </TabsContent>

          {/* 연구 대상견 */}
          <TabsContent value="subjects" className="space-y-4 md:space-y-6">
            <ResearchSubjects />
          </TabsContent>
        </Tabs>
      </main>

      {/* 모바일 하단 네비게이션 */}
      <nav className="mobile-bottom-nav md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 푸터 - 데스크톱만 */}
      <footer className="hidden md:block bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          <p>Talez - AI 반려동물 행동 분석 플랫폼 | Powered by OpenAI</p>
        </div>
      </footer>
    </div>
  );
}
