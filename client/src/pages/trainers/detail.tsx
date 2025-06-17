import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Phone, Mail, Calendar, Award, Users, BookOpen } from 'lucide-react';

interface TrainerDetailProps {
  trainerId: string;
}

export default function TrainerDetail({ trainerId }: TrainerDetailProps) {
  // Mock data based on the popular chart data
  const getTrainerData = (id: string) => {
    const trainers = {
      '1': {
        id: 1,
        name: "김민수 전문 훈련사",
        title: "15년 경력의 반려견 행동 교정 전문가",
        description: "다양한 견종의 훈련 경험을 보유하고 있으며, 개별 맞춤 훈련 프로그램을 제공합니다.",
        category: "행동교정",
        experience: "15년",
        rating: 4.9,
        reviews: 127,
        students: 450,
        totalCourses: 12,
        location: "서울 강남구",
        phone: "010-1234-5678",
        email: "trainer1@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        specialties: ["기본훈련", "행동교정", "사회화", "어질리티"],
        certifications: ["KKF 공인 훈련사", "반려동물 행동 전문가", "펫시터 자격증"],
        schedule: [
          { day: "월", time: "09:00-18:00" },
          { day: "화", time: "09:00-18:00" },
          { day: "수", time: "09:00-18:00" },
          { day: "목", time: "09:00-18:00" },
          { day: "금", time: "09:00-18:00" },
          { day: "토", time: "10:00-16:00" }
        ],
        courses: [
          { id: 1, title: "기본 훈련 과정", price: 150000, duration: "4주" },
          { id: 2, title: "행동 교정 과정", price: 200000, duration: "6주" },
          { id: 3, title: "사회화 훈련", price: 120000, duration: "3주" }
        ]
      },
      '2': {
        id: 2,
        name: "박지연 훈련사",
        title: "소형견 전문 훈련사",
        description: "소형견의 특성을 이해하고 맞춤형 훈련을 제공하는 전문가입니다.",
        category: "소형견전문",
        experience: "8년",
        rating: 4.8,
        reviews: 89,
        students: 320,
        totalCourses: 8,
        location: "서울 서초구",
        phone: "010-2345-6789",
        email: "trainer2@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        specialties: ["소형견훈련", "실내훈련", "분리불안", "짖음교정"],
        certifications: ["소형견 전문 훈련사", "반려동물 행동 상담사"],
        schedule: [
          { day: "월", time: "10:00-17:00" },
          { day: "화", time: "10:00-17:00" },
          { day: "수", time: "휴무" },
          { day: "목", time: "10:00-17:00" },
          { day: "금", time: "10:00-17:00" },
          { day: "토", time: "09:00-15:00" }
        ],
        courses: [
          { id: 4, title: "소형견 기본 훈련", price: 130000, duration: "4주" },
          { id: 5, title: "짖음 교정 과정", price: 180000, duration: "5주" }
        ]
      }
    };
    
    return trainers[id as keyof typeof trainers] || trainers['1'];
  };

  const trainer = getTrainerData(trainerId);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* 훈련사 프로필 헤더 */}
      <Card className="mb-6 overflow-hidden">
        {/* 프로필 이미지를 맨 위로 이동 */}
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 relative flex items-center justify-center">
          <Avatar className="w-48 h-48 border-4 border-white shadow-xl">
            <AvatarImage 
              src={trainer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`} 
              alt={trainer.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`;
              }}
            />
            <AvatarFallback className="text-4xl bg-primary text-white">{trainer.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">{trainer.name}</h1>
            <p className="text-lg text-muted-foreground mb-3">{trainer.title}</p>
            
            <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{trainer.rating}</span>
                <span>({trainer.reviews}개 리뷰)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{trainer.students}명 훈련</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{trainer.totalCourses}개 과정</span>
              </div>
            </div>
            
            <p className="text-center text-sm mb-6">{trainer.description}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="secondary">{trainer.category}</Badge>
              <Badge variant="outline">{trainer.experience} 경력</Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="flex-1 sm:flex-none">
                상담 신청
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                메시지 보내기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 탭 */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="courses">강의</TabsTrigger>
          <TabsTrigger value="reviews">리뷰</TabsTrigger>
          <TabsTrigger value="schedule">스케줄</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 연락처 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  연락처 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{trainer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{trainer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{trainer.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* 전문 분야 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  전문 분야
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 자격증 */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>자격증 및 인증</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {trainer.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainer.courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">기간:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">가격:</span>
                      <span className="font-semibold">{course.price.toLocaleString()}원</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>수강생 리뷰</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                리뷰 기능은 준비 중입니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                운영 시간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainer.schedule.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">{schedule.day}요일</span>
                    <span className="text-muted-foreground">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}