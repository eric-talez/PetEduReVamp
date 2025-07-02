import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Loader2, FileAudio, FileVideo, Subtitles, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutoSubtitleManagerProps {
  videoUrl?: string;
  onSubtitlesGenerated?: (subtitles: string) => void;
  className?: string;
}

interface SubtitleResult {
  text: string;
  srt: string;
  vtt: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export const AutoSubtitleManager: React.FC<AutoSubtitleManagerProps> = ({
  videoUrl,
  onSubtitlesGenerated,
  className = ""
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subtitleResult, setSubtitleResult] = useState<SubtitleResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 파일 업로드 및 자막 생성
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // 파일 크기 체크 (100MB 제한)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "100MB 이하의 파일만 업로드 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    // 파일 형식 체크
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "지원되지 않는 파일 형식",
        description: "오디오 또는 비디오 파일만 업로드 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append(file.type.startsWith('video/') ? 'video' : 'audio', file);

      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // API 엔드포인트 선택
      const endpoint = file.type.startsWith('video/') 
        ? '/api/ai/generate-subtitles-from-video'
        : '/api/ai/generate-subtitles';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '자막 생성에 실패했습니다.');
      }

      const result: SubtitleResult = await response.json();
      setSubtitleResult(result);

      // 콜백 호출
      if (onSubtitlesGenerated) {
        onSubtitlesGenerated(result.vtt);
      }

      toast({
        title: "자막 생성 완료",
        description: "자동 자막이 성공적으로 생성되었습니다.",
      });

    } catch (error) {
      console.error('자막 생성 오류:', error);
      toast({
        title: "자막 생성 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 자막 파일 다운로드
  const downloadSubtitles = (format: 'srt' | 'vtt') => {
    if (!subtitleResult) return;

    const content = format === 'srt' ? subtitleResult.srt : subtitleResult.vtt;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtitles.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Subtitles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">자동 자막 생성</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            AI 기반
          </Badge>
        </div>

        {/* 파일 업로드 영역 */}
        {!isGenerating && !subtitleResult && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-2">
                <FileAudio className="h-8 w-8 text-gray-400" />
                <FileVideo className="h-8 w-8 text-gray-400" />
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">
                  오디오 또는 비디오 파일을 업로드하세요
                </h4>
                <p className="text-sm text-gray-500">
                  지원 형식: MP3, WAV, M4A, MP4, AVI, MOV (최대 100MB)
                </p>
              </div>

              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>파일 선택</span>
              </Button>
            </div>
          </div>
        )}

        {/* 진행률 표시 */}
        {isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">자막 생성 중...</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              AI가 음성을 분석하여 자막을 생성하고 있습니다. 잠시만 기다려주세요.
            </p>
          </div>
        )}

        {/* 결과 표시 */}
        {subtitleResult && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">자막 생성 완료</span>
            </div>

            {/* 자막 미리보기 */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <h5 className="font-medium mb-2">생성된 텍스트 미리보기:</h5>
              <p className="text-sm text-gray-700 leading-relaxed">
                {subtitleResult.text}
              </p>
            </div>

            {/* 다운로드 버튼 */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadSubtitles('srt')}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>SRT 다운로드</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadSubtitles('vtt')}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>VTT 다운로드</span>
              </Button>
            </div>

            {/* 세그먼트 정보 */}
            {subtitleResult.segments && subtitleResult.segments.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">자막 세그먼트: {subtitleResult.segments.length}개</h5>
                <div className="text-xs text-gray-500">
                  총 {Math.floor(subtitleResult.segments[subtitleResult.segments.length - 1]?.end || 0)}초 분량
                </div>
              </div>
            )}

            {/* 다시 생성 버튼 */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSubtitleResult(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="w-full"
            >
              새 파일로 다시 생성
            </Button>
          </div>
        )}

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* 사용법 안내 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <h6 className="font-medium text-blue-900 mb-1">사용법 안내</h6>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• 오디오 또는 비디오 파일을 업로드하면 AI가 자동으로 자막을 생성합니다</li>
                <li>• 생성된 자막은 SRT 또는 WebVTT 형식으로 다운로드할 수 있습니다</li>
                <li>• 한국어 음성에 최적화되어 있어 정확도가 높습니다</li>
                <li>• 파일 크기가 클수록 처리 시간이 오래 걸릴 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AutoSubtitleManager;