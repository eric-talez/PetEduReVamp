import { useState } from 'react';
import { CourseCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock course data
  const courses = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "반려견 기초 훈련 마스터하기",
      description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스",
      badge: { text: "인기", variant: "accent" },
      trainer: {
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "김훈련 트레이너"
      },
      price: "120,000원",
      level: "초급"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "반려견 어질리티 입문",
      description: "다양한 장애물 코스를 통해 반려견의 민첩성과 집중력을 향상시키는 어질리티 훈련 기초 과정",
      badge: { text: "중급", variant: "blue" },
      trainer: {
        image: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "박민첩 트레이너"
      },
      price: "150,000원",
      level: "중급"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "반려견 사회화 훈련",
      description: "다른 반려견, 사람, 환경에 올바르게 적응하는 방법을 배우는 필수 사회화 과정",
      badge: { text: "초급", variant: "green" },
      trainer: {
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "이사회 트레이너"
      },
      price: "100,000원",
      level: "초급"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "분리불안 극복하기",
      description: "혼자 있는 시간을 두려워하는 반려견을 위한 단계별 행동 교정 프로그램",
      badge: { text: "행동교정", variant: "red" },
      trainer: {
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "최행동 트레이너"
      },
      price: "180,000원",
      level: "중급"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "재미있는 트릭 훈련",
      description: "하이파이브부터 점프, 회전까지 반려견의 두뇌를 자극하는 다양한 트릭 교육",
      badge: { text: "인기", variant: "accent" },
      trainer: {
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "박재미 트레이너"
      },
      price: "130,000원",
      level: "중급"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      title: "반려견 심리 케어",
      description: "반려견의 행동 패턴을 이해하고 심리적 안정을 돕는 전문 케어 과정",
      badge: { text: "심화", variant: "purple" },
      trainer: {
        image: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "김심리 트레이너"
      },
      price: "200,000원",
      level: "고급"
    }
  ];
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">강의 탐색</h1>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="강의, 훈련사 검색" 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Badge variant="default" className="py-1.5 cursor-pointer">모든 강의</Badge>
            <Badge variant="outline" className="py-1.5 cursor-pointer">초급</Badge>
            <Badge variant="outline" className="py-1.5 cursor-pointer">중급</Badge>
            <Badge variant="outline" className="py-1.5 cursor-pointer">고급</Badge>
            <Badge variant="outline" className="py-1.5 cursor-pointer flex items-center gap-1">
              <Filter size={14} />
              필터
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredCourses.length}개의 강의를 찾았습니다
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            image={course.image}
            title={course.title}
            description={course.description}
            badge={course.badge}
            trainer={course.trainer}
            onClick={() => window.location.href = `/course/${course.id}`}
          >
            <div className="flex justify-between items-center mt-4 text-sm">
              <Badge variant="outline">{course.level}</Badge>
              <span className="font-medium text-accent">{course.price}</span>
            </div>
          </CourseCard>
        ))}
      </div>
    </div>
  );
}
