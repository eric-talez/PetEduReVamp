import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, Edit, Trash2, BookOpen, Users, Clock, DollarSign } from "lucide-react";
import { useState } from "react";

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 샘플 강좌 데이터
  const courses = [
    {
      id: 1,
      title: "기본 순종 훈련 과정",
      institute: "서울반려견아카데미",
      trainer: "김훈련사",
      category: "기본 훈련",
      level: "초급",
      duration: "8주",
      price: 320000,
      enrolledStudents: 24,
      maxStudents: 30,
      status: "active",
      startDate: "2024-02-15",
      endDate: "2024-04-10",
      description: "강아지의 기본적인 순종 훈련을 위한 체계적인 교육 과정"
    },
    {
      id: 2,
      title: "문제행동 교정 전문과정",
      institute: "부산펫트레이닝센터",
      trainer: "이전문가",
      category: "문제행동",
      level: "중급",
      duration: "12주",
      price: 480000,
      enrolledStudents: 18,
      maxStudents: 20,
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-05-24",
      description: "공격성, 분리불안 등 문제행동을 전문적으로 교정하는 과정"
    },
    {
      id: 3,
      title: "어질리티 경기 준비반",
      institute: "대구동물교육원",
      trainer: "박마스터",
      category: "어질리티",
      level: "고급",
      duration: "16주",
      price: 640000,
      enrolledStudents: 12,
      maxStudents: 15,
      status: "completed",
      startDate: "2024-01-08",
      endDate: "2024-04-29",
      description: "어질리티 경기 출전을 위한 고급 훈련 과정"
    },
    {
      id: 4,
      title: "강아지 사회화 프로그램",
      institute: "서울반려견아카데미",
      trainer: "김훈련사",
      category: "사회화",
      level: "초급",
      duration: "6주",
      price: 240000,
      enrolledStudents: 28,
      maxStudents: 35,
      status: "recruiting",
      startDate: "2024-03-15",
      endDate: "2024-04-26",
      description: "어린 강아지의 건전한 사회화를 위한 그룹 프로그램"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">진행중</Badge>;
      case 'recruiting':
        return <Badge className="bg-green-100 text-green-800">모집중</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">완료</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">취소</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      '초급': 'bg-green-50 text-green-700 border-green-200',
      '중급': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      '고급': 'bg-red-50 text-red-700 border-red-200'
    };
    return <Badge variant="outline" className={colors[level as keyof typeof colors]}>{level}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">강좌 관리</h1>
          <p className="text-muted-foreground">등록된 훈련 강좌들을 관리합니다</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 강좌 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 강좌 수</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              진행중 {courses.filter(c => c.status === 'active').length}개
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 등록생</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((total, course) => total + course.enrolledStudents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              모든 강좌 합계
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 수강료</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(courses.reduce((total, course) => total + course.price, 0) / courses.length / 1000)}만원
            </div>
            <p className="text-xs text-muted-foreground">
              강좌당 평균
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 수강률</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((courses.reduce((total, course) => total + (course.enrolledStudents / course.maxStudents), 0) / courses.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              정원 대비 등록률
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>강좌 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="강좌명, 기관명, 훈련사명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="카테고리 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="기본 훈련">기본 훈련</SelectItem>
                <SelectItem value="문제행동">문제행동</SelectItem>
                <SelectItem value="어질리티">어질리티</SelectItem>
                <SelectItem value="사회화">사회화</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              고급 필터
            </Button>
          </div>

          {/* 강좌 테이블 */}
          <div className="border rounded-lg">
            <div className="grid grid-cols-9 gap-4 p-4 font-medium border-b bg-muted/50">
              <div>강좌명</div>
              <div>기관/훈련사</div>
              <div>카테고리</div>
              <div>레벨</div>
              <div>기간</div>
              <div>수강료</div>
              <div>등록현황</div>
              <div>상태</div>
              <div>작업</div>
            </div>
            {courses.map((course) => (
              <div key={course.id} className="grid grid-cols-9 gap-4 p-4 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{course.description}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{course.institute}</div>
                  <div className="text-sm text-muted-foreground">{course.trainer}</div>
                </div>
                <div className="text-sm">{course.category}</div>
                <div>{getLevelBadge(course.level)}</div>
                <div className="text-sm">
                  <div>{course.duration}</div>
                  <div className="text-muted-foreground">{course.startDate}</div>
                </div>
                <div className="font-medium">
                  {(course.price / 1000).toFixed(0)}만원
                </div>
                <div className="text-center">
                  <div className="font-medium">{course.enrolledStudents}/{course.maxStudents}</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((course.enrolledStudents / course.maxStudents) * 100)}% 달성
                  </div>
                </div>
                <div>{getStatusBadge(course.status)}</div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      console.log('강좌 상세보기:', course.title);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      console.log('강좌 편집:', course.title);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      console.log('강좌 삭제:', course.title);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}