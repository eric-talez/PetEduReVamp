import { useAuth } from "../../SimpleApp";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "wouter";
import { BookOpen, Calendar, Medal, PawPrint, Star, Bone, Award, Clock } from "lucide-react";

interface PetOwnerDashboardProps {
  onAction: (action: string, data?: any) => void;
}

export default function PetOwnerDashboard({ onAction }: PetOwnerDashboardProps) {
  const { userName, userRole } = useAuth();
  const [, setLocation] = useLocation();

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
      level: "초급"
    }
  ];

  const recommendedCourses = [
    {
      id: 4,
      title: "분리불안 극복하기",
      description: "혼자 있는 시간을 두려워하는 반려견을 위한 단계별 행동 교정 프로그램",
      image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      duration: "8주 과정",
      price: "89,000원",
      petName: "토리"
    },
    {
      id: 5,
      title: "재미있는 트릭 훈련",
      description: "하이파이브부터 점프, 회전까지 반려견의 두뇌를 자극하는 다양한 트릭 교육",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      duration: "6주 과정",
      price: "69,000원",
      petName: "몽이"
    },
    {
      id: 6,
      title: "반려견 심리 케어",
      description: "반려견의 행동 패턴을 이해하고 심리적 안정을 돕는 전문 케어 과정",
      image: "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      duration: "5주 과정",
      price: "79,000원"
    },
    {
      id: 7,
      title: "산책 예절 마스터",
      description: "끌기, 짖기 없이 즐거운 산책을 위한 리드 훈련 및 외부 환경 적응법",
      image: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      duration: "4주 과정",
      price: "59,000원"
    }
  ];

  const communityPosts = [
    {
      id: 1,
      author: {
        name: "최견주",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "3시간 전"
      },
      title: "산책 중 다른 강아지 만났을 때 대처법",
      content: "오늘 산책 중 크고 활발한 강아지를 만났는데, 우리집 강아지가 너무 긴장하더라구요. 훈련사님이 알려주신 대로 거리를 두고 차분히 대응했더니 효과가 있었어요. 다른 견주분들도 시도해보세요!",
      likes: 28,
      comments: 12,
      tag: "산책팁"
    },
    {
      id: 2,
      author: {
        name: "김훈련",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "어제"
      },
      title: "강아지가 말을 안들을 때 해결법",
      content: "많은 견주님들이 반려견이 말을 안들어서 힘들어하십니다. 하지만 강아지 입장에선 여러분이 무슨 말을 하는지 모를 수 있어요. 일관된 명령어와 적절한 보상으로 서서히 훈련하는 것이 중요합니다. 다음 주 라이브 세션에서 자세히 알려드릴게요!",
      likes: 56,
      comments: 23,
      tag: "훈련팁"
    },
    {
      id: 3,
      author: {
        name: "박반려",
        avatar: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "2일 전"
      },
      title: "분리불안 극복 성공 후기",
      content: "저희 코코가 혼자 있으면 짖고 물건을 망가뜨리는 문제가 심했는데, 이 플랫폼에서 분리불안 과정을 수강하고 정말 많이 좋아졌어요! 특히 점진적 이별 훈련이 효과적이었습니다. 비슷한 고민 있으신 분들께 추천해요.",
      likes: 42,
      comments: 18,
      tag: "성공후기"
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner - 높이 반으로 줄임 */}
      <div className="relative rounded-xl overflow-hidden h-32 md:h-40 mb-8 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="반려견 교육"
          className="w-full h-full object-cover absolute mix-blend-overlay"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4 max-w-xl">
            반려견과 함께하는 특별한 교육 여정
          </h1>
          <p className="text-white text-sm md:text-lg max-w-xl mb-6">
            Talez와 함께 전문 훈련사의 체계적인 교육으로 더 행복한 반려생활을 시작하세요.
          </p>
          <div>
            <Button
              className="bg-white text-primary font-semibold hover:bg-gray-50 mr-3"
              onClick={() => setLocation("/courses")}
            >
              강의 둘러보기
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => setLocation("/events")}
            >
              무료 웨비나 참여
            </Button>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">진행 중인 강의</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">3개</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">전체 진도율 45%</p>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <PawPrint className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">등록된 반려견</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">2마리</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="토리" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 -ml-2 rounded-full border-2 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="몽이"
                  className="w-full h-full object-cover"
                />
              </div>
              <Link href="/my-pets" className="ml-2 text-xs text-primary hover:text-primary/80">관리하기</Link>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-accent/20 dark:bg-accent/10 text-accent dark:text-accent/90 rounded-full flex items-center justify-center">
              <Medal className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">획득한 배지</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">5개</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex">
              <div className="w-6 h-6 rounded-full bg-accent/80 text-white flex items-center justify-center text-xs">
                <Star className="h-3 w-3" />
              </div>
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs -ml-1">
                <Bone className="h-3 w-3" />
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs -ml-1">
                <Award className="h-3 w-3" />
              </div>
              <Link href="/my-badges" className="ml-2 text-xs text-primary hover:text-primary/80">모두 보기</Link>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">다가오는 일정</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">2개</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center mb-1">
                <Clock className="h-3 w-3 text-purple-500 dark:text-purple-400 mr-1" />
                <span>오늘 17:00 - 기본 훈련 3주차</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 text-purple-500 dark:text-purple-400 mr-1" />
                <span>내일 14:00 - 사회화 훈련 세션</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Current Courses */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">진행 중인 강의</h2>
          <Link href="/my-courses" className="text-sm text-primary hover:text-primary/80 font-medium">모두 보기</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
              <div className="relative h-40">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold px-2 py-1 m-2 rounded">
                  진행 중
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{course.title}</h3>
                  {course.popular && (
                    <Badge variant="warning">인기</Badge>
                  )}
                  {course.level && (
                    <Badge variant={course.level === "초급" ? "success" : "info"}>
                      {course.level}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar 
                      src={course.trainer.avatar}
                      alt={course.trainer.name}
                      fallback={course.trainer.name.substring(0, 2)}
                      className="w-8 h-8"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{course.trainer.name}</span>
                  </div>
                  
                  <div className="text-right">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">진도율 {course.progress}%</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                <Link 
                  href={`/course/${course.id}`} 
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  이어서 학습하기
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Recommended Courses */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">내 반려견을 위한 맞춤 추천</h2>
          <Link href="/recommendations" className="text-sm text-primary hover:text-primary/80 font-medium">더 많은 추천</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
              <div className="relative h-36">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                {course.petName && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-0 left-0 m-2"
                  >
                    {course.petName}에게 맞춤
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">{course.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">총 {course.duration}</span>
                  <span className="font-medium text-accent">{course.price}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Community */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">인기 커뮤니티 소식</h2>
          <Link href="/community" className="text-sm text-primary hover:text-primary/80 font-medium">커뮤니티 가기</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <Avatar 
                    src={post.author.avatar}
                    alt={post.author.name}
                    fallback={post.author.name.substring(0, 2)}
                    className="w-10 h-10"
                  />
                  
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">{post.author.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.author.time}</p>
                  </div>
                </div>
                
                <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-2">{post.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Badge 
                      variant={
                        post.tag === "산책팁" ? "info" :
                        post.tag === "훈련팁" ? "success" : "purple"
                      } 
                    >
                      {post.tag}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
