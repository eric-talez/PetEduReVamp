import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Video, X, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ObjectUploaderProps {
  onUploadComplete: (videoUrl: string, videoMetadata: {
    duration?: number;
    fileSize?: number;
    thumbnail?: string;
  }) => void;
  accept?: string;
  maxSizeInMB?: number;
  className?: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
  videoUrl?: string;
}

export function ObjectUploader({ 
  onUploadComplete, 
  accept = "video/*", 
  maxSizeInMB = 100,
  className = ""
}: ObjectUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: `파일 크기가 ${maxSizeInMB}MB를 초과합니다.`
      });
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('video/')) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: '영상 파일만 업로드할 수 있습니다.'
      });
      return;
    }

    setSelectedFile(file);
    setUploadState({ status: 'idle', progress: 0 });
  };

  const getVideoMetadata = (file: File): Promise<{
    duration?: number;
    fileSize: number;
    thumbnail?: string;
  }> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const fileSize = file.size;
        
        // 썸네일 생성 (첫 번째 프레임)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(url);
          resolve({ duration, fileSize, thumbnail });
        } else {
          URL.revokeObjectURL(url);
          resolve({ duration, fileSize });
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ fileSize: file.size });
      };
      
      video.src = url;
    });
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    try {
      setUploadState({ status: 'uploading', progress: 0 });

      // 1. 업로드 URL 요청
      const uploadUrlResponse = await apiRequest('/api/videos/upload-url', {
        method: 'POST'
      });

      if (!uploadUrlResponse.success) {
        throw new Error(uploadUrlResponse.message || '업로드 URL 생성 실패');
      }

      const { uploadURL } = uploadUrlResponse.data;
      setUploadState({ status: 'uploading', progress: 25 });

      // 2. 파일 업로드
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('파일 업로드에 실패했습니다.');
      }

      setUploadState({ status: 'uploading', progress: 75 });

      // 3. 비디오 메타데이터 추출
      setUploadState({ status: 'processing', progress: 90 });
      const metadata = await getVideoMetadata(selectedFile);

      // 4. 업로드 완료
      const videoUrl = uploadURL.split('?')[0]; // 쿼리 파라미터 제거
      setUploadState({ 
        status: 'success', 
        progress: 100, 
        videoUrl 
      });

      onUploadComplete(videoUrl, metadata);

    } catch (error) {
      console.error('파일 업로드 오류:', error);
      setUploadState({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      });
    }
  };

  const resetUploader = () => {
    setUploadState({ status: 'idle', progress: 0 });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 파일 선택 영역 */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${uploadState.status === 'idle' && !selectedFile 
            ? 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100' 
            : 'border-gray-200 bg-gray-50'
          }
        `}
        onClick={() => uploadState.status === 'idle' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          data-testid="video-file-input"
        />

        {!selectedFile && uploadState.status === 'idle' && (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                영상 파일을 클릭하여 선택하세요
              </p>
              <p className="text-xs text-gray-500 mt-1">
                최대 {maxSizeInMB}MB까지 업로드 가능
              </p>
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="space-y-3">
            <Video className="mx-auto h-12 w-12 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        )}
      </div>

      {/* 업로드 진행 상태 */}
      {uploadState.status !== 'idle' && (
        <div className="space-y-3">
          {(uploadState.status === 'uploading' || uploadState.status === 'processing') && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {uploadState.status === 'uploading' ? '업로드 중...' : '처리 중...'}
                </span>
                <span className="text-gray-600">{uploadState.progress}%</span>
              </div>
              <Progress value={uploadState.progress} className="h-2" />
            </div>
          )}

          {uploadState.status === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                영상이 성공적으로 업로드되었습니다!
              </AlertDescription>
            </Alert>
          )}

          {uploadState.status === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {uploadState.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex gap-2">
        {selectedFile && uploadState.status === 'idle' && (
          <Button 
            onClick={uploadFile} 
            className="flex-1"
            data-testid="button-upload-video"
          >
            <Upload className="w-4 h-4 mr-2" />
            업로드 시작
          </Button>
        )}

        {(selectedFile || uploadState.status !== 'idle') && (
          <Button 
            variant="outline" 
            onClick={resetUploader}
            data-testid="button-reset-upload"
          >
            <X className="w-4 h-4 mr-2" />
            {uploadState.status === 'success' ? '새 파일 선택' : '취소'}
          </Button>
        )}
      </div>
    </div>
  );
}