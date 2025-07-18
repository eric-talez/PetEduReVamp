import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, SlidersHorizontal, Star, BookOpen, Package, Video, VideoOff, Play, Clock, Eye, ChevronRight, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const { toast } = useToast();

  // 강의 구매 처리 함수
  const handlePurchase = (courseId: string) => {
    console.log('강의 구매 클릭:', courseId);
    navigate(`/checkout?courseId=${courseId}`);
  };

  // 강좌 상세보기 핸들러
  const handleCourseDetail = (courseId: number) => {
    console.log('강좌 상세보기 클릭:', courseId);
    navigate(`/courses/${courseId}`);
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
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setShowCourseModal(true);
    }
  };

  // 수강신청 핸들러
  const handleEnroll = () => {
    toast({
      title: "수강신청 완료",
      description: "수강신청이 완료되었습니다!",
    });
    setShowCourseModal(false);
  };

  // 영상 재생 핸들러
  const handlePlayVideo = (module: any) => {
    setSelectedModule(module);
    setShowVideoModal(true);
  };

  // 상품 정보 핸들러
  const handleProductClick = (productName: string) => {
    // 실제 상품 정보를 위한 mock 데이터 생성
    const productInfo = {
      name: productName,
      price: Math.floor(Math.random() * 50000) + 5000,
      description: `${productName}에 대한 상세한 설명입니다. 반려견 훈련에 꼭 필요한 전문 용품으로 높은 품질을 자랑합니다.`,
      image: `https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop`,
      category: "훈련용품",
      rating: 4.5,
      reviews: Math.floor(Math.random() * 200) + 10,
      inStock: true,
      brand: "TALEZ",
      features: [
        "고품질 소재 사용",
        "반려견 안전 인증",
        "훈련 전문가 추천",
        "내구성 보장"
      ]
    };
    setSelectedProduct(productInfo);
    setShowProductModal(true);
  };

  // 장바구니 추가 핸들러
  const handleAddToCart = () => {
    toast({
      title: "장바구니에 추가됨",
      description: `${selectedProduct?.name}이(가) 장바구니에 추가되었습니다.`,
    });
    setShowProductModal(false);
  };

  // 상품 구매 핸들러
  const handleBuyProduct = () => {
    if (selectedProduct) {
      // 결제 페이지로 이동하면서 상품 정보 전달
      const productData = {
        id: `product_${Date.now()}`,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        type: 'product'
      };
      
      // URL 파라미터로 상품 정보 전달
      const queryParams = new URLSearchParams({
        productId: productData.id,
        productName: productData.name,
        price: productData.price.toString(),
        type: productData.type
      });
      
      // wouter를 사용하여 페이지 이동
      navigate(`/checkout?${queryParams.toString()}`);
      setShowProductModal(false);
    }
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

  // 페이지네이션을 위한 현재 페이지 강의 목록
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // 검색/필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

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
        {currentCourses.length > 0 ? (
          currentCourses.map((course) => (
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
                    onClick={() => handlePurchase(course.id)}
                  >
                    구매하기
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
      {filteredCourses.length > itemsPerPage && (
        <div className="mt-10 flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            {Array.from({ length: Math.ceil(filteredCourses.length / itemsPerPage) }, (_, i) => i + 1)
              .filter(page => {
                const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                return false;
              })
              .map((page, index, array) => {
                const shouldShowEllipsis = index > 0 && array[index - 1] !== page - 1;
                return (
                  <div key={page} className="flex items-center">
                    {shouldShowEllipsis && (
                      <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="text-sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => setCurrentPage(Math.min(Math.ceil(filteredCourses.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredCourses.length / itemsPerPage)}
            >
              다음
            </Button>
          </nav>
        </div>
      )}

      {/* 강의 상세 정보 모달 */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {selectedCourse.category}
                  </Badge>
                  {getDifficultyBadge(selectedCourse.difficulty)}
                  <span className="text-sm text-gray-500">
                    {Math.floor(selectedCourse.duration / 60)}시간 {selectedCourse.duration % 60}분
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{selectedCourse.trainerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedCourse.trainerName}</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {selectedCourse.price.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 강의 소개 */}
              <div>
                <h4 className="text-lg font-semibold mb-3">강의 소개</h4>
                <p className="text-gray-700 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {/* 커리큘럼 모듈 */}
              {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">커리큘럼</h4>
                  <div className="space-y-3">
                    {selectedCourse.modules.map((module: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">{module.title}</h5>
                            {module.description && (
                              <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                            )}
                            
                            {/* 시간 및 가격 정보 */}
                            <div className="flex items-center gap-4 mb-3">
                              {module.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-500">{module.duration}분</span>
                                </div>
                              )}
                              {module.price !== undefined && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-gray-500">
                                    {module.isFree ? '무료' : `${module.price?.toLocaleString()}원`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* 준비물 정보 */}
                            {module.materials && module.materials.length > 0 && (
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Package className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-700">준비물</span>
                                </div>
                                <div className="flex flex-wrap gap-1 ml-6">
                                  {module.materials.map((material: string, idx: number) => (
                                    <Badge 
                                      key={idx} 
                                      variant="outline" 
                                      className="text-xs cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                                      onClick={() => handleProductClick(material)}
                                    >
                                      {material}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 영상 정보 */}
                            <div className="mt-3">
                              {module.videoUrl || module.attachments?.some((att: any) => att.type === 'video') ? (
                                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                  <Video className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-blue-800">영상 강의 준비됨</span>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="ml-auto"
                                    onClick={() => handlePlayVideo(module)}
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    재생
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                                  <VideoOff className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">영상 강의 준비 중</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 하단 버튼 */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1"
                >
                  닫기
                </Button>
                <Button 
                  onClick={handleEnroll}
                  className="flex-1"
                >
                  수강 신청
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 영상 재생 모달 */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedModule?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedModule && (
            <div className="space-y-4">
              {/* 영상 플레이어 */}
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                {selectedModule.videoUrl ? (
                  <video 
                    controls 
                    className="w-full h-full rounded-lg"
                    src={selectedModule.videoUrl}
                  >
                    브라우저에서 비디오를 지원하지 않습니다.
                  </video>
                ) : selectedModule.attachments?.some((att: any) => att.type === 'video') ? (
                  <video 
                    controls 
                    className="w-full h-full rounded-lg"
                    src={selectedModule.attachments.find((att: any) => att.type === 'video')?.url}
                  >
                    브라우저에서 비디오를 지원하지 않습니다.
                  </video>
                ) : (
                  <div className="text-center text-white">
                    <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">영상 준비 중</p>
                    <p className="text-sm opacity-75">곧 업로드될 예정입니다.</p>
                  </div>
                )}
              </div>

              {/* 모듈 정보 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedModule.title}</h4>
                {selectedModule.description && (
                  <p className="text-gray-600 text-sm mb-3">{selectedModule.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {selectedModule.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedModule.duration}분</span>
                    </div>
                  )}
                  {selectedModule.price !== undefined && (
                    <div className="flex items-center gap-1">
                      <span>{selectedModule.isFree ? '무료' : `${selectedModule.price?.toLocaleString()}원`}</span>
                    </div>
                  )}
                </div>

                {/* 준비물 */}
                {selectedModule.materials && selectedModule.materials.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-700">준비물</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedModule.materials.map((material: string, idx: number) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                          onClick={() => handleProductClick(material)}
                        >
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 닫기 버튼 */}
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowVideoModal(false)}
                  variant="outline"
                >
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 상품 정보 팝업 모달 */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              상품 정보
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {/* 상품 이미지 */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 상품 기본 정보 */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-sm">
                        {selectedProduct.category}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {selectedProduct.brand}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {selectedProduct.price.toLocaleString()}원
                    </div>
                    <div className="text-sm text-green-600">
                      {selectedProduct.inStock ? '재고 있음' : '품절'}
                    </div>
                  </div>
                </div>

                {/* 평점 및 리뷰 */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{selectedProduct.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedProduct.reviews}개 리뷰
                  </div>
                </div>

                {/* 상품 설명 */}
                <div>
                  <h4 className="font-semibold mb-2">상품 설명</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* 상품 특징 */}
                <div>
                  <h4 className="font-semibold mb-2">상품 특징</h4>
                  <ul className="space-y-1">
                    {selectedProduct.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3 pt-4 border-t">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Heart className="w-4 h-4" />
                    찜하기
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    공유
                  </Button>
                </div>
                <div className="flex-1 flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1 flex items-center gap-1"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    장바구니
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleBuyProduct}
                    disabled={!selectedProduct.inStock}
                  >
                    구매하기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}