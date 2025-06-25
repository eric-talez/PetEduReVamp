import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  ChevronRight,
  Lock,
  Eye,
  ArrowLeft
} from 'lucide-react';

interface CoursePreviewProps {
  courseId: string;
}

export default function CoursePreview({ courseId }: CoursePreviewProps) {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  // 미리보기용 강좌 데이터
  const courseData = {
    id: parseInt(courseId),
    title: "반려견 기초 훈련 마스터하기",
    description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스",
    thumbnail: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    instructor: {
      name: "김민수 훈련사",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      bio: "15년 경력의 전문 반려견 훈련사"
    },
    price: 89000,
    rating: 4.8,
    reviews: 245,
    students: 1200,
    duration: "4주",
    level: "초급",
    category: "기본훈련",
    previewLessons: [
      {
        id: 1,
        title: "강좌 소개 및 훈련 원칙",
        duration: "8분",
        isPreview: true,
        videoUrl: "https://example.com/preview1",
        description: "이 강좌에서 배울 내용과 효과적인 훈련 원칙을 소개합니다."
      },
      {
        id: 2,
        title: "기본 자세와 준비물",
        duration: "12분",
        isPreview: true,
        videoUrl: "https://example.com/preview2",
        description: "훈련에 필요한 준비물과 올바른 자세를 배웁니다."
      },
      {
        id: 3,
        title: "앉기 명령어 기초",
        duration: "15분",
        isPreview: false,
        description: "가장 기본적인 '앉기' 명령어 훈련 방법입니다."
      }
    ],
    fullCurriculum: [
      { title: "1주차: 기초 준비", lessons: 4 },
      { title: "2주차: 기본 명령어", lessons: 5 },
      { title: "3주차: 산책 훈련", lessons: 4 },
      { title: "4주차: 응용 훈련", lessons: 3 }
    ]
  };

  const handlePlayPreview = (lessonId: number) => {
    console.log('미리보기 재생:', lessonId);
    setSelectedLesson(lessonId);
    // 실제로는 비디오 플레이어 모달을 열거나 비디오 페이지로 이동
  };

  const handleEnrollNow = () => {
    console.log('지금 등록하기 클릭');
    window.location.href = `/courses/${courseId}`;
  };

  const handleBackToCourse = () => {
    window.location.href = `/courses/${courseId}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={handleBackToCourse}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          강좌로 돌아가기
        </Button>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold">강좌 미리보기</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 강좌 정보 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={courseData.thumbnail}
                  alt={courseData.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{courseData.level}</Badge>
                    <Badge variant="outline">{courseData.category}</Badge>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{courseData.title}</h2>
                  <p className="text-gray-600 mb-3">{courseData.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{courseData.rating}</span>
                      <span className="text-gray-500">({courseData.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{courseData.students.toLocaleString()}명 수강</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{courseData.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 미리보기 레슨 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                무료 미리보기 레슨
              </CardTitle>
              <CardDescription>
                강좌의 일부를 무료로 체험해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courseData.previewLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedLesson === lesson.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => lesson.isPreview && handlePlayPreview(lesson.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        lesson.isPreview ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {lesson.isPreview ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{lesson.duration}</span>
                      {lesson.isPreview ? (
                        <Badge className="bg-green-100 text-green-800">무료</Badge>
                      ) : (
                        <Badge variant="secondary">유료</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 전체 커리큘럼 미리보기 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                전체 커리큘럼
              </CardTitle>
              <CardDescription>
                강좌에 등록하면 모든 내용을 학습할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courseData.fullCurriculum.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{week.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{week.lessons}개 레슨</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 강사 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>강사 소개</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={courseData.instructor.avatar} />
                  <AvatarFallback>{courseData.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{courseData.instructor.name}</h4>
                  <p className="text-sm text-gray-600">{courseData.instructor.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 가격 및 등록 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                {courseData.price.toLocaleString()}원
              </CardTitle>
              <CardDescription>
                평생 수강 가능
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleEnrollNow}
              >
                지금 등록하기
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  30일 환불 보장
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h5 className="font-semibold">이 강좌에 포함된 내용:</h5>
                <ul className="text-sm space-y-1">
                  <li>• 총 16개의 레슨</li>
                  <li>• 평생 수강 가능</li>
                  <li>• 모바일 및 데스크톱 접근</li>
                  <li>• 수료증 제공</li>
                  <li>• 강사 Q&A 지원</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 관련 강좌 */}
          <Card>
            <CardHeader>
              <CardTitle>관련 강좌</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h5 className="font-medium text-sm">반려견 심화 훈련</h5>
                  <p className="text-xs text-gray-600">고급 명령어와 트릭</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs">⭐ 4.7 (89)</span>
                    <span className="text-xs font-medium">129,000원</span>
                  </div>
                </div>
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h5 className="font-medium text-sm">문제행동 교정</h5>
                  <p className="text-xs text-gray-600">짖기, 물기 등 교정</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs">⭐ 4.9 (156)</span>
                    <span className="text-xs font-medium">149,000원</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 비디오 플레이어 모달 (선택된 레슨이 있을 때) */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {courseData.previewLessons.find(l => l.id === selectedLesson)?.title}
              </h3>
              <Button 
                variant="outline" 
                onClick={() => setSelectedLesson(null)}
              >
                닫기
              </Button>
            </div>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="h-16 w-16 mx-auto mb-4" />
                <p>미리보기 비디오 플레이어</p>
                <p className="text-sm text-gray-300">실제 구현에서는 비디오가 재생됩니다</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">
                {courseData.previewLessons.find(l => l.id === selectedLesson)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}