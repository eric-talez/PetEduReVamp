import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  X, 
  Eye, 
  Users, 
  MessageCircle, 
  Send,
  Maximize2,
  Minimize2,
  Share2,
  Volume2,
  VolumeX,
  Settings,
  ScreenShare,
  Phone
} from 'lucide-react';

interface StreamData {
  id: number;
  hostId: number;
  title: string;
  description?: string | null;
  category?: string | null;
  meetingUrl?: string | null;
  thumbnailUrl?: string | null;
  status?: string | null;
  currentViewers?: number | null;
  hostName?: string | null;
  hostAvatar?: string | null;
}

interface LiveStreamViewerProps {
  stream: StreamData;
  onExit: () => void;
}

interface ChatMessage {
  id: number;
  streamId: number;
  userId: number;
  message: string;
  userName?: string | null;
  userAvatar?: string | null;
  isHighlighted?: boolean;
  isPinned?: boolean;
  createdAt: Date;
}

export function LiveStreamViewer({ stream, onExit }: LiveStreamViewerProps) {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const { data: chatData, refetch: refetchChat } = useQuery<{ messages: ChatMessage[] }>({
    queryKey: ['/api/live-streaming/streams', stream.id, 'chat'],
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const csrfRes = await fetch('/api/auth/csrf', { credentials: 'include' });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken || csrfData.data?.token;
      
      const response = await fetch(`/api/live-streaming/streams/${stream.id}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken 
        },
        body: JSON.stringify({ message }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      setChatMessage('');
      refetchChat();
    },
    onError: () => {
      toast({
        title: '메시지 전송 실패',
        description: '채팅 메시지를 전송할 수 없습니다.',
        variant: 'destructive',
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      sendMessageMutation.mutate(chatMessage.trim());
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatData?.messages]);

  const toggleFullscreen = useCallback(async () => {
    if (!videoContainerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await videoContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  const handleShare = async () => {
    const shareText = `${stream.title} - 라이브 방송\n${stream.hostName || '훈련사'}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: stream.title, text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({ title: '복사 완료', description: '라이브 정보가 복사되었습니다.' });
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const messages = chatData?.messages || [];

  return (
    <div className="space-y-4" data-testid="live-stream-viewer">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div 
            ref={videoContainerRef}
            className="relative bg-black rounded-xl overflow-hidden aspect-video"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center px-4">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
                  <Video className="relative w-24 h-24 text-emerald-400 mx-auto" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{stream.title}</h3>
                <p className="text-white/70 text-sm mb-4">{stream.hostName || '훈련사'}</p>
                <p className="text-white/50 text-xs mb-6 max-w-md mx-auto">
                  WebRTC 스트리밍 준비 중입니다. 호스트가 방송을 시작하면 영상이 표시됩니다.
                </p>
                
                {stream.meetingUrl && (
                  <Button 
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => window.open(stream.meetingUrl!, '_blank')}
                    data-testid="btn-join-meeting"
                  >
                    <Phone className="w-5 h-5 mr-2" /> 화상회의 참여
                  </Button>
                )}
              </div>
            </div>
            
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
              <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {stream.currentViewers || 0}명
              </span>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/60 text-white hover:bg-black/80"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/60 text-white hover:bg-black/80"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/60 text-white hover:bg-black/80 lg:hidden"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-red-500/80 text-white hover:bg-red-600"
                onClick={onExit}
                data-testid="btn-close-viewer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {stream.hostAvatar ? (
                      <img src={stream.hostAvatar} alt="" className="w-10 h-10 object-cover" />
                    ) : (
                      <Users className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="text-white">
                    <p className="font-medium text-sm">{stream.hostName || '훈련사'}</p>
                    <p className="text-xs text-white/60">{stream.category || '라이브 수업'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/60 text-white hover:bg-black/80"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-1" /> 공유
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-lg font-bold mb-2">{stream.title}</h2>
            {stream.description && (
              <p className="text-sm text-muted-foreground">{stream.description}</p>
            )}
          </div>
        </div>

        <div className={`lg:col-span-1 ${showChat ? 'block' : 'hidden lg:block'}`}>
          <Card className="h-[500px] lg:h-full flex flex-col">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium text-sm">실시간 채팅</span>
              </div>
              <span className="text-xs text-muted-foreground">{messages.length}개 메시지</span>
            </div>
            
            <ScrollArea className="flex-1 p-3" ref={chatScrollRef}>
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    아직 채팅 메시지가 없습니다.
                    <br />첫 번째 메시지를 보내보세요!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-2 ${msg.isPinned ? 'bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {msg.userAvatar ? (
                          <img src={msg.userAvatar} alt="" className="w-7 h-7 object-cover" />
                        ) : (
                          <Users className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{msg.userName || '익명'}</span>
                          {msg.isHighlighted && (
                            <span className="text-[10px] bg-yellow-200 dark:bg-yellow-800 px-1 rounded">강조</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 text-sm"
                  maxLength={200}
                  data-testid="input-chat-message"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!chatMessage.trim() || sendMessageMutation.isPending}
                  data-testid="btn-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
      
      <Separator className="my-4" />
    </div>
  );
}

export default LiveStreamViewer;
