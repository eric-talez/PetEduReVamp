import { useState, useRef, FormEvent, useCallback, memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessaging } from "@/hooks/useMessaging";
import { Paperclip, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 파일을 Base64로 변환하는 유틸리티 함수
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 자동 크기 조절 텍스트 영역 컴포넌트
const AutoResizeTextarea = memo(({ 
  value, 
  onChange, 
  onKeyDown,
  placeholder
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // 높이 초기화
      textareaRef.current.style.height = 'auto';
      // 스크롤 높이에 맞게 조절 (최대 5줄)
      const newHeight = Math.min(textareaRef.current.scrollHeight, 24 * 5);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="min-h-[40px] resize-none transition-height duration-200"
      rows={1}
    />
  );
});

function MessageInputComponent() {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeConversation, sendMessage, isConnected } = useMessaging();
  const { toast } = useToast();

  // 텍스트 메시지 전송 핸들러
  const handleSendMessage = useCallback((e?: FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || !activeConversation || !isConnected) return;
    
    sendMessage(activeConversation.userId, message.trim());
    setMessage("");
  }, [message, activeConversation, isConnected, sendMessage]);

  // 엔터키 처리 (Shift+Enter는 줄바꿈)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeConversation || !isConnected) return;

    const file = files[0];
    
    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      toast({
        title: "이미지 업로드 실패",
        description: "이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "이미지 업로드 실패",
        description: "5MB 이하의 이미지만 업로드할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // 파일을 Base64로 인코딩
      const base64 = await fileToBase64(file);
      
      // 이미지 메시지 전송
      sendMessage(activeConversation.userId, base64, "image");
      
      toast({
        title: "이미지 전송 완료",
        description: "이미지가 성공적으로 전송되었습니다.",
        variant: "default"
      });
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      toast({
        title: "이미지 업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [activeConversation, isConnected, sendMessage, toast]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, []);

  if (!activeConversation) {
    return null;
  }

  // 대화 상대 사용자 이름
  const receiverName = activeConversation.userName;
  
  return (
    <div className="p-4 border-t dark:border-gray-700">
      {/* 상대방 타이핑 표시 (추후 WebSocket으로 구현) */}
      {/* <div className="mb-2">
        <div className="typing-dots inline-flex justify-center items-center space-x-1">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <span className="text-xs text-muted-foreground ml-2">{receiverName}님이 입력 중...</span>
      </div> */}
      
      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileSelect}
          disabled={isUploading || !isConnected}
          className="flex-shrink-0"
          title="이미지 첨부"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Paperclip className="h-5 w-5" />
          )}
        </Button>
        
        <AutoResizeTextarea
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder={isConnected ? "메시지를 입력하세요..." : "연결 중..."}
        />
        
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isUploading || !isConnected}
          className="flex-shrink-0"
          title="메시지 보내기"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>

      {!isConnected && (
        <div className="mt-2 text-xs text-center text-muted-foreground flex items-center justify-center">
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          <span>서버에 연결 중입니다...</span>
        </div>
      )}
    </div>
  );
}

// 메모이제이션 적용
export const MessageInput = memo(MessageInputComponent);