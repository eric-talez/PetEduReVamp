import { Link } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';

interface GuideStep {
  id: string;
  title: string;
  content: string;
  imageSrc: string;
}

interface GuideSection {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
}

// 가이드 섹션 데이터
const guideSections: GuideSection[] = [
  {
    id: "account",
    title: "계정 관리",
    description: "회원가입부터 프로필 설정까지, 계정 관리에 관한 가이드입니다.",
    steps: [
      {
        id: "account-1",
        title: "회원가입하기",
        content: "화면 우측 상단의 '로그인/회원가입' 버튼을 클릭하고 회원가입 양식을 작성하세요. 이메일 인증 후 가입이 완료됩니다.",
        imageSrc: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "account-2",
        title: "프로필 설정하기",
        content: "로그인 후 '마이페이지'에서 프로필 정보를 등록하고 관리할 수 있습니다. 프로필 사진, 자기소개, 관심사 등을 추가하면 맞춤형 서비스를 이용할 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "account-3",
        title: "반려동물 등록하기",
        content: "'마이페이지 > 내 반려동물'에서 반려동물 정보를 등록할 수 있습니다. 이름, 종류, 나이, 성별, 특징 등 상세 정보를 입력하면 맞춤형 교육 추천을 받을 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      }
    ]
  },
  {
    id: "courses",
    title: "교육 과정",
    description: "다양한 교육 과정을 검색하고 신청하는 방법을 안내합니다.",
    steps: [
      {
        id: "courses-1",
        title: "교육 과정 검색하기",
        content: "'교육 과정' 메뉴에서 다양한 필터를 사용해 원하는 교육을 찾을 수 있습니다. 강아지 크기, 연령, 교육 주제, 난이도 등으로 필터링이 가능합니다.",
        imageSrc: "https://images.unsplash.com/photo-1594004844565-ab87e1d155c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "courses-2",
        title: "교육 과정 신청하기",
        content: "원하는 교육을 선택한 후 '신청하기' 버튼을 클릭하여 신청 절차를 진행합니다. 결제 단계에서 쿠폰이나 포인트를 사용할 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "courses-3",
        title: "수강하기",
        content: "신청한 교육은 '내 교육 과정'에서 확인할 수 있습니다. 각 강의는 동영상, 텍스트, 퀴즈 등 다양한 형태로 제공됩니다.",
        imageSrc: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      }
    ]
  },
  {
    id: "videocall",
    title: "화상 상담",
    description: "전문 훈련사와의 1:1 화상 상담 이용 방법을 안내합니다.",
    steps: [
      {
        id: "videocall-1",
        title: "훈련사 선택하기",
        content: "'훈련사' 메뉴에서 전문분야, 평점, 리뷰 등을 참고하여 원하는 훈련사를 선택할 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1591280621903-7051af95a519?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "videocall-2",
        title: "상담 예약하기",
        content: "훈련사 프로필에서 '상담 예약' 버튼을 클릭하여 원하는 날짜와 시간을 선택합니다. 예약 시 상담 주제와 질문을 미리 작성할 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1573496782646-e8d943a4bdd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "videocall-3",
        title: "화상 상담 참여하기",
        content: "예약한 시간에 '내 화상 상담' 메뉴에 접속하여 '입장하기' 버튼을 클릭합니다. 카메라와 마이크 권한을 허용하면 상담이 시작됩니다.",
        imageSrc: "https://images.unsplash.com/photo-1553775282-20af80779df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      }
    ]
  },
  {
    id: "community",
    title: "커뮤니티",
    description: "반려동물 관련 정보와 경험을 공유하는 커뮤니티 이용 방법을 안내합니다.",
    steps: [
      {
        id: "community-1",
        title: "게시글 보기",
        content: "'커뮤니티' 메뉴에서 최신 게시글을 확인할 수 있습니다. 카테고리별로 필터링하거나 검색을 통해 원하는 정보를 찾을 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "community-2",
        title: "게시글 작성하기",
        content: "'글쓰기' 버튼을 클릭하여 새 게시글을 작성할 수 있습니다. 사진, 동영상 등을 첨부하고 적절한 카테고리를 선택하세요.",
        imageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "community-3",
        title: "댓글 및 좋아요",
        content: "게시글에 댓글을 작성하거나 좋아요를 눌러 소통할 수 있습니다. 유용한 정보는 북마크를 통해 저장할 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1575935470607-5b8e7578c2c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      }
    ]
  },
  {
    id: "location",
    title: "위치 서비스",
    description: "내 주변의 반려동물 관련 시설을 찾는 방법을 안내합니다.",
    steps: [
      {
        id: "location-1",
        title: "위치 서비스 이용하기",
        content: "'위치 서비스' 메뉴에서 내 주변의 훈련 센터, 애견 카페, 동물병원 등의 정보를 확인할 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "location-2",
        title: "내 위치 찾기",
        content: "'내 위치 찾기' 버튼을 클릭하면 현재 위치를 기준으로 근처 시설 정보가 제공됩니다. 위치 권한을 허용해야 이용 가능합니다.",
        imageSrc: "https://images.unsplash.com/photo-1572053675669-33acfa021cea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        id: "location-3",
        title: "시설 정보 확인하기",
        content: "시설을 선택하면 상세 정보, 운영 시간, 리뷰, 날씨 정보 등을 확인할 수 있습니다. '길 찾기' 기능을 통해 해당 위치까지의 경로를 확인할 수 있습니다.",
        imageSrc: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      }
    ]
  }
];

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState(guideSections[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  
  const currentSection = guideSections.find(section => section.id === activeTab) || guideSections[0];
  const currentStep = currentSection.steps[activeStepIndex];
  
  // 다음 단계로 이동
  const goToNextStep = () => {
    if (activeStepIndex < currentSection.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };
  
  // 이전 단계로 이동
  const goToPrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 배너 영역 */}
      <div className="w-full mb-8 rounded-lg overflow-hidden relative">
        <div className="relative h-48 md:h-64">
          <img 
            src="https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=400&q=80"
            alt="이용 가이드 배너" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
            <div className="px-6 md:px-10 text-white max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">이용 가이드</h1>
              <p className="text-lg mb-2">
                펫에듀 플랫폼을 효과적으로 활용하는 방법을 안내합니다.
              </p>
              <p className="text-sm md:text-base">
                회원가입부터 교육 과정 수강, 화상 상담까지 단계별로 알아보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="px-2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            홈으로
          </Button>
        </Link>
      </div>
      
      {/* 메인 컨텐츠 */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setActiveStepIndex(0);
      }}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          {guideSections.map(section => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {guideSections.map(section => (
          <TabsContent key={section.id} value={section.id}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {section.description}
                </p>
                
                {/* 단계별 진행 상태 */}
                <div className="flex items-center justify-center mb-8">
                  {section.steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className="flex items-center"
                    >
                      <div 
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-medium
                          ${index === activeStepIndex 
                            ? 'bg-primary text-white' 
                            : index < activeStepIndex 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }
                        `}
                        onClick={() => setActiveStepIndex(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        {index + 1}
                      </div>
                      
                      {index < section.steps.length - 1 && (
                        <div 
                          className={`
                            w-12 h-1 
                            ${index < activeStepIndex 
                              ? 'bg-primary/20' 
                              : 'bg-gray-200 dark:bg-gray-700'
                            }
                          `}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* 현재 단계 컨텐츠 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-semibold mb-4">
                      {activeStepIndex + 1}. {currentStep.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
                      {currentStep.content}
                    </p>
                    
                    {/* 탐색 버튼 */}
                    <div className="flex justify-between mt-6">
                      <Button 
                        variant="outline" 
                        onClick={goToPrevStep} 
                        disabled={activeStepIndex === 0}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        이전 단계
                      </Button>
                      
                      <Button 
                        onClick={goToNextStep} 
                        disabled={activeStepIndex === currentSection.steps.length - 1}
                      >
                        다음 단계
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img 
                        src={currentStep.imageSrc} 
                        alt={currentStep.title} 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* 관련 링크 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">더 자세한 내용이 필요하신가요?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          다양한 도움말과 안내를 통해 펫에듀 플랫폼을 더욱 편리하게 이용하실 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/help/faq">
            <Button variant="outline" className="w-full sm:w-auto">
              자주 묻는 질문
            </Button>
          </Link>
          <Link href="/help/contact">
            <Button className="w-full sm:w-auto">
              1:1 문의하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}