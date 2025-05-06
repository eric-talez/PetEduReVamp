import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { 
  BarChart2, BookOpen, Calendar, Clock, Filter, Search, Star 
} from "lucide-react";

export default function MyCourses() {
  const [filter, setFilter] = useState("inProgress");
  
  const courses = [
    {
      id: 1,
      title: "반려견 기초 훈련 마스터하기",
      description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 65,
      trainer: {
        name: "김훈련 트레이너",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      startDate: "2023-09-05",
      endDate: "2023-11-30",
      status: "inProgress",
      nextClass: "오늘 17:00 - 기본 훈련 3주차",
      popular: true
    },
    {
      id: 2,
      title: "반려견 어질리티 입문",
      description: "다양한 장애물 코스를 통해 반려견의 민첩성과 집중력을 향상시키는 어질리티 훈련 기초 과정",
      image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 30,
      trainer: {
        name: "박민첩 트레이너",
        avatar: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      startDate: "2023-10-15",
      endDate: "2024-01-15",
      status: "inProgress",
      nextClass: "내일 14:00 - 어질리티 기초 훈련",
      level: "중급"
    },
    {
      id: 3,
      title: "반려견 사회화 훈련",
      description: "다른 반려견, 사람, 환경에 올바르게 적응하는 방법을 배우는 필수 사회화 과정",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 45,
      trainer: {
        name: "이사회 트레이너",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      startDate: "2023-11-01",
      endDate: "2024-02-01",
      status: "inProgress",
      nextClass: "금요일 16:00 - 타 견종 만남 세션",
      level: "초급"
    },
    {
      id: 4,
      title: "반려견 기본 예절",
      description: "반려견의 기본적인 예절과 행동을 가르치는 기초 훈련 과정, 초보 견주에게 필수적인 코스",
      image: "https://images.unsplash.com/photo-1601758174039-617983b8cdd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 100,
      trainer: {
        name: "김예절 트레이너",
        avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      startDate: "2023-05-10",
      endDate: "2023-08-10",
      status: "completed",
      certificate: true,
      level: "초급"
    },
    {
      id: 5,
      title: "문제 행동 교정 과정",
      description: "반려견의 짖음, 물기, 불안 등 다양한 문제 행동을 과학적으로 교정하는 특화된 과정",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 100,
      trainer: {
        name: "박행동 트레이너",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      startDate: "2023-06-15",
      endDate: "2023-09-15",
      status: "completed",
      certificate: true,
      level: "중급"
    },
    {
      id: 6,
      title: "노즈워크 기초",
      description: "반려견의 후각을 활용한 놀이와 훈련으로 지능을 발달시키는 노즈워크 입문 과정",
      image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 0,
      trainer: {
        name: "박후각 트레이너",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      startDate: "2024-01-10",
      endDate: "2024-03-10",
      status: "upcoming",
      level: "초급"
    }
  ];

  const filteredCourses = courses.filter(course => {
    if (filter === "all") return true;
    return course.status === filter;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">내 강의실</h1>
        <p className="text-gray-600 dark:text-gray-300">
          등록한 모든 강의를 확인하고 학습을 계속하세요.
        </p>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">전체 강의</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{courses.length}개</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">진행 중인 강의</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{courses.filter(c => c.status === 'inProgress').length}개</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">다음 수업</h2>
              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {courses.find(c => c.status === 'inProgress')?.nextClass || "예정된 수업 없음"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-4">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 mr-1" />
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">상태:</span>
        </div>
        
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs"
        >
          전체
        </Button>
        
        <Button
          variant={filter === "inProgress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("inProgress")}
          className="text-xs"
        >
          진행 중
        </Button>
        
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
          className="text-xs"
        >
          완료
        </Button>
        
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming")}
          className="text-xs"
        >
          예정
        </Button>
        
        <div className="ml-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="강의 검색" 
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {filteredCourses.length === 0 ? (
          <Card className="p-8 border border-gray-100 dark:border-gray-700 text-center">
            <div className="flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                {filter === "all" ? "등록된 강의가 없습니다" : 
                 filter === "inProgress" ? "진행 중인 강의가 없습니다" : 
                 filter === "completed" ? "완료한 강의가 없습니다" : 
                 "예정된 강의가 없습니다"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {filter === "all" ? "새로운 강의를 찾아보세요!" : 
                 filter === "inProgress" ? "새로운 강의를 시작해보세요." : 
                 filter === "completed" ? "아직 완료한 강의가 없습니다." : 
                 "새로운 강의를 찾아 등록해보세요."}
              </p>
              <Button>
                강의 찾아보기
              </Button>
            </div>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 md:h-full object-cover"
                  />
                  {course.status === "inProgress" && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      진행 중
                    </div>
                  )}
                  {course.status === "completed" && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      완료
                    </div>
                  )}
                  {course.status === "upcoming" && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      예정
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-3/4">
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{course.title}</h3>
                    <div className="flex items-center mt-1 md:mt-0">
                      {course.popular && <Badge variant="warning" className="mr-2">인기</Badge>}
                      {course.level && (
                        <Badge 
                          variant={course.level === "초급" ? "success" : 
                                 course.level === "중급" ? "info" : "secondary"}
                        >
                          {course.level}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Avatar
                        src={course.trainer.avatar}
                        alt={course.trainer.name}
                        className="w-8 h-8 mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{course.trainer.name}</span>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {course.startDate} ~ {course.endDate}
                    </div>
                  </div>
                  
                  {course.status === "inProgress" && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>진도율</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {course.status === "inProgress" && course.nextClass && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span>다음 수업: {course.nextClass}</span>
                    </div>
                  )}
                  
                  {course.status === "completed" && course.certificate && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span>수료증 발급 가능</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {course.status === "inProgress" && (
                      <Button>
                        이어서 학습하기
                      </Button>
                    )}
                    
                    {course.status === "completed" && course.certificate && (
                      <Button>
                        수료증 발급
                      </Button>
                    )}
                    
                    {course.status === "upcoming" && (
                      <Button>
                        강의 정보
                      </Button>
                    )}
                    
                    <Button variant="outline">
                      상세 보기
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
