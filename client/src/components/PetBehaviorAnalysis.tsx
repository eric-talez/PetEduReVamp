import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, Check, X, AlertCircle } from 'lucide-react';
import { useAIAnalysis, type AnalysisResult } from '@/hooks/useAIAnalysis';
import { useToast } from '@/hooks/use-toast';

// 분석 점수 색상 결정 함수
const getScoreColor = (score: number, reverse = false): string => {
  if (reverse) {
    score = 100 - score; // 스트레스, 불안과 같은 점수는 낮을수록 좋음
  }
  
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  if (score >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

interface PetBehaviorAnalysisProps {
  petId: number;
  petName: string;
}

export function PetBehaviorAnalysis({ petId, petName }: PetBehaviorAnalysisProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeAnimalBehavior, isAnalyzing } = useAIAnalysis();
  const { toast } = useToast();

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 비디오 파일 타입 검증
      if (!file.type.startsWith('video/')) {
        toast({
          title: "비디오 파일만 허용됩니다",
          description: "MP4, WebM, MOV 등의 비디오 파일을 선택해주세요.",
          variant: "destructive"
        });
        return;
      }
      
      // 파일 크기 제한 (100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "100MB 이하의 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }
      
      setVideoFile(file);
      
      // 파일 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleSelectVideoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 분석 시작 핸들러
  const handleAnalyzeClick = async () => {
    if (!videoFile) {
      toast({
        title: "비디오 파일 필요",
        description: "분석할 비디오 파일을 먼저 선택해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 실제 구현시 S3/Firebase 등에 비디오 업로드 후 URL 받음
      // 여기서는 가상의 URL 사용
      await new Promise(resolve => setTimeout(resolve, 1500)); // 업로드 시뮬레이션
      const fakeUploadedUrl = `https://example.com/videos/${videoFile.name}`;
      
      setIsUploading(false);
      
      // 분석 요청
      const result = await analyzeAnimalBehavior(fakeUploadedUrl, petId);
      
      if (result) {
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error('비디오 업로드 및 분석 실패:', error);
      toast({
        title: "분석 실패",
        description: "비디오 업로드 또는 분석 중 오류가 발생했습니다.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  // 다시 시작
  const handleReset = () => {
    setVideoFile(null);
    setVideoUrl('');
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">반려동물 행동 분석</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 비디오 업로드 및 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle>비디오 업로드</CardTitle>
            <CardDescription>분석할 반려동물 비디오를 업로드하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            
            {!videoUrl ? (
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={handleSelectVideoClick}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">비디오 파일을 업로드하세요</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">MP4, WebM, MOV 파일 (최대 100MB)</p>
              </div>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden relative">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {videoFile && (
              <div className="mt-4">
                <p className="text-sm font-medium">{videoFile.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSelectVideoClick} disabled={isUploading || isAnalyzing}>
              비디오 선택
            </Button>
            <Button 
              onClick={handleAnalyzeClick}
              disabled={!videoFile || isUploading || isAnalyzing}
              className="bg-primary"
            >
              {(isUploading || isAnalyzing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? '업로드 중...' : isAnalyzing ? '분석 중...' : '분석 시작'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* 분석 결과 */}
        {analysisResult ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{petName}의 행동 분석 결과</CardTitle>
                  <CardDescription>{new Date(analysisResult.date).toLocaleDateString()} 분석</CardDescription>
                </div>
                <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs">
                  <Check className="h-3 w-3" />
                  <span>분석 완료</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">요약</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{analysisResult.summary}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">행동 점수</h3>
                  <div className="space-y-4">
                    {Object.entries(analysisResult.scores).map(([key, score]) => {
                      const isReverse = ['stress', 'anxiety', 'aggression'].includes(key);
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="capitalize">{key}</Label>
                            <span className="text-sm font-semibold">{Math.round(score)}/100</span>
                          </div>
                          <Progress 
                            value={score} 
                            max={100} 
                            className={`h-2 ${getScoreColor(score, isReverse)}`} 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">추천사항</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleReset} variant="outline" className="w-full">
                새 비디오로 분석하기
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{petName}의 행동 분석</CardTitle>
              <CardDescription>비디오를 업로드하여 AI 분석을 시작하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">분석 결과가 없습니다</h3>
                <p className="text-sm max-w-md">
                  반려동물의 행동이 담긴 비디오를 업로드하면 AI가 분석하여 결과를 보여드립니다. 
                  놀이, 훈련, 일상 생활 등 다양한 상황의 비디오를 분석해보세요.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}