import { CourseCard, StatCard, CommunityCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Link } from 'wouter';
import { Calendar, Medal, GraduationCap, PawPrint } from 'lucide-react';
import { getUserRole } from '@/lib/utils';

export default function Home() {
  const userRole = getUserRole();
  
  return (
    <div>
      {/* Banner Section */}
      <div className="relative rounded-xl overflow-hidden h-60 md:h-80 mb-8 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400"
          alt="반려견 교육"
          className="w-full h-full object-cover absolute mix-blend-overlay"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-white text-2xl md:text-4xl font-display font-bold mb-2 md:mb-4 max-w-xl">
            반려견과 함께하는 특별한 교육 여정
          </h1>
          <p className="text-white text-sm md:text-lg max-w-xl mb-6">
            PetEduPlatform과 함께 전문 훈련사의 체계적인 교육으로 더 행복한 반려생활을 시작하세요.
          </p>
          <div>
            <Button
              variant="default"
              className="bg-white text-primary font-semibold mr-3"
            >
              <Link href="/courses">강의 둘러보기</Link>
            </Button>
            
            <Button variant="outlineWhite">
              <Link href="/free-webinar">무료 웨비나 참여</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content - different for each role */}
      {userRole === 'pet-owner' && (
        <div className="user-dashboard">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<GraduationCap className="text-xl" />}
              title="진행 중인 강의"
              value="3개"
              color="blue"
            >
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">전체 진도율 45%</p>
            </StatCard>
            
            <StatCard
              icon={<PawPrint className="text-xl" />}
              title="등록된 반려견"
              value="2마리"
              color="green"
            >
              <div className="flex items-center">
                <Avatar
                  src="https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                  alt="토리"
                  size="sm"
                  border
                  className="-ml-0"
                />
                <Avatar
                  src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                  alt="몽이"
                  size="sm"
                  border
                  className="-ml-2"
                />
                <Link href="/my-pets" className="ml-2 text-xs text-primary hover:text-primary/80">관리하기</Link>
              </div>
            </StatCard>
            
            <StatCard
              icon={<Medal className="text-xl" />}
              title="획득한 배지"
              value="5개"
              color="accent"
            >
              <div className="flex">
                <div className="w-6 h-6 rounded-full bg-accent/80 text-white flex items-center justify-center text-xs">
                  ⭐
                </div>
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs -ml-1">
                  🦴
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs -ml-1">
                  🏆
                </div>
                <Link href="/my-badges" className="ml-2 text-xs text-primary hover:text-primary/80">모두 보기</Link>
              </div>
            </StatCard>
            
            <StatCard
              icon={<Calendar className="text-xl" />}
              title="다가오는 일정"
              value="2개"
              color="purple"
            >
              <div className="text-xs text-gray-700 dark:text-gray-300">
                <div className="flex items-center mb-1">
                  <span className="text-purple-500 dark:text-purple-400 mr-1">⏰</span>
                  <span>오늘 17:00 - 기본 훈련 3주차</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 dark:text-purple-400 mr-1">⏰</span>
                  <span>내일 14:00 - 사회화 훈련 세션</span>
                </div>
              </div>
            </StatCard>
          </div>
          
          {/* Ongoing Courses Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">진행 중인 강의</h2>
              <Link href="/my-courses" className="text-sm text-primary hover:text-primary/80 font-medium">모두 보기</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CourseCard
                image="https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350"
                title="반려견 기초 훈련 마스터하기"
                description="앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스"
                badge={{ text: "인기", variant: "accent" }}
                progress={65}
                trainer={{ 
                  image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
                  name: "김훈련 트레이너" 
                }}
                status="진행 중"
                onClick={() => {}}
              />
              
              <CourseCard
                image="https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350"
                title="반려견 어질리티 입문"
                description="다양한 장애물 코스를 통해 반려견의 민첩성과 집중력을 향상시키는 어질리티 훈련 기초 과정"
                badge={{ text: "중급", variant: "blue" }}
                progress={30}
                trainer={{ 
                  image: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
                  name: "박민첩 트레이너" 
                }}
                status="진행 중"
                onClick={() => {}}
              />
              
              <CourseCard
                image="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350"
                title="반려견 사회화 훈련"
                description="다른 반려견, 사람, 환경에 올바르게 적응하는 방법을 배우는 필수 사회화 과정"
                badge={{ text: "초급", variant: "green" }}
                progress={45}
                trainer={{ 
                  image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
                  name: "이사회 트레이너" 
                }}
                status="진행 중"
                onClick={() => {}}
              />
            </div>
          </div>
          
          {/* Recommended Courses */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">내 반려견을 위한 맞춤 추천</h2>
              <Link href="/recommendations" className="text-sm text-primary hover:text-primary/80 font-medium">더 많은 추천</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow border border-gray-100 dark:border-gray-700 card-hover">
                <div className="relative h-36">
                  <img 
                    src="https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350" 
                    alt="분리불안 극복하기" 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-0 left-0 m-2" variant="red" size="sm">
                    토리에게 맞춤
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">분리불안 극복하기</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    혼자 있는 시간을 두려워하는 반려견을 위한 단계별 행동 교정 프로그램
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">총 8주 과정</span>
                    <span className="font-medium text-accent">89,000원</span>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow border border-gray-100 dark:border-gray-700 card-hover">
                <div className="relative h-36">
                  <img 
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350" 
                    alt="재미있는 트릭 훈련" 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-0 left-0 m-2" variant="red" size="sm">
                    몽이에게 맞춤
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">재미있는 트릭 훈련</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    하이파이브부터 점프, 회전까지 반려견의 두뇌를 자극하는 다양한 트릭 교육
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">총 6주 과정</span>
                    <span className="font-medium text-accent">69,000원</span>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow border border-gray-100 dark:border-gray-700 card-hover">
                <div className="relative h-36">
                  <img 
                    src="https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350" 
                    alt="반려견 심리 케어" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">반려견 심리 케어</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    반려견의 행동 패턴을 이해하고 심리적 안정을 돕는 전문 케어 과정
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">총 5주 과정</span>
                    <span className="font-medium text-accent">79,000원</span>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow border border-gray-100 dark:border-gray-700 card-hover">
                <div className="relative h-36">
                  <img 
                    src="https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350" 
                    alt="산책 예절 마스터" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">산책 예절 마스터</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    끌기, 짖기 없이 즐거운 산책을 위한 리드 훈련 및 외부 환경 적응법
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">총 4주 과정</span>
                    <span className="font-medium text-accent">59,000원</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Community Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">인기 커뮤니티 소식</h2>
              <Link href="/community" className="text-sm text-primary hover:text-primary/80 font-medium">커뮤니티 가기</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CommunityCard
                user={{
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                  name: "최견주",
                  time: "3시간 전"
                }}
                title="산책 중 다른 강아지 만났을 때 대처법"
                content="오늘 산책 중 크고 활발한 강아지를 만났는데, 우리집 강아지가 너무 긴장하더라구요. 훈련사님이 알려주신 대로 거리를 두고 차분히 대응했더니 효과가 있었어요. 다른 견주분들도 시도해보세요!"
                likes={28}
                comments={12}
                tag={{ text: "산책팁", variant: "blue" }}
              />
              
              <CommunityCard
                user={{
                  image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                  name: "김훈련",
                  time: "어제"
                }}
                title="강아지가 말을 안들을 때 해결법"
                content="많은 견주님들이 반려견이 말을 안들어서 힘들어하십니다. 하지만 강아지 입장에선 여러분이 무슨 말을 하는지 모를 수 있어요. 일관된 명령어와 적절한 보상으로 서서히 훈련하는 것이 중요합니다. 다음 주 라이브 세션에서 자세히 알려드릴게요!"
                likes={56}
                comments={23}
                tag={{ text: "훈련팁", variant: "green" }}
              />
              
              <CommunityCard
                user={{
                  image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                  name: "박반려",
                  time: "2일 전"
                }}
                title="분리불안 극복 성공 후기"
                content="저희 코코가 혼자 있으면 짖고 물건을 망가뜨리는 문제가 심했는데, 이 플랫폼에서 분리불안 과정을 수강하고 정말 많이 좋아졌어요! 특히 점진적 이별 훈련이 효과적이었습니다. 비슷한 고민 있으신 분들께 추천해요."
                likes={42}
                comments={18}
                tag={{ text: "성공후기", variant: "purple" }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Different content for different roles */}
      {userRole === 'trainer' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">훈련사 대시보드</h2>
          <p className="mt-4">훈련사 전용 기능이 표시됩니다.</p>
          <div className="mt-8">
            <Button variant="default">
              <Link href="/trainer/dashboard">훈련사 대시보드로 이동</Link>
            </Button>
          </div>
        </div>
      )}
      
      {userRole === 'institute-admin' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">기관 관리자 대시보드</h2>
          <p className="mt-4">기관 관리자 전용 기능이 표시됩니다.</p>
          <div className="mt-8">
            <Button variant="default">
              <Link href="/institute/dashboard">기관 대시보드로 이동</Link>
            </Button>
          </div>
        </div>
      )}
      
      {userRole === 'admin' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">시스템 관리자 대시보드</h2>
          <p className="mt-4">시스템 관리자 전용 기능이 표시됩니다.</p>
          <div className="mt-8">
            <Button variant="default">
              <Link href="/admin/dashboard">관리자 대시보드로 이동</Link>
            </Button>
          </div>
        </div>
      )}
      
      {/* General user view if not logged in */}
      {userRole === 'general' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">PetEduPlatform에 오신 것을 환영합니다</h2>
          <p className="mt-4">로그인하시면 다양한 서비스를 이용하실 수 있습니다.</p>
          <div className="mt-8 space-x-4">
            <Button variant="default">로그인</Button>
            <Button variant="outline">회원가입</Button>
          </div>
        </div>
      )}
    </div>
  );
}
