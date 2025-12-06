import { useState, useRef, FormEvent, useCallback, memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessaging } from "@/hooks/useMessaging";
import { Paperclip, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 자동 크기 조절 텍스트 영역 컴포넌트
const AutoResizeTextarea = memo(({ 
  value, 
  onChange, 
  onKeyDown,
  placeholder,
  disabled
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
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
      disabled={disabled}
      className="min-h-[40px] resize-none transition-height duration-200 flex-1"
      rows={1}
      data-testid="input-message"
    />
  );
});

function MessageInputComponent() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { activeConversation, sendMessage, sendTypingIndicator, isConnected } = useMessaging();
  const { toast } = useToast();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 텍스트 메시지 전송 핸들러
  const handleSendMessage = useCallback(async (e?: FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || !activeConversation || isSending) return;
    
    setIsSending(true);
    try {
      await sendMessage(activeConversation.participant.id, message.trim());
      setMessage("");
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      toast({
        title: "메시지 전송 실패",
        description: "메시지를 전송하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [message, activeConversation, isSending, sendMessage, toast]);

  // 엔터키 처리 (Shift+Enter는 줄바꿈)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // 타이핑 표시 전송 (디바운스)
    if (activeConversation && sendTypingIndicator) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(activeConversation.participant.id);
      }, 300);
    }
  }, [activeConversation, sendTypingIndicator]);

  if (!activeConversation) {
    return null;
  }

  const participantName = activeConversation.participant?.name || '상대방';
  
  return (
    <div className="p-4 border-t dark:border-gray-700">
      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <AutoResizeTextarea
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder={`${participantName}님에게 메시지 보내기...`}
          disabled={isSending}
        />
        
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isSending}
          className="flex-shrink-0"
          title="메시지 보내기"
          data-testid="button-send-message"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
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

export const MessageInput = memo(MessageInputComponent);
