import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Users, BookOpen, Play, Download } from 'lucide-react';

interface CourseDetailProps {
  courseId: string;
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  // Mock data based on the popular chart data
  const getCourseData = (id: string) => {
    const courses = {
      '1': {
        id: 1,
        title: "기본 순종 훈련",
        description: "반려견의 기본적인 순종 훈련을 위한 필수 과정입니다. 앉기, 기다리기, 이리와 등의 기본 명령어를 배웁니다.",
        category: "기본훈련",
        instructor: "김민수 훈련사",
        instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        duration: "4주",
        price: 150000,
        rating: 4.8,
        reviews: 245,
        students: 1200,
        level: "초급",
        thumbnail: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        lessons: [
          { id: 1, title: "기본 자세와 리드줄 사용법", duration: "15분", completed: false },
          { id: 2, title: "앉기 명령어 훈련", duration: "20분", completed: false },
          { id: 3, title: "기다리기 명령어 훈련", duration: "18분", completed: false },
          { id: 4, title: "이리와 명령어 훈련", duration: "22분", completed: false }
        ],
        requirements: [
          "3개월 이상의 건강한 반려견",
          "기본적인 백신 접종 완료",
          "훈련에 필요한 간식과 리드줄 준비"
        ],
        whatYouWillLearn: [
          "기본 순종 명령어 (앉기, 기다리기, 이리와)",
          "올바른 리드줄 사용법",
          "효과적인 보상 시스템 활용",
          "문제 행동 예방 및 교정 방법"
        ]
      },
      '2': {
        id: 2,
        title: "실내 배변 훈련",
        description: "실내에서 올바른 배변 습관을 기르는 전문 훈련 과정입니다.",
        category: "배변훈련",
        instructor: "이수진 훈련사",
        instructorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        duration: "3주",
        price: 120000,
        rating: 4.7,
        reviews: 189,
        students: 890,
        level: "초급",
        thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        lessons: [
          { id: 1, title: "배변 패드 배치와 환경 설정", duration: "12분", completed: false },
          { id: 2, title: "배변 신호 인식하기", duration: "16분", completed: false },
          { id: 3, title: "성공적인 배변 후 보상 방법", duration: "14분", completed: false }
        ],
        requirements: [
          "6개월 미만의 어린 반려견 권장",
          "실내 훈련 공간 확보",
          "배변 패드와 청소 용품 준비"
        ],
        whatYouWillLearn: [
          "올바른 배변 장소 인식",
          "배변 신호 파악 방법",
          "실수 시 올바른 대응법",
          "배변 패드 사용법"
        ]
      }
    };
    
    return courses[id as keyof typeof courses] || courses['1'];
  };

  const course = getCourseData(courseId);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* 강의 헤더 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{course.rating}</span>
                  <span>({course.reviews}개 리뷰)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students}명 수강</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 수강 신청 카드 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl">{course.price.toLocaleString()}원</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                수강 신청하기
              </Button>
              <Button variant="outline" className="w-full">
                장바구니에 추가
              </Button>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">강사 정보</h4>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                    <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-muted-foreground">전문 훈련사</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 상세 정보 탭 */}
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
          <TabsTrigger value="description">강의 소개</TabsTrigger>
          <TabsTrigger value="requirements">수강 요건</TabsTrigger>
          <TabsTrigger value="reviews">리뷰</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                강의 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>강의 소개</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">이 강의에서 배우게 될 내용</h3>
                  <ul className="space-y-2">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">강의 설명</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description} 체계적이고 단계별로 진행되는 훈련 과정을 통해 
                    반려견과의 더 나은 소통을 경험하실 수 있습니다. 
                    경험 많은 전문 훈련사가 직접 지도하며, 개별 반려견의 특성에 맞는 
                    맞춤형 훈련 방법을 제공합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>수강 요건</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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
      </Tabs>
    </div>
  );
}