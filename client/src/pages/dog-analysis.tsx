import { useState, useRef, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dog, Brain, FileVideo, BarChart3, FileText, Activity, Camera, Eye, Timer, TrendingUp, Play, Square, Maximize, Minimize, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import FileUploadAnalysis from "@/components/dog-analysis/FileUploadAnalysis";
import BehavioralAnalysis from "@/components/dog-analysis/BehavioralAnalysis";
import PatternAnalysis from "@/components/dog-analysis/PatternAnalysis";
import ComprehensiveReport from "@/components/dog-analysis/ComprehensiveReport";
import FileBasedRealTimeAnalysis from "@/components/dog-analysis/FileBasedRealTimeAnalysis";

export default function DogAnalysisPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [realtimeSubTab, setRealtimeSubTab] = useState("file");
  const [isCameraAnalyzing, setIsCameraAnalyzing] = useState(false);
  const [cameraAnalysisTime, setCameraAnalysisTime] = useState(0);
  const [intensityLevel, setIntensityLevel] = useState([5]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (analysisTimerRef.current) {
        clearInterval(analysisTimerRef.current);
      }
    };
  }, [cameraStream]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      toast({
        title: "전체화면 전환 실패",
        description: "브라우저에서 전체화면을 지원하지 않습니다.",
        variant: "destructive"
      });
    }
  }, [isFullscreen, toast]);

  const toggleOrientation = useCallback(async () => {
    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> };
      if (orientation && typeof orientation.lock === 'function') {
        const currentType = orientation.type;
        if (currentType.includes('portrait')) {
          await orientation.lock('landscape');
        } else {
          await orientation.lock('portrait');
        }
        toast({
          title: "화면 방향 변경",
          description: currentType.includes('portrait') ? "가로 모드로 전환되었습니다." : "세로 모드로 전환되었습니다."
        });
      }
    } catch (error) {
      toast({
        title: "화면 방향 전환 실패",
        description: "전체화면 모드에서만 화면 방향을 변경할 수 있습니다.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const startCameraAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraAnalyzing(true);
      setCameraAnalysisTime(0);
      
      analysisTimerRef.current = setInterval(() => {
        setCameraAnalysisTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "카메라 분석 시작",
        description: "실시간으로 강아지 행동을 분석합니다."
      });
    } catch (error) {
      toast({
        title: "카메라 접근 실패",
        description: "카메라 권한을 허용해주세요.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCameraAnalysis = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (analysisTimerRef.current) {
      clearInterval(analysisTimerRef.current);
    }
    setIsCameraAnalyzing(false);
    toast({
      title: "분석 종료",
      description: `총 ${formatTime(cameraAnalysisTime)} 동안 분석되었습니다.`
    });
  }, [cameraStream, cameraAnalysisTime, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
            <div ref={containerRef} className={`${isFullscreen ? 'bg-white p-4 overflow-auto' : ''}`}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      <span>실시간 분석</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isMobile && (
                        <Button variant="outline" size="sm" onClick={toggleOrientation} title="화면 회전">
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={toggleFullscreen} title={isFullscreen ? "전체화면 종료" : "전체화면"}>
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={realtimeSubTab} onValueChange={setRealtimeSubTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="file" className="flex items-center gap-2">
                        <FileVideo className="w-4 h-4" />
                        <span>파일 분석</span>
                      </TabsTrigger>
                      <TabsTrigger value="camera" className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>카메라 분석</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="file">
                      <FileBasedRealTimeAnalysis />
                    </TabsContent>

                    <TabsContent value="camera" className="space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={isCameraAnalyzing ? stopCameraAnalysis : startCameraAnalysis}
                            variant={isCameraAnalyzing ? "destructive" : "default"}
                            className="flex items-center gap-2"
                          >
                            {isCameraAnalyzing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span>{isCameraAnalyzing ? "분석 중지" : "카메라 분석 시작"}</span>
                          </Button>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-mono">{formatTime(cameraAnalysisTime)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">감도:</span>
                          <div className="w-24">
                            <Slider value={intensityLevel} onValueChange={setIntensityLevel} max={10} min={1} step={1} />
                          </div>
                          <span className="text-sm font-medium w-4">{intensityLevel[0]}</span>
                        </div>
                      </div>

                      {isCameraAnalyzing && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-800">실시간 분석 중...</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Camera className="w-4 h-4 text-blue-500" />
                              <span>카메라 피드</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                              {isCameraAnalyzing ? (
                                <>
                                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                                    LIVE
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-400 text-center p-4">
                                  <Camera className="w-12 h-12 mx-auto mb-3" />
                                  <p className="text-sm">카메라 분석을 시작하려면 위의 버튼을 클릭하세요</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span>실시간 분석 결과</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {isCameraAnalyzing ? (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">AI 분석 중</span>
                                  <Badge variant="secondary" className="text-xs">GPT-4.1</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">감지된 행동</span>
                                  <Badge className="bg-green-100 text-green-800">분석 대기중</Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>활동 수준</span>
                                    <span>분석중...</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>감정 상태</span>
                                    <span>분석중...</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>움직임 패턴</span>
                                    <span>분석중...</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-6 text-gray-400">
                                <Eye className="w-10 h-10 mx-auto mb-2" />
                                <p className="text-sm">카메라 분석을 시작하면 결과가 표시됩니다</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
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
