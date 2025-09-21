import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CourseCard } from '@/components/ui/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Hourglass, Star, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function MyCourses() {
  // Mock courses data
  const ongoingCourses = [
    {
      id: 1,
      image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 002_1751722697071.png",
      title: "반려견 기초 훈련 마스터하기",
      description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스",
      badge: { text: "인기", variant: "accent" },
      progress: 65,
      trainer: { 
        image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 003_1751722697072.png", 
        name: "김훈련 트레이너" 
      },
      status: "진행 중",
      nextLesson: "오늘 17:00 - 12주차: 산책 중 만남 훈련"
    },
    {
      id: 2,
      image: "/attached_assets/image_1746582251297.png",
      title: "반려견 어질리티 입문",
      description: "다양한 장애물 코스를 통해 반려견의 민첩성과 집중력을 향상시키는 어질리티 훈련 기초 과정",
      badge: { text: "중급", variant: "blue" },
      progress: 30,
      trainer: { 
        image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 001_1751722697059.png", 
        name: "박민첩 트레이너" 
      },
      status: "진행 중",
      nextLesson: "내일 14:00 - 6주차: 터널 통과하기"
    },
    {
      id: 3,
      image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 002_1751722697071.png",
      title: "반려견 사회화 훈련",
      description: "다른 반려견, 사람, 환경에 올바르게 적응하는 방법을 배우는 필수 사회화 과정",
      badge: { text: "초급", variant: "green" },
      progress: 45,
      trainer: { 
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
        name: "이사회 트레이너" 
      },
      status: "진행 중",
      nextLesson: "수요일 15:30 - 8주차: 반려견 카페 방문하기"
    }
  ];

  const completedCourses = [
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "퍼피 클래스: 생애 초기 교육",
      description: "강아지의 발달 단계에 맞춘 초기 교육으로 건강한 성장과 사회화의 기초를 다지는 과정",
      badge: { text: "완료", variant: "green" },
      progress: 100,
      trainer: { 
        image: "https://images.unsplash.com/photo-1582553032985-9a8f8c2cfa1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
        name: "정퍼피 트레이너" 
      },
      status: "완료",
      completedDate: "2023년 11월 15일"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "집안 예절 교육",
      description: "실내에서의 바람직한 행동 습관을 기르고 파괴적 행동을 교정하는 집중 교육 과정",
      badge: { text: "완료", variant: "green" },
      progress: 100,
      trainer: { 
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
        name: "최행동 트레이너" 
      },
      status: "완료",
      completedDate: "2023년 9월 22일"
    }
  ];

  const wishlistCourses = [
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "분리불안 극복하기",
      description: "혼자 있는 시간을 두려워하는 반려견을 위한 단계별 행동 교정 프로그램",
      badge: { text: "행동교정", variant: "red" },
      trainer: { 
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
        name: "최행동 트레이너" 
      },
      price: "180,000원",
      duration: "8주 과정"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "재미있는 트릭 훈련",
      description: "하이파이브부터 점프, 회전까지 반려견의 두뇌를 자극하는 다양한 트릭 교육",
      badge: { text: "인기", variant: "accent" },
      trainer: { 
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
        name: "박재미 트레이너" 
      },
      price: "130,000원",
      duration: "6주 과정"
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">내 강의실</h1>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <div className="text-lg">
            안녕하세요, <span className="font-semibold">김견주</span>님!
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            오늘도 반려견과 함께 즐거운 학습을 시작해보세요.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="text-sm">
              <span className="text-primary font-semibold">57%</span> 완료
            </div>
            <Progress className="h-2 w-32" value={57} />
          </div>
          
          <Button>
            <BarChart className="w-4 h-4 mr-2" />
            학습 분석
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="ongoing" className="mb-8">
        <TabsList>
          <TabsTrigger value="ongoing">
            <Hourglass className="w-4 h-4 mr-2" />
            진행 중 ({ongoingCourses.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="w-4 h-4 mr-2" />
            완료 ({completedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            <Star className="w-4 h-4 mr-2" />
            찜 목록 ({wishlistCourses.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ongoing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingCourses.map((course) => (
              <CourseCard
                key={course.id}
                image={course.image}
                title={course.title}
                description={course.description}
                badge={course.badge}
                progress={course.progress}
                trainer={course.trainer}
                status={course.status}
                onClick={() => window.location.href = `/courses/${course.id}`}
              >
                <div className="mt-3 flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{course.nextLesson}</span>
                </div>
              </CourseCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <CourseCard
                key={course.id}
                image={course.image}
                title={course.title}
                description={course.description}
                badge={course.badge}
                progress={course.progress}
                trainer={course.trainer}
                status={course.status}
                onClick={() => window.location.href = `/courses/${course.id}/review`}
              >
                <div className="mt-3 flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  <span>완료일: {course.completedDate}</span>
                </div>
              </CourseCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="wishlist" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistCourses.map((course) => (
              <CourseCard
                key={course.id}
                image={course.image}
                title={course.title}
                description={course.description}
                badge={course.badge}
                trainer={course.trainer}
                onClick={() => window.location.href = `/courses/${course.id}/enroll`}
              >
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{course.duration}</span>
                  <span className="text-xs font-medium text-accent">{course.price}</span>
                </div>
                <div className="mt-3">
                  <Button variant="default" size="sm" className="w-full">수강 신청</Button>
                </div>
              </CourseCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
