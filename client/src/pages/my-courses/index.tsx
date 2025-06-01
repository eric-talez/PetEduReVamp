import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, User } from "lucide-react";

export default function MyCoursesPage() {
  const courses = [
    {
      id: 1,
      title: "기초 반려견 훈련",
      instructor: "김훈련사",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      status: "진행중",
      nextLesson: "2025-06-02 14:00"
    },
    {
      id: 2,
      title: "사회화 훈련 프로그램",
      instructor: "박훈련사",
      progress: 45,
      totalLessons: 8,
      completedLessons: 4,
      status: "진행중",
      nextLesson: "2025-06-03 10:00"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">내 강의</h1>
        <p className="text-gray-600">현재 수강 중인 강의와 진행 상황을 확인하세요.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <User className="w-4 h-4 mr-1" />
                    {course.instructor}
                  </CardDescription>
                </div>
                <Badge variant={course.status === "진행중" ? "default" : "secondary"}>
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>진행률</span>
                    <span>{course.completedLessons}/{course.totalLessons} 강의</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {course.progress}%
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  다음 수업: {course.nextLesson}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    수업 참여
                  </Button>
                  <Button size="sm" variant="outline">
                    상세 보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">수강 중인 강의가 없습니다</h3>
          <p className="text-gray-600 mb-4">새로운 강의를 신청해보세요.</p>
          <Button>강의 둘러보기</Button>
        </div>
      )}
    </div>
  );
}