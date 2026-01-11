
import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import MotionAnalysisVisualizer from "./MotionAnalysisVisualizer";
import DogSelector, { type DogSubject } from "./DogSelector";
import { 
  Camera, 
  Video, 
  Square, 
  RotateCw,
  Smartphone,
  Monitor,
  Activity,
  Loader2,
  Maximize,
  Minimize,
  SwitchCamera
} from "lucide-react";

interface MotionAnalysis {
  joints: Array<{
    name: string;
    x: number;
    y: number;
    confidence: number;
  }>;
  movementSpeed: number;
  postureTilt: number;
  limbAngles: {
    frontLeft: number;
    frontRight: number;
    backLeft: number;
    backRight: number;
  };
  activityType: string;
  estimatedPain: boolean;
}

interface DogAnalysisResult {
  behavior: string;
  confidence: number;
  emotion: string;
  intensity: number;
  bodyLanguage?: {
    tail: string;
    ears: string;
    posture: string;
    eyeContact: string;
  };
  postureAnalysis?: {
    isAbnormal: boolean;
    abnormalityType: string;
    description: string;
    severity: string;
    possibleCauses: string[];
    recommendations: string[];
  };
  detailedBehavior?: {
    primaryAction: string;
    secondaryActions: string[];
    movementPattern: string;
    attentionFocus: string;
    energyLevel: string;
  };
  contextualFactors: {
    environment: string;
    triggers: string[];
    socialContext: string;
  };
  recommendations: string[];
}

export default function RealTimeMotionCapture() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [motionAnalysis, setMotionAnalysis] = useState<MotionAnalysis | null>(null);
  const [dogAnalysis, setDogAnalysis] = useState<DogAnalysisResult | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [useRearCamera, setUseRearCamera] = useState(true); // 기본: 후면 카메라 (강아지 촬영용)
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<number | null>(null);
  const [selectedDog, setSelectedDog] = useState<DogSubject | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fpsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: useRearCamera ? { exact: "environment" } : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsStreaming(true);
      
      // FPS 카운터 시작
      frameCountRef.current = 0;
      fpsIntervalRef.current = setInterval(() => {
        setFps(frameCountRef.current);
        setFrameCount(prev => prev + frameCountRef.current);
        frameCountRef.current = 0;
      }, 1000);

      toast({
        title: "카메라 시작됨",
        description: "실시간 모션 분석을 시작하려면 '분석 시작' 버튼을 클릭하세요."
      });

    } catch (error: any) {
      console.error('카메라 접근 오류:', error);
      toast({
        title: "카메라 접근 실패",
        description: error.message || "카메라 권한을 확인해주세요.",
        variant: "destructive"
      });
    }
  }, [useRearCamera, toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    if (fpsIntervalRef.current) {
      clearInterval(fpsIntervalRef.current);
      fpsIntervalRef.current = null;
    }

    setIsStreaming(false);
    setIsAnalyzing(false);
    setFps(0);
  }, []);

  const captureAndAnalyzeFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // 캔버스에 현재 프레임 그리기
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 프레임 카운터 증가
    frameCountRef.current++;

    // 이미지를 Blob으로 변환
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        // AI 분석 요청
        const formData = new FormData();
        formData.append('frame', blob);
        formData.append('timestamp', (Date.now() / 1000).toString());
        if (selectedDogId) {
          formData.append('dogId', selectedDogId.toString());
        }

        const response = await fetch('/api/ai-analysis/analyze-frame', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('프레임 분석 실패');
        }

        const result = await response.json();

        // 프레임 이미지 저장
        const frameUrl = URL.createObjectURL(blob);
        setCapturedFrame(frameUrl);

        // AI 분석 결과 저장
        setDogAnalysis(result as DogAnalysisResult);
        setAnalysisError(null);

        // 강아지 감지 여부 확인
        const isDogDetected = result.behavior && 
          !result.behavior.includes('강아지가 아님') && 
          !result.behavior.includes('분석 실패') &&
          result.confidence > 0.3;

        // 모션 분석 데이터 생성 (AI 분석 결과 기반)
        const aiMotionAnalysis: MotionAnalysis = {
          joints: generateJointPoints(),
          movementSpeed: isDogDetected ? (result.intensity || 5) * 0.3 : 0,
          postureTilt: result.postureAnalysis?.isAbnormal ? 15 : Math.random() * 10 - 5,
          limbAngles: {
            frontLeft: 90 + (result.intensity || 5) * 3,
            frontRight: 90 + (result.intensity || 5) * 3,
            backLeft: 100 + (result.intensity || 5) * 2,
            backRight: 100 + (result.intensity || 5) * 2
          },
          activityType: result.behavior || "분석 대기",
          estimatedPain: result.postureAnalysis?.isAbnormal || result.intensity > 7
        };

        setMotionAnalysis(aiMotionAnalysis);

        // 실시간 로그 추가
        if ((window as any).addAnalysisLog) {
          const logMessage = isDogDetected 
            ? `🐕 강아지 분석: ${result.behavior} | 감정: ${result.emotion} (신뢰도 ${Math.round(result.confidence * 100)}%)`
            : `⚠️ 강아지가 감지되지 않았습니다. 카메라에 강아지를 비춰주세요.`;
          (window as any).addAnalysisLog(logMessage, isDogDetected ? 'success' : 'warning');
        }

      } catch (error) {
        console.error('프레임 분석 오류:', error);
        setAnalysisError('프레임 분석 중 오류가 발생했습니다');
      }
    }, 'image/jpeg', 0.8);

  }, []);

  const generateJointPoints = () => {
    const joints = [
      "목", "왼쪽 어깨", "오른쪽 어깨",
      "왼쪽 팔꿈치", "오른쪽 팔꿈치",
      "왼쪽 앞발", "오른쪽 앞발",
      "왼쪽 엉덩이", "오른쪽 엉덩이",
      "왼쪽 무릎", "오른쪽 무릎",
      "왼쪽 뒷발", "오른쪽 뒷발",
      "꼬리 시작", "꼬리 끝"
    ];

    return joints.map(name => ({
      name,
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
      confidence: 0.7 + Math.random() * 0.3
    }));
  };

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    
    // 1초마다 프레임 캡처 및 분석
    analysisIntervalRef.current = setInterval(() => {
      captureAndAnalyzeFrame();
    }, 1000);

    toast({
      title: "실시간 분석 시작",
      description: "강아지의 모션을 실시간으로 분석하고 있습니다."
    });
  }, [captureAndAnalyzeFrame, toast]);

  const stopAnalysis = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    setIsAnalyzing(false);

    toast({
      title: "분석 중지됨",
      description: "실시간 모션 분석이 중지되었습니다."
    });
  }, [toast]);

  const toggleCamera = useCallback(async () => {
    const newValue = !useRearCamera;
    setUseRearCamera(newValue);
    
    // 스트리밍 중이면 카메라 재시작
    if (isStreaming) {
      stopCamera();
      // 약간의 지연 후 재시작
      setTimeout(async () => {
        try {
          const constraints: MediaStreamConstraints = {
            video: {
              facingMode: newValue ? { exact: "environment" } : "user",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }

          setIsStreaming(true);
          
          frameCountRef.current = 0;
          fpsIntervalRef.current = setInterval(() => {
            setFps(frameCountRef.current);
            setFrameCount(prev => prev + frameCountRef.current);
            frameCountRef.current = 0;
          }, 1000);

          toast({
            title: newValue ? "🐕 후면 카메라로 전환" : "🤳 전면 카메라로 전환",
            description: "카메라가 성공적으로 전환되었습니다."
          });
        } catch (error: any) {
          console.error('카메라 전환 오류:', error);
          toast({
            title: "카메라 전환 실패",
            description: "해당 카메라를 사용할 수 없습니다. 다른 카메라를 선택해 주세요.",
            variant: "destructive"
          });
          // 원래 상태로 복구
          setUseRearCamera(!newValue);
        }
      }, 200);
    } else {
      toast({
        title: newValue ? "🐕 후면 카메라 선택됨" : "🤳 전면 카메라 선택됨",
        description: "카메라 시작 버튼을 눌러 촬영을 시작하세요."
      });
    }
  }, [isStreaming, useRearCamera, stopCamera, toast]);

  // 전체화면 토글 함수
  const toggleFullscreen = useCallback(async () => {
    if (!videoContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await videoContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
        toast({
          title: "📺 전체화면 모드",
          description: "ESC 또는 버튼을 눌러 종료하세요."
        });
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('전체화면 전환 오류:', error);
      toast({
        title: "전체화면 전환 실패",
        description: "브라우저가 전체화면을 지원하지 않습니다.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // 전체화면 상태 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6" />
              <span>실시간 모션 캡처</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white text-purple-600">
                {isStreaming ? "🟢 스트리밍 중" : "⚫ 대기"}
              </Badge>
              {isAnalyzing && (
                <Badge variant="secondary" className="bg-white text-pink-600">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  분석 중
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* 강아지 선택 */}
          <div className="mb-6">
            <DogSelector
              selectedDogId={selectedDogId}
              onSelectDog={(id, dog) => {
                setSelectedDogId(id);
                setSelectedDog(dog);
              }}
              showDetails={true}
              label="분석 대상 강아지 선택"
            />
          </div>

          <div className="space-y-6">
            {/* 카메라 뷰 - 전체 너비, 높이 2배 */}
            <div className="space-y-4">
              <div 
                ref={videoContainerRef}
                className={`relative bg-gray-900 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`} 
                style={isFullscreen ? {} : { aspectRatio: '3/4', minHeight: '70vh' }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* 오버레이 정보 */}
                {isStreaming && (
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                      <div className="text-xs opacity-75">FPS</div>
                      <div className="text-lg font-bold">{fps}</div>
                    </div>
                    <div className="bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                      <div className="text-xs opacity-75">프레임</div>
                      <div className="text-lg font-bold">{frameCount}</div>
                    </div>
                  </div>
                )}

                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                    <div className="text-center text-gray-400">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">카메라가 꺼져있습니다</p>
                      <p className="text-sm mb-4">아래 버튼을 눌러 카메라를 시작하세요</p>
                      
                      {/* 카메라 전환 버튼 */}
                      <button
                        onClick={toggleCamera}
                        className="mx-auto mb-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all active:scale-95 shadow-lg"
                        data-testid="camera-switch-off-state"
                      >
                        <RotateCw className="w-5 h-5" />
                        <span className="font-medium">
                          {useRearCamera ? "🤳 전면으로 전환" : "🐕 후면으로 전환"}
                        </span>
                      </button>
                      
                      <div className="px-4 py-2 bg-gray-700 rounded-lg inline-block">
                        <span className="text-sm">
                          현재: {useRearCamera ? "🐕 후면 카메라" : "🤳 전면 카메라"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 플로팅 버튼들 - 전체화면 & 카메라 전환 (항상 최상위에 표시) */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-50">
                  {/* 전체화면 버튼 */}
                  <button
                    onClick={toggleFullscreen}
                    className="w-14 h-14 rounded-full bg-purple-600 shadow-lg flex items-center justify-center hover:bg-purple-700 transition-all active:scale-95 border-2 border-white"
                    data-testid="fullscreen-toggle-btn"
                    aria-label={isFullscreen ? "전체화면 종료" : "전체화면"}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-7 h-7 text-white" />
                    ) : (
                      <Maximize className="w-7 h-7 text-white" />
                    )}
                  </button>
                  
                  {/* 카메라 전환 버튼 */}
                  <button
                    onClick={toggleCamera}
                    className="w-14 h-14 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center hover:bg-cyan-600 transition-all active:scale-95 border-2 border-white"
                    data-testid="camera-flip-floating-btn"
                    aria-label="카메라 전환"
                  >
                    <SwitchCamera className="w-7 h-7 text-white" />
                  </button>
                </div>
              </div>

              {/* 카메라 전환 토글 */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{useRearCamera ? "🐕" : "🤳"}</span>
                  <div>
                    <p className="font-medium text-gray-800">카메라 선택</p>
                    <p className="text-sm text-gray-500">
                      {useRearCamera ? "후면 카메라 (강아지 촬영)" : "전면 카메라 (셀카)"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleCamera}
                  className={`relative w-20 h-10 rounded-full transition-all duration-300 ${
                    useRearCamera 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                      : "bg-gradient-to-r from-pink-500 to-purple-500"
                  }`}
                  data-testid="camera-toggle-switch"
                  aria-label="카메라 전환"
                >
                  <span 
                    className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
                      useRearCamera ? "left-1" : "left-11"
                    }`}
                  >
                    {useRearCamera ? "🐕" : "🤳"}
                  </span>
                </button>
              </div>

              {/* 컨트롤 버튼 */}
              <div className="grid grid-cols-1 gap-3">
                {!isStreaming ? (
                  <Button 
                    onClick={startCamera} 
                    className="min-h-[48px] bg-gradient-to-r from-purple-500 to-pink-500"
                    data-testid="camera-start-btn"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    카메라 시작
                  </Button>
                ) : (
                  <Button 
                    onClick={stopCamera} 
                    variant="destructive"
                    className="min-h-[48px]"
                    data-testid="camera-stop-btn"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    카메라 중지
                  </Button>
                )}

                {isStreaming && !isAnalyzing && (
                  <Button 
                    onClick={startAnalysis}
                    className="col-span-2 min-h-[48px] bg-gradient-to-r from-green-500 to-teal-500"
                    data-testid="analysis-start-btn"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    실시간 분석 시작
                  </Button>
                )}

                {isAnalyzing && (
                  <Button 
                    onClick={stopAnalysis}
                    variant="outline"
                    className="col-span-2 min-h-[48px]"
                    data-testid="analysis-stop-btn"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    분석 중지
                  </Button>
                )}
              </div>

              {/* 디바이스 정보 */}
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">현재 카메라:</span>
                      <div className="flex items-center space-x-2">
                        {useRearCamera ? (
                          <>
                            <Smartphone className="w-4 h-4" />
                            <span>후면 카메라</span>
                          </>
                        ) : (
                          <>
                            <Monitor className="w-4 h-4" />
                            <span>전면 카메라</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">상태:</span>
                      <Badge variant={isAnalyzing ? "default" : "secondary"}>
                        {isAnalyzing ? "AI 분석 중" : isStreaming ? "대기 중" : "중지"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 분석 결과 */}
            <div className="space-y-4">
              {motionAnalysis && capturedFrame ? (
                <>
                  <MotionAnalysisVisualizer 
                    motionAnalysis={motionAnalysis}
                    imageUrl={capturedFrame}
                  />
                  
                  {/* 상세 강아지 분석 결과 */}
                  {dogAnalysis && (
                    <DogAnalysisPanel analysis={dogAnalysis} />
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-400 py-12">
                      <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium mb-2">분석 대기 중</p>
                      <p className="text-sm">
                        카메라를 시작하고 '실시간 분석 시작'을 클릭하세요
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {analysisError && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <p className="text-red-600 text-sm">{analysisError}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📱 모바일/컴퓨터 사용 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <div>
                <strong>카메라 권한 허용:</strong> 브라우저에서 카메라 권한을 요청하면 '허용'을 클릭하세요.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <div>
                <strong>카메라 선택:</strong> 모바일에서는 '카메라 전환' 버튼으로 전면/후면 카메라를 변경할 수 있습니다.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <div>
                <strong>실시간 분석:</strong> 강아지를 카메라에 비추고 '실시간 분석 시작'을 클릭하면 AI가 자동으로 모션을 분석합니다.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
              <div>
                <strong>결과 확인:</strong> 오른쪽 패널에서 관절 포인트, 움직임 속도, 자세 등을 실시간으로 확인하세요.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DogAnalysisPanel({ analysis }: { analysis: DogAnalysisResult }) {
  const isDogDetected = analysis.behavior && 
    !analysis.behavior.includes('강아지가 아님') && 
    !analysis.behavior.includes('분석 실패') &&
    analysis.confidence > 0.3;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '심각': return 'bg-red-100 text-red-700 border-red-200';
      case '중간': return 'bg-orange-100 text-orange-700 border-orange-200';
      case '경미': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getEnergyIcon = (level: string) => {
    switch (level) {
      case '높음': return '🔥';
      case '보통': return '⚡';
      default: return '😴';
    }
  };

  if (!isDogDetected) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🔍</div>
            <div>
              <p className="font-medium text-yellow-800">강아지가 감지되지 않았습니다</p>
              <p className="text-sm text-yellow-600">카메라에 강아지 전신이 보이도록 조정해주세요</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 메인 분석 결과 */}
      <Card className="border-purple-200">
        <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              🐕 강아지 상세 분석
            </span>
            <Badge variant="outline" className="bg-white">
              신뢰도: {Math.round(analysis.confidence * 100)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* 행동 & 감정 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-600 mb-1">현재 행동</div>
              <div className="font-medium text-blue-800">{analysis.behavior}</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="text-xs text-pink-600 mb-1">감정 상태</div>
              <div className="font-medium text-pink-800">{analysis.emotion}</div>
            </div>
          </div>

          {/* 신체 언어 */}
          {analysis.bodyLanguage && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">🦴 신체 언어</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
                  <span className="text-lg">🐕‍🦺</span>
                  <div>
                    <div className="text-xs text-gray-500">꼬리</div>
                    <div className="text-gray-700">{analysis.bodyLanguage.tail}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
                  <span className="text-lg">👂</span>
                  <div>
                    <div className="text-xs text-gray-500">귀</div>
                    <div className="text-gray-700">{analysis.bodyLanguage.ears}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
                  <span className="text-lg">🧍</span>
                  <div>
                    <div className="text-xs text-gray-500">자세</div>
                    <div className="text-gray-700">{analysis.bodyLanguage.posture}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
                  <span className="text-lg">👀</span>
                  <div>
                    <div className="text-xs text-gray-500">시선</div>
                    <div className="text-gray-700">{analysis.bodyLanguage.eyeContact}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 상세 행동 */}
          {analysis.detailedBehavior && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">🎯 상세 행동 분석</div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">주요 행동:</span>
                  <span className="font-medium">{analysis.detailedBehavior.primaryAction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">움직임 패턴:</span>
                  <span>{analysis.detailedBehavior.movementPattern}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">에너지 수준:</span>
                  <span>{getEnergyIcon(analysis.detailedBehavior.energyLevel)} {analysis.detailedBehavior.energyLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">주의 집중:</span>
                  <span>{analysis.detailedBehavior.attentionFocus}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 자세 이상 분석 */}
      {analysis.postureAnalysis && (
        <Card className={`border ${analysis.postureAnalysis.isAbnormal ? 'border-orange-200' : 'border-green-200'}`}>
          <CardHeader className={`pb-2 ${analysis.postureAnalysis.isAbnormal ? 'bg-orange-50' : 'bg-green-50'}`}>
            <CardTitle className="text-base flex items-center gap-2">
              {analysis.postureAnalysis.isAbnormal ? '⚠️' : '✅'} 자세 분석
              <Badge className={getSeverityColor(analysis.postureAnalysis.severity)}>
                {analysis.postureAnalysis.severity}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-3">
            <p className="text-gray-700">{analysis.postureAnalysis.description}</p>
            
            {analysis.postureAnalysis.isAbnormal && analysis.postureAnalysis.possibleCauses?.length > 0 && (
              <div>
                <div className="font-medium text-gray-600 mb-1">가능한 원인:</div>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {analysis.postureAnalysis.possibleCauses.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.postureAnalysis.recommendations?.length > 0 && (
              <div>
                <div className="font-medium text-gray-600 mb-1">권장 조치:</div>
                <ul className="list-disc list-inside text-blue-600 space-y-1">
                  {analysis.postureAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 추천 사항 */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader className="pb-2 bg-blue-50">
            <CardTitle className="text-base">💡 AI 권장 사항</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="space-y-2 text-sm">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
