import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | null) => void;
  maxSize?: number; // 최대 파일 크기 (MB 단위)
  aspectRatio?: number; // 가로 세로 비율 (width / height)
  className?: string;
  label?: string;
  quality?: number; // 이미지 압축 품질 (0 ~ 1)
  maxWidth?: number; // 최대 가로 크기
  maxHeight?: number; // 최대 세로 크기
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  aspectRatio,
  className = "",
  label = "이미지 업로드",
  quality = 0.8,
  maxWidth = 1200,
  maxHeight = 800
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value !== preview) {
      setPreview(value || null);
    }
  }, [value]);

  // 이미지 최적화 및 리사이징
  const optimizeImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // 이미지 크기 계산
          let width = img.width;
          let height = img.height;
          
          // 최대 크기 제한
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          // 비율 설정이 있는 경우 적용
          if (aspectRatio) {
            if (width / height > aspectRatio) {
              // 너무 넓은 경우
              width = Math.floor(height * aspectRatio);
            } else if (width / height < aspectRatio) {
              // 너무 높은 경우
              height = Math.floor(width / aspectRatio);
            }
          }
          
          // 캔버스 생성 및 이미지 그리기
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('캔버스 컨텍스트를 가져올 수 없습니다.'));
            return;
          }
          
          // 배경을 흰색으로 채우기 (투명 배경 방지)
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          
          // 이미지 그리기
          ctx.drawImage(img, 0, 0, width, height);
          
          // 최적화된 이미지 생성
          const optimizedImage = canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedImage);
        };
        
        img.onerror = () => {
          reject(new Error('이미지 로드 중 오류가 발생했습니다.'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 크기 검사
    if (file.size > maxSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }
    
    // 파일 유형 검사
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    
    try {
      // 이미지 최적화
      const optimizedImage = await optimizeImage(file);
      
      // 미리보기 및 결과 업데이트
      setPreview(optimizedImage);
      onChange(optimizedImage);
    } catch (error) {
      console.error('이미지 최적화 중 오류:', error);
      setError('이미지 처리 중 오류가 발생했습니다.');
    }
    
    // 입력 필드 초기화
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // 파일 크기 검사
    if (file.size > maxSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }
    
    // 파일 유형 검사
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    
    try {
      // 이미지 최적화
      const optimizedImage = await optimizeImage(file);
      
      // 미리보기 및 결과 업데이트
      setPreview(optimizedImage);
      onChange(optimizedImage);
    } catch (error) {
      console.error('이미지 최적화 중 오류:', error);
      setError('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] overflow-hidden transition-all ${
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="업로드된 이미지"
              className="mx-auto max-h-[300px] max-w-full object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {label}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              최대 {maxSize}MB (드래그 & 드롭 지원)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="mt-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              찾아보기
            </Button>
          </>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />
    </div>
  );
}