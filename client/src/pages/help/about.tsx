import { Link } from 'wouter';
import { ChevronLeft, Award, GitBranch, Heart, BarChart, Users, MapPin, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

// 팀원 데이터
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "김태희",
    role: "CEO & 공동 창업자",
    bio: "반려동물 행동 전문가로 10년 이상의 경험을 가지고 있으며, 반려동물 교육의 혁신을 목표로 펫에듀를 설립했습니다.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 2,
    name: "박준혁",
    role: "CTO & 공동 창업자",
    bio: "IT 전문가이자 반려동물 애호가로, 기술을 통해 반려동물 교육의 접근성을 높이는 데 기여하고 있습니다.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 3,
    name: "이지민",
    role: "수석 훈련사",
    bio: "국제 인증 훈련사로서 다양한 반려동물 행동 문제에 대한 솔루션을 개발하고 훈련사 교육 프로그램을 총괄하고 있습니다.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 4,
    name: "정민수",
    role: "마케팅 디렉터",
    bio: "디지털 마케팅 전문가로서 반려동물 산업에서의 풍부한 경험을 바탕으로 펫에듀의 브랜드 전략을 이끌고 있습니다.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 배너 영역 */}
      <div className="w-full mb-8 rounded-lg overflow-hidden relative">
        <div className="relative h-48 md:h-64">
          <img 
            src="https://images.unsplash.com/photo-1549291981-56d443d5e2a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=400&q=80"
            alt="About Us 배너" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
            <div className="px-6 md:px-10 text-white max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">펫에듀 소개</h1>
              <p className="text-lg mb-2">
                모든 반려동물과 견주를 위한 교육 플랫폼
              </p>
              <p className="text-sm md:text-base">
                행복한 반려 생활을 위한 우리의 미션과 가치를 소개합니다.
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
      
      {/* 회사 소개 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg mb-4">
              <span className="font-semibold text-primary">펫에듀</span>는 2023년, 반려동물 교육의 어려움을 경험한 창업자들에 의해 설립되었습니다.
            </p>
            <p className="mb-4">
              우리는 모든 반려동물과 보호자가 최고 품질의 교육 자원에 쉽게 접근할 수 있어야 한다고 믿습니다. 이러한 믿음을 바탕으로, 전문 훈련사의 온라인 강의부터 1:1 맞춤형 상담, 위치 기반 서비스까지 종합적인 교육 플랫폼을 구축했습니다.
            </p>
            <p>
              펫에듀는 단순한 교육 서비스를 넘어, 지속적으로 성장하는 반려동물 커뮤니티를 형성하여 모든 반려동물과 보호자가 더 행복하고 조화로운 삶을 살 수 있도록 돕는 것을 목표로 합니다.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=500" 
              alt="펫에듀 스토리" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      
      {/* 미션 & 비전 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center">미션 & 비전</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                우리의 미션
              </h3>
              <p className="mb-4">
                모든 반려동물과 보호자에게 최고 품질의 교육 기회를 제공하여, 더 행복하고 건강한 반려 생활을 만들어갑니다.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Heart className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>반려동물의 행동과 심리에 대한 이해 증진</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>전문가와 견주 간의 지식 공유 활성화</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>교육 리소스의 접근성 향상</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <GitBranch className="mr-2 h-5 w-5 text-primary" />
                우리의 비전
              </h3>
              <p className="mb-4">
                글로벌 반려동물 교육 시장을 선도하는 혁신적인 플랫폼으로 성장하여, 반려동물 복지 향상에 기여합니다.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <BarChart className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>데이터 기반 맞춤형 교육 솔루션 개발</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>지역 기반 훈련사-견주 연결 생태계 구축</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>반려동물 교육 커뮤니티 활성화</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 팀 소개 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map(member => (
            <Card key={member.id} className="overflow-hidden hover:shadow-md transition">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* 합류하기 섹션 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">함께 성장하세요</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          반려동물의 행복한 삶을 위한 우리의 미션에 동참하세요.
          열정적인 팀과 함께 혁신적인 반려동물 교육 플랫폼을 만들어갈 인재를 찾고 있습니다.
        </p>
        <Button size="lg">채용 정보 보기</Button>
      </div>
      
      {/* 파트너십 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Partners</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          펫에듀는 반려동물 산업의 다양한 전문가 및 기관과 협력하여 최고의 서비스를 제공합니다.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
          <img 
            src="https://via.placeholder.com/150x80?text=Partner+1" 
            alt="파트너 1" 
            className="h-16 w-auto grayscale hover:grayscale-0 transition"
          />
          <img 
            src="https://via.placeholder.com/150x80?text=Partner+2" 
            alt="파트너 2" 
            className="h-16 w-auto grayscale hover:grayscale-0 transition"
          />
          <img 
            src="https://via.placeholder.com/150x80?text=Partner+3" 
            alt="파트너 3" 
            className="h-16 w-auto grayscale hover:grayscale-0 transition"
          />
          <img 
            src="https://via.placeholder.com/150x80?text=Partner+4" 
            alt="파트너 4" 
            className="h-16 w-auto grayscale hover:grayscale-0 transition"
          />
        </div>
      </div>
      
      {/* 연락처 */}
      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          질문이나 제안이 있으신가요? 언제든지 연락주세요. 성심껏 답변 드리겠습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/help/contact">
            <Button variant="outline" className="w-full sm:w-auto">
              문의하기
            </Button>
          </Link>
          <Link href="/help/faq">
            <Button className="w-full sm:w-auto">
              자주 묻는 질문
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}