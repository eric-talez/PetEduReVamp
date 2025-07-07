import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Clock } from 'lucide-react';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 실제 커리큘럼 데이터 가져오기
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/admin/curriculums');
        if (response.ok) {
          const data = await response.json();
          // 커리큘럼 데이터를 강의 형태로 변환
          const transformedCourses = data.curriculums
            .filter(curriculum => curriculum.status === 'published')
            .map(curriculum => ({
              id: curriculum.id,
              title: curriculum.title,
              description: curriculum.description,
              trainer: {
                name: curriculum.trainerName || '전문 훈련사',
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${curriculum.trainerName || 'trainer'}`
              },
              price: `${curriculum.price?.toLocaleString() || 0}원`,
              level: curriculum.difficulty === 'beginner' ? '초급' : 
                     curriculum.difficulty === 'intermediate' ? '중급' : '고급',
              category: curriculum.category || '기본 훈련',
              duration: Math.floor((curriculum.duration || 0) / 60),
              modules: curriculum.modules?.length || 0,
              badge: { 
                text: curriculum.difficulty === 'beginner' ? '초급' : 
                      curriculum.difficulty === 'intermediate' ? '중급' : '고급',
                variant: curriculum.difficulty === 'beginner' ? 'green' : 
                         curriculum.difficulty === 'intermediate' ? 'blue' : 'purple'
              }
            }));
          setCourses(transformedCourses);
        }
      } catch (error) {
        console.error('강의 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">강의 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">강의 찾기</h1>
          <p className="text-gray-600">전문 훈련사들의 검증된 강의로 반려견과 함께 성장하세요</p>
          {courses.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              총 {courses.length}개의 강의가 등록되어 있습니다.
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="강의명, 설명, 강사명으로 검색..."
              className="pl-10 pr-4 py-3 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={course.badge.variant} className="text-xs">
                      {course.badge.text}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={course.trainer.image} 
                      alt={course.trainer.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <span className="text-sm text-gray-700">{course.trainer.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}시간</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.modules}강</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{course.price}</span>
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                      수강신청
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 강의가 없습니다</h3>
            <p className="text-gray-500">관리자가 커리큘럼을 발행하면 여기에 표시됩니다.</p>
          </div>
        )}

        {filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-400">다른 검색어를 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}