import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CreditCard, 
  Share, 
  ChevronRight,
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from '@/components/ui/Avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/SimpleApp';
import { useToast } from '@/hooks/use-toast';
import { KakaoMapView } from '@/components/KakaoMapView';

// 임시 데이터 타입 정의
interface EventLocation {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  region: string;
}

interface EventItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: EventLocation;
  organizer: {
    name: string;
    avatar: string;
    description?: string;
  };
  category: string;
  price: number | '무료';
  attendees: number;
  maxAttendees?: number;
  details?: string;
  requirements?: string[];
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

// 이벤트 상세 데이터
const MOCK_EVENTS: EventItem[] = [
  {
    id: 1,
    title: "강아지 사회화 모임",
    description: "다양한 강아지들과 함께하는 사회화 모임입니다. 반려견의 사회성 향상을 위한 최고의 기회!",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "2025-05-15",
    time: "14:00 - 16:00",
    location: {
      id: 1,
      name: "강남 애견공원",
      address: "서울 강남구 삼성동 159",
      lat: 37.508796,
      lng: 127.061359,
      region: "서울"
    },
    organizer: {
      name: "김훈련",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      description: "10년 경력의 반려견 행동 전문가입니다. 사회화 모임을 통해 많은 반려견들의 사회성 향상을 도왔습니다."
    },
    category: "소셜",
    price: '무료',
    attendees: 15,
    maxAttendees: 20,
    details: "이번 사회화 모임에서는 반려견의 연령과 성격에 맞게 그룹을 나누어 진행됩니다. 소심한 강아지, 활발한 강아지, 공격성이 있는 강아지 등 다양한 성향의 반려견들이 안전하게 사회화할 수 있도록 전문 트레이너가 함께합니다.\n\n모임 전 간단한 반려견 행동 평가를 통해 적절한 그룹을 배정받게 됩니다. 이를 통해 모든 참가자들이 안전하고 즐거운 시간을 보낼 수 있습니다.\n\n집에서 미리 간식과 장난감을 준비해오시면 더욱 풍성한 시간을 보낼 수 있습니다.",
    requirements: [
      "광견병 등 필수 예방접종을 완료한 반려견",
      "기본적인 리드 훈련이 된 반려견",
      "당일 반려견 건강상태가 양호할 것",
      "반려견 배변봉투 필수 지참"
    ],
    faq: [
      {
        question: "모든 견종이 참가할 수 있나요?",
        answer: "네, 모든 견종이 참가 가능합니다. 다만 공격성이 심한 경우 별도의 세션으로 진행될 수 있습니다."
      },
      {
        question: "반려견이 아직 예방접종을 완료하지 않았는데도 참가할 수 있나요?",
        answer: "죄송합니다만, 모든 반려견의 안전을 위해 기본 예방접종(광견병, 종합백신)이 완료된 반려견만 참가 가능합니다."
      },
      {
        question: "비가 오면 어떻게 되나요?",
        answer: "우천시에는 실내 대체 장소에서 진행되거나, 행사가 연기될 수 있습니다. 변경사항은 참가자에게 개별 연락드립니다."
      }
    ]
  },
  {
    id: 2,
    title: "반려견 건강 세미나",
    description: "반려견의 건강을 위한 영양과 운동에 대한 전문가 세미나입니다.",
    image: "https://images.unsplash.com/photo-1597633425046-08f5110420b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "2025-05-20",
    time: "19:00 - 21:00",
    location: {
      id: 2,
      name: "펫케어 센터",
      address: "서울 서초구 서초동 1445-3",
      lat: 37.491632,
      lng: 127.007358,
      region: "서울"
    },
    organizer: {
      name: "박수의",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      description: "수의사이자 반려동물 영양학 전문가로 활동하고 있습니다. 영양과 운동을 통한 반려견 건강관리에 대한 다수의 저서를 집필했습니다."
    },
    category: "교육",
    price: 15000,
    attendees: 28,
    maxAttendees: 40,
    details: "이번 세미나에서는 다음과 같은 내용을 다룹니다:\n\n1. 연령별 반려견 영양 관리법\n2. 비만 반려견을 위한 식이요법\n3. 알레르기가 있는 반려견을 위한 식단\n4. 실내에서 할 수 있는 반려견 운동법\n5. 반려견 건강 체크리스트\n\n모든 참가자에게는 세미나 자료집과 반려견 영양제 샘플이 제공됩니다.",
    requirements: [
      "반려견 동반 불가 (세미나만 진행됩니다)",
      "필기구 지참 권장",
      "질문이 있으신 분들은 미리 준비해오시면 좋습니다"
    ],
    faq: [
      {
        question: "반려견을 동반해도 되나요?",
        answer: "본 세미나는 반려인만 참석 가능합니다. 장소 특성상 반려견 동반은 불가합니다."
      },
      {
        question: "주차 시설이 있나요?",
        answer: "센터 내 주차장이 있으며, 2시간 무료 주차가 가능합니다."
      },
      {
        question: "영상 녹화나 사진 촬영이 가능한가요?",
        answer: "저작권 보호를 위해 영상 녹화는 금지되어 있으며, 사진 촬영은 발표자의 허락 하에 가능합니다."
      }
    ]
  }
];

// 로그인 유도 함수
function promptLogin() {
  const confirmed = window.confirm("이 기능을 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
  if (confirmed) {
    window.location.href = "/auth";
  }
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        // 목업 데이터에서 ID로 이벤트 찾기
        const foundEvent = MOCK_EVENTS.find(e => e.id.toString() === id);
        
        if (foundEvent) {
          setEvent(foundEvent);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  const auth = useAuth();
  
  const handleRegister = () => {
    if (!auth || !auth.isAuthenticated) {
      promptLogin();
      return;
    }
    
    setIsRegistering(true);
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      setIsRegistering(false);
      toast({
        title: "등록 완료",
        description: "이벤트 참가 신청이 완료되었습니다.",
      });
    }, 1000);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "링크 복사됨",
      description: "이벤트 링크가 클립보드에 복사되었습니다.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">이벤트를 찾을 수 없습니다</h1>
          <p className="text-gray-500 mb-6">요청하신 이벤트가 존재하지 않거나 삭제되었습니다.</p>
          <Link href="/events">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              모든 이벤트 보기
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 배너 영역 */}
      {event.image && (
        <div className="w-full mb-8 rounded-lg overflow-hidden relative">
          <div className="relative h-64 md:h-80">
            <img 
              src={event.image}
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
              <div className="px-6 md:px-10 text-white max-w-xl">
                <Badge className="mb-4 bg-white text-primary">{event.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                <p className="text-lg mb-6">
                  {formatDate(event.date)} · {event.time}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 뒤로가기 */}
      <div className="mb-4">
        <Link href="/events">
          <Button variant="ghost" className="px-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            이벤트 목록으로
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 메인 콘텐츠 */}
        <div className="w-full lg:w-2/3">
          {/* 이미지 */}
          <div className="w-full rounded-lg overflow-hidden mb-6">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full max-h-[400px] object-cover"
            />
          </div>
          
          {/* 제목 및 기본 정보 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <Badge className="bg-primary text-white">{event.category}</Badge>
              <Badge variant={event.price === '무료' ? "outline" : "secondary"}>
                {event.price === '무료' ? '무료' : `${event.price.toLocaleString()}원`}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
          </div>
          
          {/* 주최자 정보 */}
          <Card className="mb-6 p-4">
            <div className="flex items-center mb-3">
              <Avatar className="w-12 h-12 mr-4">
                <img 
                  src={event.organizer.avatar} 
                  alt={event.organizer.name} 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div>
                <h3 className="font-medium">주최자: {event.organizer.name}</h3>
                {event.organizer.description && (
                  <p className="text-sm text-gray-500">{event.organizer.description}</p>
                )}
              </div>
            </div>
          </Card>
          
          {/* 상세 설명 */}
          {event.details && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">이벤트 상세</h2>
              <Card className="p-4">
                <div className="whitespace-pre-line">
                  {event.details}
                </div>
              </Card>
            </div>
          )}
          
          {/* 참가 요구사항 */}
          {event.requirements && event.requirements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">참가 요구사항</h2>
              <Card className="p-4">
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
          
          {/* FAQ */}
          {event.faq && event.faq.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">자주 묻는 질문</h2>
              <Card className="divide-y">
                {event.faq.map((item, index) => (
                  <div key={index} className="p-4">
                    <h3 className="font-medium mb-2">Q: {item.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300 pl-4">A: {item.answer}</p>
                  </div>
                ))}
              </Card>
            </div>
          )}
          
          {/* 위치 정보 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">이벤트 위치</h2>
            <Card className="p-4">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <div className="font-medium">{event.location.name}</div>
                  <div className="text-sm text-gray-500">{event.location.address}</div>
                </div>
              </div>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <KakaoMapView selectedLocation={event.location} />
              </div>
            </Card>
          </div>
        </div>
        
        {/* 사이드바 - 이벤트 정보 요약 및 신청 */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-6">
            <Card className="p-5 mb-6">
              <h2 className="text-xl font-semibold mb-4">이벤트 정보</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">날짜</h3>
                    <p className="text-gray-600 dark:text-gray-300">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">시간</h3>
                    <p className="text-gray-600 dark:text-gray-300">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">장소</h3>
                    <p className="text-gray-600 dark:text-gray-300">{event.location.name}</p>
                    <p className="text-sm text-gray-500">{event.location.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">참가자</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {event.attendees}명 
                      {event.maxAttendees ? ` / ${event.maxAttendees}명` : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">참가비</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {event.price === '무료' ? '무료' : `${event.price.toLocaleString()}원`}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-5" />
              
              {event.maxAttendees && event.attendees >= event.maxAttendees ? (
                <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    모집이 마감되었습니다
                  </p>
                </div>
              ) : (
                <Button 
                  className="w-full mb-4" 
                  size="lg"
                  disabled={isRegistering}
                  onClick={handleRegister}
                >
                  {isRegistering ? "처리 중..." : "이벤트 신청하기"}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                이벤트 공유하기
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}