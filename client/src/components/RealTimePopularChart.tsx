import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Minus, Eye, Heart, MessageCircle, Users, MapPin, Calendar, Star, Phone, Mail, Award, Share2, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PopularItem {
  id: number;
  title: string;
  description: string;
  category: string;
  views: number;
  likes: number;
  comments: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  imageUrl?: string;
  author?: string;
  location?: string;
  date?: string;
  detailPath: string;
}

export function RealTimePopularChart() {
  const [, setLocation] = useLocation();
  const [updateTime, setUpdateTime] = useState(new Date());
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 실시간 통계 데이터 조회
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/popular-stats'],
    refetchInterval: 30000, // 30초마다 자동 갱신
  });

  // 좋아요 기능
  const likeMutation = useMutation({
    mutationFn: async ({ postId, type }: { postId: number; type: string }) => {
      return apiRequest('POST', `/api/${type}/${postId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/popular-stats'] });
      toast({
        title: "좋아요!",
        description: "좋아요가 추가되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "좋아요 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  });

  // 공유 기능
  const handleShare = (title: string, id: number, type: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: `${window.location.origin}/${type}/${id}`,
      });
    } else {
      // 브라우저가 Web Share API를 지원하지 않는 경우
      navigator.clipboard.writeText(`${window.location.origin}/${type}/${id}`);
      toast({
        title: "링크 복사됨",
        description: "링크가 클립보드에 복사되었습니다.",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleItemClick = (item: PopularItem) => {
    console.log('[RealTimePopularChart] 아이템 클릭:', item.title, item.detailPath);

    if (item.detailPath.startsWith('/trainers/')) {
      const trainerId = item.detailPath.split('/')[2];
      const trainerData = getTrainerData(trainerId);
      setSelectedTrainer(trainerData);
      setIsTrainerModalOpen(true);

      // 메인메뉴와 일관성을 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent('trainerProfileViewed', {
        detail: { trainerId, source: 'popular-chart' }
      }));
    } else if (item.detailPath.startsWith('/courses/')) {
      const courseId = item.detailPath.split('/')[2];
      const courseData = getCourseData(courseId);
      setSelectedCourse(courseData);
      setIsCourseModalOpen(true);

      // 과정 조회 이벤트
      window.dispatchEvent(new CustomEvent('courseViewed', {
        detail: { courseId, source: 'popular-chart' }
      }));
    } else if (item.detailPath.startsWith('/events/')) {
      const eventId = item.detailPath.split('/')[2];
      const eventData = getEventData(eventId);
      setSelectedEvent(eventData);
      setIsEventModalOpen(true);

      // 이벤트 조회 이벤트
      window.dispatchEvent(new CustomEvent('eventViewed', {
        detail: { eventId, source: 'popular-chart' }
      }));
    } else if (item.detailPath.startsWith('/community/')) {
      const communityId = item.detailPath.split('/')[2];
      const communityData = getCommunityData(communityId);
      setSelectedCommunity(communityData);
      setIsCommunityModalOpen(true);
    } else {
      console.log('[RealTimePopularChart] 클릭된 경로:', item.detailPath);
      setLocation(item.detailPath);
    }
  };

  const getTrainerData = (id: string) => {
    const trainers = {
      '1': {
        id: 1,
        name: "김민수 전문 훈련사",
        specialty: "반려견 기본 훈련",
        experience: "10년",
        rating: 4.9,
        reviews: 156,
        students: 450,
        totalCourses: 12,
        location: "서울 강남구",
        phone: "010-1234-5678",
        email: "trainer1@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        description: "10년 이상의 경험을 가진 전문 반려견 훈련사로, 특히 기본 순종 훈련과 문제 행동 교정에 탁월한 실력을 보유하고 있습니다.",
        certifications: ["KKF 공인 훈련사", "CCPDT-KA 자격증", "반려동물 행동분석사"],
        specialties: ["기본 순종 훈련", "문제 행동 교정", "사회화 훈련"],
        courses: [
          { id: 1, title: "기본 순종 훈련", price: 150000, duration: "4주" },
          { id: 2, title: "문제 행동 교정", price: 200000, duration: "6주" }
        ]
      },
      '2': {
        id: 2,
        name: "이수진 훈련사",
        specialty: "배변 훈련 전문",
        experience: "8년",
        rating: 4.8,
        reviews: 89,
        students: 320,
        totalCourses: 8,
        location: "서울 서초구",
        phone: "010-2345-6789",
        email: "trainer2@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        description: "배변 훈련과 실내 훈련 전문가로, 어린 강아지부터 성견까지 효과적인 훈련 방법을 제공합니다.",
        certifications: ["IAABC 공인 훈련사", "반려동물 배변 전문가"],
        specialties: ["배변 훈련", "실내 훈련", "어린 강아지 훈련"],
        courses: [
          { id: 3, title: "실내 배변 훈련", price: 120000, duration: "3주" },
          { id: 4, title: "어린 강아지 기초 훈련", price: 180000, duration: "5주" }
        ]
      }
    };

    return trainers[id as keyof typeof trainers] || trainers['1'];
  };

  const getCourseData = (id: string) => {
    const courses = {
      '1': {
        id: 1,
        title: "기본 순종 훈련",
        description: "반려견의 기본적인 순종 훈련을 위한 필수 과정입니다.",
        instructor: "김민수 훈련사",
        duration: "4주",
        price: 150000,
        rating: 4.8,
        students: 1200,
        thumbnail: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
      },
      '2': {
        id: 2,
        title: "실내 배변 훈련",
        description: "실내에서 올바른 배변 습관을 기르는 전문 훈련 과정입니다.",
        instructor: "이수진 훈련사",
        duration: "3주",
        price: 120000,
        rating: 4.7,
        students: 890,
        thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
      }
    };

    return courses[id as keyof typeof courses] || courses['1'];
  };

  const getEventData = (id: string) => {
    const events = {
      '1': {
        id: 1,
        title: "2024 반려견 어질리티 챔피언십",
        description: "전국 반려견들이 참가하는 어질리티 대회입니다. 초보자부터 전문가까지 다양한 부문으로 진행됩니다.",
        date: "2024년 7월 15일",
        time: "10:00 - 18:00",
        location: "올림픽공원 체조경기장",
        address: "서울특별시 송파구 올림픽로 424",
        category: "스포츠대회",
        organizer: "한국반려견협회",
        maxParticipants: 200,
        currentParticipants: 156,
        entryFee: 50000,
        prizes: ["1등: 200만원", "2등: 100만원", "3등: 50만원"],
        requirements: ["3개월 이상의 건강한 반려견", "기본 예방접종 완료", "보험 가입 필수"],
        contact: "010-1234-5678",
        email: "agility@petassociation.kr",
        thumbnail: "https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
      },
      '2': {
        id: 2,
        title: "펫 페어 2024",
        description: "반려동물 용품 전시회 및 체험 행사입니다.",
        date: "2024년 8월 20일",
        time: "09:00 - 17:00",
        location: "코엑스 전시홀",
        address: "서울특별시 강남구 영동대로 513",
        category: "전시회",
        organizer: "펫산업협회",
        maxParticipants: 5000,
        currentParticipants: 3200,
        entryFee: 10000,
        prizes: [],
        requirements: ["사전 등록 필수"],
        contact: "02-1234-5678",
        email: "info@petfair.kr",
        thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
      }
    };

    return events[id as keyof typeof events] || events['1'];
  };

  const getCommunityData = (id: string) => {
    const community = {
      '1': {
        id: 1,
        title: "우리집 강아지 분리불안 해결했어요!",
        content: "3개월 동안 심각한 분리불안으로 고생했던 우리 골든리트리버 멍멍이가 드디어 혼자 있는 걸 편안해하게 되었어요. 처음에는 5분만 나가도 온 집을 다 뜯어놓고 짖어대서 정말 힘들었는데...",
        fullContent: `3개월 동안 심각한 분리불안으로 고생했던 우리 골든리트리버 멍멍이가 드디어 혼자 있는 걸 편안해하게 되었어요.

처음에는 5분만 나가도 온 집을 다 뜯어놓고 짖어대서 정말 힘들었습니다. 이웃들 민원도 들어오고, 집은 매일 난장판이 되고... 정말 포기하고 싶었어요.

하지만 전문 훈련사님의 도움으로 단계별 훈련을 시작했습니다:

1. 나가는 신호 없애기 - 열쇠, 가방 등을 평소에도 만지기
2. 짧은 시간부터 시작 - 1분, 3분, 5분씩 늘려가기
3. 특별한 장난감 - 나갈 때만 주는 특별한 간식 장난감
4. 무시하기 - 돌아와서도 바로 관심 주지 않기

3개월 정도 꾸준히 했더니 이제는 2-3시간도 혼자 잘 있어요! 

같은 고민 있으신 분들 포기하지 마세요. 시간은 걸리지만 분명 좋아집니다!`,
        author: "골든맘",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        category: "훈련후기",
        date: "2024년 6월 1일",
        views: 3245,
        likes: 189,
        comments: 67,
        tags: ["분리불안", "골든리트리버", "훈련후기", "성공사례"],
        thumbnail: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      '2': {
        id: 2,
        title: "강아지 간식 만들기 레시피 모음",
        content: "집에서 쉽게 만들 수 있는 건강한 강아지 간식 레시피를 공유합니다...",
        fullContent: `집에서 쉽게 만들 수 있는 건강한 강아지 간식 레시피를 공유드려요!

🥕 당근 쿠키
재료: 당근 1개, 밀가루 1컵, 달걀 1개
1. 당근을 갈아서 으깨기
2. 밀가루, 달걀과 섞어 반죽하기
3. 쿠키 모양으로 만들어 오븐에 15분

🍠 고구마 칩
재료: 고구마 1개
1. 고구마를 얇게 슬라이스
2. 오븐에 120도로 2시간 건조

🐟 연어 져키
재료: 연어 살 200g
1. 연어를 얇게 썰기
2. 소금 없이 오븐에서 저온 건조

모든 간식은 소금, 설탕, 양념 없이 만들어주세요!`,
        author: "펫셰프",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        category: "레시피",
        date: "2024년 5월 28일",
        views: 2789,
        likes: 156,
        comments: 78,
        tags: ["수제간식", "레시피", "건강한간식", "DIY"],
        thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    };

    return community[id as keyof typeof community] || community['1'];
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // 통계 데이터와 기본 데이터 병합 함수
  const mergeWithStats = (baseData: PopularItem[], statsArray: any[], category: string) => {
    if (!statsData || !statsArray) return baseData;

    return baseData.map((item, index) => {
      const stat = statsArray[index];
      if (stat && stat.id === item.id) {
        return {
          ...item,
          views: stat.views,
          likes: stat.likes,
          comments: stat.comments,
          trend: stat.trend,
          changePercent: stat.changePercent
        };
      }
      return item;
    });
  };

  const baseCourseData: PopularItem[] = [
    {
      id: 1,
      title: "기초 복종훈련 완전정복",
      description: "반려견의 기본적인 복종훈련부터 고급 명령어까지 체계적으로 학습하는 종합 과정입니다.",
      category: "기초훈련",
      views: 1923,
      likes: 98,
      comments: 45,
      trend: 'up',
      changePercent: 15.2,
      author: "강동훈 훈련사",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=강동훈&backgroundColor=2563eb,16a34a,dc2626,9333ea&radius=50",
      detailPath: "/courses/curriculum-basic-obedience"
    }
  ];

  // 실시간 통계와 병합된 데이터
  const coursesData = mergeWithStats(baseCourseData, statsData?.courses || [], 'courses');

  const baseTrainerData: PopularItem[] = [
    {
      id: 6,
      title: "강동훈 훈련사",
      description: "국가자격증 훈련 및 반려동물 교감 교육 전문가입니다.",
      category: "국가자격증",
      views: 2156,
      likes: 134,
      comments: 78,
      trend: 'up',
      changePercent: 15.8,
      location: "경북 구미시",
      detailPath: "/trainers/6",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=강동훈&backgroundColor=2563eb,16a34a,dc2626,9333ea&radius=50"
    }
  ];

  // 모든 데이터 타입에 대한 실시간 통계 병합
  const trainersData = mergeWithStats(baseTrainerData, statsData?.trainers || [], 'trainers');

  const baseEventData: PopularItem[] = [
    {
      id: 1,
      title: "왕짱스쿨 반려견 교감교육 체험",
      description: "구미시 2025 미래교육지구 마을학교 반려꿈터와 함께하는 특별 체험 프로그램입니다.",
      category: "교육체험",
      views: 1567,
      likes: 98,
      comments: 45,
      trend: 'up',
      changePercent: 15.2,
      location: "경북 구미시 구평동 661",
      date: "2025-07-10",
      detailPath: "/events/1"
    }
  ];

  const eventsData = mergeWithStats(baseEventData, statsData?.events || [], 'events');

  const baseCommunityData: PopularItem[] = [
    {
      id: 1,
      title: "왕짱스쿨 강동훈 훈련사님께 감사드립니다!",
      description: "정서안정 및 동물교감 교육을 통해 우리 강아지가 많이 달라졌어요.",
      category: "훈련후기",
      views: 856,
      likes: 67,
      comments: 23,
      trend: 'up',
      changePercent: 28.5,
      author: "구미시민",
      detailPath: "/community/1"
    }
  ];

  const communityData = mergeWithStats(baseCommunityData, statsData?.community || [], 'community');

  const renderPopularList = (items: PopularItem[], showLocation = false, showDate = false) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <button
          key={item.id}
          className="w-full flex items-center space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/20 text-left"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[RealTimePopularChart] 아이템 클릭:', item.title, item.detailPath);
            handleItemClick(item);
          }}
          type="button"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{index + 1}</span>
          </div>

          {/* 썸네일 영역 */}
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
            <img 
              src={item.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.author || item.title)}&backgroundColor=6366f1&textColor=ffffff`} 
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // 이미 대체 이미지를 사용중이면 더 이상 변경하지 않음
                if (!target.src.includes('dicebear.com')) {
                  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.author || item.title)}&backgroundColor=6366f1&textColor=ffffff`;
                }
              }}
              onLoad={() => {
                // 이미지 로딩 성공 시 로그 (디버깅용)
                console.log(`[Image] 로딩 성공: ${item.title}`);
              }}
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{item.title}</h3>
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
              {item.description}
            </p>

            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{item.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{item.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{item.comments}</span>
              </div>
              {item.author && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{item.author}</span>
                </div>
              )}
              {showLocation && item.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              )}
              {showDate && item.date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-2">
            {getTrendIcon(item.trend)}
            <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
              {item.trend !== 'stable' && (item.changePercent > 0 ? '+' : '')}{item.changePercent}%
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  const handleConsultationClick = async (trainerName: string) => {
    console.log('[Modal Action] 상담 신청 클릭:', trainerName);

    try {
      const response = await fetch('/api/consultation/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerName: trainerName,
          message: `${trainerName}와의 상담을 신청합니다.`
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
      } else {
        alert('상담신청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('상담신청 오류:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  // 훈련사 데이터 업데이트 시 이미지 처리 개선
  const updateStatsWithTrend = (data: PopularItem[], statsData: any) => {
    return data.map(item => {
      const stat = statsData?.trainers?.find((s: any) => s.name === item.author);
      if (stat) {
        return {
          ...item,
          views: stat.views,
          likes: stat.likes,
          trend: stat.trend,
          changePercent: stat.changePercent,
          // 이미지가 없는 경우 기본 아바타 이미지 사용
          imageUrl: item.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.author || item.title)}&backgroundColor=6366f1&textColor=ffffff`
        };
      }
      return {
        ...item,
        imageUrl: item.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.author || item.title)}&backgroundColor=6366f1&textColor=ffffff`
      };
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>실시간 인기 차트</span>
            </CardTitle>
            <div className="text-xs text-gray-500">
              마지막 업데이트: {updateTime.toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="trainers" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trainers" className="text-xs">
                훈련사
              </TabsTrigger>
              <TabsTrigger value="courses" className="text-xs">
                강좌
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs">
                이벤트
              </TabsTrigger>
              <TabsTrigger value="community" className="text-xs">
                커뮤니티 글
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trainers" className="mt-4">
              {renderPopularList(trainersData, true)}
            </TabsContent>

            <TabsContent value="courses" className="mt-4">
              {renderPopularList(coursesData)}
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              {renderPopularList(eventsData, true, true)}
            </TabsContent>

            <TabsContent value="community" className="mt-4">
              {renderPopularList(communityData)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Trainer Detail Modal */}
    <Dialog open={isTrainerModalOpen} onOpenChange={setIsTrainerModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedTrainer && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedTrainer.name}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 훈련사 기본 정보 */}
              <div className="md:col-span-2">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedTrainer.avatar} alt={selectedTrainer.name} />
                    <AvatarFallback>{selectedTrainer.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{selectedTrainer.specialty}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{selectedTrainer.rating}</span>
                        <span className="text-sm text-muted-foreground">({selectedTrainer.reviews}개 리뷰)</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3">{selectedTrainer.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>경력 {selectedTrainer.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedTrainer.students}명 훈련</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedTrainer.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 전문 분야 */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">전문 분야</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>

                {/* 자격증 */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">자격증 및 인증</h3>
                  <ul className="space-y-1">
                    {selectedTrainer.certifications.map((cert: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 진행 중인 강좌 */}
                <div>
                  <h3 className="font-semibold mb-3">진행 중인 강좌</h3>
                  <div className="space-y-3">
                    {selectedTrainer.courses.map((course: any) => (
                      <div key={course.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">{course.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{course.price.toLocaleString()}원</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 연락처 및 액션 */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">연락처</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{selectedTrainer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{selectedTrainer.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      console.log('[Modal Action] 상담 신청 클릭:', selectedTrainer.name);
                      handleConsultationClick(selectedTrainer.name);
                      try {
                        const response = await fetch('/api/consultation/request', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            trainerId: selectedTrainer.id,
                            message: `${selectedTrainer.name}님께 상담을 요청합니다.`,
                            preferredDate: new Date().toISOString()
                          })
                        });

                        if (response.ok) {
                          const result = await response.json();
                          toast({
                            title: "상담 신청 완료",
                            description: result.message,
                          });
                          // 상담 신청 후 상담 관리 페이지로 이동
                          setIsTrainerModalOpen(false);
                          setLocation('/consultation');
                        } else {
                          throw new Error('상담 신청 실패');
                        }
                      } catch (error) {
                        toast({
                          title: "오류",
                          description: "상담 신청 중 오류가 발생했습니다.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    상담 신청
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={async () => {
                      console.log('[Modal Action] 메시지 보내기 클릭:', selectedTrainer.name);
                      try {
                        const response = await fetch('/api/messages/send', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            receiverId: selectedTrainer.id,
                            message: `안녕하세요 ${selectedTrainer.name}님, 훈련에 대해 문의드리고 싶습니다.`
                          })
                        });

                        if (response.ok) {
                          const result = await response.json();
                          toast({
                            title: "메시지 전송 완료",
                            description: result.message,
                          });
                          // 메시지 전송 후 상세 페이지로 이동
                          setIsTrainerModalOpen(false);
                          setLocation(`/messages?trainer=${selectedTrainer.id}`);
                        } else {
                          throw new Error('메시지 전송 실패');
                        }
                      } catch (error) {
                        toast({
                          title: "오류",
                          description: "메시지 전송 중 오류가 발생했습니다.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    메시지 보내기
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      console.log('[Modal Action] 프로필 전체보기 클릭:', selectedTrainer.name);
                      setIsTrainerModalOpen(false);
                      setLocation(`/trainers/${selectedTrainer.id}`);
                    }}
                  >
                    프로필 전체보기
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>

    {/* Course Detail Modal */}
    <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {selectedCourse && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedCourse.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 강좌 썸네일 */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedCourse.thumbnail} 
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-muted-foreground mb-4">{selectedCourse.description}</p>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{selectedCourse.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{selectedCourse.students}명 수강</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedCourse.duration}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">강사</h3>
                    <p className="text-sm text-muted-foreground">{selectedCourse.instructor}</p>
                  </div>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <p className="text-2xl font-bold">{selectedCourse.price.toLocaleString()}원</p>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          className="w-full"
                          onClick={() => {
                            console.log('[Modal Action] 수강 신청 클릭:', selectedCourse.title);
                            // TODO: 수강 신청 프로세스 시작
                          }}
                        >
                          수강 신청
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            console.log('[Modal Action] 장바구니 추가 클릭:', selectedCourse.title);
                            // TODO: 장바구니 추가 기능
                          }}
                        >
                          장바구니 추가
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => {
                            console.log('[Modal Action] 상세정보 보기 클릭:', selectedCourse.title);
                            setIsCourseModalOpen(false);
                            setLocation(`/courses/${selectedCourse.id}`);
                          }}
                        >
                          상세정보 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>

    {/* 이벤트 모달 */}
    <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedEvent && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={selectedEvent.thumbnail} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">이벤트 정보</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{selectedEvent.currentParticipants}/{selectedEvent.maxParticipants}명 참가</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">설명</h3>
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">참가 조건</h3>
                    <ul className="text-sm space-y-1">
                      {selectedEvent.requirements?.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <p className="text-lg font-semibold mb-2">참가비</p>
                        <p className="text-2xl font-bold">{selectedEvent.entryFee?.toLocaleString()}원</p>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          className="w-full"
                          onClick={async () => {
                            console.log('[Modal Action] 참가 신청 클릭:', selectedEvent.title);
                            try {
                              const response = await fetch(`/api/events/${selectedEvent.id}/register`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  participantName: "반려인",
                                  phone: "010-1234-5678",
                                  email: "participant@example.com"
                                })
                              });

                              if (response.ok) {
                                const result = await response.json();
                                toast({
                                  title: "참가 신청 완료",
                                  description: result.message,
                                });
                              } else {
                                throw new Error('참가 신청 실패');
                              }
                            } catch (error) {
                              toast({
                                title: "오류",
                                description: "참가 신청 중 오류가 발생했습니다.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          참가 신청
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={async () => {
                            console.log('[Modal Action] 문의하기 클릭:', selectedEvent.title);
                            try {
                              const response = await fetch('/api/messages/send', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  receiverId: selectedEvent.organizerId || 1,
                                  message: `${selectedEvent.title} 이벤트에 대해 문의드립니다.`
                                })
                              });

                              if (response.ok) {
                                const result = await response.json();
                                toast({
                                  title: "문의 전송 완료",
                                  description: result.message,
                                });
                              } else {
                                throw new Error('문의 전송 실패');
                              }
                            } catch (error) {
                              toast({
                                title: "오류",
                                description: "문의 전송 중 오류가 발생했습니다.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          문의하기
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => {
                            console.log('[Modal Action] 이벤트 전체보기 클릭:', selectedEvent.title);
                            setIsEventModalOpen(false);
                            setLocation(`/events/${selectedEvent.id}`);
                          }}
                        >
                          전체보기
                        </Button>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm space-y-1">
                          <p><strong>주최:</strong> {selectedEvent.organizer}</p>
                          <p><strong>연락처:</strong> {selectedEvent.contact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>

    {/* 커뮤니티 모달 */}
    <Dialog open={isCommunityModalOpen} onOpenChange={setIsCommunityModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedCommunity && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedCommunity.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {selectedCommunity.thumbnail && (
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={selectedCommunity.thumbnail} 
                    alt={selectedCommunity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedCommunity.authorAvatar} 
                      alt={selectedCommunity.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedCommunity.author}</p>
                      <p className="text-sm text-muted-foreground">{selectedCommunity.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedCommunity.views?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{selectedCommunity.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{selectedCommunity.comments}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">내용</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line">{selectedCommunity.fullContent}</p>
                    </div>
                  </div>

                  {selectedCommunity.tags && (
                    <div>
                      <h3 className="font-semibold mb-2">태그</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCommunity.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => {
                            console.log('[Modal Action] 좋아요 클릭:', selectedCommunity.title);
                            likeMutation.mutate({ postId: selectedCommunity.id, type: 'community' });
                          }}
                          disabled={likeMutation.isPending}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          {likeMutation.isPending ? '처리중...' : '좋아요'}
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={async () => {
                            console.log('[Modal Action] 댓글 쓰기 클릭:', selectedCommunity.title);
                            try {
                              const response = await fetch(`/api/community/posts/${selectedCommunity.id}/comments`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  content: "이 글 정말 도움이 되었습니다!",
                                  authorName: "반려인"
                                })
                              });

                              if (response.ok) {
                                const result = await response.json();
                                toast({
                                  title: "댓글 작성 완료",
                                  description: result.message,
                                });
                              } else {
                                throw new Error('댓글 작성 실패');
                              }
                            } catch (error) {
                              toast({
                                title: "오류",
                                description: "댓글 작성 중 오류가 발생했습니다.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          댓글 쓰기
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => {
                            console.log('[Modal Action] 공유하기 클릭:', selectedCommunity.title);
                            handleShare(selectedCommunity.title, selectedCommunity.id, 'community');
                          }}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          공유하기
                        </Button>
                      </div>

                      <div className="mt-4 pt-4 border-t text-sm">
                        <p className="font-medium mb-2">카테고리</p>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                          {selectedCommunity.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}