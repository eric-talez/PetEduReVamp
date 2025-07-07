import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, SlidersHorizontal, Star, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoursesPageProps {
  mode?: 'view' | 'create' | 'edit';
  userType?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number;
  modules: any[];
  trainerName: string;
  status: 'draft' | 'published' | 'archived';
  enrollmentCount?: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

export default function Courses(props?: CoursesPageProps) {
  const { mode = 'view', userType } = props || {};
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 수강 신청 처리 함수
  const handleEnrollment = async (courseId: number) => {
    console.log('수강 신청 클릭:', courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('수강 신청 성공:', courseId);
        alert('수강 신청이 완료되었습니다!');
        window.location.reload();
      } else {
        const error = await response.text();
        console.error('수강 신청 실패:', error);
        alert(`수강 신청 실패: ${error}`);
      }
    } catch (error) {
      console.error('수강 신청 오류:', error);
      alert('수강 신청 중 오류가 발생했습니다.');
    }
  };

  // 강좌 상세보기 핸들러
  const handleCourseDetail = (courseId: number) => {
    console.log('강좌 상세보기 클릭:', courseId);
    window.location.href = `/courses/${courseId}`;
  };

  // 강좌 참여하기 핸들러
  const handleJoinCourse = (courseId: string) => {
    console.log('강좌 참여하기 클릭:', courseId);
    // 로그인 체크 후 수강 신청 프로세스 시작
    handleEnrollment(parseInt(courseId));
  };

  // 미리보기 핸들러
  const handlePreview = (courseId: string) => {
    console.log('미리보기 클릭:', courseId);
    window.location.href = `/courses/${courseId}/preview`;
  };

  // 실제 등록된 커리큘럼에서 발행된 강의만 조회
  const fetchPublishedCourses = async () => {
    try {
      setLoading(true);
      console.log('🔥 강의 찾기 - 발행된 강의 목록 조회 시작');
      
      const response = await fetch('/api/admin/curriculums');
      if (response.ok) {
        const data = await response.json();
        console.log('🔥 커리큘럼 데이터:', data);
        
        // 발행된 상태의 커리큘럼만 필터링하여 강의 형태로 변환
        const publishedCourses = data.curriculums
          .filter((curriculum: any) => curriculum.status === 'published')
          .map((curriculum: any) => ({
            id: curriculum.id,
            title: curriculum.title,
            description: curriculum.description,
            price: curriculum.price || 0,
            difficulty: curriculum.difficulty || 'beginner',
            category: curriculum.category || '기본 훈련',
            duration: curriculum.duration || 0,
            modules: curriculum.modules || [],
            trainerName: curriculum.trainerName || '전문 훈련사',
            status: curriculum.status,
            enrollmentCount: curriculum.enrollmentCount || 0,
            averageRating: curriculum.averageRating || 0,
            createdAt: curriculum.createdAt || new Date().toISOString(),
            updatedAt: curriculum.updatedAt || new Date().toISOString()
          }));
        
        console.log('🔥 발행된 강의 목록:', publishedCourses);
        setCourses(publishedCourses);
      } else {
        console.error('🔥 커리큘럼 API 응답 실패:', response.status);
        toast({
          title: "오류",
          description: "강의 목록을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('🔥 강의 데이터 로딩 실패:', error);
      toast({
        title: "오류",
        description: "강의 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedCourses();
  }, []);

  // 필터링된 강의 목록
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.trainerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "beginner") return matchesSearch && course.difficulty === "beginner";
    if (filter === "intermediate") return matchesSearch && course.difficulty === "intermediate";
    if (filter === "advanced") return matchesSearch && course.difficulty === "advanced";
    
    return matchesSearch && course.category === filter;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="success">초급</Badge>;
      case 'intermediate':
        return <Badge className="bg-blue-500 text-white">중급</Badge>;
      case 'advanced':
        return <Badge variant="destructive">고급</Badge>;
      default:
        return <Badge variant="secondary">미설정</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">강의 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 검색 기능
  const handleSearch = () => {
    console.log('검색 실행:', searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('검색어 변경:', e.target.value);
  };

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
          variant={filter === "beginner" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("beginner")}
          className="text-xs"
        >
          초급
        </Button>

        <Button
          variant={filter === "intermediate" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("intermediate")}
          className="text-xs"
        >
          중급
        </Button>

        <Button
          variant={filter === "advanced" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("advanced")}
          className="text-xs"
        >
          고급
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
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-blue-400" />
                <Badge variant="default" className="absolute top-2 right-2">
                  발행됨
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{course.title}</h3>

                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 mr-2">
                    {course.averageRating || 0}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({course.enrollmentCount || 0} 수강생)
                  </span>

                  <div className="ml-auto">
                    {getDifficultyBadge(course.difficulty)}
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback>{course.trainerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{course.trainerName}</span>
                  </div>

                  <span className="font-medium text-sm text-primary">{course.price.toLocaleString()}원</span>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  <span>{Math.floor(course.duration / 60)}시간 {course.duration % 60}분</span>
                  <span className="mx-2">•</span>
                  <span>{course.modules.length}개 모듈</span>
                  <span className="mx-2">•</span>
                  <span>{course.category}</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handlePreview(course.id)}
                  >
                    미리보기
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleJoinCourse(course.id)}
                  >
                    수강 신청
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">현재 발행된 강의가 없습니다.</p>
            <p className="text-gray-400 text-sm">관리자가 강의를 발행하면 이곳에 표시됩니다.</p>
          </div>
        )}
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