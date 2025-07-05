import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause,
  SkipBack, 
  SkipForward,
  Volume2,
  Maximize,
  BookOpen,
  Clock,
  CheckCircle,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  modules: Module[];
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
  videoUrl?: string;
}

export default function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchCourseContent(id);
    }
  }, [id]);

  const fetchCourseContent = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
      }
    } catch (error) {
      console.error('강의 콘텐츠 조회 실패:', error);
      toast({
        title: "오류",
        description: "강의 콘텐츠를 불러올 수 없습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentVideo = () => {
    if (!course || !course.modules[currentModuleIndex]) return null;
    const currentModule = course.modules[currentModuleIndex];
    return currentModule.videos[currentVideoIndex] || null;
  };

  const getCurrentModule = () => {
    if (!course) return null;
    return course.modules[currentModuleIndex] || null;
  };

  const goToNextVideo = () => {
    if (!course) return;
    
    const currentModule = course.modules[currentModuleIndex];
    if (currentVideoIndex < currentModule.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentVideoIndex(0);
    }
  };

  const goToPrevVideo = () => {
    if (!course) return;
    
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const prevModule = course.modules[currentModuleIndex - 1];
      setCurrentVideoIndex(prevModule.videos.length - 1);
    }
  };

  const selectVideo = (moduleIndex: number, videoIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentVideoIndex(videoIndex);
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
          <p className="text-muted-foreground">수강 권한이 없거나 강의가 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  const currentVideo = getCurrentVideo();
  const currentModule = getCurrentModule();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-screen">
          {/* 비디오 플레이어 영역 */}
          <div className="lg:col-span-3 bg-black flex flex-col">
            {/* 비디오 플레이어 */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
              {currentVideo ? (
                <div className="w-full h-full flex items-center justify-center">
                  {/* 실제 비디오 플레이어는 여기에 구현 */}
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{currentVideo.title}</h3>
                    <p className="text-gray-300">영상 재생 화면</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">재생할 영상을 선택하세요</p>
                </div>
              )}
            </div>

            {/* 비디오 컨트롤 */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevVideo}
                    className="text-white hover:bg-gray-700"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-gray-700"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextVideo}
                    className="text-white hover:bg-gray-700"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 mx-6">
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Volume2 className="w-4 h-4" />
                    <div className="w-16 bg-gray-600 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-gray-700"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 현재 영상 정보 */}
              {currentVideo && currentModule && (
                <div className="mt-4 text-white">
                  <h4 className="font-medium">{currentModule.title}</h4>
                  <h3 className="text-lg font-bold">{currentVideo.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentVideo.duration}분</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{course.trainerName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 - 강의 목록 */}
          <div className="lg:col-span-1 bg-white border-l overflow-y-auto h-screen">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">{course.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">강의 목록</p>
            </div>

            <div className="p-4 space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="border">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 pb-3">
                    <div className="space-y-2">
                      {module.videos.map((video, videoIndex) => (
                        <div
                          key={video.id}
                          onClick={() => selectVideo(moduleIndex, videoIndex)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentModuleIndex === moduleIndex && currentVideoIndex === videoIndex
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              currentModuleIndex === moduleIndex && currentVideoIndex === videoIndex
                                ? 'bg-white text-primary'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {videoIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight">{video.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs opacity-70">
                                  <Clock className="w-3 h-3" />
                                  <span>{video.duration}분</span>
                                </div>
                                <CheckCircle className="w-3 h-3 opacity-70" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}