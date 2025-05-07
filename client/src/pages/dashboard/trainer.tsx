import { useAuth } from "../../SimpleApp";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, Award, BarChart2 } from "lucide-react";

interface TrainerDashboardProps {
  onAction: (action: string, data?: any) => void;
}

export default function TrainerDashboard({ onAction }: TrainerDashboardProps) {
  const { userName } = useAuth();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-60 md:h-80 mb-8 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1583511655826-05700a52f8e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="훈련사 대시보드"
          className="w-full h-full object-cover absolute mix-blend-overlay"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4 max-w-xl">
            반려견 교육의 전문가, {userName || '훈련사'}님
          </h1>
          <p className="text-white text-sm md:text-lg max-w-xl mb-6">
            PetEduPlatform에서 귀하의 전문성을 공유하고 더 많은 반려견 가족에게 최고의 교육을 제공하세요.
          </p>
          <div>
            <Button
              className="bg-white text-primary font-semibold hover:bg-gray-50 mr-3"
            >
              새 강의 개설하기
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              전문가 인증 업그레이드
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
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">5개</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>지난 달 +1</span>
              <a href="/trainer/courses" className="text-primary hover:text-primary/80">관리</a>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">수강생</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">42명</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>지난 달 +8명</span>
              <a href="/trainer/students" className="text-primary hover:text-primary/80">상세</a>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-accent/20 dark:bg-accent/10 text-accent dark:text-accent/90 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">월 수익</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">1,234,000원</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>지난 달 +18.2%</span>
              <a href="/trainer/earnings" className="text-primary hover:text-primary/80">내역</a>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">예정된 강의</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">3개</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center mb-1">
                <svg className="h-3 w-3 text-purple-500 dark:text-purple-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>오늘 15:00 - 기초 훈련반</span>
              </div>
              <div className="flex items-center">
                <svg className="h-3 w-3 text-purple-500 dark:text-purple-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>내일 13:00 - 심화 과정</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border border-gray-100 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">수익 추이</h2>
              <Badge variant="info">최근 6개월</Badge>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  여기에 수익 차트가 표시됩니다.
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="border border-gray-100 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">수강생 분포</h2>
              <Badge variant="success">활성 사용자</Badge>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-6 w-6 text-primary" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  여기에 수강생 분포 차트가 표시됩니다.
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Activities */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">최근 활동</h2>
        </div>
        
        <Card className="border border-gray-100 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    신규 수강생 등록
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">1시간 전</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  김견주님이 "반려견 기초 훈련 마스터하기" 강의에 등록했습니다.
                </p>
              </div>
            </div>
            
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    수료증 발급
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">3시간 전</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  박반려님이 "반려견 사회화 훈련" 과정을 완료하고 수료증을 받았습니다.
                </p>
              </div>
            </div>
            
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-accent/20 dark:bg-accent/10 text-accent dark:text-accent/90 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    수익 입금
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">어제</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  5월 강의 수익 545,000원이 계좌에 입금되었습니다.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Popular Courses */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">인기 강의</h2>
          <a href="/trainer/courses" className="text-sm text-primary hover:text-primary/80 font-medium">모든 강의</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
            <div className="relative h-40">
              <img 
                src="https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350" 
                alt="반려견 기초 훈련 마스터하기" 
                className="w-full h-full object-cover"
              />
              <Badge variant="warning" className="absolute top-0 right-0 m-2">인기</Badge>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">반려견 기초 훈련 마스터하기</h3>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-gray-500 dark:text-gray-400">수강생: 24명</span>
                <span className="font-medium text-accent">89,000원</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="success">평점 4.8/5</Badge>
                <Badge variant="info">후기 16개</Badge>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
            <div className="relative h-40">
              <img 
                src="https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350" 
                alt="반려견 어질리티 입문" 
                className="w-full h-full object-cover"
              />
              <Badge variant="info" className="absolute top-0 right-0 m-2">중급</Badge>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">반려견 어질리티 입문</h3>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-gray-500 dark:text-gray-400">수강생: 12명</span>
                <span className="font-medium text-accent">120,000원</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="success">평점 4.6/5</Badge>
                <Badge variant="info">후기 8개</Badge>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
            <div className="relative h-40">
              <img 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350" 
                alt="반려견 사회화 훈련" 
                className="w-full h-full object-cover"
              />
              <Badge variant="success" className="absolute top-0 right-0 m-2">초급</Badge>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">반려견 사회화 훈련</h3>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-gray-500 dark:text-gray-400">수강생: 18명</span>
                <span className="font-medium text-accent">75,000원</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="success">평점 4.9/5</Badge>
                <Badge variant="info">후기 12개</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
