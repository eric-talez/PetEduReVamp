import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, SlidersHorizontal, Star } from "lucide-react";

interface CoursesPageProps {
  mode?: 'view' | 'create' | 'edit';
  userType?: string;
}

export default function Courses(props?: CoursesPageProps) {
  const { mode = 'view', userType } = props || {};
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      id: 1,
      title: "반려견 기초 훈련 마스터하기",
      description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "89,000원",
      trainer: {
        name: "김훈련 트레이너",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.8,
      reviews: 45,
      popular: true,
      level: "초급",
      category: "기본 훈련"
    },
    {
      id: 2,
      title: "반려견 어질리티 입문",
      description: "다양한 장애물 코스를 통해 반려견의 민첩성과 집중력을 향상시키는 어질리티 훈련 기초 과정",
      image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "120,000원",
      trainer: {
        name: "박민첩 트레이너",
        avatar: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.6,
      reviews: 28,
      level: "중급",
      category: "활동 훈련"
    },
    {
      id: 3,
      title: "반려견 사회화 훈련",
      description: "다른 반려견, 사람, 환경에 올바르게 적응하는 방법을 배우는 필수 사회화 과정",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "75,000원",
      trainer: {
        name: "이사회 트레이너",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.9,
      reviews: 36,
      level: "초급",
      category: "사회화"
    },
    {
      id: 4,
      title: "분리불안 극복하기",
      description: "혼자 있는 시간을 두려워하는 반려견을 위한 단계별 행동 교정 프로그램",
      image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "89,000원",
      trainer: {
        name: "최행동 트레이너",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.7,
      reviews: 22,
      level: "중급",
      category: "행동 교정"
    },
    {
      id: 5,
      title: "재미있는 트릭 훈련",
      description: "하이파이브부터 점프, 회전까지 반려견의 두뇌를 자극하는 다양한 트릭 교육",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "69,000원",
      trainer: {
        name: "박재미 트레이너",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.5,
      reviews: 19,
      popular: true,
      level: "모든 레벨",
      category: "트릭 훈련"
    },
    {
      id: 6,
      title: "반려견 심리 케어",
      description: "반려견의 행동 패턴을 이해하고 심리적 안정을 돕는 전문 케어 과정",
      image: "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "79,000원",
      trainer: {
        name: "김심리 트레이너",
        avatar: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.8,
      reviews: 31,
      level: "중급",
      category: "심리 케어"
    },
    {
      id: 7,
      title: "산책 예절 마스터",
      description: "끌기, 짖기 없이 즐거운 산책을 위한 리드 훈련 및 외부 환경 적응법",
      image: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "59,000원",
      trainer: {
        name: "이산책 트레이너",
        avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.6,
      reviews: 24,
      popular: true,
      level: "초급",
      category: "기본 훈련"
    },
    {
      id: 8,
      title: "반려견 노즈워크 기초",
      description: "후각을 활용한 놀이와 훈련으로 반려견의 지능을 발달시키는 노즈워크 입문 과정",
      image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      price: "68,000원",
      trainer: {
        name: "박후각 트레이너",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      rating: 4.7,
      reviews: 17,
      level: "초급",
      category: "특수 훈련"
    }
  ];

  // 검색 기능
  const handleSearch = () => {
    console.log('검색 실행:', searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('검색어 변경:', e.target.value);
  };

  // 실시간 검색 및 필터링
  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      course.level === filter ||
      course.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="강의 탐색"
          className="w-full h-full object-cover absolute"
        />



        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-primary dark:text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            반려견을 위한 체계적인 교육 과정
          </h1>
          <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base max-w-xl mb-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            평생 함께할 반려견에게 필요한 훈련과 교육을 전문가와 함께 시작하세요.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="원하는 강의를 검색하세요" 
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <Button className="ml-2" onClick={handleSearch}>
              검색
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-4">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 mr-1" />
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">필터:</span>
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
          variant={filter === "초급" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("초급")}
          className="text-xs"
        >
          초급
        </Button>

        <Button
          variant={filter === "중급" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("중급")}
          className="text-xs"
        >
          중급
        </Button>

        <Button
          variant={filter === "기본 훈련" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("기본 훈련")}
          className="text-xs"
        >
          기본 훈련
        </Button>

        <Button
          variant={filter === "사회화" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("사회화")}
          className="text-xs"
        >
          사회화
        </Button>

        <Button
          variant={filter === "행동 교정" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("행동 교정")}
          className="text-xs"
        >
          행동 교정
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="ml-auto text-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
          고급 필터
        </Button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              {course.popular && (
                <Badge variant="warning" className="absolute top-2 right-2">
                  인기
                </Badge>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{course.title}</h3>

              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 mr-2">
                  {course.rating}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({course.reviews} 후기)
                </span>

                <Badge variant={
                  course.level === "초급" ? "success" : 
                  course.level === "중급" ? "info" : "secondary"
                } className="ml-auto">
                  {course.level}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={course.trainer.avatar} alt={course.trainer.name} />
                    <AvatarFallback>{course.trainer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{course.trainer.name}</span>
                </div>

                <span className="font-medium text-sm text-accent">{course.price}</span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
              <Link href={`/course/${course.id}`}>
                <Button 
                  variant="link" 
                  className="text-sm font-medium text-primary hover:text-primary/80 p-0"
                >
                  자세히 보기
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-sm">
            이전
          </Button>
          <Button variant="default" size="sm" className="text-sm">
            1
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            2
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            3
          </Button>
          <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
          <Button variant="outline" size="sm" className="text-sm">
            8
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            다음
          </Button>
        </nav>
      </div>
    </div>
  );
}