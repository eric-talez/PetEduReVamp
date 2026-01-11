import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload,
  Video,
  Music,
  FileText,
  X,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Brain,
  Activity,
  Eye,
  AlertTriangle,
  Heart,
  Lightbulb,
  CheckCircle2
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  type: 'video' | 'audio';
  size: number;
  url: string;
  analysisProgress: number;
  analysisResults?: {
    behaviors: Array<{
      type: string;
      confidence: number;
      timeRange: [number, number];
      description: string;
    }>;
    emotions: Array<{
      emotion: string;
      confidence: number;
      timestamp: number;
    }>;
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
    recommendations?: string[];
    audioFeatures?: {
      frequency: number;
      amplitude: number;
      duration: number;
    };
  };
}

// 비디오에서 프레임을 추출하는 헬퍼 함수
async function extractFrameFromVideo(videoUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.muted = true;
    
    video.onloadeddata = () => {
      // 비디오의 1초 지점으로 이동 (또는 처음)
      video.currentTime = Math.min(1, video.duration / 2);
    };
    
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/jpeg', 0.9);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
    
    video.load();
  });
}

export default function FileUploadAnalysis() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [analysisInProgress, setAnalysisInProgress] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback((files: FileList | null, type: 'video' | 'audio') => {
    if (!files) return;

    Array.from(files).forEach(file => {
      // 파일 타입 검증
      const isValidType = type === 'video' 
        ? file.type.startsWith('video/')
        : file.type.startsWith('audio/');

      if (!isValidType) {
        toast({
          title: "잘못된 파일 형식",
          description: `${type === 'video' ? '동영상' : '음성'} 파일만 업로드 가능합니다.`,
          variant: "destructive"
        });
        return;
      }

      // 파일 크기 제한 (200MB)
      if (file.size > 200 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "200MB 이하의 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        size: file.size,
        url: fileUrl,
        analysisProgress: 0
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // 자동으로 분석 시작 - 파일 객체를 직접 전달
      startAnalysis(newFile);
    });
  }, [toast]);

  const startAnalysis = useCallback(async (file: UploadedFile) => {
    const fileId = file.id;
    setAnalysisInProgress(fileId);

    try {
      // 실제 AI 분석 수행
      let progress = 0;
      const updateProgress = (value: number) => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, analysisProgress: value }
              : f
          )
        );
      };

      updateProgress(10);

      // AI 분석 요청
      const formData = new FormData();
      if (file.type === 'video') {
        // 비디오에서 프레임 추출
        updateProgress(20);
        const frameBlob = await extractFrameFromVideo(file.url);
        updateProgress(40);
        
        formData.append('frame', frameBlob, 'frame.jpg');
        formData.append('timestamp', '0');
        
        const analysisResponse = await fetch('/api/ai-analysis/analyze-frame', {
          method: 'POST',
          body: formData
        });
        
        updateProgress(70);
        
        if (!analysisResponse.ok) {
          throw new Error('AI 분석 실패');
        }
        
        const aiResult = await analysisResponse.json();
        
        // AI 분석 결과를 UI 형식으로 변환
        const analysisResults = {
          behaviors: [
            {
              type: aiResult.behavior,
              confidence: aiResult.confidence,
              timeRange: [0, 30] as [number, number],
              description: aiResult.detailedBehavior?.primaryAction || aiResult.bodyLanguage?.posture || "AI 분석 완료"
            }
          ],
          emotions: [
            { 
              emotion: aiResult.emotion, 
              confidence: aiResult.confidence, 
              timestamp: 0 
            }
          ],
          bodyLanguage: aiResult.bodyLanguage,
          postureAnalysis: aiResult.postureAnalysis,
          detailedBehavior: aiResult.detailedBehavior,
          recommendations: aiResult.recommendations,
          audioFeatures: aiResult.audioFeatures
        };

        updateProgress(100);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, analysisProgress: 100, analysisResults }
              : f
          )
        );

        toast({
          title: "AI 분석 완료",
          description: `${aiResult.behavior} - 신뢰도 ${Math.round(aiResult.confidence * 100)}%`
        });

      } else {
        // 오디오 분석 - 오디오 파일 가져오기
        updateProgress(20);
        const audioResponse = await fetch(file.url);
        const audioBlob = await audioResponse.blob();
        updateProgress(40);
        
        formData.append('audio', audioBlob, 'audio.mp3');
        formData.append('timestamp', '0');
        formData.append('duration', '30');
        
        const analysisResponse = await fetch('/api/ai-analysis/analyze-audio', {
          method: 'POST',
          body: formData
        });
        
        updateProgress(70);
        
        if (!analysisResponse.ok) {
          throw new Error('AI 분석 실패');
        }
        
        const aiResult = await analysisResponse.json();
        
        const analysisResults = {
          behaviors: [
            {
              type: aiResult.behavior,
              confidence: aiResult.confidence,
              timeRange: [0, 30] as [number, number],
              description: "음성 AI 분석 완료"
            }
          ],
          emotions: [
            { 
              emotion: aiResult.emotion, 
              confidence: aiResult.confidence, 
              timestamp: 0 
            }
          ],
          audioFeatures: aiResult.audioFeatures
        };

        updateProgress(100);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, analysisProgress: 100, analysisResults }
              : f
          )
        );

        toast({
          title: "AI 음성 분석 완료",
          description: `${aiResult.behavior} - 신뢰도 ${Math.round(aiResult.confidence * 100)}%`
        });
      }

      setAnalysisInProgress(null);

    } catch (error) {
      console.error('AI 분석 오류:', error);
      setAnalysisInProgress(null);
      
      toast({
        title: "분석 오류",
        description: "AI 분석 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    const videoFiles = Array.from(files).filter(f => f.type.startsWith('video/'));
    const audioFiles = Array.from(files).filter(f => f.type.startsWith('audio/'));

    if (videoFiles.length > 0) {
      const videoFileList = new DataTransfer();
      videoFiles.forEach(f => videoFileList.items.add(f));
      handleFileUpload(videoFileList.files, 'video');
    }

    if (audioFiles.length > 0) {
      const audioFileList = new DataTransfer();
      audioFiles.forEach(f => audioFileList.items.add(f));
      handleFileUpload(audioFileList.files, 'audio');
    }
  }, [handleFileUpload]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Video className="w-6 h-6" />
            <span>비디오/오디오 파일 분석</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 파일 업로드 영역 */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Video className="w-12 h-12 text-gray-400" />
                <Music className="w-12 h-12 text-gray-400" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-700">
                  파일을 드래그하여 업로드하거나 아래 버튼을 클릭하세요
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  지원 형식: MP4, AVI, MOV (동영상) / MP3, WAV, M4A (음성)
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>동영상 업로드</span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => audioInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Music className="w-4 h-4" />
                  <span>음성 파일 업로드</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, 'video')}
          />

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, 'audio')}
          />
        </CardContent>
      </Card>

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>업로드된 파일 ({uploadedFiles.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {file.type === 'video' ? (
                        <Video className="w-8 h-8 text-blue-600" />
                      ) : (
                        <Music className="w-8 h-8 text-green-600" />
                      )}

                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {file.type === 'video' ? '동영상' : '음성'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {file.type === 'video' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // 동영상 재생 토글
                            setCurrentlyPlaying(
                              currentlyPlaying === file.id ? null : file.id
                            );
                          }}
                        >
                          {currentlyPlaying === file.id ? (
                            <PauseCircle className="w-4 h-4" />
                          ) : (
                            <PlayCircle className="w-4 h-4" />
                          )}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 분석 진행 상황 */}
                  {file.analysisProgress < 100 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">분석 진행중...</span>
                        <span className="text-sm text-gray-600">{Math.round(file.analysisProgress)}%</span>
                      </div>
                      <Progress value={file.analysisProgress} className="w-full" />
                    </div>
                  )}

                  {/* 분석 결과 */}
                  {file.analysisResults && (
                    <div className="mt-4 space-y-4">
                      {/* 이상자세 경고 배너 */}
                      {file.analysisResults.postureAnalysis?.isAbnormal && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-bold text-red-800 mb-1">이상 자세 감지</h4>
                              <p className="text-sm text-red-700 mb-2">
                                <span className="font-medium">유형:</span> {file.analysisResults.postureAnalysis.abnormalityType}
                              </p>
                              <p className="text-sm text-red-700 mb-2">
                                {file.analysisResults.postureAnalysis.description}
                              </p>
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant={file.analysisResults.postureAnalysis.severity === '심각' ? 'destructive' : 'secondary'}>
                                  심각도: {file.analysisResults.postureAnalysis.severity}
                                </Badge>
                              </div>
                              {file.analysisResults.postureAnalysis.possibleCauses?.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-red-800">가능한 원인:</p>
                                  <ul className="text-xs text-red-700 list-disc list-inside">
                                    {file.analysisResults.postureAnalysis.possibleCauses.map((cause, i) => (
                                      <li key={i}>{cause}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {file.analysisResults.postureAnalysis.recommendations?.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-red-800">권고사항:</p>
                                  <ul className="text-xs text-red-700 list-disc list-inside">
                                    {file.analysisResults.postureAnalysis.recommendations.map((rec, i) => (
                                      <li key={i}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 정상 자세 확인 */}
                      {file.analysisResults.postureAnalysis && !file.analysisResults.postureAnalysis.isAbnormal && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">자세 정상</span>
                            <span className="text-sm text-green-700">- {file.analysisResults.postureAnalysis.description}</span>
                          </div>
                        </div>
                      )}

                      <Tabs defaultValue="behaviors" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="behaviors" className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>행동</span>
                          </TabsTrigger>
                          <TabsTrigger value="body" className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>신체</span>
                          </TabsTrigger>
                          <TabsTrigger value="emotions" className="flex items-center space-x-1">
                            <Brain className="w-4 h-4" />
                            <span>감정</span>
                          </TabsTrigger>
                          <TabsTrigger value="recommendations" className="flex items-center space-x-1">
                            <Lightbulb className="w-4 h-4" />
                            <span>제안</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="behaviors" className="space-y-3">
                          {/* 기본 행동 분석 */}
                          {file.analysisResults.behaviors.map((behavior, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-lg">{behavior.type}</span>
                                <Badge variant="secondary">
                                  신뢰도 {Math.round(behavior.confidence * 100)}%
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{behavior.description}</p>
                            </div>
                          ))}

                          {/* 상세 행동 분석 */}
                          {file.analysisResults.detailedBehavior && (
                            <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                              <h4 className="font-bold text-blue-900 flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>상세 행동 분석</span>
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-blue-700 font-medium">주요 행동</p>
                                  <p className="text-sm text-blue-900">{file.analysisResults.detailedBehavior.primaryAction}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-blue-700 font-medium">움직임 패턴</p>
                                  <p className="text-sm text-blue-900">{file.analysisResults.detailedBehavior.movementPattern}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-blue-700 font-medium">주의 집중</p>
                                  <p className="text-sm text-blue-900">{file.analysisResults.detailedBehavior.attentionFocus}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-blue-700 font-medium">에너지 수준</p>
                                  <p className="text-sm text-blue-900">{file.analysisResults.detailedBehavior.energyLevel}</p>
                                </div>
                              </div>
                              {file.analysisResults.detailedBehavior.secondaryActions?.length > 0 && (
                                <div>
                                  <p className="text-xs text-blue-700 font-medium">부차적 행동</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {file.analysisResults.detailedBehavior.secondaryActions.map((action, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{action}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="body" className="space-y-3">
                          {/* 신체 언어 분석 */}
                          {file.analysisResults.bodyLanguage && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <p className="text-xs text-purple-700 font-medium mb-1">꼬리</p>
                                <p className="text-sm font-medium text-purple-900">{file.analysisResults.bodyLanguage.tail}</p>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <p className="text-xs text-purple-700 font-medium mb-1">귀</p>
                                <p className="text-sm font-medium text-purple-900">{file.analysisResults.bodyLanguage.ears}</p>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <p className="text-xs text-purple-700 font-medium mb-1">전체 자세</p>
                                <p className="text-sm font-medium text-purple-900">{file.analysisResults.bodyLanguage.posture}</p>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <p className="text-xs text-purple-700 font-medium mb-1">시선</p>
                                <p className="text-sm font-medium text-purple-900">{file.analysisResults.bodyLanguage.eyeContact}</p>
                              </div>
                            </div>
                          )}

                          {/* 자세 분석 상세 */}
                          {file.analysisResults.postureAnalysis && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-bold text-gray-900 mb-2">자세 분석</h4>
                              <p className="text-sm text-gray-700">{file.analysisResults.postureAnalysis.description}</p>
                              <div className="mt-2 flex items-center space-x-2">
                                <Badge variant={file.analysisResults.postureAnalysis.isAbnormal ? 'destructive' : 'secondary'}>
                                  {file.analysisResults.postureAnalysis.isAbnormal ? '이상' : '정상'}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  심각도: {file.analysisResults.postureAnalysis.severity}
                                </span>
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="emotions" className="space-y-3">
                          {file.analysisResults.emotions.map((emotion, index) => (
                            <div key={index} className="p-4 bg-amber-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-lg text-amber-900">{emotion.emotion}</span>
                                <Badge variant="secondary">
                                  {Math.round(emotion.confidence * 100)}%
                                </Badge>
                              </div>
                              <p className="text-xs text-amber-700">
                                감지 시점: {emotion.timestamp}초
                              </p>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="recommendations" className="space-y-3">
                          {file.analysisResults.recommendations && file.analysisResults.recommendations.length > 0 ? (
                            <div className="space-y-2">
                              {file.analysisResults.recommendations.map((rec, index) => (
                                <div key={index} className="p-3 bg-green-50 rounded-lg flex items-start space-x-2">
                                  <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-green-800">{rec}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                              특별한 권고사항이 없습니다
                            </div>
                          )}
                        </TabsContent>

                        {file.analysisResults.audioFeatures && (
                          <TabsContent value="audio" className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-sm">주파수</h4>
                                <p className="text-lg font-bold text-blue-600">
                                  {file.analysisResults.audioFeatures.frequency}Hz
                                </p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-sm">진폭</h4>
                                <p className="text-lg font-bold text-green-600">
                                  {Math.round(file.analysisResults.audioFeatures.amplitude * 100)}%
                                </p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-sm">재생 시간</h4>
                                <p className="text-lg font-bold text-purple-600">
                                  {file.analysisResults.audioFeatures.duration}초
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                        )}
                      </Tabs>
                    </div>
                  )}

                  {/* 동영상 미리보기 */}
                  {file.type === 'video' && currentlyPlaying === file.id && (
                    <div className="mt-4">
                      <video 
                        src={file.url} 
                        controls 
                        className="w-full max-h-64 rounded-lg"
                        autoPlay
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}