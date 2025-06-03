import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Eye, Heart, MessageCircle, BookOpen, Users, Calendar, MapPin } from 'lucide-react';

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

  // 컴포넌트 마운트 확인
  useEffect(() => {
    console.log('[RealTimePopularChart] 컴포넌트가 마운트되었습니다');
  }, []);

  // 실시간 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTime(new Date());
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 인기 강좌 데이터
  const popularCourses: PopularItem[] = [
    {
      id: 1,
      title: "기초 앉기 훈련",
      description: "반려견의 기본 명령어 훈련부터 시작하는 첫걸음",
      category: "기초훈련",
      views: 2847,
      likes: 342,
      comments: 89,
      trend: 'up',
      changePercent: 15.3,
      author: "김훈련사",
      detailPath: "/course/1"
    },
    {
      id: 2,
      title: "산책 매너 완성하기",
      description: "올바른 산책 예절과 리드줄 훈련 마스터하기",
      category: "사회화훈련",
      views: 2156,
      likes: 298,
      comments: 67,
      trend: 'up',
      changePercent: 8.7,
      author: "박전문가",
      detailPath: "/course/2"
    },
    {
      id: 3,
      title: "분리불안 해결법",
      description: "혼자 있을 때 불안해하는 반려견을 위한 특별 훈련",
      category: "행동교정",
      views: 1923,
      likes: 267,
      comments: 54,
      trend: 'stable',
      changePercent: 0,
      author: "이행동전문가",
      detailPath: "/course/3"
    },
    {
      id: 4,
      title: "어질리티 입문",
      description: "반려견과 함께하는 재미있는 장애물 훈련",
      category: "스포츠훈련",
      views: 1687,
      likes: 234,
      comments: 43,
      trend: 'down',
      changePercent: -3.2,
      author: "최스포츠강사",
      detailPath: "/course/4"
    },
    {
      id: 5,
      title: "퍼피 사회화 프로그램",
      description: "어린 강아지를 위한 사회성 발달 프로그램",
      category: "퍼피훈련",
      views: 1534,
      likes: 189,
      comments: 38,
      trend: 'up',
      changePercent: 12.1,
      author: "정퍼피전문가",
      detailPath: "/course/5"
    }
  ];

  // 인기 훈련사 데이터
  const popularTrainers: PopularItem[] = [
    {
      id: 1,
      title: "김민수 훈련사",
      description: "15년 경력의 베테랑 전문가, 행동교정 전문",
      category: "행동교정 전문",
      views: 3254,
      likes: 456,
      comments: 123,
      trend: 'up',
      changePercent: 18.5,
      location: "서울 강남구",
      detailPath: "/trainers/1"
    },
    {
      id: 2,
      title: "박영희 훈련사",
      description: "소형견 전문 훈련사, 온라인 강의 인기",
      category: "소형견 전문",
      views: 2891,
      likes: 398,
      comments: 87,
      trend: 'up',
      changePercent: 11.2,
      location: "경기 성남시",
      detailPath: "/trainers/2"
    },
    {
      id: 3,
      title: "이창호 훈련사",
      description: "어질리티 챔피언 출신, 스포츠 훈련 전문",
      category: "스포츠 훈련",
      views: 2567,
      likes: 345,
      comments: 76,
      trend: 'stable',
      changePercent: 0,
      location: "서울 송파구",
      detailPath: "/trainers/3"
    },
    {
      id: 4,
      title: "정수미 훈련사",
      description: "퍼피 전문가, 사회화 훈련의 베스트셀러",
      category: "퍼피 교육",
      views: 2234,
      likes: 312,
      comments: 65,
      trend: 'up',
      changePercent: 7.8,
      location: "부산 해운대구",
      detailPath: "/trainers/4"
    },
    {
      id: 5,
      title: "최동석 훈련사",
      description: "대형견 전문, 가드독 훈련 경험 풍부",
      category: "대형견 전문",
      views: 1987,
      likes: 267,
      comments: 54,
      trend: 'down',
      changePercent: -2.1,
      location: "인천 연수구",
      detailPath: "/trainers/5"
    }
  ];

  // 인기 이벤트 데이터
  const popularEvents: PopularItem[] = [
    {
      id: 1,
      title: "반려견 페스티벌 2024",
      description: "전국 최대 규모의 반려견 축제가 돌아왔습니다",
      category: "축제",
      views: 4521,
      likes: 623,
      comments: 198,
      trend: 'up',
      changePercent: 25.4,
      location: "서울 한강공원",
      date: "2024-06-15",
      detailPath: "/events/1"
    },
    {
      id: 2,
      title: "무료 퍼피 클래스",
      description: "생후 6개월 미만 강아지를 위한 무료 교육",
      category: "교육",
      views: 3234,
      likes: 445,
      comments: 134,
      trend: 'up',
      changePercent: 19.8,
      location: "경기 분당",
      date: "2024-06-08",
      detailPath: "/events/2"
    },
    {
      id: 3,
      title: "어질리티 대회",
      description: "전국 반려견 어질리티 챔피언십",
      category: "대회",
      views: 2876,
      likes: 389,
      comments: 112,
      trend: 'stable',
      changePercent: 0,
      location: "경기 고양시",
      date: "2024-06-22",
      detailPath: "/events/3"
    },
    {
      id: 4,
      title: "입양의 날 행사",
      description: "유기견 입양 캠페인 및 상담 행사",
      category: "입양",
      views: 2543,
      likes: 356,
      comments: 89,
      trend: 'up',
      changePercent: 13.7,
      location: "서울 마포구",
      date: "2024-06-10",
      detailPath: "/events/4"
    },
    {
      id: 5,
      title: "반려견 건강 검진의 날",
      description: "무료 건강검진 및 상담 서비스",
      category: "건강",
      views: 2198,
      likes: 298,
      comments: 67,
      trend: 'down',
      changePercent: -4.2,
      location: "부산 중구",
      date: "2024-06-12",
      detailPath: "/events/5"
    }
  ];

  // 인기 커뮤니티 글 데이터
  const popularPosts: PopularItem[] = [
    {
      id: 1,
      title: "우리 댕댕이 첫 훈련 후기",
      description: "3개월간의 기초 훈련을 마치고 느낀 점들을 공유합니다",
      category: "훈련후기",
      views: 1856,
      likes: 234,
      comments: 78,
      trend: 'up',
      changePercent: 22.1,
      author: "반려인123",
      detailPath: "/community/post/1"
    },
    {
      id: 2,
      title: "강아지 간식 만들기 레시피",
      description: "집에서 쉽게 만드는 건강한 수제 간식",
      category: "레시피",
      views: 1634,
      likes: 198,
      comments: 65,
      trend: 'up',
      changePercent: 16.3,
      author: "요리하는엄마",
      detailPath: "/community/post/2"
    },
    {
      id: 3,
      title: "산책 중 만난 특별한 친구들",
      description: "오늘 한강에서 만난 귀여운 강아지들 사진",
      category: "일상",
      views: 1423,
      likes: 167,
      comments: 43,
      trend: 'stable',
      changePercent: 0,
      author: "한강산책러",
      detailPath: "/community/post/3"
    },
    {
      id: 4,
      title: "분리불안 극복 경험담",
      description: "6개월간의 분리불안 훈련 과정과 결과",
      category: "경험담",
      views: 1287,
      likes: 145,
      comments: 52,
      trend: 'up',
      changePercent: 9.4,
      author: "극복맘",
      detailPath: "/community/post/4"
    },
    {
      id: 5,
      title: "반려견 응급처치 기본 상식",
      description: "위급상황에서 알아두면 유용한 응급처치법",
      category: "정보",
      views: 1156,
      likes: 132,
      comments: 34,
      trend: 'down',
      changePercent: -1.8,
      author: "수의사김박사",
      detailPath: "/community/post/5"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleItemClick = (detailPath: string) => {
    console.log('[RealTimePopularChart] 클릭된 경로:', detailPath);
    setLocation(detailPath);
  };

  const renderPopularList = (items: PopularItem[], showLocation = false, showDate = false) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/20"
          onClick={() => {
            console.log('[RealTimePopularChart] 클릭 테스트:', item.title, item.detailPath);
            alert(`클릭됨: ${item.title}`);
            handleItemClick(item.detailPath);
          }}
          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}
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
        </div>
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
              <BookOpen className="h-4 w-4 mr-1" />
              인기 강좌
            </TabsTrigger>
            <TabsTrigger value="trainers" className="text-xs">
              <Users className="h-4 w-4 mr-1" />
              인기 훈련사
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              <Calendar className="h-4 w-4 mr-1" />
              인기 이벤트
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs">
              <MessageCircle className="h-4 w-4 mr-1" />
              인기 글
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-4">
            {renderPopularList(popularCourses)}
          </TabsContent>
          
          <TabsContent value="trainers" className="mt-4">
            {renderPopularList(popularTrainers, true)}
          </TabsContent>
          
          <TabsContent value="events" className="mt-4">
            {renderPopularList(popularEvents, true, true)}
          </TabsContent>
          
          <TabsContent value="posts" className="mt-4">
            {renderPopularList(popularPosts)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}