import { useState, useRef, useEffect, useCallback } from "react";
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
  SkipBack,
  SkipForward,
  Subtitles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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

interface CurriculumItem {
  id: number;
  title: string;
  duration: string;
  description: string;
  price: number;
  isPurchased: boolean;
}

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
  price: number; // 전체 강의 가격
  trainer: {
    name: string;
    avatar: string;
  };
  tags: string[];
  curriculum: CurriculumItem[]; // 커리큘럼 항목 목록
}

export default function VideoTraining() {
  const [videoFilter, setVideoFilter] = useState("all");
  // 프리미엄 비디오 미리보기 시간 제한 (초)
  const PREVIEW_TIME_LIMIT = 30; 
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  // 로컬 스토리지에서 구매 정보 가져오기
  const [purchasedItems, setPurchasedItems] = useState<{videoId: number, itemId: number}[]>(() => {
    const savedItems = localStorage.getItem('purchasedVideoItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [previewItem, setPreviewItem] = useState<{videoId: number, itemId: number} | null>(null);
  const [previewTimeLeft, setPreviewTimeLeft] = useState<number>(30); // 미리보기 시간 (초)
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // 직접 함수 정의로 순환 참조 문제 해결
  const checkItemPurchased = (videoId: number, itemId: number, items: {videoId: number, itemId: number}[]) => {
    return items.some(item => item.videoId === videoId && item.itemId === itemId);
  };
  
  // 영상 구매 함수 - 권한 확인 및 구매 처리
  const handlePurchaseItem = (videoId: number, itemId: number, price: number) => {
    console.log("구매 처리 시작: ", videoId, itemId, price);
    
    try {
      // 로그인 상태 체크
      if (!isAuthenticated) {
        toast({
          title: "로그인 필요",
          description: "강의를 구매하려면 로그인이 필요합니다.",
          variant: "destructive",
        });
        
        // 로그인 페이지로 리디렉션 (1.5초 후)
        setTimeout(() => {
          window.location.href = '/auth';
        }, 1500);
        
        return;
      }
      
      // 이미 구매한 항목인지 체크
      if (checkItemPurchased(videoId, itemId, purchasedItems)) {
        console.log("이미 구매한 항목:", videoId, itemId);
        toast({
          title: "이미 구매함",
          description: "이미 구매한 강의입니다. 지금 시청하실 수 있습니다.",
          variant: "default",
        });
        return;
      }
      
      // 구매 확인 대화상자
      if (confirm(`${price.toLocaleString()}원 강의를 구매하시겠습니까?`)) {
        // 새로운 구매 항목 추가
        const newPurchasedItems = [...purchasedItems, {videoId, itemId}];
        console.log("구매 완료:", newPurchasedItems);
        
        // 상태 업데이트
        setPurchasedItems(newPurchasedItems);
        
        // 로컬 스토리지에 구매 정보 저장
        localStorage.setItem('purchasedVideoItems', JSON.stringify(newPurchasedItems));
        
        // 성공 메시지
        toast({
          title: "구매 성공",
          description: "강의 구매가 완료되었습니다. 지금 바로 시청하실 수 있습니다.",
          variant: "default",
        });
        
        // 페이지 새로고침 (상태 반영을 위해)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("구매 처리 중 오류 발생:", error);
      toast({
        title: "구매 처리 오류",
        description: "강의 구매 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };
  
  // 구매 여부 확인 함수 - useCallback 사용하지 않고 직접 정의
  const isItemPurchased = (videoId: number, itemId: number) => {
    return checkItemPurchased(videoId, itemId, purchasedItems);
  };
  
  // 로그인 상태에 따라 구매 처리 - 모든 함수를 순수 함수로 변경
  const handlePurchaseClick = (videoId: number, itemId: number, price: number) => {
    console.log("구매 버튼 클릭:", videoId, itemId, price);
    
    // 로그인 상태 확인 (버튼에 disabled 속성이 있지만, 추가 안전장치로 처리)
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "강의를 구매하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }
    
    // 구매 처리
    handlePurchaseItem(videoId, itemId, price);
  };
  
  // 미리보기 시작 함수
  const handleStartPreview = (videoId: number, itemId: number) => {
    setPreviewItem({videoId, itemId});
    setPreviewTimeLeft(30); // 미리보기 시간 초기화 (30초)
    setIsPreviewMode(true);
    setIsPlaying(true);
    setPreviewEnded(false);
    
    // 타이머 설정
    const timer = setInterval(() => {
      setPreviewTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPreviewEnded(true);
          setIsPreviewMode(false);
          
          const videoElement = videoRef.current;
          if (videoElement) {
            videoElement.pause();
            setPlayerState(prevState => ({ ...prevState, playing: false }));
          }
          
          toast({
            title: "미리보기 종료",
            description: "30초 미리보기가 종료되었습니다. 전체 강의를 보시려면 구매하세요.",
          });
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 클린업 함수 (비디오 상세 정보 페이지를 나가면 타이머 정리)
    return () => clearInterval(timer);
  };
  
  // 비디오 플레이어 관련 상태
  const videoRef = useRef<HTMLVideoElement>(null);
  // 비디오 플레이어 상태를 위한 인터페이스
  interface PlayerState {
    playing: boolean;
    currentTime: number;
    duration: number;
    muted: boolean;
    volume: number;
    subtitles: boolean;
    playbackRate: number;
    paused: boolean;
    controlsVisible: boolean;
  }
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    muted: false,
    volume: 1,
    subtitles: false,
    playbackRate: 1,
    paused: true,
    controlsVisible: true
  });
  const seekBarRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

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
      price: 0, // 전체 강의 가격
      trainer: {
        name: "김훈련",
        avatar: "https://robohash.org/trainer-kim?set=set4&size=200x200&bgset=bg1",
      },
      tags: ["기본 명령어", "입문", "누구나"],
      curriculum: [
        {
          id: 101,
          title: "기본 원리 이해하기",
          duration: "5:30",
          description: "반려견 훈련의 기본 원리와 긍정적 강화 훈련법에 대해 알아봅니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 102,
          title: "앉아 명령 훈련하기",
          duration: "4:45",
          description: "반려견에게 '앉아' 명령을 효과적으로 가르치는 방법을 배웁니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 103,
          title: "엎드려 명령 훈련하기",
          duration: "5:05",
          description: "반려견에게 '엎드려' 명령을 단계적으로 가르치는 방법을 배웁니다.",
          price: 0,
          isPurchased: true
        }
      ]
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
      price: 29000, // 전체 강의 가격
      trainer: {
        name: "이사회",
        avatar: "https://robohash.org/trainer-lee?set=set4&size=200x200&bgset=bg1",
      },
      tags: ["사회화", "만남", "행동 교정"],
      curriculum: [
        {
          id: 201,
          title: "사회화의 중요성 이해하기",
          duration: "6:15",
          description: "강아지 사회화가 중요한 이유와 적절한 시기에 대해 알아봅니다.",
          price: 8000,
          isPurchased: false
        },
        {
          id: 202,
          title: "첫 만남 준비하기",
          duration: "8:30",
          description: "다른 강아지와의 첫 만남을 위한 준비와 주의사항을 설명합니다.",
          price: 10000,
          isPurchased: false
        },
        {
          id: 203,
          title: "사회화 장소 선택하기",
          duration: "5:20",
          description: "안전하고 효과적인 사회화를 위한 장소 선택 방법에 대해 알아봅니다.",
          price: 6000,
          isPurchased: false
        },
        {
          id: 204,
          title: "문제 행동 대처하기",
          duration: "8:40",
          description: "사회화 과정에서 발생할 수 있는 문제 행동과 해결 방법을 배웁니다.",
          price: 12000,
          isPurchased: false
        }
      ]
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
      price: 0, // 무료 강의
      trainer: {
        name: "이산책",
        avatar: "https://robohash.org/trainer-walk?set=set4&size=200x200&bgset=bg1",
      },
      tags: ["산책", "끌기", "리드 훈련"],
      curriculum: [
        {
          id: 301,
          title: "산책 리드 사용하기",
          duration: "6:20",
          description: "올바른 산책 리드 선택과 사용법에 대해 알아봅니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 302,
          title: "끌기 행동의 원인 이해하기",
          duration: "5:10",
          description: "반려견이 산책 중 끌기 행동을 하는 원인과 심리를 분석합니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 303,
          title: "효과적인 교정 방법",
          duration: "7:40",
          description: "끌기 행동을 효과적으로 교정하는 훈련 방법을 단계별로 배웁니다.",
          price: 0,
          isPurchased: true
        }
      ]
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
      price: 35000, // 전체 강의 가격
      trainer: {
        name: "최행동",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["분리불안", "심리", "행동 교정"],
      curriculum: [
        {
          id: 401,
          title: "분리불안의 이해",
          duration: "7:15",
          description: "반려견 분리불안의 원인과 증상에 대해 심층적으로 알아봅니다.",
          price: 9000,
          isPurchased: false
        },
        {
          id: 402,
          title: "분리불안 진단하기",
          duration: "6:20",
          description: "내 반려견의 분리불안 정도를 진단하는 방법을 배웁니다.",
          price: 8000,
          isPurchased: false
        },
        {
          id: 403,
          title: "단계별 치료 접근법",
          duration: "8:50",
          description: "분리불안 완화를 위한 효과적인 단계별 접근법을 알아봅니다.",
          price: 10000,
          isPurchased: false
        },
        {
          id: 404,
          title: "환경 조성과 일상 관리",
          duration: "6:10",
          description: "분리불안을 줄이는 환경 조성과 일상 관리 방법을 배웁니다.",
          price: 8000,
          isPurchased: false
        }
      ]
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
      price: 0, // 무료 강의
      trainer: {
        name: "박재미",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["트릭", "하이파이브", "즐거운 훈련"],
      curriculum: [
        {
          id: 501,
          title: "트릭 훈련의 중요성",
          duration: "3:25",
          description: "반려견과의 유대감을 강화하는 트릭 훈련의 중요성을 알아봅니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 502,
          title: "하이파이브 기초 훈련",
          duration: "4:50",
          description: "하이파이브 훈련을 위한 기초 단계와 준비 사항을 배웁니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 503,
          title: "하이파이브 완성하기",
          duration: "4:00",
          description: "하이파이브 동작을 완성하고 다양한 상황에서 활용하는 방법을 배웁니다.",
          price: 0,
          isPurchased: true
        }
      ]
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
      price: 32000, // 전체 강의 가격
      trainer: {
        name: "박민첩",
        avatar: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["어질리티", "운동", "활동성"],
      curriculum: [
        {
          id: 601,
          title: "어질리티의 이해",
          duration: "5:30",
          description: "어질리티 훈련의 개념과 목적, 필요한 준비물에 대해 알아봅니다.",
          price: 8000,
          isPurchased: false
        },
        {
          id: 602,
          title: "기본 장비 소개",
          duration: "6:15",
          description: "어질리티 훈련에 사용되는 다양한 장비와 그 용도를 배웁니다.",
          price: 7000,
          isPurchased: false
        },
        {
          id: 603,
          title: "기초 장애물 훈련",
          duration: "8:25",
          description: "허들, 터널 등 기초 장애물을 통과하는 훈련 방법을 배웁니다.",
          price: 10000,
          isPurchased: false
        },
        {
          id: 604,
          title: "코스 완주 훈련",
          duration: "5:30",
          description: "여러 장애물을 연결한 간단한 코스를 완주하는 훈련 방법을 배웁니다.",
          price: 9000,
          isPurchased: false
        }
      ]
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
      price: 28000, // 전체 강의 가격
      trainer: {
        name: "최행동",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["짖음", "소음", "이웃 민원"],
      curriculum: [
        {
          id: 701,
          title: "짖음 행동의 원인",
          duration: "5:40",
          description: "반려견이 짖는 다양한 원인과 각 원인별 특징을 알아봅니다.",
          price: 7000,
          isPurchased: false
        },
        {
          id: 702,
          title: "상황별 대처 방법",
          duration: "7:15",
          description: "다양한 상황에서의 짖음 행동에 대한 효과적인 대처법을 배웁니다.",
          price: 8000,
          isPurchased: false
        },
        {
          id: 703,
          title: "긍정적 강화 훈련법",
          duration: "5:25",
          description: "짖음 행동을 개선하기 위한 긍정적 강화 훈련 방법을 배웁니다.",
          price: 7000,
          isPurchased: false
        },
        {
          id: 704,
          title: "이웃과의 관계 관리",
          duration: "3:30",
          description: "반려견 짖음으로 인한 이웃과의 갈등을 관리하는 방법을 알아봅니다.",
          price: 6000,
          isPurchased: false
        }
      ]
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
      price: 0, // 무료 강의
      trainer: {
        name: "박후각",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      },
      tags: ["노즈워크", "후각", "지능 발달"],
      curriculum: [
        {
          id: 801,
          title: "노즈워크의 이해",
          duration: "4:15",
          description: "노즈워크의 개념과 반려견에게 주는 이점에 대해 알아봅니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 802,
          title: "기초 노즈워크 훈련",
          duration: "6:20",
          description: "집에서 간단하게 시작할 수 있는 기초 노즈워크 훈련 방법을 배웁니다.",
          price: 0,
          isPurchased: true
        },
        {
          id: 803,
          title: "중급 노즈워크 활동",
          duration: "6:55",
          description: "난이도를 높인 중급 노즈워크 활동과 게임을 통해 반려견의 능력을 향상시킵니다.",
          price: 0,
          isPurchased: true
        }
      ]
    },
  ];

  const filteredVideos = videoFilter === "all" 
    ? videos 
    : videoFilter === "free" 
      ? videos.filter(video => !video.isPremium)
      : videoFilter === "premium" 
        ? videos.filter(video => video.isPremium)
        : videos.filter(video => video.category === videoFilter);

  // 비디오 플레이어 컨트롤 함수들
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(error => {
        console.error('비디오 재생 실패:', error);
      });
    } else {
      video.pause();
    }
    
    setPlayerState(prev => ({
      ...prev,
      playing: !video.paused,
      paused: video.paused
    }));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    
    setPlayerState(prev => ({
      ...prev,
      muted: video.muted
    }));
  };

  const seekTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    video.currentTime = newTime;
    
    setPlayerState(prev => ({
      ...prev,
      currentTime: newTime
    }));
  };

  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const seekBar = seekBarRef.current;
    
    if (!video || !seekBar) return;
    
    const rect = seekBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const seekRatio = offsetX / rect.width;
    const newTime = video.duration * seekRatio;
    
    video.currentTime = newTime;
    
    setPlayerState(prev => ({
      ...prev,
      currentTime: newTime
    }));
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen().catch(err => {
        console.error('전체화면 전환 실패:', err);
      });
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 미리보기 남은 시간 포맷팅
  const formatPreviewTimeLeft = (): string => {
    return `${previewTimeLeft}초 남음`;
  };

  // 영상 플레이어 이벤트 핸들러
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: video.currentTime,
        paused: video.paused
      }));
      
      // 미리보기 제한 체크 (비로그인 & 프리미엄 영상일 경우)
      if (selectedVideo && selectedVideo.isPremium && !isAuthenticated && video.currentTime >= PREVIEW_TIME_LIMIT) {
        video.pause();
        setPreviewEnded(true);
      }
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

  // 비디오 컨트롤 함수 (다른 동일한 함수와의 중복 방지를 위해 삭제함)
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const volume = parseFloat(e.target.value);
    video.volume = volume;
    setPlayerState(prev => ({ ...prev, volume, muted: volume === 0 }));
  };

  // 영상 탐색 (시간 이동)
  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  };

  // 영상 상세 정보 표시
  const handleShowVideoDetails = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setPreviewEnded(false);
    setElapsedTime(0);
  };
  
  // 영상 재생 시작
  const handlePlayVideo = () => {
    if (!selectedVideo) return;
    
    setIsPlaying(true);
    setPreviewEnded(false);
    setElapsedTime(0);
    setPlayerState(prev => ({ ...prev, playing: true, currentTime: 0 }));

    // Premium 영상이고 인증되지 않은 사용자일 경우 타이머 시작
    if (selectedVideo.isPremium && !isAuthenticated) {
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
                      onClick={() => handleShowVideoDetails(video)}
                    >
                      <Search size={16} />
                      상세 보기
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

      {/* 영상 상세 정보 모달 */}
      {selectedVideo && !isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseVideo}>
                닫기
              </Button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 썸네일 이미지 */}
                <div>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedVideo.thumbnail} 
                      alt={selectedVideo.title} 
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">난이도</span>
                      <Badge>{selectedVideo.level}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">영상 길이</span>
                      <span>{selectedVideo.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">분류</span>
                      <Badge variant="outline">{selectedVideo.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">조회수</span>
                      <span>{selectedVideo.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Star size={16} className="fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="text-sm">{selectedVideo.rating} ({selectedVideo.reviews})</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 flex items-center justify-center gap-2" 
                    onClick={handlePlayVideo}
                    disabled={selectedVideo.isPremium && !isAuthenticated}
                  >
                    <Play size={16} />
                    지금 시청하기
                  </Button>
                  {selectedVideo.isPremium && !isAuthenticated && (
                    <div className="mt-2 text-xs text-center text-amber-500 flex items-center justify-center">
                      <Lock size={12} className="mr-1" />
                      프리미엄 강의는 로그인 후 이용 가능합니다
                    </div>
                  )}
                </div>
                
                {/* 영상 정보 및 커리큘럼 */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">강의 설명</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedVideo.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">강사 정보</h4>
                    <div className="flex items-center">
                      <img 
                        src={selectedVideo.trainer.avatar} 
                        alt={selectedVideo.trainer.name}
                        className="w-12 h-12 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <h5 className="font-medium">{selectedVideo.trainer.name} 훈련사</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          분야: {selectedVideo.category} 전문
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">커리큘럼</h4>
                    <div className="space-y-2 border rounded-lg p-3 divide-y">
                      {selectedVideo && selectedVideo.curriculum.map((item, index) => (
                        <div key={item.id} className="flex items-center py-3">
                          <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">{item.title}</h5>
                              {item.isPurchased || isItemPurchased(selectedVideo.id, item.id) ? (
                                <Badge variant="success" className="ml-2">구매 완료</Badge>
                              ) : item.price > 0 ? (
                                <Badge variant="secondary" className="ml-2">{item.price.toLocaleString()}원</Badge>
                              ) : (
                                <Badge variant="outline" className="ml-2">무료</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.duration}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{item.description}</p>
                            
                            {/* 구매 또는 시청 버튼 */}
                            <div className="mt-2">
                              {item.isPurchased || isItemPurchased(selectedVideo.id, item.id) || item.price === 0 ? (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex items-center gap-1"
                                  onClick={() => {
                                    setIsPlaying(true);
                                    // 추가 로직: 특정 챕터부터 시작
                                  }}
                                >
                                  <Play size={14} />
                                  지금 시청하기
                                </Button>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="flex items-center gap-1"
                                    type="button"
                                    onClick={() => {
                                      // 로그인 상태 확인
                                      if (!isAuthenticated) {
                                        alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
                                        // 로그인 페이지로 리디렉션
                                        window.location.href = '/auth';
                                        return;
                                      }
                                      
                                      console.log("인증 상태 확인:", isAuthenticated);
                                      
                                      if (confirm(`${item.title} 강의를 ${item.price.toLocaleString()}원에 구매하시겠습니까?`)) {
                                        // 구매 정보 저장
                                        const existingItems = JSON.parse(localStorage.getItem('purchasedVideoItems') || '[]');
                                        const newItem = { videoId: selectedVideo?.id || 0, itemId: item.id };
                                        
                                        // 중복 제거하여 추가
                                        const updatedItems = [
                                          ...existingItems.filter(i => 
                                            !(i.videoId === newItem.videoId && i.itemId === newItem.itemId)
                                          ),
                                          newItem
                                        ];
                                        
                                        // 로컬 스토리지 업데이트
                                        localStorage.setItem('purchasedVideoItems', JSON.stringify(updatedItems));
                                        
                                        // 성공 메시지
                                        alert("강의가 구매되었습니다!");
                                        
                                        // 페이지 새로고침
                                        window.location.reload();
                                      }
                                    }}
                                  >
                                    {item.price.toLocaleString()}원 구매
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    onClick={() => handleStartPreview(selectedVideo.id, item.id)}
                                  >
                                    <Play size={14} />
                                    미리보기
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 전체 강의 구매 옵션 */}
                    {selectedVideo && selectedVideo.isPremium && (
                      <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">전체 강의 패키지 구매</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              모든 강의를 할인된 가격에 구매하세요!
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              {selectedVideo.price.toLocaleString()}원
                            </div>
                            <div className="text-xs line-through text-gray-500">
                              {Math.round(selectedVideo.curriculum.reduce((sum, item) => sum + item.price, 0) * 1.2).toLocaleString()}원
                            </div>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-2" 
                          disabled={!isAuthenticated}
                          onClick={() => {
                            // 전체 강의 구매 처리
                            selectedVideo.curriculum.forEach(item => {
                              if (!item.isPurchased && !isItemPurchased(selectedVideo.id, item.id)) {
                                setPurchasedItems(prev => [...prev, {videoId: selectedVideo.id, itemId: item.id}]);
                              }
                            });
                            toast({
                              title: "패키지 구매 완료",
                              description: `${selectedVideo.price.toLocaleString()}원 상당의 전체 강의 패키지를 구매했습니다.`,
                            });
                          }}
                        >
                          전체 강의 구매하기
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">태그</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              <div className="aspect-video bg-black relative">
                {/* 비디오 플레이어 */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={selectedVideo.thumbnail}
                  onClick={togglePlay}
                >
                  {/* 영상 파일이 없는 경우를 위한 대체 소스 (실제 구현시 서버의 실제 영상 파일로 교체) */}
                  <source src={`https://storage.googleapis.com/talez-videos/sample-${selectedVideo.id % 3 + 1}.mp4`} type="video/mp4" />
                  
                  {/* 자막 트랙 */}
                  <track 
                    label="한국어" 
                    kind="subtitles" 
                    srcLang="ko" 
                    src={`/subtitles/video-${selectedVideo.id}-ko.vtt`} 
                    default={playerState.subtitles}
                  />
                  <track 
                    label="English" 
                    kind="subtitles" 
                    srcLang="en" 
                    src={`/subtitles/video-${selectedVideo.id}-en.vtt`}
                  />
                  브라우저가 동영상 태그를 지원하지 않습니다.
                </video>
                
                {/* 비디오 컨트롤 오버레이 */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playerState.controlsVisible ? 'opacity-100' : 'opacity-0'}`}
                  onMouseMove={() => setPlayerState(prev => ({...prev, controlsVisible: true}))}
                  onMouseLeave={() => !playerState.paused && setPlayerState(prev => ({...prev, controlsVisible: false}))}
                >
                  {/* 재생/일시정지 버튼 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/40 text-white hover:bg-black/60 rounded-full h-16 w-16"
                    onClick={togglePlay}
                    aria-label={playerState.paused ? "재생" : "일시정지"}
                  >
                    {playerState.paused ? <Play size={32} /> : <Pause size={32} />}
                  </Button>
                </div>
                
                {/* 컨트롤 바 */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2 transition-opacity duration-300 ${playerState.controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                  {/* 진행 바 */}
                  <div className="relative h-1 bg-gray-600 rounded-full mb-3 cursor-pointer" onClick={handleSeekBarClick} ref={seekBarRef}>
                    <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{ width: `${(playerState.currentTime / playerState.duration) * 100}%` }}></div>
                  </div>
                  
                  {/* 컨트롤 버튼 그룹 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={togglePlay}>
                        {playerState.paused ? <Play size={18} /> : <Pause size={18} />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={() => seekTime(-10)}>
                        <SkipBack size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={() => seekTime(10)}>
                        <SkipForward size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={toggleMute}>
                        {playerState.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={toggleSubtitles}>
                        <Subtitles size={18} className={playerState.subtitles ? "text-primary" : "text-white"} />
                      </Button>
                      <span className="text-white text-xs ml-2">
                        {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={toggleFullscreen}>
                      <Maximize size={18} />
                    </Button>
                  </div>
                </div>
                
                {/* 프리미엄 비로그인 시간 제한 오버레이 */}
                {(selectedVideo.isPremium && !isAuthenticated) || isPreviewMode ? (
                  <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 rounded px-3 py-1 text-white flex items-center">
                    {previewEnded ? (
                      <AlertCircle size={14} className="mr-1 text-amber-500" />
                    ) : (
                      <span className="mr-1">미리보기</span>
                    )}
                    {previewEnded ? "미리보기 종료" : isPreviewMode ? formatPreviewTimeLeft() : `${PREVIEW_TIME_LIMIT}초`}
                  </div>
                ) : null}
                
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