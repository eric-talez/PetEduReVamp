import { useState, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessaging } from "@/hooks/useMessaging";
import { Paperclip, Send } from "lucide-react";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeConversation, sendMessage } = useMessaging();

  // 텍스트 메시지 전송 핸들러
  const handleSendMessage = (e?: FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || !activeConversation) return;
    
    sendMessage(activeConversation.userId, message.trim());
    setMessage("");
  };

  // 엔터키 처리 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeConversation) return;

    const file = files[0];
    
    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      setIsUploading(true);
      
      // 파일을 Base64로 인코딩
      const base64 = await fileToBase64(file);
      
      // 이미지 메시지 전송
      sendMessage(activeConversation.userId, base64, "image");
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 파일을 Base64로 변환하는 유틸리티 함수
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!activeConversation) {
    return null;
  }

  return (
    <div className="p-4 border-t dark:border-gray-700">
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
          disabled={isUploading}
          className="flex-shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="min-h-[40px] resize-none"
          rows={1}
        />
        
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isUploading}
          className="flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}