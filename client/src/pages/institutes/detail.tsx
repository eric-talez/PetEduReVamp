import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/use-toast";
import { KakaoMapView } from "@/components/KakaoMapView";
import { 
  Star, MapPin, Calendar, Building, Users, 
  BookOpen, Phone, Mail, ArrowLeft, Shield, 
  Sparkles, ArrowRight, Heart, MessageSquare
} from "lucide-react";

export default function InstituteDetail() {
  const [_, params] = useRoute('/institutes/:id');
  const instituteId = params?.id;
  const [institute, setInstitute] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // 로그인 상태 확인 함수
  const isAuthenticated = (): boolean => {
    const storedAuth = localStorage.getItem('petedu_auth');
    return storedAuth !== null;
  };
  
  // 로그인 유도 함수
  const promptLogin = () => {
    toast({
      title: "로그인이 필요합니다",
      description: "이 기능을 사용하려면 로그인이 필요합니다.",
      variant: "destructive",
    });
    
    // 2초 후 로그인 페이지로 이동
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 2000);
  };
  
  // 예약하기 기능 - 로그인 필요
  const handleReservation = () => {
    if (isAuthenticated()) {
      toast({
        title: "예약 요청",
        description: "예약이 요청되었습니다. 담당자 확인 후 연락드립니다.",
      });
    } else {
      promptLogin();
    }
  };
  
  // 리뷰 작성 기능 - 로그인 필요
  const handleReviewWrite = () => {
    if (isAuthenticated()) {
      toast({
        title: "리뷰 작성",
        description: "리뷰 작성 페이지로 이동합니다.",
      });
    } else {
      promptLogin();
    }
  };
  
  // 문의하기 기능 - 로그인 필요
  const handleInquiry = () => {
    if (isAuthenticated()) {
      toast({
        title: "문의하기",
        description: "문의 메시지가 전송되었습니다.",
      });
    } else {
      promptLogin();
    }
  };
  
  useEffect(() => {
    // 데이터 가져오기 (실제로는 API 호출)
    const fetchInstituteData = () => {
      setLoading(true);
      
      // 모의 데이터 - 실제로는 API 호출로 대체
      setTimeout(() => {
        const mockInstitute = {
          id: parseInt(instituteId || "1"),
          name: "행복한 반려견 교육 센터",
          description: "체계적인 커리큘럼과 전문 훈련사들의 1:1 맞춤형 교육으로 반려견의 행동 교정과 견주의 올바른 반려견 교육 방법을 안내합니다. 다양한 프로그램을 통해 반려견의 사회화와 기본 훈련을 도와드립니다.",
          detailedDescription: "행복한 반려견 교육 센터는 2015년 설립된 이래 수천 명의 견주와 반려견에게 최고의 교육 서비스를 제공해 왔습니다. 저희 센터는 과학적인 방법론에 기반한 교육 프로그램으로 반려견의 행동 문제를 해결하고, 인간과 개 사이의 더 강한 유대 관계를 형성하는 것을 목표로 합니다. 넓은 실내 훈련장과 야외 훈련장을 갖추고 있어 날씨에 관계없이 다양한 교육 활동을 진행할 수 있습니다.",
          image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
          location: "서울시 강남구 역삼동 123-45",
          phone: "02-1234-5678",
          email: "info@happydogcenter.com",
          rating: 4.9,
          reviews: 86,
          trainers: 8,
          courses: 12,
          facilities: ["실내 훈련장", "야외 훈련장", "대기실", "상담실", "카페테리아"],
          openingHours: "평일 10:00 - 20:00, 주말 10:00 - 18:00",
          category: "교육 센터",
          region: "서울",
          breedSupport: ["소형견", "중형견", "대형견"],
          certification: true,
          premium: true,
          established: "2015년",
          coordinates: {
            lat: 37.5665 + (parseInt(instituteId || "1") * 0.005),
            lng: 126.9780 + (parseInt(instituteId || "1") * 0.005),
          },
          images: [
            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
            "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
          ],
          programs: [
            {
              id: 1,
              name: "기본 복종 훈련",
              price: 150000,
              duration: "4주",
              description: "앉아, 엎드려, 기다려 등 기본 명령어 교육"
            },
            {
              id: 2,
              name: "사회화 프로그램",
              price: 200000,
              duration: "8주",
              description: "다른 개, 사람들과의 상호작용 교육"
            },
            {
              id: 3,
              name: "문제 행동 교정",
              price: 250000,
              duration: "6주",
              description: "짖음, 물기, 분리불안 등 교정"
            }
          ],
          reviewList: [
            {
              id: 1,
              userName: "김철수",
              rating: 5,
              date: "2023-10-15",
              content: "정말 좋은 교육을 받았습니다. 우리 강아지의 행동이 많이 개선되었어요."
            },
            {
              id: 2,
              userName: "이영희",
              rating: 4.5,
              date: "2023-09-22",
              content: "전문적인 트레이너분들이 꼼꼼하게 지도해주셔서 만족스러워요."
            }
          ]
        };
        
        setInstitute(mockInstitute);
        setLoading(false);
      }, 800);
    };
    
    fetchInstituteData();
  }, [instituteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">위치 서비스를 찾을 수 없습니다</h1>
        <p className="text-gray-500 mb-6">요청하신 위치 서비스 정보가 존재하지 않습니다.</p>
        <Button onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전으로 돌아가기
        </Button>
      </div>
    );
  }

  // 위치 정보를 지도 컴포넌트 형식으로 변환
  const locationData = {
    lat: institute.coordinates.lat,
    lng: institute.coordinates.lng,
    name: institute.name,
    address: institute.location
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 내비게이션 */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          위치 서비스 목록으로 돌아가기
        </Button>
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">{institute.name}</h1>
          
          <div className="flex items-center gap-2">
            {institute.certification && (
              <Badge variant="success" className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                인증
              </Badge>
            )}
            {institute.premium && (
              <Badge variant="warning" className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                프리미엄
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-gray-600 dark:text-gray-400">{institute.location}</span>
          <span className="mx-2">•</span>
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-gray-600 dark:text-gray-400">{institute.rating} ({institute.reviews} 후기)</span>
        </div>
      </div>
      
      {/* 이미지 갤러리 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {institute.images.map((image: string, idx: number) => (
          <div key={idx} className={idx === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""}>
            <img 
              src={image} 
              alt={`${institute.name} ${idx + 1}`} 
              className="w-full h-full object-cover rounded-lg"
              style={{ height: idx === 0 ? "400px" : "195px" }}
            />
          </div>
        ))}
      </div>
      
      {/* 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 컬럼 - 상세 정보 */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">소개</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{institute.detailedDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-3">시설 정보</h3>
                  <ul className="space-y-2">
                    {institute.facilities.map((facility: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <Building className="w-4 h-4 text-primary mr-2" />
                        <span>{facility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">운영 정보</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-primary mr-2" />
                      <span>{institute.openingHours}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-primary mr-2" />
                      <span>전문 트레이너 {institute.trainers}명</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-primary mr-2" />
                      <span>교육 프로그램 {institute.courses}개</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-primary mr-2" />
                      <span>{institute.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-primary mr-2" />
                      <span>{institute.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* 교육 프로그램 */}
          {institute.programs && (
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">교육 프로그램</h2>
                <div className="space-y-4">
                  {institute.programs.map((program: any) => (
                    <div key={program.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{program.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{program.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{program.price.toLocaleString()}원</p>
                          <p className="text-sm text-gray-500">{program.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4" onClick={handleReservation}>
                  예약/문의하기
                </Button>
              </div>
            </Card>
          )}
          
          {/* 리뷰 */}
          {institute.reviewList && (
            <Card className="mb-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">리뷰</h2>
                  <Button variant="outline" size="sm" onClick={handleReviewWrite}>
                    리뷰 작성하기
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {institute.reviewList.map((review: any) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                          {review.userName.charAt(0)}
                        </div>
                        <span className="font-medium">{review.userName}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span>{review.rating}</span>
                        </div>
                        <span className="ml-auto text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* 오른쪽 컬럼 - 지도 & 연락처 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <div className="p-6">
              {/* 지도 */}
              <h2 className="text-lg font-medium mb-3">위치 정보</h2>
              <div className="h-[300px] mb-6">
                <KakaoMapView selectedLocation={locationData} />
              </div>
              
              {/* CTA 버튼 */}
              <div className="space-y-3">
                <Button onClick={handleInquiry} className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  문의하기
                </Button>
                
                <Button variant="outline" onClick={() => {
                  if (isAuthenticated()) {
                    toast({
                      title: "관심 등록",
                      description: "관심 목록에 추가되었습니다.",
                    });
                  } else {
                    promptLogin();
                  }
                }} className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  관심 등록
                </Button>
                
                <Button variant="ghost" onClick={() => {
                  window.location.href = `/institutes`;
                }} className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  다른 위치 서비스 보기
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}