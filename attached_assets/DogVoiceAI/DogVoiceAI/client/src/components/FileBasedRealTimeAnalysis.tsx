import { useState, useRef, useCallback, useEffect } from "react";
import { analyzeFileMetadata, analyzeImageFrame, analyzeAudioSegment, captureVideoFrame, captureAudioSegment, type DogBehaviorAnalysis } from "@/lib/ai-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MotionAnalysisVisualizer from "./MotionAnalysisVisualizer";
import { 
  Upload,
  Play,
  Pause,
  Square,
  Volume2,
  Eye,
  Brain,
  Activity,
  RotateCcw,
  FileVideo,
  Music
} from "lucide-react";

interface AnalysisFile {
  id: string;
  name: string;
  type: 'video' | 'audio';
  url: string;
  duration: number;
}

type RealTimeResult = DogBehaviorAnalysis;

export default function FileBasedRealTimeAnalysis() {
  const [uploadedFile, setUploadedFile] = useState<AnalysisFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<RealTimeResult[]>([]);
  const [currentResult, setCurrentResult] = useState<RealTimeResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaElementRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // 실제 AI 분석 수행
  const performAIAnalysis = useCallback(async (timestamp: number): Promise<RealTimeResult | null> => {
    if (!uploadedFile || !mediaElementRef.current) return null;

    try {
      if (uploadedFile.type === 'video') {
        // 비디오 프레임 캡처 및 분석
        const frameBlob = await captureVideoFrame(mediaElementRef.current as HTMLVideoElement);
        return await analyzeImageFrame(frameBlob, timestamp);
      } else {
        // 오디오 세그먼트 분석
        const audioBlob = await captureAudioSegment(
          mediaElementRef.current as HTMLAudioElement,
          timestamp - 2, // 2초 전부터
          2 // 2초 길이
        );
        return await analyzeAudioSegment(audioBlob, timestamp, 2);
      }
    } catch (error) {
      console.error('AI 분석 오류:', error);
      toast({
        title: "분석 오류",
        description: "AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
      return null;
    }
  }, [uploadedFile, toast]);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!isVideo && !isAudio) {
      toast({
        title: "지원하지 않는 파일 형식",
        description: "동영상 또는 음성 파일만 업로드할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(file);
    const tempMedia = document.createElement(isVideo ? 'video' : 'audio') as HTMLVideoElement | HTMLAudioElement;

    tempMedia.addEventListener('loadedmetadata', () => {
      const analysisFile: AnalysisFile = {
        id: Date.now().toString(),
        name: file.name,
        type: isVideo ? 'video' : 'audio',
        url,
        duration: tempMedia.duration
      };

      setUploadedFile(analysisFile);
      setAnalysisResults([]);
      setCurrentResult(null);
      setCurrentTime(0);

      // 파일 메타데이터 분석
      analyzeFileMetadata(file.name, isVideo ? 'video' : 'audio', tempMedia.duration)
        .then(metadata => {
          console.log('파일 메타데이터 분석 완료:', metadata);
        })
        .catch(error => {
          console.error('메타데이터 분석 오류:', error);
        });

      toast({
        title: "파일 업로드 완료",
        description: "AI 분석 준비가 완료되었습니다."
      });
    });

    tempMedia.src = url;
  }, [toast]);

  const startAnalysis = useCallback(() => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setAnalysisResults([]);
    setCurrentTime(0);

    // 미디어 재생 시작
    if (mediaElementRef.current) {
      mediaElementRef.current.currentTime = 0;
      mediaElementRef.current.play();
    }

    // 실시간 분석 시뮬레이션
    analysisIntervalRef.current = setInterval(() => {
      const currentMediaTime = mediaElementRef.current?.currentTime || 0;
      setCurrentTime(currentMediaTime);

      // 매 5초마다 AI 분석 수행 (API 부하 감소)
      if (Math.floor(currentMediaTime) % 5 === 0 && currentMediaTime > 0) {
        performAIAnalysis(currentMediaTime).then(result => {
          if (result) {
            setCurrentResult(result);
            setAnalysisResults(prev => [...prev, result]);
          }
        }).catch(error => {
          console.error('분석 실행 오류:', error);
        });
      }

      // 미디어 종료 확인
      if (mediaElementRef.current?.ended) {
        setIsAnalyzing(false);
        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
        }
        toast({
          title: "분석 완료",
          description: "파일 분석이 완료되었습니다."
        });
      }
    }, 1000); // 1초마다 업데이트
  }, [uploadedFile, performAIAnalysis, toast]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    if (mediaElementRef.current) {
      mediaElementRef.current.pause();
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    stopAnalysis();
    setAnalysisResults([]);
    setCurrentResult(null);
    setCurrentTime(0);
    if (mediaElementRef.current) {
      mediaElementRef.current.currentTime = 0;
    }
  }, [stopAnalysis]);

  // 클린업
  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      if (uploadedFile) {
        URL.revokeObjectURL(uploadedFile.url);
      }
    };
  }, [uploadedFile]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>파일 기반 실시간 분석</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            동영상 또는 음성 파일을 업로드하여 실시간 행동 및 음성 분석을 수행합니다
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 파일 업로드 */}
          {!uploadedFile && (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                파일을 업로드하세요
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                동영상 (MP4, AVI, MOV) 또는 음성 파일 (MP3, WAV, M4A)
              </p>
              <Button variant="outline">
                파일 선택
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          {/* 업로드된 파일 정보 */}
          {uploadedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {uploadedFile.type === 'video' ? (
                    <FileVideo className="w-8 h-8 text-blue-600" />
                  ) : (
                    <Music className="w-8 h-8 text-green-600" />
                  )}
                  <div>
                    <h4 className="font-medium">{uploadedFile.name}</h4>
                    <p className="text-sm text-gray-500">
                      재생 시간: {formatTime(uploadedFile.duration)}
                    </p>
                  </div>
                </div>

                <Button 
                  variant="ghost"
                  onClick={() => {
                    URL.revokeObjectURL(uploadedFile.url);
                    setUploadedFile(null);
                    stopAnalysis();
                  }}
                >
                  제거
                </Button>
              </div>

              {/* 미디어 플레이어 */}
              <div className="space-y-4">
                {uploadedFile.type === 'video' ? (
                  <video
                    ref={mediaElementRef as React.RefObject<HTMLVideoElement>}
                    src={uploadedFile.url}
                    className="w-full max-h-64 rounded-lg"
                    controls={false}
                  />
                ) : (
                  <div className="bg-gray-900 text-white rounded-lg p-8 text-center">
                    <Volume2 className="w-16 h-16 mx-auto mb-4" />
                    <p>음성 파일 재생 중...</p>
                    <audio
                      ref={mediaElementRef as React.RefObject<HTMLAudioElement>}
                      src={uploadedFile.url}
                      className="hidden"
                    />
                  </div>
                )}

                {/* 진행률 바 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(uploadedFile.duration)}</span>
                  </div>
                  <Progress 
                    value={(currentTime / uploadedFile.duration) * 100} 
                    className="w-full" 
                  />
                </div>

                {/* 제어 버튼 */}
                <div className="flex justify-center space-x-2">
                  {!isAnalyzing ? (
                    <Button onClick={startAnalysis} className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>실시간 분석 시작</span>
                    </Button>
                  ) : (
                    <Button onClick={stopAnalysis} variant="destructive" className="flex items-center space-x-2">
                      <Square className="w-4 h-4" />
                      <span>분석 중지</span>
                    </Button>
                  )}

                  <Button onClick={resetAnalysis} variant="outline" className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>처음부터</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 실시간 분석 결과 */}
      {isAnalyzing && currentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-red-500" />
              <span>실시간 분석 결과</span>
              <Badge variant="secondary" className="ml-auto">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="behavior" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="behavior">행동 분석</TabsTrigger>
                <TabsTrigger value="emotion">감정 상태</TabsTrigger>
                <TabsTrigger value="motion">모션 분석</TabsTrigger>
                <TabsTrigger value="audio">음성 분석</TabsTrigger>
              </TabsList>

              <TabsContent value="behavior" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">감지된 행동</h4>
                    <p className="text-2xl font-bold text-blue-600">{currentResult.behavior}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">신뢰도</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(currentResult.confidence * 100)}%
                    </p>
                  </div>
                </div>

                {currentResult.bodyLanguage && (
                  <div className="space-y-2">
                    <h4 className="font-medium">신체 언어</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="font-medium">꼬리:</span>
                        <span className="ml-2">{currentResult.bodyLanguage.tail}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="font-medium">귀:</span>
                        <span className="ml-2">{currentResult.bodyLanguage.ears}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="font-medium">자세:</span>
                        <span className="ml-2">{currentResult.bodyLanguage.posture}</span>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="emotion" className="space-y-4">
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Eye className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                  <h4 className="font-medium text-purple-900 mb-2">현재 감정 상태</h4>
                  <p className="text-3xl font-bold text-purple-600">{currentResult.emotion}</p>
                  <p className="text-sm text-purple-700 mt-2">
                    시간: {formatTime(currentResult.timestamp)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="motion" className="space-y-4">
                {currentResult.motionAnalysis ? (
                  <MotionAnalysisVisualizer 
                    motionAnalysis={currentResult.motionAnalysis}
                    imageUrl={uploadedFile?.url}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4" />
                    <p>모션 분석 데이터를 기다리는 중...</p>
                  </div>
                )}
              </TabsContent>

              {currentResult.audioFeatures && (
                <TabsContent value="audio" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900">주파수</h4>
                      <p className="text-2xl font-bold text-orange-600">
                        {currentResult.audioFeatures.frequency}Hz
                      </p>
                    </div>
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-medium text-teal-900">음량</h4>
                      <p className="text-2xl font-bold text-teal-600">
                        {Math.round(currentResult.audioFeatures.amplitude * 100)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-medium text-indigo-900">음조</h4>
                      <p className="text-2xl font-bold text-indigo-600">
                        {currentResult.audioFeatures.pitch}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* 분석 기록 */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>분석 기록 ({analysisResults.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analysisResults.reverse().map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono text-gray-500">
                      {formatTime(result.timestamp)}
                    </span>
                    <Badge variant="outline">{result.behavior}</Badge>
                    <Badge variant="secondary">{result.emotion}</Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(result.confidence * 100)}% 신뢰도
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}