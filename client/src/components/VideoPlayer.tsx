import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize,
  Subtitles,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AutoSubtitleManager } from './AutoSubtitleManager';

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
  title: string;
  isPremium?: boolean;
  isPreviewMode?: boolean;
  previewTimeLeft?: number;
  onPreviewEnd?: () => void;
  purchased?: boolean;
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  subtitlesUrl?: string;
  showAutoSubtitleManager?: boolean;
}

interface PlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  muted: boolean;
  volume: number;
  subtitles: boolean;
  playbackRate: number;
  buffering: boolean;
  fullscreen: boolean;
  showSubtitleManager: boolean;
  generatedSubtitles: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  poster,
  title,
  isPremium = false,
  isPreviewMode = false,
  previewTimeLeft = 0,
  onPreviewEnd,
  purchased = false,
  autoPlay = false,
  onTimeUpdate,
  subtitlesUrl,
  showAutoSubtitleManager = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    playing: autoPlay,
    currentTime: 0,
    duration: 0,
    muted: false,
    volume: 1,
    subtitles: false,
    playbackRate: 1,
    buffering: false,
    fullscreen: false,
    showSubtitleManager: false,
    generatedSubtitles: null
  });
  
  const [controlsVisible, setControlsVisible] = useState(true);
  const [mouseInactive, setMouseInactive] = useState(false);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 비디오 로드 및 초기화
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: video.duration
      }));
    };
    
    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: video.currentTime
      }));
      
      // 상위 컴포넌트에 현재 시간 전달
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
      
      // 미리보기 모드이고 시간이 다 되었다면
      if (isPreviewMode && previewTimeLeft <= 0 && onPreviewEnd) {
        video.pause();
        setPlayerState(prev => ({ ...prev, playing: false }));
        onPreviewEnd();
      }
    };
    
    const handleEnded = () => {
      setPlayerState(prev => ({
        ...prev,
        playing: false,
        currentTime: 0
      }));
      video.currentTime = 0;
    };
    
    const handleWaiting = () => {
      setPlayerState(prev => ({
        ...prev,
        buffering: true
      }));
    };
    
    const handlePlaying = () => {
      setPlayerState(prev => ({
        ...prev,
        buffering: false
      }));
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    
    if (autoPlay) {
      try {
        video.play().catch(err => {
          console.error('자동 재생 실패:', err);
          setPlayerState(prev => ({ ...prev, playing: false }));
        });
      } catch (err) {
        console.error('자동 재생 오류:', err);
        setPlayerState(prev => ({ ...prev, playing: false }));
      }
    }
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [videoUrl, autoPlay, isPreviewMode, previewTimeLeft, onPreviewEnd, onTimeUpdate]);
  
  // 마우스 움직임에 따른 컨트롤 표시/숨김 처리
  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true);
      setMouseInactive(false);
      
      // 이전 타이머 제거
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      
      // 3초 후 마우스 비활성화 상태로 설정
      inactivityTimeoutRef.current = setTimeout(() => {
        if (playerState.playing) {
          setMouseInactive(true);
          setControlsVisible(false);
        }
      }, 3000);
    };
    
    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => setControlsVisible(false));
      container.addEventListener('mouseenter', () => setControlsVisible(true));
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', () => setControlsVisible(false));
        container.removeEventListener('mouseenter', () => setControlsVisible(true));
      }
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [playerState.playing]);
  
  // 재생/일시정지 토글
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (playerState.playing) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('재생 실패:', err);
      });
    }
    
    setPlayerState(prev => ({
      ...prev,
      playing: !prev.playing
    }));
  };
  
  // 시간 이동
  const handleSeek = (newTime: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    // 미리보기 모드이고 제한시간을 초과하려는 경우
    if (isPreviewMode && newTime > previewTimeLeft) {
      newTime = Math.min(newTime, previewTimeLeft);
    }
    
    video.currentTime = newTime;
    setPlayerState(prev => ({
      ...prev,
      currentTime: newTime
    }));
  };
  
  // 음소거 토글
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setPlayerState(prev => ({
      ...prev,
      muted: !prev.muted
    }));
  };
  
  // 볼륨 조절
  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = newVolume / 100;
    setPlayerState(prev => ({
      ...prev,
      volume: newVolume / 100,
      muted: newVolume === 0
    }));
  };
  
  // 자막 토글
  const toggleSubtitles = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const tracks = video.textTracks;
    if (tracks.length > 0) {
      const track = tracks[0];
      const newSubtitlesState = track.mode === 'showing' ? 'hidden' : 'showing';
      track.mode = newSubtitlesState as TextTrackMode;
      
      setPlayerState(prev => ({
        ...prev,
        subtitles: newSubtitlesState === 'showing'
      }));
    }
  };
  
  // 전체화면 토글
  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('전체화면 전환 실패:', err);
      });
      setPlayerState(prev => ({ ...prev, fullscreen: true }));
    } else {
      document.exitFullscreen();
      setPlayerState(prev => ({ ...prev, fullscreen: false }));
    }
  };
  
  // 10초 앞으로/뒤로 이동
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(video.currentTime + 10, video.duration);
    video.currentTime = newTime;
    setPlayerState(prev => ({ ...prev, currentTime: newTime }));
  };
  
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(video.currentTime - 10, 0);
    video.currentTime = newTime;
    setPlayerState(prev => ({ ...prev, currentTime: newTime }));
  };
  
  // 시간 포맷팅 (초 -> MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 미리보기 남은 시간 표시
  const renderPreviewTimeLeft = () => {
    if (!isPreviewMode) return null;
    return `${previewTimeLeft}초 남음`;
  };
  
  return (
    <div className="space-y-4">
      <div 
        ref={playerContainerRef}
        className={`relative rounded-lg overflow-hidden bg-black ${mouseInactive ? 'cursor-none' : ''}`}
        style={{ aspectRatio: '16/9' }}
      >
      {/* 비디오 플레이어 */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        onClick={togglePlay}
      >
        {subtitlesUrl && (
          <track 
            kind="subtitles" 
            src={subtitlesUrl} 
            srcLang="ko" 
            label="한국어"
          />
        )}
        브라우저가 비디오 재생을 지원하지 않습니다.
      </video>
      
      {/* 프리미엄/미리보기 표시 */}
      {isPremium && !purchased && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="default" className="text-xs font-semibold bg-amber-500 text-white">
            프리미엄
          </Badge>
        </div>
      )}
      
      {isPreviewMode && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="outline" className="bg-black/70 text-white text-xs">
            미리보기 {renderPreviewTimeLeft()}
          </Badge>
        </div>
      )}
      
      {/* 버퍼링 표시 */}
      {playerState.buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      
      {/* 제목 표시 (컨트롤이 보일 때만) */}
      {controlsVisible && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 text-white">
          <h3 className="text-lg font-medium truncate">{title}</h3>
        </div>
      )}
      
      {/* 플레이어 컨트롤 */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 z-10 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* 시크바 */}
        <div 
          ref={seekBarRef}
          className="w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            const newTime = playerState.duration * clickPosition;
            handleSeek(newTime);
          }}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ width: `${(playerState.currentTime / playerState.duration) * 100}%` }}
          />
          
          {/* 시크바 버튼 */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg"
            style={{ left: `${(playerState.currentTime / playerState.duration) * 100}%` }}
          />
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* 재생/일시정지 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white h-8 w-8" 
              onClick={togglePlay}
            >
              {playerState.playing ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            
            {/* 뒤로 10초 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white h-8 w-8" 
              onClick={skipBackward}
            >
              <SkipBack size={18} />
            </Button>
            
            {/* 앞으로 10초 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white h-8 w-8" 
              onClick={skipForward}
            >
              <SkipForward size={18} />
            </Button>
            
            {/* 볼륨 컨트롤 */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white h-8 w-8" 
                onClick={toggleMute}
              >
                {playerState.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              
              <div className="hidden sm:block w-20">
                <Slider
                  value={[playerState.muted ? 0 : playerState.volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleVolumeChange(value[0])}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* 시간 표시 */}
            <div className="text-white text-xs hidden sm:block">
              {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 자막 토글 버튼 */}
            {subtitlesUrl && (
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${playerState.subtitles ? 'text-primary' : 'text-white'}`}
                onClick={toggleSubtitles}
              >
                <Subtitles size={18} />
              </Button>
            )}

            {/* 자동 자막 관리자 토글 버튼 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${playerState.showSubtitleManager ? 'text-primary' : 'text-white'}`}
              onClick={() => setPlayerState(prev => ({ ...prev, showSubtitleManager: !prev.showSubtitleManager }))}
              title="자동 자막 생성"
            >
              <Subtitles size={18} />
              {!subtitlesUrl && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />}
            </Button>
            
            {/* 전체화면 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white h-8 w-8" 
              onClick={toggleFullscreen}
            >
              <Maximize size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* 미리보기 종료 알림 */}
      {isPreviewMode && previewTimeLeft <= 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
            <h3 className="text-xl font-bold mb-2">미리보기가 종료되었습니다</h3>
            <p className="text-muted-foreground mb-4">
              전체 콘텐츠를 시청하려면 강의를 구매해주세요.
            </p>
          </div>
        </div>
      )}
      
      {/* 클릭 영역 (빈 공간 클릭 시 재생/일시정지) */}
        <div 
          className="absolute inset-0 z-0"
          onClick={togglePlay}
        />
      </div>

      {/* 자동 자막 관리자 패널 */}
      {playerState.showSubtitleManager && (
        <div className="mt-4">
          <AutoSubtitleManager
            videoUrl={videoUrl}
            onSubtitlesGenerated={(subtitles) => {
              setPlayerState(prev => ({ ...prev, generatedSubtitles: subtitles }));
              
              // 생성된 자막을 비디오에 동적으로 추가
              const video = videoRef.current;
              if (video && subtitles) {
                // 기존 자막 트랙 제거
                const existingTracks = video.textTracks;
                for (let i = existingTracks.length - 1; i >= 0; i--) {
                  const track = existingTracks[i];
                  if (track.label === '자동 생성 자막') {
                    track.mode = 'disabled';
                  }
                }
                
                // 새 자막 트랙 생성
                const blob = new Blob([subtitles], { type: 'text/vtt' });
                const url = URL.createObjectURL(blob);
                
                // track 엘리먼트 생성 및 추가
                const track = document.createElement('track');
                track.kind = 'subtitles';
                track.src = url;
                track.srclang = 'ko';
                track.label = '자동 생성 자막';
                track.default = true;
                
                video.appendChild(track);
                
                // 자막 활성화
                setTimeout(() => {
                  const textTrack = video.textTracks[video.textTracks.length - 1];
                  if (textTrack) {
                    textTrack.mode = 'showing';
                    setPlayerState(prev => ({ ...prev, subtitles: true }));
                  }
                }, 100);
              }
            }}
            className="bg-gray-900/90 backdrop-blur-sm border border-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;