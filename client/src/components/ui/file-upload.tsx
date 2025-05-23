import React, { useState, useRef } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { UploadCloud, X, FilePlus } from "lucide-react";

interface FileUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  previewWidth?: number;
  previewHeight?: number;
}

export function FileUpload({
  value,
  onChange,
  onBlur,
  disabled = false,
  className,
  accept = "image/*",
  maxSizeMB = 5,
  previewWidth = 150,
  previewHeight = 150,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일을 Base64로 인코딩
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // 드래그 이벤트 처리
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setDragging(true);
    }
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  // 파일 유효성 검사
  const validateFile = (file: File): boolean => {
    // 파일 크기 체크
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return false;
    }

    // 파일 타입 체크 (이미지만 허용)
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return false;
    }

    setError(null);
    return true;
  };

  // 파일 처리
  const processFile = async (file: File) => {
    if (validateFile(file)) {
      try {
        const base64 = await convertToBase64(file);
        onChange(base64);
        if (onBlur) onBlur();
      } catch (error) {
        console.error("File conversion error:", error);
        setError("파일 변환 중 오류가 발생했습니다.");
      }
    }
  };

  // 드롭 이벤트 처리
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // 파일 선택 이벤트 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  // 파일 선택 버튼 클릭
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 선택된 파일 제거
  const handleRemoveFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {!value ? (
        // 업로드 영역 (파일이 없을 때)
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            dragging
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={disabled ? undefined : handleButtonClick}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="파일 선택 또는 드래그하여 업로드"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }
          }}
          aria-disabled={disabled}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            aria-hidden="true"
            id="file-upload-input"
          />
          <UploadCloud className="h-10 w-10 text-primary mb-2" />
          <p className="text-sm font-semibold mb-1 text-foreground">
            {dragging ? "파일을 놓으세요" : "파일을 끌어다 놓거나 클릭하세요"}
          </p>
          <p className="text-xs text-foreground/80 font-medium">
            {accept === "image/*" ? "PNG, JPG, GIF" : accept} (최대 {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        // 미리보기 영역 (파일 있을 때)
        <div className="relative border rounded-lg overflow-hidden">
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-7 w-7 rounded-full bg-white text-primary hover:text-primary-foreground hover:bg-primary shadow-sm border border-gray-200"
              onClick={handleButtonClick}
              disabled={disabled}
              aria-label="파일 변경"
            >
              <FilePlus size={14} />
              <span className="sr-only">파일 변경</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-7 w-7 rounded-full shadow-sm border border-destructive"
              onClick={handleRemoveFile}
              disabled={disabled}
              aria-label="파일 제거"
            >
              <X size={14} />
              <span className="sr-only">파일 제거</span>
            </Button>
          </div>
          <div
            className="flex items-center justify-center bg-muted/40 border border-border/40"
            style={{ 
              width: previewWidth, 
              height: previewHeight,
              maxWidth: '100%'
            }}
            role="figure"
            aria-label="업로드된 이미지 미리보기"
          >
            <img
              src={value}
              alt="업로드된 이미지"
              className="object-cover"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
              loading="lazy"
            />
          </div>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-200 dark:border-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}