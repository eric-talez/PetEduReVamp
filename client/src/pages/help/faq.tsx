import { Link } from 'wouter';
import { 
  ChevronLeft, 
  ChevronDown, 
  Search,
  HelpCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

// FAQ 카테고리 및 항목 타입 정의
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// FAQ 데이터
const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "펫에듀 플랫폼은 어떤 서비스인가요?",
    answer: "펫에듀 플랫폼은 반려동물 교육과 관련된 종합 플랫폼입니다. 전문 훈련사의 교육 과정, 비대면 화상 상담, 지역별 훈련 시설 정보, 커뮤니티 등 다양한 서비스를 제공합니다.",
    category: "일반"
  },
  {
    id: "faq-2",
    question: "회원가입은 어떻게 하나요?",
    answer: "화면 우측 상단의 '로그인/회원가입' 버튼을 클릭한 후, 회원가입 양식을 작성하시면 됩니다. 일반 사용자, 훈련사, 교육기관 관리자 등 다양한 역할로 가입이 가능합니다.",
    category: "계정"
  },
  {
    id: "faq-3",
    question: "교육 과정은 어떻게 신청하나요?",
    answer: "로그인 후 '교육 과정' 메뉴에서 원하는 강좌를 선택하고 신청 버튼을 클릭하시면 됩니다. 신청 시 결제 페이지로 이동하며, 결제 완료 후 바로 수강이 가능합니다.",
    category: "교육"
  },
  {
    id: "faq-4",
    question: "화상 상담은 어떻게 진행되나요?",
    answer: "화상 상담은 사전 예약 후 지정된 시간에 진행됩니다. 예약한 시간에 '내 화상 상담' 메뉴로 접속하시면 훈련사와 연결됩니다. 화상 상담은 PC와 모바일 모두 지원합니다.",
    category: "상담"
  },
  {
    id: "faq-5",
    question: "결제 방법은 어떤 것이 있나요?",
    answer: "신용카드, 체크카드, 가상계좌, 휴대폰 결제 등 다양한 결제 방법을 지원합니다. 또한 네이버페이, 카카오페이 등 간편결제도 이용 가능합니다.",
    category: "결제"
  },
  {
    id: "faq-6",
    question: "환불 정책은 어떻게 되나요?",
    answer: "강의 시작 후 7일 이내에는 수강률 25% 미만일 경우 전액 환불이 가능합니다. 7일 이후에는 잔여 기간에 대해 일할 계산된 금액이 환불됩니다. 자세한 내용은 이용약관을 참고해주세요.",
    category: "결제"
  },
  {
    id: "faq-7",
    question: "훈련사로 등록하려면 어떻게 해야 하나요?",
    answer: "회원가입 시 '훈련사'로 역할을 선택한 후, 필요한 자격증 및 경력 정보를 업로드하시면 관리자 검토 후 승인됩니다. 승인 후에는 교육 과정을 등록하고 상담을 진행할 수 있습니다.",
    category: "훈련사"
  },
  {
    id: "faq-8",
    question: "반려동물 등록은 어떻게 하나요?",
    answer: "로그인 후 '마이페이지 > 내 반려동물'에서 반려동물 정보를 등록할 수 있습니다. 이름, 종류, 나이, 성별, 특징 등 상세 정보를 입력하면 맞춤형 교육 추천을 받을 수 있습니다.",
    category: "반려동물"
  },
  {
    id: "faq-9",
    question: "모바일 앱도 있나요?",
    answer: "현재 모바일 웹으로 서비스를 제공하고 있으며, iOS 및 Android 앱은 개발 중입니다. 모바일 웹은 PC 버전과 동일한 기능을 모두 사용할 수 있습니다.",
    category: "일반"
  },
  {
    id: "faq-10",
    question: "커뮤니티 이용 규칙은 무엇인가요?",
    answer: "커뮤니티에서는 반려동물 교육과 관련된 정보 공유, 질문, 경험담 등을 자유롭게 나눌 수 있습니다. 다만 광고성 게시물, 타인을 비방하는 내용, 유해한 콘텐츠는 제재 대상이 될 수 있습니다.",
    category: "커뮤니티"
  },
  {
    id: "faq-11",
    question: "이벤트 정보는 어디서 확인할 수 있나요?",
    answer: "'이벤트' 메뉴에서 다양한 오프라인 모임, 세미나, 할인 혜택 등의 이벤트 정보를 확인할 수 있습니다. 로그인 없이도 이벤트 정보 조회가 가능합니다.",
    category: "이벤트"
  },
  {
    id: "faq-12",
    question: "위치 기반 서비스는 어떻게 이용하나요?",
    answer: "'위치 서비스' 메뉴에서 내 주변 훈련 센터, 애견 카페, 동물병원 등의 정보를 확인할 수 있습니다. '내 위치 찾기' 버튼을 클릭하면 현재 위치 기준으로 정보가 제공됩니다.",
    category: "위치 서비스"
  }
];

// 카테고리 목록 생성
const categories = ["전체", ...Array.from(new Set(faqData.map(item => item.category)))];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  
  // 검색 및 필터링된 FAQ 항목
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "전체" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 배너 영역 */}
      <div className="w-full mb-8 rounded-lg overflow-hidden relative">
        <div className="relative h-48 md:h-64">
          <img 
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=400&q=80"
            alt="FAQ 배너" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
            <div className="px-6 md:px-10 text-white max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">자주 묻는 질문</h1>
              <p className="text-lg mb-2">
                펫에듀 플랫폼에 대한 궁금증을 해결해 드립니다.
              </p>
              <p className="text-sm md:text-base">
                원하는 답변을 찾지 못하셨다면 고객센터로 문의해주세요.
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
      
      {/* 검색 및 필터 영역 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="질문 또는 키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ 아코디언 */}
      <Card className="mb-8 p-6">
        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-start">
                    <span className="text-primary font-semibold mr-2">Q.</span>
                    <div>
                      <span>{faq.question}</span>
                      <Badge variant="outline" className="ml-2 text-xs">{faq.category}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex">
                    <span className="text-primary font-semibold mr-2">A.</span>
                    <div className="flex-1">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-12 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500 mb-4">
              다른 검색어를 입력하거나 다른 카테고리를 선택해보세요.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("전체");
              }}
            >
              필터 초기화
            </Button>
          </div>
        )}
      </Card>
      
      {/* 추가 도움말 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">더 궁금한 점이 있으신가요?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          자주 묻는 질문에서 원하는 답변을 찾지 못하셨다면, 1:1 문의를 통해 상세한 답변을 받아보세요.
          전문 상담원이 신속하게 답변해 드립니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/help/guide">
            <Button variant="outline" className="w-full sm:w-auto">
              이용 가이드 보기
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