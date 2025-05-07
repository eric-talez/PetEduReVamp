import { Link } from 'wouter';
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock,
  AlertCircle,
  Send
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

// 문의 유형
const INQUIRY_TYPES = [
  "계정 관련",
  "교육 과정",
  "화상 상담",
  "결제 문의",
  "기술적 오류",
  "기타 문의"
];

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState<string | undefined>(undefined);
  const [urgent, setUrgent] = useState<string>("no");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 문의 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 항목 검증
    if (!name || !email || !subject || !message || !inquiryType) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "이름, 이메일, 제목, 내용, 문의 유형은 필수 입력 항목입니다.",
        variant: "destructive"
      });
      return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "이메일 형식이 올바르지 않습니다",
        description: "유효한 이메일 주소를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // 실제 구현에서는 API 호출로 대체됩니다.
    setTimeout(() => {
      toast({
        title: "문의가 접수되었습니다",
        description: "빠른 시일 내에 답변 드리겠습니다.",
      });
      
      // 폼 초기화
      setInquiryType(undefined);
      setUrgent("no");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 배너 영역 */}
      <div className="w-full mb-8 rounded-lg overflow-hidden relative">
        <div className="relative h-48 md:h-64">
          <img 
            src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=400&q=80"
            alt="문의하기 배너" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
            <div className="px-6 md:px-10 text-white max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">고객센터</h1>
              <p className="text-lg mb-2">
                궁금한 점이 있으신가요?
              </p>
              <p className="text-sm md:text-base">
                문의 사항을 남겨주시면 신속하게 답변 드리겠습니다.
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 문의 양식 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">문의하기</h2>
              
              <form onSubmit={handleSubmit}>
                {/* 문의 유형 선택 */}
                <div className="mb-6">
                  <Label className="mb-2 block">문의 유형 (필수)</Label>
                  <ToggleGroup 
                    type="single" 
                    variant="outline" 
                    className="flex flex-wrap gap-2"
                    value={inquiryType}
                    onValueChange={setInquiryType}
                  >
                    {INQUIRY_TYPES.map(type => (
                      <ToggleGroupItem
                        key={type}
                        value={type}
                        className="rounded-full"
                      >
                        {type}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                
                {/* 긴급 여부 */}
                <div className="mb-6">
                  <Label className="mb-2 block">긴급 문의 여부</Label>
                  <RadioGroup 
                    defaultValue="no" 
                    value={urgent}
                    onValueChange={setUrgent}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="urgent-yes" />
                      <Label htmlFor="urgent-yes">예</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="urgent-no" />
                      <Label htmlFor="urgent-no">아니오</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* 개인 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="name" className="mb-2 block">이름 (필수)</Label>
                    <Input 
                      id="name" 
                      placeholder="이름을 입력하세요" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-2 block">이메일 (필수)</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="이메일을 입력하세요" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="phone" className="mb-2 block">전화번호 (선택)</Label>
                  <Input 
                    id="phone" 
                    placeholder="전화번호를 입력하세요" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    빠른 답변이 필요한 경우 전화번호를 남겨주세요.
                  </p>
                </div>
                
                {/* 문의 내용 */}
                <div className="mb-6">
                  <Label htmlFor="subject" className="mb-2 block">제목 (필수)</Label>
                  <Input 
                    id="subject" 
                    placeholder="제목을 입력하세요" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="message" className="mb-2 block">내용 (필수)</Label>
                  <Textarea 
                    id="message" 
                    placeholder="문의 내용을 상세히 입력해주세요..." 
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                {/* 제출 알림 */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      문의하신 내용은 영업일 기준 1-2일 이내에 답변 드립니다. 긴급한 문의는 전화로 연락해주세요.
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-pulse" /> 
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> 
                      문의하기
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* 연락처 정보 */}
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">연락처 정보</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">이메일</p>
                    <p className="text-gray-600 dark:text-gray-300">support@petedu.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">전화</p>
                    <p className="text-gray-600 dark:text-gray-300">02-123-4567</p>
                    <p className="text-xs text-gray-500">평일 9:00 - 18:00 (공휴일 제외)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">주소</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      서울특별시 강남구 테헤란로 123<br />
                      펫에듀 타워 8층
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">고객센터 운영 시간</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">채팅 상담</p>
                    <p className="text-gray-600 dark:text-gray-300">평일 9:00 - 20:00</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">전화 상담</p>
                    <p className="text-gray-600 dark:text-gray-300">평일 9:00 - 18:00</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">이메일 문의</p>
                    <p className="text-gray-600 dark:text-gray-300">24시간 접수 가능</p>
                    <p className="text-xs text-gray-500">영업일 기준 1-2일 내 답변</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">빠른 링크</h3>
              
              <div className="flex flex-col space-y-2">
                <Link href="/help/faq">
                  <Button variant="ghost" className="w-full justify-start">
                    자주 묻는 질문
                  </Button>
                </Link>
                <Link href="/help/guide">
                  <Button variant="ghost" className="w-full justify-start">
                    이용 가이드
                  </Button>
                </Link>
                <Link href="/help/about">
                  <Button variant="ghost" className="w-full justify-start">
                    회사 소개
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}