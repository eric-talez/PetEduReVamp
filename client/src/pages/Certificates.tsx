import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Download, CheckCircle, Share2, Medal, FileText, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export default function Certificates() {
  // Mock certificates data
  const certificates = [
    {
      id: 1,
      title: "기본 훈련 과정 수료증",
      description: "반려견 기초 훈련 마스터하기 과정을 성공적으로 수료하였습니다.",
      issueDate: "2023년 9월 15일",
      course: "반려견 기초 훈련 마스터하기",
      institute: "퍼펙트 펫 아카데미",
      pet: {
        name: "토리",
        image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      trainer: {
        name: "김훈련",
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      type: "completion",
      thumbnail: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350"
    },
    {
      id: 2,
      title: "집안 예절 교육 수료증",
      description: "반려견 실내 생활 예절 교육 과정을 성공적으로 수료하였습니다.",
      issueDate: "2023년 11월 22일",
      course: "집안 예절 교육",
      institute: "해피 도그 스쿨",
      pet: {
        name: "토리",
        image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      trainer: {
        name: "최행동",
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      type: "completion",
      thumbnail: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350"
    }
  ];

  // Mock badges data
  const badges = [
    {
      id: 1,
      title: "기본 훈련 마스터",
      description: "모든 기본 훈련 명령어를 성공적으로 마스터했습니다.",
      issueDate: "2023년 9월 15일",
      pet: {
        name: "토리",
        image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      icon: "🥇",
      color: "bg-yellow-500"
    },
    {
      id: 2,
      title: "사교왕",
      description: "다양한 환경에서 다른 반려견과 사람들과 원활하게 소통합니다.",
      issueDate: "2023년 10월 10일",
      pet: {
        name: "토리",
        image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      icon: "👋",
      color: "bg-blue-500"
    },
    {
      id: 3,
      title: "달리기 챔피언",
      description: "어질리티 달리기 코스에서 뛰어난 성과를 보였습니다.",
      issueDate: "2023년 11월 05일",
      pet: {
        name: "토리",
        image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      icon: "🏃",
      color: "bg-green-500"
    },
    {
      id: 4,
      title: "새싹 훈련생",
      description: "기본 훈련을 시작하여 좋은 성과를 보이고 있습니다.",
      issueDate: "2023년 12월 20일",
      pet: {
        name: "몽이",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      icon: "🌱",
      color: "bg-emerald-500"
    },
    {
      id: 5,
      title: "친절한 친구",
      description: "다른 반려견들과 우호적으로 지내는 친화력을 보입니다.",
      issueDate: "2024년 1월 10일",
      pet: {
        name: "몽이",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      icon: "❤️",
      color: "bg-red-500"
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">자격증 및 수료증</h1>
      
      <Tabs defaultValue="certificates" className="mb-8">
        <TabsList>
          <TabsTrigger value="certificates">
            <FileText className="w-4 h-4 mr-2" />
            수료증
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Medal className="w-4 h-4 mr-2" />
            획득한 배지
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="certificates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={certificate.thumbnail}
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Award className="w-16 h-16 text-white opacity-80" />
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{certificate.title}</CardTitle>
                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>발급일: {certificate.issueDate}</span>
                      </div>
                    </div>
                    <Badge variant="blue">수료증</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {certificate.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Avatar 
                        src={certificate.pet.image} 
                        alt={certificate.pet.name}
                        size="sm"
                      />
                      <span className="ml-2 text-sm">{certificate.pet.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm">{certificate.trainer.name} 트레이너</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm mb-1">
                      <span className="font-medium">교육 과정:</span> {certificate.course}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">발급 기관:</span> {certificate.institute}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      공유하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center text-white text-2xl mb-4`}>
                      {badge.icon}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{badge.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {badge.description}
                    </p>
                    
                    <div className="flex items-center mb-4">
                      <Badge variant="outline" className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {badge.issueDate}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <Avatar 
                        src={badge.pet.image} 
                        alt={badge.pet.name}
                        size="sm"
                      />
                      <span className="ml-2 text-sm">{badge.pet.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
