import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, Calendar, CheckCircle, PlayCircle, List, Download, Share2, Bookmark, Heart } from "lucide-react";
import { useAuth } from "../../SimpleApp";

// 커리큘럼 타입 정의
interface Lesson {
  id: number;
  title: string;
  duration: string;
  preview: boolean;
  type: "video" | "document" | "quiz";
  description?: string;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function CourseDetail() {
  // URL에서 강의 ID 파라미터 가져오기
  const [match, params] = useRoute<{ id: string }>("/course/:id");
  console.log('CourseDetail rendering - Route match:', match, 'params:', params, 'location:', window.location.pathname);
  const courseId = match && params ? parseInt(params.id) : 1;
  console.log("강의 상세 페이지 로딩:", courseId, match, params);
  
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("curriculum"); // 기본 탭을 커리큘럼으로 설정
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Lesson | null>(null);

  // 강의 정보 (실제로는 API에서 가져와야 함)
  const course = {
    id: courseId,
    title: "반려견 기초 훈련 마스터하기",
    description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스입니다. 이 강의에서는 반려견과의 소통 방법부터 보상 기반 훈련 방법까지 다양한 기술을 배우게 됩니다. 전문 훈련사의 지도와 함께 실전 연습을 통해 자신감을 키우게 됩니다.",
    fullDescription: `반려견과의 행복한 생활을 위한 첫 단계, '반려견 기초 훈련 마스터하기'에 오신 것을 환영합니다!

이 강의는 반려견을 처음 맞이한 견주부터 기존 반려견의 훈련을 체계적으로 배우고 싶은 모든 분들을 위해 준비되었습니다.

▶ 이런 분들에게 추천합니다
- 반려견을 처음 맞이한 초보 견주
- 반려견과의 소통에 어려움을 겪고 계신 분
- 반려견 훈련의 기초를 체계적으로 배우고 싶은 분
- 산책 시 리드 당김, 짖음 등의 문제 행동으로 고민하시는 분

▶ 이 강의를 통해 배우게 됩니다
- 반려견의 심리와 행동 패턴 이해하기
- 효과적인 보상 기반 훈련 방법
- 기본 명령어(앉아, 기다려, 엎드려 등) 훈련법
- 산책 예절과 리드 훈련
- 문제 행동 예방과 해결 방법
- 일상 생활 속 지속적인 훈련 방법

▶ 강의 특징
- 전문 훈련사의 시연과 실습 중심의 교육
- 단계별로 난이도를 높여가는 체계적 커리큘럼
- 다양한 품종과 연령대의 반려견 훈련 사례 제공
- 견주-반려견 간 유대감 강화를 위한 팁 제공

훈련은 단순히 명령을 가르치는 것이 아닌, 반려견과의 소통과 유대를 강화하는 과정입니다. 이 강의와 함께 반려견과 더 깊은 이해와 신뢰를 바탕으로 한 관계를 만들어가세요.`,
    
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    price: "89,000원",
    originalPrice: "120,000원",
    discount: "26%",
    trainer: {
      id: 123,
      name: "김훈련 트레이너",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      bio: "반려견 행동 전문가 | 대한반려동물협회 인증 트레이너 | 10년 경력",
      description: "안녕하세요, 반려견 행동 전문가 김훈련입니다. 저는 10년 이상 다양한 품종과 연령대의 반려견들을 훈련해왔으며, 특히 문제 행동 교정과 기초 훈련에 전문성을 갖고 있습니다. 대한반려동물협회 인증 트레이너로서 과학적이고 인도적인 훈련 방법을 추구합니다. 이 강의를 통해 여러분과 반려견 모두가 행복한 생활을 만들어가는 데 도움이 되길 바랍니다."
    },
    rating: 4.8,
    reviewCount: 45,
    studentCount: 320,
    lastUpdated: "2023년 8월 업데이트",
    totalHours: "12시간 30분",
    lectures: 28,
    level: "초급",
    category: "기본 훈련",
    tags: ["기초 훈련", "반려견 훈련", "명령어 훈련", "산책 예절", "행동 교정"],
    languages: ["한국어"],
    requirements: [
      "특별한 사전 지식은 필요하지 않습니다.",
      "3개월 이상의 반려견 (품종 무관)",
      "기본적인 훈련 도구 (리드줄, 간식, 클리커 등)"
    ],
    includes: [
      "28개의 상세 강의",
      "5개의 다운로드 가능한 학습 자료",
      "평생 접근 권한",
      "수료증 발급",
      "모바일 및 TV로 시청 가능"
    ],
    preview: "https://www.youtube.com/embed/dQw4w9WgXcQ" // 샘플 영상
  };

  // 커리큘럼 데이터
  const curriculum: Section[] = [
    {
      id: 1,
      title: "섹션 1: 기초 개념과 준비",
      lessons: [
        {
          id: 101,
          title: "강의 소개 및 개요",
          duration: "10:15",
          preview: true,
          type: "video",
          description: "이 강의의 전체 구성과 학습 방법에 대해 알아봅니다."
        },
        {
          id: 102,
          title: "반려견 행동의 이해",
          duration: "15:30",
          preview: false,
          type: "video",
          description: "반려견의 본능과 행동 패턴에 대한 기본적인 이해를 돕습니다."
        },
        {
          id: 103,
          title: "훈련에 필요한 준비물",
          duration: "12:45",
          preview: false,
          type: "video",
          description: "효과적인 훈련을 위해 필요한 도구들과 그 사용법을 알아봅니다."
        },
        {
          id: 104,
          title: "섹션 1 요약 자료",
          duration: "5분 분량",
          preview: false,
          type: "document",
          description: "1섹션의 중요 내용을 요약한 PDF 문서입니다."
        }
      ]
    },
    {
      id: 2,
      title: "섹션 2: 기본 명령어 훈련",
      lessons: [
        {
          id: 201,
          title: "앉아(Sit) 명령 훈련하기",
          duration: "18:20",
          preview: false,
          type: "video",
          description: "가장 기본적인 명령어인 '앉아'를 훈련하는 방법을 배웁니다."
        },
        {
          id: 202,
          title: "기다려(Stay) 명령 훈련하기",
          duration: "20:15",
          preview: false,
          type: "video",
          description: "반려견이 한 자리에서 기다리도록 하는 명령을 훈련합니다."
        },
        {
          id: 203,
          title: "엎드려(Down) 명령 훈련하기",
          duration: "16:30",
          preview: false,
          type: "video",
          description: "바닥에 엎드리는 명령에 대해 훈련하는 방법을 배웁니다."
        },
        {
          id: 204,
          title: "기본 명령어 연습 과제",
          duration: "10분 분량",
          preview: false,
          type: "document",
          description: "학습한 명령어를 연습할 수 있는 과제가 포함된 문서입니다."
        },
        {
          id: 205,
          title: "섹션 2 퀴즈",
          duration: "5분",
          preview: false,
          type: "quiz",
          description: "기본 명령어 훈련에 대한 이해도를 테스트합니다."
        }
      ]
    },
    {
      id: 3,
      title: "섹션 3: 산책 예절 훈련",
      lessons: [
        {
          id: 301,
          title: "올바른 리드 사용법",
          duration: "14:45",
          preview: false,
          type: "video",
          description: "산책 시 리드를 올바르게 사용하는 방법에 대해 배웁니다."
        },
        {
          id: 302,
          title: "당기지 않고 걷기 훈련",
          duration: "22:10",
          preview: false,
          type: "video",
          description: "반려견이 리드를 당기지 않고 걷는 방법을 훈련합니다."
        },
        {
          id: 303,
          title: "다른 반려견 만났을 때 대처법",
          duration: "19:50",
          preview: false,
          type: "video",
          description: "산책 중 다른 반려견을 만났을 때의 올바른 대처법을 배웁니다."
        }
      ]
    }
  ];

  // 모든 강의를 평면화해서 배열로 만들기
  const allLessons = curriculum.flatMap(section => section.lessons);

  useEffect(() => {
    // 실제로는 여기서 API 호출을 통해 강의 정보와 수강 여부를 가져와야 함
    setIsEnrolled(false); // 예시로 false로 설정
    
    // 기본 재생 영상 설정
    const previewLesson = allLessons.find(lesson => lesson.preview);
    if (previewLesson) {
      setActiveVideo(previewLesson);
    }
  }, [courseId]);

  // 강의 시청 핸들러
  const handleWatchLesson = (lesson: Lesson) => {
    console.log("강의 시청 요청:", lesson.title);
    
    if (!isAuthenticated && !lesson.preview) {
      alert("이 강의를 시청하려면 로그인 후 수강 신청이 필요합니다.");
      return;
    }

    if (!isEnrolled && !lesson.preview) {
      alert("이 강의를 시청하려면 수강 신청이 필요합니다.");
      return;
    }

    // 커리큘럼 탭에서 클릭한 경우에도 재생하도록 설정
    setActiveVideo(lesson);
    
    // 상단 비디오 플레이어 영역으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 정보 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* 좌측: 비디오 플레이어 */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 aspect-video rounded-lg overflow-hidden mb-4">
            {activeVideo ? (
              <div className="w-full h-full">
                {activeVideo.preview ? (
                  <iframe 
                    src={course.preview} 
                    className="w-full h-full" 
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <PlayCircle className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">{activeVideo.title}</p>
                    {!isAuthenticated || !isEnrolled ? (
                      <p className="mt-2 text-gray-400">수강 신청 후 시청 가능합니다</p>
                    ) : (
                      <p className="mt-2 text-gray-400">영상 재생 준비 중...</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <p>영상을 선택해주세요</p>
              </div>
            )}
          </div>

          {/* 현재 선택된 강의 정보 */}
          {activeVideo && (
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{activeVideo.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {activeVideo.type === 'video' ? '비디오' : activeVideo.type === 'document' ? '문서' : '퀴즈'} • {activeVideo.duration}
                  </p>
                </div>
                {activeVideo.preview && (
                  <Badge variant="info">미리보기</Badge>
                )}
              </div>
              {activeVideo.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {activeVideo.description}
                </p>
              )}
            </div>
          )}

          {/* 탭 영역 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="about">강의 소개</TabsTrigger>
              <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
              <TabsTrigger value="reviews">수강평</TabsTrigger>
            </TabsList>

            {/* 강의 소개 탭 */}
            <TabsContent value="about" className="space-y-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h2 className="text-2xl font-bold mb-6">강의 소개</h2>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{course.fullDescription}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-8 mb-4">포함 사항</h3>
                <ul className="space-y-2">
                  {course.includes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-8 mb-4">수강 요건</h3>
                <ul className="space-y-2">
                  {course.requirements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">강사 소개</h2>
                <div className="flex items-start space-x-4">
                  <Avatar
                    src={course.trainer.avatar}
                    alt={course.trainer.name}
                    className="w-14 h-14"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{course.trainer.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{course.trainer.bio}</p>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">{course.trainer.description}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 커리큘럼 탭 */}
            <TabsContent value="curriculum">
              <div>
                <h2 className="text-2xl font-bold mb-6">커리큘럼</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-1" />
                    <span>{curriculum.length} 섹션</span>
                  </div>
                  <div className="flex items-center">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    <span>{course.lectures} 강의</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>총 {course.totalHours}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{course.lastUpdated}</span>
                  </div>
                </div>

                {/* 커리큘럼 아코디언 */}
                <div className="space-y-4">
                  {curriculum.map((section) => (
                    <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4">
                        <h3 className="font-semibold text-base">{section.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {section.lessons.length} 강의 • {section.lessons.reduce((acc, lesson) => {
                            if (lesson.duration.includes('분')) return acc;
                            const [min, sec] = lesson.duration.split(':').map(Number);
                            return acc + min + (sec / 60);
                          }, 0).toFixed(0)}분
                        </p>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {section.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            className={`p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${activeVideo?.id === lesson.id ? 'bg-primary/5' : ''}`}
                            onClick={() => handleWatchLesson(lesson)}
                          >
                            <div className="flex items-start">
                              <div className="mr-3 mt-1">
                                {lesson.type === 'video' ? (
                                  <PlayCircle className="h-5 w-5 text-primary" />
                                ) : lesson.type === 'document' ? (
                                  <Download className="h-5 w-5 text-primary" />
                                ) : (
                                  <List className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{lesson.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {lesson.type === 'video' ? '비디오' : lesson.type === 'document' ? '문서' : '퀴즈'} • {lesson.duration}
                                </p>
                              </div>
                            </div>
                            {lesson.preview && (
                              <Badge variant="outline" className="ml-2">
                                미리보기
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 수강평 탭 */}
            <TabsContent value="reviews">
              <div>
                <h2 className="text-2xl font-bold mb-6">수강평</h2>
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <div className="text-3xl font-bold">{course.rating}</div>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.reviewCount} 수강평</div>
                  </div>
                  
                  <div className="flex-1 max-w-md">
                    {/* 별점 분포를 보여주는 바 차트 (예시) */}
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center mb-1">
                        <div className="text-sm w-5">{star}</div>
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1 mr-2" />
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ 
                              width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 샘플 수강평 */}
                <div className="space-y-6">
                  {[
                    {
                      id: 1,
                      user: {
                        name: "홍길동",
                        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                      },
                      rating: 5,
                      date: "2023년 12월 15일",
                      content: "정말 유익한 강의였습니다. 제 반려견이 명령어를 이해하는 모습을 보니 감동이었어요. 특히 산책 시 리드 당김 문제가 많이 나아졌습니다. 훈련사님의 친절한 설명과 실제 시연이 큰 도움이 되었습니다."
                    },
                    {
                      id: 2,
                      user: {
                        name: "김철수",
                        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                      },
                      rating: 4,
                      date: "2023년 11월 20일",
                      content: "처음 강아지를 키우는 초보 견주로서 이 강의는 정말 필수였습니다. 기본 명령어부터 차근차근 알려주셔서 좋았어요. 다만 더 다양한 품종의 사례가 있었으면 좋겠습니다."
                    },
                    {
                      id: 3,
                      user: {
                        name: "이영희",
                        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                      },
                      rating: 5,
                      date: "2023년 10월 5일",
                      content: "강아지를 3마리 키우고 있는데, 이 강의를 듣고 모두에게 적용하니 집안이 정말 평화로워졌어요. 특히 '기다려' 명령이 잘 통해서 식사 시간이 한결 여유로워졌습니다. 정말 감사합니다!"
                    }
                  ].map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar 
                            src={review.user.avatar} 
                            alt={review.user.name}
                            className="w-10 h-10 mr-3"
                          />
                          <div>
                            <h4 className="font-medium">{review.user.name}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                              ))}
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 우측: 강의 정보 및 구매 카드 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm sticky top-20">
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{course.price}</span>
                  {course.discount && (
                    <>
                      <span className="text-gray-500 dark:text-gray-400 text-lg line-through ml-2">{course.originalPrice}</span>
                      <Badge variant="success" className="ml-2">{course.discount} 할인</Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <Button className="w-full" size="lg">
                  {isEnrolled ? '수강 계속하기' : '수강 신청하기'}
                </Button>
                
                {!isEnrolled && (
                  <Button variant="outline" className="w-full">
                    장바구니에 추가
                  </Button>
                )}
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                30일 환불 보장
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold mb-2">이 강의는</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">{course.totalHours}</span>
                  </div>
                  <div className="flex items-center">
                    <PlayCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">{course.lectures}개 강의</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">다운로드 가능</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">수료증</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm" className="w-1/3">
                    <Share2 className="h-4 w-4 mr-2" />
                    공유
                  </Button>
                  <Button variant="ghost" size="sm" className="w-1/3">
                    <Bookmark className="h-4 w-4 mr-2" />
                    저장
                  </Button>
                  <Button variant="ghost" size="sm" className="w-1/3">
                    <Heart className="h-4 w-4 mr-2" />
                    좋아요
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}