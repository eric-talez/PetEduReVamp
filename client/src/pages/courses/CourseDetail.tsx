import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  CreditCard,
  CheckCircle,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  enrollmentCount: number;
  rating: number;
  status: string;
  isAvailableForPurchase: boolean;
  thumbnailUrl: string;
  modules: Module[];
  reviews: Review[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchCourseDetail(id);
    }
  }, [id]);

  const fetchCourseDetail = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
      }
    } catch (error) {
      console.error('강의 상세 조회 실패:', error);
      toast({
        title: "오류",
        description: "강의 정보를 불러올 수 없습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!course) return;
    
    setPurchasing(true);
    try {
      const response = await fetch(`/api/courses/${course.id}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "구매 완료",
          description: `"${course.title}" 강의 구매가 완료되었습니다!`,
        });
        
        // 구매 완료 후 강의 수강 페이지로 이동
        setTimeout(() => {
          window.location.href = `/learn/${course.id}`;
        }, 1500);
      } else {
        throw new Error('구매 실패');
      }
    } catch (error) {
      toast({
        title: "구매 실패",
        description: "강의 구매 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '미정';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">강의를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">요청하신 강의가 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground">강의 상세</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 강의 정보 카드 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Badge variant={getDifficultyColor(course.difficulty)}>
                    {getDifficultyLabel(course.difficulty)}
                  </Badge>
                  <Badge variant="outline">{course.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{Math.floor(course.duration / 60)}시간 {course.duration % 60}분</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{course.enrollmentCount}명 수강중</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{course.trainerName}</p>
                    <p className="text-sm text-muted-foreground">전문 훈련사</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 커리큘럼 섹션 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  커리큘럼
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{module.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{module.duration}분</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              <span>{module.videos.length}개 영상</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 수강후기 섹션 */}
            <Card>
              <CardHeader>
                <CardTitle>수강후기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.userName}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 - 구매 정보 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-center">강의 구매</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ₩{course.price.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">평생 수강 가능</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">평생 무제한 수강</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">모바일/PC 지원</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">수료증 발급</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">강사 Q&A 지원</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={purchasing || !course.isAvailableForPurchase}
                    className="w-full h-12 text-lg"
                  >
                    {purchasing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        구매중...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        지금 구매하기
                      </div>
                    )}
                  </Button>

                  <div className="text-xs text-center text-muted-foreground">
                    구매 후 즉시 수강 가능합니다
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}