import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Video,
  Camera,
  CameraOff,
  Brain,
  Activity,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  Crosshair,
  Eye,
  EyeOff,
  Loader2,
  Maximize,
  Minimize,
  SwitchCamera
} from "lucide-react";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';

interface AnalysisResult {
  behavior: string;
  emotion: string;
  confidence: number;
  bodyLanguage?: {
    posture: string;
    tailPosition?: string;
    earPosition?: string;
    eyeContact?: string;
  };
  recommendations?: string[];
  timestamp: number;
}

interface TrackingPoint {
  x: number;
  y: number;
  label: string;
  confidence: number;
}

interface MotionTrackingData {
  boundingBox?: { x: number; y: number; width: number; height: number };
  keypoints?: TrackingPoint[];
  motionVector?: { dx: number; dy: number };
}

const KEYPOINT_LABELS: Record<string, string> = {
  'nose': '코',
  'left_eye': '왼눈',
  'right_eye': '오른눈',
  'left_ear': '왼귀',
  'right_ear': '오른귀',
  'left_shoulder': '왼어깨',
  'right_shoulder': '오른어깨',
  'left_elbow': '왼팔꿈치',
  'right_elbow': '오른팔꿈치',
  'left_wrist': '왼손목',
  'right_wrist': '오른손목',
  'left_hip': '왼엉덩이',
  'right_hip': '오른엉덩이',
  'left_knee': '왼무릎',
  'right_knee': '오른무릎',
  'left_ankle': '왼발목',
  'right_ankle': '오른발목'
};

const SKELETON_CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2],
  [1, 3], [2, 4],
  [5, 6],
  [5, 7], [7, 9],
  [6, 8], [8, 10],
  [5, 11], [6, 12],
  [11, 12],
  [11, 13], [13, 15],
  [12, 14], [14, 16]
];

export default function RealTimeMotionAnalysis() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [motionTracking, setMotionTracking] = useState<MotionTrackingData | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [motionHistory, setMotionHistory] = useState<{x: number; y: number; time: number}[]>([]);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [fps, setFps] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useRearCamera, setUseRearCamera] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const dogDetectorRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const prevKeypointsRef = useRef<poseDetection.Keypoint[] | null>(null);
  const smoothedKeypointsRef = useRef<poseDetection.Keypoint[] | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const SMOOTHING_FACTOR = 0.3;

  const initializeTensorFlow = useCallback(async () => {
    if (modelLoaded || modelLoading) return;
    
    setModelLoading(true);
    console.log("TensorFlow.js 초기화 시작...");
    
    try {
      console.log("WebGL 백엔드 설정 중...");
      await tf.setBackend('webgl');
      await tf.ready();
      console.log("TensorFlow.js 백엔드 준비 완료:", tf.getBackend());
      
      // COCO-SSD 모델 로딩 (강아지 감지용)
      console.log("COCO-SSD 객체 감지 모델 로딩 중...");
      const dogDetector = await cocoSsd.load({
        base: 'lite_mobilenet_v2'
      });
      dogDetectorRef.current = dogDetector;
      console.log("COCO-SSD 모델 로딩 완료!");
      
      // MoveNet 다중 포즈 모델 로딩 (보조용)
      console.log("MoveNet 다중 포즈 모델 로딩 중...");
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING
        }
      );
      
      console.log("MoveNet 다중 포즈 모델 로딩 완료!");
      detectorRef.current = detector;
      setModelLoaded(true);
      
      toast({
        title: "AI 모델 로딩 완료",
        description: "강아지 감지 모델이 준비되었습니다. 강아지를 우선적으로 감지합니다."
      });
    } catch (err) {
      console.error("TensorFlow.js 초기화 오류:", err);
      setError("AI 모델을 로드할 수 없습니다: " + (err instanceof Error ? err.message : String(err)));
      toast({
        title: "모델 로딩 실패",
        description: "TensorFlow.js 초기화에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setModelLoading(false);
    }
  }, [modelLoaded, modelLoading, toast]);

  const detectPose = useCallback(async () => {
    if (!dogDetectorRef.current) {
      console.log("강아지 감지기 없음");
      return;
    }
    if (!videoRef.current) {
      console.log("비디오 없음");
      return;
    }
    if (!overlayCanvasRef.current) {
      console.log("캔버스 없음");
      return;
    }
    
    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.log("컨텍스트 없음");
      return;
    }
    
    if (video.readyState < 2) {
      console.log("비디오 준비 안됨:", video.readyState);
      return;
    }
    
    const rect = video.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    try {
      // COCO-SSD로 객체 감지 (강아지 우선)
      const predictions = await dogDetectorRef.current.detect(video);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!trackingEnabled) return;
      
      const scaleX = rect.width / video.videoWidth;
      const scaleY = rect.height / video.videoHeight;
      
      // 동물/강아지 관련 클래스 필터링
      const animalClasses = ['dog', 'cat', 'bird', 'horse', 'sheep', 'cow', 'bear'];
      const dogPredictions = predictions.filter(p => animalClasses.includes(p.class));
      const personPredictions = predictions.filter(p => p.class === 'person');
      
      // 강아지가 감지되면 강아지만 표시, 없으면 다른 객체도 표시
      const targetPredictions = dogPredictions.length > 0 ? dogPredictions : predictions.filter(p => p.class !== 'person');
      
      const colors = ['#00ff00', '#00ffff', '#ff00ff', '#ffff00', '#ff8800'];
      
      // 강아지/동물 바운딩 박스 그리기
      targetPredictions.forEach((prediction, index) => {
        const [x, y, width, height] = prediction.bbox;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;
        
        const color = colors[index % colors.length];
        const confidence = Math.round(prediction.score * 100);
        
        // 바운딩 박스 그리기
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        
        // 라벨 배경
        const labelMap: Record<string, string> = {
          'dog': '🐕 강아지',
          'cat': '🐈 고양이',
          'bird': '🐦 새',
          'horse': '🐴 말',
          'sheep': '🐑 양',
          'cow': '🐄 소',
          'bear': '🐻 곰'
        };
        const label = `${labelMap[prediction.class] || prediction.class} ${confidence}%`;
        
        ctx.fillStyle = color;
        const labelWidth = ctx.measureText(label).width + 20;
        ctx.fillRect(scaledX, scaledY - 30, labelWidth, 28);
        
        // 라벨 텍스트
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(label, scaledX + 8, scaledY - 10);
        
        // 중심점 표시
        const centerX = scaledX + scaledWidth / 2;
        const centerY = scaledY + scaledHeight / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });
      
      // 감지된 사람 수 표시 (별도로)
      if (personPredictions.length > 0 && dogPredictions.length > 0) {
        ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.fillRect(10, 10, 150, 28);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`👤 사람 ${personPredictions.length}명 감지`, 18, 30);
      }
      
      // 첫 번째 강아지에 대한 모션 히스토리 추적
      if (targetPredictions.length > 0) {
        const firstPrediction = targetPredictions[0];
        const [x, y, width, height] = firstPrediction.bbox;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;
        
        const centerX = scaledX + scaledWidth / 2;
        const centerY = scaledY + scaledHeight / 2;
        
        setMotionHistory(prev => {
          const newHistory = [...prev, { x: centerX, y: centerY, time: Date.now() }];
          return newHistory.slice(-30);
        });
        
        setMotionTracking({
          boundingBox: {
            x: scaledX,
            y: scaledY,
            width: scaledWidth,
            height: scaledHeight
          },
          keypoints: [{
            x: centerX,
            y: centerY,
            label: firstPrediction.class === 'dog' ? '강아지 중심' : firstPrediction.class,
            confidence: firstPrediction.score
          }],
          motionVector: { dx: 0, dy: 0 }
        });
        
        // 모션 경로 그리기
        if (motionHistory.length > 1) {
          ctx.beginPath();
          ctx.moveTo(motionHistory[0].x, motionHistory[0].y);
          
          for (let i = 1; i < motionHistory.length; i++) {
            const alpha = i / motionHistory.length;
            ctx.strokeStyle = `rgba(255, 165, 0, ${alpha})`;
            ctx.lineWidth = 2 + alpha * 3;
            ctx.lineTo(motionHistory[i].x, motionHistory[i].y);
          }
          ctx.stroke();
        }
      } else {
        setMotionTracking(null);
      }
      
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastFrameTimeRef.current >= 1000) {
        setFps(Math.round(frameCountRef.current * 1000 / (now - lastFrameTimeRef.current)));
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }
      
    } catch (err) {
      console.error("포즈 감지 오류:", err);
    }
  }, [trackingEnabled, motionHistory]);

  const runPoseDetectionLoop = useCallback(() => {
    if (!isStreaming || !trackingEnabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    detectPose();
    animationFrameRef.current = requestAnimationFrame(runPoseDetectionLoop);
  }, [isStreaming, trackingEnabled, detectPose]);

  useEffect(() => {
    if (isStreaming && trackingEnabled && modelLoaded) {
      runPoseDetectionLoop();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isStreaming, trackingEnabled, modelLoaded, runPoseDetectionLoop]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      if (!modelLoaded) {
        await initializeTensorFlow();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsStreaming(true);
      lastFrameTimeRef.current = performance.now();
      
      toast({
        title: "카메라 시작",
        description: "AI 포즈 감지가 활성화되었습니다."
      });
    } catch (err) {
      console.error("카메라 접근 오류:", err);
      setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
      toast({
        title: "카메라 오류",
        description: "카메라에 접근할 수 없습니다.",
        variant: "destructive"
      });
    }
  }, [toast, modelLoaded, initializeTensorFlow]);

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsAnalyzing(false);
    setIsPaused(false);
    setMotionTracking(null);
    setMotionHistory([]);
    setFps(0);

    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  }, []);

  // 전체화면 토글 함수 (모바일 호환)
  const toggleFullscreen = useCallback(async () => {
    // CSS 기반 전체화면 토글 (모바일 호환)
    setIsFullscreen(prev => {
      const newValue = !prev;
      if (newValue) {
        // 전체화면 진입 시 스크롤 방지
        document.body.style.overflow = 'hidden';
        toast({
          title: "📺 전체화면 모드",
          description: "버튼을 눌러 종료하세요."
        });
      } else {
        // 전체화면 종료 시 스크롤 복원
        document.body.style.overflow = '';
      }
      return newValue;
    });
    
    // 네이티브 전체화면 API도 시도 (데스크탑용)
    if (videoContainerRef.current) {
      try {
        if (!document.fullscreenElement && !isFullscreen) {
          await videoContainerRef.current.requestFullscreen?.();
        } else if (document.fullscreenElement) {
          await document.exitFullscreen?.();
        }
      } catch (error) {
        // 모바일에서는 실패할 수 있음 - CSS 전체화면으로 대체됨
        console.log('네이티브 전체화면 미지원, CSS 전체화면 사용');
      }
    }
  }, [toast, isFullscreen]);

  // 카메라 전환 함수
  const toggleCamera = useCallback(async () => {
    const newValue = !useRearCamera;
    setUseRearCamera(newValue);

    if (isStreaming) {
      stopCamera();
      setTimeout(async () => {
        try {
          // 먼저 ideal 모드로 시도
          let constraints: MediaStreamConstraints = {
            video: {
              facingMode: newValue ? "environment" : "user",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          };
          
          let stream: MediaStream;
          try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
          } catch (firstError) {
            // ideal 모드 실패 시 exact 모드 시도
            console.log('ideal 모드 실패, exact 모드 시도:', firstError);
            constraints = {
              video: {
                facingMode: { exact: newValue ? "environment" : "user" },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
          }
          
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          setIsStreaming(true);
          toast({
            title: newValue ? "🐕 후면 카메라" : "🤳 전면 카메라",
            description: "카메라가 전환되었습니다."
          });
        } catch (error) {
          console.error('카메라 전환 오류:', error);
          toast({
            title: "카메라 전환 실패",
            description: "해당 카메라를 사용할 수 없습니다.",
            variant: "destructive"
          });
          setUseRearCamera(!newValue);
        }
      }, 200);
    } else {
      toast({
        title: newValue ? "🐕 후면 카메라 선택됨" : "🤳 전면 카메라 선택됨",
        description: "카메라 시작 버튼을 눌러주세요."
      });
    }
  }, [isStreaming, useRearCamera, stopCamera, toast]);

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

  const analyzeFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isPaused) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0);

    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
      });

      if (!blob) return;

      const formData = new FormData();
      formData.append('frame', blob);
      formData.append('timestamp', Date.now().toString());

      const response = await fetch('/api/ai-analysis/analyze-frame', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('분석 실패');
      }

      const result = await response.json();

      const analysisResult: AnalysisResult = {
        behavior: result.behavior,
        emotion: result.emotion,
        confidence: result.confidence,
        bodyLanguage: result.bodyLanguage,
        recommendations: result.recommendations,
        timestamp: Date.now()
      };

      setCurrentResult(analysisResult);
      setAnalysisResults(prev => [analysisResult, ...prev.slice(0, 9)]);
      setAnalysisCount(prev => prev + 1);

    } catch (err) {
      console.error("분석 오류:", err);
    }
  }, [isPaused]);

  const startAnalysis = useCallback(() => {
    if (!isStreaming) return;

    setIsAnalyzing(true);
    setIsPaused(false);

    analyzeFrame();

    analysisIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        analyzeFrame();
      }
    }, 3000);

    toast({
      title: "분석 시작",
      description: "3초마다 실시간 AI 행동 분석을 수행합니다."
    });
  }, [isStreaming, analyzeFrame, isPaused, toast]);

  const pauseAnalysis = useCallback(() => {
    setIsPaused(true);
    toast({
      title: "분석 일시정지",
      description: "분석이 일시정지되었습니다."
    });
  }, [toast]);

  const resumeAnalysis = useCallback(() => {
    setIsPaused(false);
    toast({
      title: "분석 재개",
      description: "분석을 재개합니다."
    });
  }, [toast]);

  const stopAnalysis = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    setIsAnalyzing(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, [stopCamera]);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      '행복': 'bg-yellow-100 text-yellow-800',
      '즐거움': 'bg-green-100 text-green-800',
      '편안함': 'bg-blue-100 text-blue-800',
      '호기심': 'bg-purple-100 text-purple-800',
      '불안': 'bg-orange-100 text-orange-800',
      '경계': 'bg-red-100 text-red-800',
      '피로': 'bg-gray-100 text-gray-800'
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Camera className="w-6 h-6" />
            <span>실시간 AI 포즈 감지</span>
            {modelLoading && (
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                모델 로딩 중
              </Badge>
            )}
            {isStreaming && fps > 0 && (
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                {fps} FPS
              </Badge>
            )}
            {isAnalyzing && !isPaused && (
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white animate-pulse">
                분석 중
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div 
                ref={videoContainerRef}
                className={`relative bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 ${
                  isFullscreen 
                    ? 'fixed inset-0 z-[9999] rounded-none w-screen h-screen' 
                    : 'aspect-video'
                }`}
                style={isFullscreen ? { 
                  position: 'fixed', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  width: '100vw', 
                  height: '100vh',
                  zIndex: 9999
                } : {}}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {isStreaming && (
                  <canvas 
                    ref={overlayCanvasRef} 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      zIndex: 100,
                      width: '100%',
                      height: '100%',
                      border: trackingEnabled ? '3px solid #00ff00' : 'none'
                    }}
                  />
                )}

                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">카메라가 꺼져 있습니다</p>
                      <p className="text-sm text-gray-400 mt-2">
                        아래 버튼을 눌러 카메라를 시작하세요
                      </p>
                    </div>
                  </div>
                )}

                {isStreaming && trackingEnabled && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm">
                    <Crosshair className="w-4 h-4 animate-pulse" />
                    <span>AI 포즈 감지 활성화</span>
                  </div>
                )}

                {isStreaming && isAnalyzing && !isPaused && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                )}

                {currentResult && isStreaming && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg" style={{ zIndex: 20 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold">{currentResult.behavior}</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-0.5 rounded ${getEmotionColor(currentResult.emotion)}`}>
                          {currentResult.emotion}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {Math.round(currentResult.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                )}

                {/* 전체화면 종료 버튼 (전체화면 모드에서만 표시) */}
                {isFullscreen && (
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500 shadow-lg flex items-center justify-center hover:bg-red-600 transition-all active:scale-95 z-[10000]"
                    data-testid="fullscreen-exit-btn"
                    aria-label="전체화면 종료"
                  >
                    <Minimize className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Crosshair className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium">AI 포즈 트래킹</span>
                  {modelLoaded && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      MoveNet 준비됨
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {/* 전체화면 버튼 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="bg-purple-100 hover:bg-purple-200 border-purple-300"
                    data-testid="button-fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Maximize className="w-4 h-4 text-purple-600" />
                    )}
                  </Button>
                  
                  {/* 카메라 전환 버튼 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleCamera}
                    className="bg-cyan-100 hover:bg-cyan-200 border-cyan-300"
                    data-testid="button-switch-camera"
                  >
                    <SwitchCamera className="w-4 h-4 text-cyan-600" />
                  </Button>
                  
                  {/* 트래킹 토글 버튼 */}
                  <Button
                    variant={trackingEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTrackingEnabled(!trackingEnabled);
                      if (trackingEnabled) {
                        setMotionTracking(null);
                        setMotionHistory([]);
                      }
                    }}
                    data-testid="button-toggle-tracking"
                  >
                    {trackingEnabled ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        켜짐
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        꺼짐
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isStreaming ? (
                  <Button 
                    onClick={startCamera} 
                    className="flex-1"
                    disabled={modelLoading}
                    data-testid="button-start-camera"
                  >
                    {modelLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        모델 로딩 중...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        카메라 시작
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={stopCamera} 
                    variant="destructive" 
                    className="flex-1"
                    data-testid="button-stop-camera"
                  >
                    <CameraOff className="w-4 h-4 mr-2" />
                    카메라 중지
                  </Button>
                )}

                {isStreaming && !isAnalyzing && (
                  <Button 
                    onClick={startAnalysis} 
                    variant="secondary" 
                    className="flex-1"
                    data-testid="button-start-analysis"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    행동 분석 시작
                  </Button>
                )}

                {isAnalyzing && (
                  <>
                    {isPaused ? (
                      <Button 
                        onClick={resumeAnalysis} 
                        variant="secondary"
                        data-testid="button-resume-analysis"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        재개
                      </Button>
                    ) : (
                      <Button 
                        onClick={pauseAnalysis} 
                        variant="secondary"
                        data-testid="button-pause-analysis"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        일시정지
                      </Button>
                    )}
                    <Button 
                      onClick={stopAnalysis} 
                      variant="outline"
                      data-testid="button-stop-analysis"
                    >
                      분석 중지
                    </Button>
                  </>
                )}
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span>실시간 포즈 정보</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {motionTracking && motionTracking.keypoints ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-500">감지된 관절:</span>
                          <span className="ml-2 font-medium">
                            {motionTracking.keypoints.filter(k => k.confidence > 0.3).length} / 17
                          </span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-500">평균 신뢰도:</span>
                          <span className="ml-2 font-medium">
                            {Math.round(
                              motionTracking.keypoints
                                .filter(k => k.confidence > 0.3)
                                .reduce((sum, k) => sum + k.confidence, 0) / 
                              Math.max(1, motionTracking.keypoints.filter(k => k.confidence > 0.3).length) * 100
                            )}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {motionTracking.keypoints
                            .filter(k => k.confidence > 0.3)
                            .map((kp, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                                <span>{kp.label}</span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(kp.confidence * 100)}%
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      {isStreaming ? (
                        <p>사람을 감지하지 못했습니다</p>
                      ) : (
                        <p>카메라를 시작하면 포즈 정보가 표시됩니다</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-pink-600" />
                    <span>AI 행동 분석 결과</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResults.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {analysisResults.map((result, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border ${index === 0 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{result.behavior}</span>
                            <Badge className={getEmotionColor(result.emotion)}>
                              {result.emotion}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>신뢰도: {Math.round(result.confidence * 100)}%</span>
                            <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                          </div>
                          {result.recommendations && result.recommendations.length > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              <p className="font-medium">권장사항:</p>
                              <ul className="list-disc list-inside">
                                {result.recommendations.slice(0, 2).map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <p>분석 결과가 없습니다</p>
                      <p className="text-sm mt-1">"행동 분석 시작" 버튼을 눌러 AI 분석을 시작하세요</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>분석 통계</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analysisCount}</div>
                      <div className="text-sm text-gray-600">총 분석 횟수</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analysisResults.length > 0 
                          ? Math.round(analysisResults.reduce((sum, r) => sum + r.confidence, 0) / analysisResults.length * 100)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-600">평균 신뢰도</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
