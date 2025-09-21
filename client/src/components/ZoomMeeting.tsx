import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  MessageSquare, 
  ScreenShare, 
  Share2, 
  Settings, 
  X, 
  Maximize,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZoomMeetingProps {
  meetingId: string;
  password?: string;
  userName: string;
  onClose: () => void;
  isSpeaker?: boolean;
  startTime?: string;
  endTime?: string;
  trainer?: {
    name: string;
    avatar: string;
  };
}

export function ZoomMeeting({ 
  meetingId, 
  password, 
  userName, 
  onClose, 
  isSpeaker = false,
  startTime,
  endTime,
  trainer
}: ZoomMeetingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Zoom SDK 로딩 및 초기화
  useEffect(() => {
    // Zoom Web SDK 스크립트 로드
    const loadZoomSDK = async () => {
      try {
        setIsLoading(true);
        
        // 실제 구현에서는 ZoomMtg 객체를 로드하고 초기화하는 코드가 필요합니다.
        // 예시 코드:
        // import { ZoomMtg } from '@zoom/meetingsdk';
        // ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av');
        // ZoomMtg.preLoadWasm();
        // ZoomMtg.prepareWebSDK();
        
        // 여기서는 SDK가 로드되었다고 가정하고 진행합니다.
        console.log('Zoom SDK 로드 완료');
        
        // 실제 구현에서는 시그니처 생성이 필요합니다.
        // 서버에서 JWT 토큰을 받아오는 로직이 필요합니다.
        
        // 로딩 시뮬레이션
        setTimeout(() => {
          setIsLoading(false);
          joinMeeting();
        }, 1500);
        
      } catch (err) {
        console.error('Zoom SDK 로드 실패:', err);
        setError('Zoom 미팅 SDK를 로드하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };
    
    loadZoomSDK();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (isJoined) {
        // 실제 구현에서는 미팅에서 나가는 로직이 필요합니다.
        // ZoomMtg.leaveMeeting({});
        console.log('Zoom 미팅에서 나가기');
      }
    };
  }, []);
  
  // 미팅 참여 함수
  const joinMeeting = async () => {
    try {
      // 실제 구현에서는 Zoom SDK를 사용하여 미팅에 참여하는 로직이 필요합니다.
      // ZoomMtg.join({
      //   meetingNumber: meetingId,
      //   userName: userName,
      //   password: password,
      //   leaveUrl: window.location.origin,
      //   success: () => {
      //     console.log('미팅 참여 성공');
      //     setIsJoined(true);
      //   },
      //   error: (err) => {
      //     console.error('미팅 참여 실패:', err);
      //     setError('미팅에 참여할 수 없습니다. 미팅 ID와 비밀번호를 확인해주세요.');
      //   }
      // });
      
      // 미팅 참여 시뮬레이션
      console.log('미팅 참여 시뮬레이션:', {
        meetingId,
        userName,
        password,
        isSpeaker
      });
      
      setTimeout(() => {
        setIsJoined(true);
        toast({
          title: "화상 수업에 참여했습니다",
          description: `미팅 ID: ${meetingId}`,
        });
      }, 1000);
      
    } catch (err) {
      console.error('미팅 참여 실패:', err);
      setError('미팅에 참여할 수 없습니다. 미팅 ID와 비밀번호를 확인해주세요.');
    }
  };
  
  // 마이크 토글
  const toggleMic = () => {
    // 실제 구현에서는 Zoom SDK를 사용하여 마이크를 켜고 끄는 로직이 필요합니다.
    // ZoomMtg.mute({
    //   mute: micEnabled,
    //   success: () => {
    //     setMicEnabled(!micEnabled);
    //   }
    // });
    
    setMicEnabled(!micEnabled);
    toast({
      title: micEnabled ? "마이크가 꺼졌습니다" : "마이크가 켜졌습니다",
      variant: "default",
    });
  };
  
  // 비디오 토글
  const toggleVideo = () => {
    // 실제 구현에서는 Zoom SDK를 사용하여 비디오를 켜고 끄는 로직이 필요합니다.
    // ZoomMtg.stopVideo({
    //   stop: videoEnabled,
    //   success: () => {
    //     setVideoEnabled(!videoEnabled);
    //   }
    // });
    
    setVideoEnabled(!videoEnabled);
    toast({
      title: videoEnabled ? "비디오가 꺼졌습니다" : "비디오가 켜졌습니다",
      variant: "default",
    });
  };
  
  // 화면 공유 토글
  const toggleScreenShare = () => {
    // 실제 구현에서는 Zoom SDK를 사용하여 화면 공유를 켜고 끄는 로직이 필요합니다.
    // if (isScreenSharing) {
    //   ZoomMtg.stopShareScreen({
    //     success: () => {
    //       setIsScreenSharing(false);
    //     }
    //   });
    // } else {
    //   ZoomMtg.shareScreen({
    //     success: () => {
    //       setIsScreenSharing(true);
    //     }
    //   });
    // }
    
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "화면 공유가 중지되었습니다" : "화면 공유를 시작합니다",
      variant: "default",
    });
  };
  
  // 전체 화면 토글
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  
  // 채팅 토글
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  // 오디오 음소거 토글
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "오디오가 켜졌습니다" : "오디오가 음소거되었습니다",
      variant: "default",
    });
  };
  
  // 미팅 종료
  const leaveMeeting = () => {
    // 실제 구현에서는 Zoom SDK를 사용하여 미팅에서 나가는 로직이 필요합니다.
    // ZoomMtg.leaveMeeting({
    //   success: () => {
    //     setIsJoined(false);
    //     onClose();
    //   }
    // });
    
    setIsJoined(false);
    toast({
      title: "화상 수업에서 나갔습니다",
      description: "세션이 종료되었습니다.",
      variant: "default",
    });
    onClose();
  };
  
  // 참가자 목록 업데이트 시뮬레이션
  useEffect(() => {
    if (isJoined) {
      const interval = setInterval(() => {
        // 실제 구현에서는 Zoom SDK에서 참가자 수를 가져오는 로직이 필요합니다.
        const randomChange = Math.random() > 0.7 ? 1 : 0;
        setParticipantsCount(prev => Math.min(10, Math.max(1, prev + randomChange)));
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isJoined]);
  
  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-white text-lg">Zoom 미팅에 연결 중입니다...</p>
        <p className="text-gray-400 text-sm mt-2">잠시만 기다려주세요</p>
      </div>
    );
  }
  
  // 에러 발생 시 표시
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>미팅 연결 오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={onClose}>돌아가기</Button>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* 헤더 */}
      <div className="p-4 bg-gray-900 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center">
          <Badge variant="outline" className="bg-red-600 text-white border-red-600 flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
            라이브
          </Badge>
          <h3 className="ml-3 text-white font-medium">
            {trainer ? `${trainer.name} 훈련사님과의 화상 수업` : `화상 수업 (ID: ${meetingId})`}
          </h3>
          {startTime && endTime && (
            <span className="ml-4 text-gray-400 text-sm hidden sm:inline-block">
              {startTime} ~ {endTime}
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <Badge variant="outline" className="mr-3 flex items-center gap-1">
            <Users size={14} />
            {participantsCount}
          </Badge>
          <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
      </div>
      
      {/* 미팅 콘텐츠 */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-950 relative">
        {/* 메인 비디오 */}
        <div className="md:col-span-3 aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          {videoEnabled ? (
            <img 
              src={trainer?.avatar || "https://robohash.org/trainer?set=set4&size=600x400&bgset=bg1"} 
              alt="Video preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <VideoOff size={48} className="text-gray-500 mb-2" />
              <p className="text-gray-400">{trainer?.name || userName}님의 비디오가 꺼져 있습니다</p>
            </div>
          )}
          
          {/* 화면 공유 중 오버레이 */}
          {isScreenSharing && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-center">
                <ScreenShare size={48} className="text-primary mx-auto mb-2" />
                <p className="text-white">화면 공유 중...</p>
              </div>
            </div>
          )}
          
          {/* 참가자 비디오 오버레이 (작은 창) */}
          <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-800 rounded overflow-hidden border-2 border-primary shadow-lg">
            {videoEnabled ? (
              <img 
                src="https://robohash.org/user?set=set4&size=200x150&bgset=bg1" 
                alt="Your video" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <VideoOff size={24} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>
        
        {/* 참가자 목록 또는 채팅 */}
        <div className="hidden md:block bg-gray-900 rounded-lg overflow-hidden">
          {isChatOpen ? (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-gray-800 font-medium text-white">
                채팅
              </div>
              <div className="flex-grow p-2 overflow-y-auto">
                <div className="space-y-2">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-400">{trainer?.name || "진행자"}</p>
                    <p className="text-sm text-white">안녕하세요, 모두 잘 들리시나요?</p>
                  </div>
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <p className="text-xs text-gray-400">나</p>
                    <p className="text-sm text-white">네, 잘 들립니다!</p>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-400">{trainer?.name || "진행자"}</p>
                    <p className="text-sm text-white">오늘은 기본 명령어 훈련에 대해 알아볼 거예요.</p>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-gray-800">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="메시지 입력..." 
                    className="flex-grow bg-gray-800 border-0 rounded p-2 text-white text-sm"
                  />
                  <Button size="sm">전송</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-gray-800 font-medium text-white">
                참가자 ({participantsCount})
              </div>
              <div className="flex-grow p-2 overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-center p-2 hover:bg-gray-800 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      {trainer ? (
                        <img 
                          src={trainer.avatar} 
                          alt={trainer.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">T</span>
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm">{trainer?.name || "진행자"} (호스트)</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 hover:bg-gray-800 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <span className="text-white font-bold">Y</span>
                    </div>
                    <div>
                      <p className="text-white text-sm">{userName} (나)</p>
                    </div>
                  </div>
                  {participantsCount > 2 && Array.from({ length: participantsCount - 2 }).map((_, i) => (
                    <div key={i} className="flex items-center p-2 hover:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                        <span className="text-white font-bold">P</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">참가자 {i + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 컨트롤 바 */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-center items-center gap-2 md:gap-4">
          <Button 
            variant={micEnabled ? "outline" : "secondary"} 
            size="icon" 
            onClick={toggleMic}
            className={!micEnabled ? "bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 text-white" : ""}
          >
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>
          
          <Button 
            variant={videoEnabled ? "outline" : "secondary"} 
            size="icon" 
            onClick={toggleVideo}
            className={!videoEnabled ? "bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 text-white" : ""}
          >
            {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </Button>
          
          {isSpeaker && (
            <Button 
              variant={isScreenSharing ? "secondary" : "outline"} 
              size="icon" 
              onClick={toggleScreenShare}
              className={isScreenSharing ? "bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700 text-white" : ""}
            >
              <ScreenShare size={20} />
            </Button>
          )}
          
          <Button 
            variant={isMuted ? "secondary" : "outline"} 
            size="icon" 
            onClick={toggleMute}
            className={isMuted ? "bg-orange-600 border-orange-600 hover:bg-orange-700 hover:border-orange-700 text-white" : ""}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <Button 
            variant={isChatOpen ? "secondary" : "outline"} 
            size="icon" 
            onClick={toggleChat}
          >
            <MessageSquare size={20} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFullscreen}
          >
            <Maximize size={20} />
          </Button>
          
          <Button 
            variant="destructive" 
            className="ml-2" 
            onClick={leaveMeeting}
          >
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ZoomMeeting;