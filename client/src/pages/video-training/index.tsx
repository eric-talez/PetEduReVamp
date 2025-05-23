import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Lock, 
  Play, 
  Pause, 
  Star, 
  Search, 
  Filter, 
  Maximize, 
  Volume2, 
  VolumeX,
  SkipForward,
  SkipBack,
  Subtitles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: string;
  isPremium: boolean;
  category: string;
  views: number;
  rating: number;
  reviews: number;
  trainer: {
    name: string;
    avatar: string;
  };
  tags: string[];
}

export default function VideoTraining() {
  const [videoFilter, setVideoFilter] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // 비디오 플레이어 관련 상태
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playerState, setPlayerState] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
    muted: false,
    volume: 1,
    subtitles: false,
    playbackRate: 1
  });
  const [showControls, setShowControls] = useState(true);

  // 무료 영상과 유료 영상 데이터
  const videos: Video[] = [
    {
      id: 1,
      title: "반려견 기본 훈련: 앉아, 엎드려",
      description: "가장 기본적인 반려견 훈련 명령어인 '앉아'와 '엎드려'를 효과적으로 가르치는 방법을 알아봅니다.",
      thumbnail: "https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      duration: "15:20",
      level: "입문",
      isPremium: false,
      category: "기본 훈련",
      views: 12500,
      rating: 4.8,
      reviews: 342,
      trainer: {
        name: "김훈련",
        avatar: "https://robohash.org/trainer-kim?set=set4&size=200x200&bgset=bg1",
      },
      tags: ["기본 명령어", "입문", "누구나"],
    },
    {
      id: 2,
      title: "강아지 사회화 훈련: 다른 강아지와 만나기",
      description: "반려견이 다른 강아지들과 편안하게 어울릴 수 있도록 사회화 훈련을 시키는 방법을 알려드립니다.",
      thumbnail: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      duration: "23:45",
      level: "중급",
      isPremium: true,
      category: "사회화",
      views: 8700,
      rating: 4.7,
      reviews: 215,
      trainer: {
        name: "이사회",
        avatar: "https://robohash.org/trainer-lee?set=set4&size=200x200&bgset=bg1",
      },
      tags: ["사회화", "만남", "행동 교정"],
    },
    {
      id: 3,
      title: "산책 시 끌기 교정하기",
      description: "산책할 때 리드를 당기는 문제 행동을 교정하는 효과적인 방법을 배워봅니다.",
      thumbnail: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      duration: "19:10",
      level: "초급",
      isPremium: false,
      category: "기본 훈련",
      views: 15800,
      rating: 4.9,
      reviews: 420,
      trainer: {
        name: "이산책",
        avatar: "https://robohash.org/trainer-walk?set=set4&size=200x200&bgset=bg1",
      },
      tags: ["산책", "끌기", "리드 훈련"],
    },
    {
      id: 4,
      title: "반려견 분리불안 극복하기",
      description: "혼자 있을 때 극심한 불안감을 느끼는 반려견의 분리불안을 해결하는 전문가의 노하우를 공유합니다.",
      thumbnail: "https://images.unsplash.com/photo-1583511655826-05700442b31b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      duration: "28:35",
      level: "전문가",
      isPremium: true,
      category: "행동 교정",
      views: 9200,
      rating: 4.8,
      reviews: 178,
      trainer: {
        name: "최행동",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["분리불안", "심리", "행동 교정"],
    },
    {
      id: 5,
      title: "재미있는 트릭 훈련: 하이파이브 가르치기",
      description: "반려견에게 하이파이브를 가르치는 방법을 통해 반려견과의 유대감을 강화하고 재미있는 상호작용을 배워봅니다.",
      thumbnail: "https://images.pexels.com/photos/2951921/pexels-photo-2951921.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      duration: "12:15",
      level: "입문",
      isPremium: false,
      category: "트릭 훈련",
      views: 18400,
      rating: 4.6,
      reviews: 310,
      trainer: {
        name: "박재미",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["트릭", "하이파이브", "즐거운 훈련"],
    },
    {
      id: 6,
      title: "반려견 어질리티 입문",
      description: "반려견의 활동성을 높이고 운동 능력을 향상시키는 기초 어질리티 훈련법을 배웁니다.",
      thumbnail: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      duration: "25:40",
      level: "중급",
      isPremium: true,
      category: "활동 훈련",
      views: 7800,
      rating: 4.7,
      reviews: 145,
      trainer: {
        name: "박민첩",
        avatar: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["어질리티", "운동", "활동성"],
    },
    {
      id: 7,
      title: "반려견 짖음 문제 해결하기",
      description: "과도한 짖음 행동을 개선하는 효과적인 훈련법과 일상에서 실천할 수 있는 관리 방법을 알려드립니다.",
      thumbnail: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      duration: "20:50",
      level: "중급",
      isPremium: true,
      category: "행동 교정",
      views: 11300,
      rating: 4.8,
      reviews: 265,
      trainer: {
        name: "최행동",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["짖음", "소음", "이웃 민원"],
    },
    {
      id: 8,
      title: "노즈워크: 반려견 후각 능력 향상시키기",
      description: "반려견의 자연스러운 후각 능력을 활용한 노즈워크 훈련을 통해 지능 발달과 스트레스 해소에 도움을 줍니다.",
      thumbnail: "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      duration: "17:30",
      level: "초급",
      isPremium: false,
      category: "특수 훈련",
      views: 6500,
      rating: 4.5,
      reviews: 120,
      trainer: {
        name: "박후각",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["노즈워크", "후각", "지능 발달"],
    },
  ];

  const filteredVideos = videoFilter === "all" 
    ? videos 
    : videoFilter === "free" 
      ? videos.filter(video => !video.isPremium)
      : videoFilter === "premium" 
        ? videos.filter(video => video.isPremium)
        : videos.filter(video => video.category === videoFilter);

  // 영상 플레이어 이벤트 핸들러
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: video.currentTime
      }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: video.duration
      }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({
        ...prev,
        playing: false
      }));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, selectedVideo]);

  // 자막 토글
  const toggleSubtitles = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setPlayerState(prev => {
      const newSubtitlesState = !prev.subtitles;
      // 자막 트랙 활성화/비활성화 로직
      if (video.textTracks && video.textTracks.length > 0) {
        for (let i = 0; i < video.textTracks.length; i++) {
          video.textTracks[i].mode = newSubtitlesState ? 'showing' : 'hidden';
        }
      }
      return { ...prev, subtitles: newSubtitlesState };
    });
  };

  // 재생/일시정지 토글
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (playerState.playing) {
      video.pause();
    } else {
      video.play();
    }
    
    setPlayerState(prev => ({ ...prev, playing: !prev.playing }));
  };

  // 볼륨 변경
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const volume = parseFloat(e.target.value);
    video.volume = volume;
    setPlayerState(prev => ({ ...prev, volume, muted: volume === 0 }));
  };

  // 음소거 토글
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMutedState = !playerState.muted;
    video.muted = newMutedState;
    setPlayerState(prev => ({ ...prev, muted: newMutedState }));
  };

  // 전체화면 토글
  const toggleFullscreen = () => {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // 영상 탐색 (시간 이동)
  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  };

  // 시간 포맷팅 (00:00 형식)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 영상 재생 시작
  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    setPreviewEnded(false);
    setElapsedTime(0);
    setPlayerState(prev => ({ ...prev, playing: true, currentTime: 0 }));

    // Premium 영상이고 인증되지 않은 사용자일 경우 타이머 시작
    if (video.isPremium && !isAuthenticated) {
      const timer = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          if (newTime >= 60) { // 60초(1분) 후 프리뷰 종료
            clearInterval(timer);
            setPreviewEnded(true);
            const videoElement = videoRef.current;
            if (videoElement) {
              videoElement.pause();
              setPlayerState(prevState => ({ ...prevState, playing: false }));
            }
            return 60;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  };

  // 영상 닫기
  const handleCloseVideo = () => {
    setIsPlaying(false);
    setSelectedVideo(null);
    setElapsedTime(0);
    setPreviewEnded(false);
  };

  // 로그인 페이지로 이동
  const handleGoToLogin = () => {
    setShowPremiumAlert(false);
    setLocation('/auth');
  };

  // 남은 시간 포맷팅
  const formatRemainingTime = () => {
    const remainingSeconds = 60 - elapsedTime;
    return `${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* 상단 배너 */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 shadow-lg">
        <img 
          src="https://images.pexels.com/photos/4277088/pexels-photo-4277088.jpeg?auto=compress&cs=tinysrgb&w=1600&h=400" 
          alt="영상 훈련"
          className="w-full h-full object-cover absolute"
        />
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10 container mx-auto">
          <h1 className="text-primary dark:text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            영상 훈련 라이브러리
          </h1>
          <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base max-w-xl mb-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            반려견 훈련 전문가들이 제공하는 고품질 영상으로 언제 어디서나 효과적인 훈련을 경험하세요.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">
              500+ 무료 영상
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">
              인기 훈련사 강의
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">
              초보자 추천 코스
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="훈련 영상 검색" 
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <Button className="ml-2">
              검색
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">인기 훈련 영상</h2>
          <p className="text-gray-600 dark:text-gray-400">
            다른 사용자들에게 인기 있는 훈련 영상을 만나보세요.
          </p>
        </div>

      {/* 탭 */}
      <Tabs defaultValue="all" className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setVideoFilter("all")}>전체</TabsTrigger>
            <TabsTrigger value="free" onClick={() => setVideoFilter("free")}>무료 영상</TabsTrigger>
            <TabsTrigger value="premium" onClick={() => setVideoFilter("premium")}>프리미엄</TabsTrigger>
          </TabsList>

          {/* 검색창 */}
          <div className="relative w-full sm:w-auto max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="영상 검색"
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={videoFilter === "기본 훈련" ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => setVideoFilter("기본 훈련")}
          >
            기본 훈련
          </Badge>
          <Badge
            variant={videoFilter === "행동 교정" ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => setVideoFilter("행동 교정")}
          >
            행동 교정
          </Badge>
          <Badge
            variant={videoFilter === "사회화" ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => setVideoFilter("사회화")}
          >
            사회화
          </Badge>
          <Badge
            variant={videoFilter === "트릭 훈련" ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => setVideoFilter("트릭 훈련")}
          >
            트릭 훈련
          </Badge>
          <Badge
            variant={videoFilter === "활동 훈련" ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => setVideoFilter("활동 훈련")}
          >
            활동 훈련
          </Badge>
          <Badge
            variant={videoFilter === "특수 훈련" ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => setVideoFilter("특수 훈련")}
          >
            특수 훈련
          </Badge>
        </div>

        {/* 비디오 그리드 */}
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handlePlayVideo(video)}
                    >
                      <Play size={16} />
                      재생하기
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {video.isPremium && (
                      <Badge variant="warning" className="shadow-sm">
                        <Lock size={12} className="mr-1" />
                        프리미엄
                      </Badge>
                    )}
                    <Badge variant="secondary" className="shadow-sm">
                      {video.duration}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-md line-clamp-2">{video.title}</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <img 
                      src={video.trainer.avatar} 
                      alt={video.trainer.name} 
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                    <span>{video.trainer.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Star size={14} className="fill-yellow-500 text-yellow-500 mr-1" />
                      <span>{video.rating} ({video.reviews})</span>
                    </div>
                    <span>{video.views.toLocaleString()} 조회</span>
                  </div>
                  <Badge variant="outline" className="mt-3">{video.level}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="free" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Free 필터에 대한 동일한 내용 */}
          </div>
        </TabsContent>
        <TabsContent value="premium" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Premium 필터에 대한 동일한 내용 */}
          </div>
        </TabsContent>
      </Tabs>

      {/* 비디오 플레이어 모달 */}
      {isPlaying && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseVideo}>
                닫기
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video bg-black">
                {/* 실제 영상 대신 임시 이미지 사용 */}
                <img 
                  src={selectedVideo.thumbnail} 
                  alt={selectedVideo.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* 프리미엄 비로그인 시간 제한 오버레이 */}
                {selectedVideo.isPremium && !isAuthenticated && (
                  <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 rounded px-3 py-1 text-white flex items-center">
                    {previewEnded ? (
                      <AlertCircle size={14} className="mr-1 text-amber-500" />
                    ) : (
                      <span className="mr-1">미리보기</span>
                    )}
                    {previewEnded ? "미리보기 종료" : formatRemainingTime()}
                  </div>
                )}
                
                {/* 미리보기 끝났을 때 오버레이 */}
                {selectedVideo.isPremium && !isAuthenticated && previewEnded && (
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-6 text-center">
                    <Lock size={40} className="text-amber-500 mb-3" />
                    <h3 className="text-white text-xl font-bold mb-2">미리보기가 종료되었습니다</h3>
                    <p className="text-gray-300 mb-4">
                      이 프리미엄 영상의 전체 내용을 보려면 로그인하고<br />
                      구독을 시작하세요.
                    </p>
                    <div className="flex gap-3">
                      <Button onClick={handleGoToLogin}>
                        로그인하기
                      </Button>
                      <Button variant="outline" onClick={handleCloseVideo}>
                        닫기
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    src={selectedVideo.trainer.avatar} 
                    alt={selectedVideo.trainer.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{selectedVideo.trainer.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedVideo.category} 전문
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <Star size={14} className="mr-1 fill-yellow-500 text-yellow-500" />
                    {selectedVideo.rating}
                  </Badge>
                  <Badge variant="outline">{selectedVideo.level}</Badge>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedVideo.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 프리미엄 컨텐츠 알림 */}
      <AlertDialog open={showPremiumAlert} onOpenChange={setShowPremiumAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Lock className="h-5 w-5 text-amber-500 mr-2" />
              프리미엄 콘텐츠
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 콘텐츠는 프리미엄 회원만 이용할 수 있습니다. 로그인하고 구독을 시작하세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleGoToLogin}>
              로그인 페이지로 이동
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}