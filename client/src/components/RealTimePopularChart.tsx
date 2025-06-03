import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Eye, Heart, MessageCircle, Users, MapPin, Calendar } from 'lucide-react';
import { useLocation } from 'wouter';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleItemClick = (detailPath: string) => {
    console.log('[RealTimePopularChart] 클릭된 경로:', detailPath);
    setLocation(detailPath);
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

  const coursesData: PopularItem[] = [
    {
      id: 1,
      title: "반려견 기본 예절 마스터하기",
      description: "반려견의 기본적인 예절과 행동 교정을 위한 체계적인 교육 과정입니다.",
      category: "기본교육",
      views: 1250,
      likes: 89,
      comments: 34,
      trend: 'up',
      changePercent: 15.2,
      author: "김민수 훈련사",
      detailPath: "/courses/1"
    },
    {
      id: 2,
      title: "문제행동 교정 전문가 과정",
      description: "짖음, 물기, 분리불안 등 다양한 문제행동을 해결하는 전문 과정입니다.",
      category: "문제행동",
      views: 980,
      likes: 67,
      comments: 28,
      trend: 'up',
      changePercent: 8.5,
      author: "박지혜 훈련사",
      detailPath: "/courses/2"
    },
    {
      id: 3,
      title: "어질리티 훈련 기초부터 실전까지",
      description: "반려견과 함께하는 즐거운 운동, 어질리티 훈련의 모든 것을 배워보세요.",
      category: "스포츠",
      views: 756,
      likes: 52,
      comments: 19,
      trend: 'stable',
      changePercent: 2.1,
      author: "이준호 훈련사",
      detailPath: "/courses/3"
    },
    {
      id: 4,
      title: "반려견 사회화 트레이닝",
      description: "다른 개와 사람들과의 올바른 상호작용을 위한 사회화 교육입니다.",
      category: "사회화",
      views: 623,
      likes: 41,
      comments: 15,
      trend: 'down',
      changePercent: -3.2,
      author: "최예린 훈련사",
      detailPath: "/courses/4"
    },
    {
      id: 5,
      title: "반려견 특수목적 훈련",
      description: "경호견, 탐지견 등 특수 목적을 위한 전문 훈련 과정입니다.",
      category: "전문훈련",
      views: 534,
      likes: 38,
      comments: 12,
      trend: 'up',
      changePercent: 12.8,
      author: "정현우 훈련사",
      detailPath: "/courses/5"
    }
  ];

  const trainersData: PopularItem[] = [
    {
      id: 1,
      title: "김민수 전문 훈련사",
      description: "15년 경력의 반려견 행동 교정 전문가로, 다양한 견종의 훈련 경험을 보유하고 있습니다.",
      category: "행동교정",
      views: 2150,
      likes: 124,
      comments: 67,
      trend: 'up',
      changePercent: 18.5,
      location: "서울 강남구",
      detailPath: "/trainers/1"
    },
    {
      id: 2,
      title: "박지혜 펫 트레이너",
      description: "소형견 전문 훈련사로, 섬세하고 체계적인 교육 방법으로 유명합니다.",
      category: "소형견전문",
      views: 1890,
      likes: 98,
      comments: 45,
      trend: 'up',
      changePercent: 12.3,
      location: "서울 송파구",
      detailPath: "/trainers/2"
    },
    {
      id: 3,
      title: "이준호 어질리티 코치",
      description: "국제 어질리티 대회 출신 코치로, 반려견 스포츠 훈련의 최고 전문가입니다.",
      category: "스포츠훈련",
      views: 1567,
      likes: 87,
      comments: 39,
      trend: 'stable',
      changePercent: 1.8,
      location: "경기 성남시",
      detailPath: "/trainers/3"
    },
    {
      id: 4,
      title: "최예린 행동분석가",
      description: "동물행동학 박사로, 과학적 접근을 통한 반려견 행동 분석 및 교정을 전문으로 합니다.",
      category: "행동분석",
      views: 1234,
      likes: 76,
      comments: 32,
      trend: 'up',
      changePercent: 9.7,
      location: "서울 마포구",
      detailPath: "/trainers/4"
    },
    {
      id: 5,
      title: "정현우 K9 트레이너",
      description: "경찰견, 군견 훈련 출신으로 고난이도 전문 훈련을 담당하는 베테랑 훈련사입니다.",
      category: "전문훈련",
      views: 987,
      likes: 65,
      comments: 28,
      trend: 'down',
      changePercent: -2.4,
      location: "서울 용산구",
      detailPath: "/trainers/5"
    }
  ];

  const eventsData: PopularItem[] = [
    {
      id: 1,
      title: "2024 반려견 어질리티 챔피언십",
      description: "전국 반려견들이 참가하는 대규모 어질리티 경기 대회입니다.",
      category: "대회",
      views: 3240,
      likes: 189,
      comments: 78,
      trend: 'up',
      changePercent: 25.4,
      location: "올림픽공원 체조경기장",
      date: "2024-07-15",
      detailPath: "/events/1"
    },
    {
      id: 2,
      title: "펫케어 박람회 2024",
      description: "반려동물 용품, 사료, 의료 서비스 등을 한눈에 볼 수 있는 종합 박람회입니다.",
      category: "박람회",
      views: 2890,
      likes: 156,
      comments: 92,
      trend: 'up',
      changePercent: 19.8,
      location: "코엑스 전시장",
      date: "2024-06-20",
      detailPath: "/events/2"
    },
    {
      id: 3,
      title: "반려견 사회화 모임",
      description: "다양한 견종의 반려견들이 함께 어울리며 사회화 훈련을 하는 정기 모임입니다.",
      category: "모임",
      views: 1567,
      likes: 98,
      comments: 45,
      trend: 'stable',
      changePercent: 3.2,
      location: "한강공원 뚝섬지구",
      date: "2024-06-08",
      detailPath: "/events/3"
    },
    {
      id: 4,
      title: "펫 푸드 페스티벌",
      description: "건강한 반려동물 사료와 간식을 체험해볼 수 있는 미식 축제입니다.",
      category: "축제",
      views: 1234,
      likes: 76,
      comments: 34,
      trend: 'up',
      changePercent: 14.6,
      location: "잠실 롯데월드몰",
      date: "2024-06-25",
      detailPath: "/events/4"
    },
    {
      id: 5,
      title: "반려견 입양의 날",
      description: "유기견 보호소와 함께하는 반려견 입양 캠페인 및 상담회입니다.",
      category: "캠페인",
      views: 987,
      likes: 123,
      comments: 56,
      trend: 'up',
      changePercent: 22.1,
      location: "서울광장",
      date: "2024-06-15",
      detailPath: "/events/5"
    }
  ];

  const communityData: PopularItem[] = [
    {
      id: 1,
      title: "우리집 강아지 분리불안 해결했어요!",
      description: "6개월간의 꾸준한 훈련으로 분리불안을 극복한 경험을 공유합니다.",
      category: "경험담",
      views: 4567,
      likes: 234,
      comments: 89,
      trend: 'up',
      changePercent: 31.2,
      author: "반려인123",
      detailPath: "/community/1"
    },
    {
      id: 2,
      title: "골든리트리버 털갈이 시기 관리법",
      description: "골든리트리버의 계절별 털갈이 시기에 대비한 관리 노하우를 알려드립니다.",
      category: "관리팁",
      views: 3456,
      likes: 187,
      comments: 67,
      trend: 'up',
      changePercent: 18.9,
      author: "골든맘",
      detailPath: "/community/2"
    },
    {
      id: 3,
      title: "강아지 간식 만들기 레시피 모음",
      description: "집에서 쉽게 만들 수 있는 건강한 강아지 간식 레시피를 공유합니다.",
      category: "레시피",
      views: 2789,
      likes: 156,
      comments: 78,
      trend: 'stable',
      changePercent: 2.7,
      author: "펫셰프",
      detailPath: "/community/3"
    },
    {
      id: 4,
      title: "소형견 산책 시 주의사항",
      description: "소형견 산책 시 안전하게 산책하는 방법과 주의해야 할 점들을 정리했습니다.",
      category: "안전정보",
      views: 2134,
      likes: 98,
      comments: 45,
      trend: 'down',
      changePercent: -5.3,
      author: "소형견러버",
      detailPath: "/community/4"
    },
    {
      id: 5,
      title: "반려견 건강검진 후기 및 팁",
      description: "정기 건강검진의 중요성과 검진 과정에서 알아두면 좋은 팁들을 공유합니다.",
      category: "건강정보",
      views: 1876,
      likes: 87,
      comments: 39,
      trend: 'up',
      changePercent: 11.4,
      author: "건강지킴이",
      detailPath: "/community/5"
    }
  ];

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
            alert(`클릭됨: ${item.title}`);
            handleItemClick(item.detailPath);
          }}
          type="button"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{index + 1}</span>
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

  return (
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
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses" className="text-xs">
              강좌
            </TabsTrigger>
            <TabsTrigger value="trainers" className="text-xs">
              훈련사
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              이벤트
            </TabsTrigger>
            <TabsTrigger value="community" className="text-xs">
              커뮤니티 글
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-4">
            {renderPopularList(coursesData)}
          </TabsContent>
          
          <TabsContent value="trainers" className="mt-4">
            {renderPopularList(trainersData, true)}
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
  );
}