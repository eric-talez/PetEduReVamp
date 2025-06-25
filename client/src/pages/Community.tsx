import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, TrendingUp, MessageCircle, Filter } from 'lucide-react';

export default function Community() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock community posts data
  const communityPosts = [
    {
      id: 1,
      user: {
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "최견주",
        time: "3시간 전"
      },
      title: "산책 중 다른 강아지 만났을 때 대처법",
      content: "오늘 산책 중 크고 활발한 강아지를 만났는데, 우리집 강아지가 너무 긴장하더라구요. 훈련사님이 알려주신 대로 거리를 두고 차분히 대응했더니 효과가 있었어요. 다른 견주분들도 시도해보세요!",
      likes: 28,
      comments: 12,
      tag: { text: "산책팁", variant: "blue" }
    },
    {
      id: 2,
      user: {
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "김훈련",
        time: "어제"
      },
      title: "강아지가 말을 안들을 때 해결법",
      content: "많은 견주님들이 반려견이 말을 안들어서 힘들어하십니다. 하지만 강아지 입장에선 여러분이 무슨 말을 하는지 모를 수 있어요. 일관된 명령어와 적절한 보상으로 서서히 훈련하는 것이 중요합니다. 다음 주 라이브 세션에서 자세히 알려드릴게요!",
      likes: 56,
      comments: 23,
      tag: { text: "훈련팁", variant: "green" }
    },
    {
      id: 3,
      user: {
        image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "박반려",
        time: "2일 전"
      },
      title: "분리불안 극복 성공 후기",
      content: "저희 코코가 혼자 있으면 짖고 물건을 망가뜨리는 문제가 심했는데, 이 플랫폼에서 분리불안 과정을 수강하고 정말 많이 좋아졌어요! 특히 점진적 이별 훈련이 효과적이었습니다. 비슷한 고민 있으신 분들께 추천해요.",
      likes: 42,
      comments: 18,
      tag: { text: "성공후기", variant: "purple" }
    },
    {
      id: 4,
      user: {
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "이건강",
        time: "3일 전"
      },
      title: "강아지 여름 건강 관리 팁",
      content: "날씨가 점점 더워지면서 반려견 건강 관리에 신경 써야 할 부분이 있어요. 산책은 아침이나 저녁 시간으로 조정하고, 충분한 수분 섭취를 도와주세요. 아스팔트 온도가 높을 수 있으니 발바닥 보호제도 추천합니다.",
      likes: 35,
      comments: 15,
      tag: { text: "건강", variant: "red" }
    },
    {
      id: 5,
      user: {
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "최행동",
        time: "4일 전"
      },
      title: "번개와 천둥에 겁내는 강아지 케어 방법",
      content: "번개와 천둥 소리에 공포감을 느끼는 반려견이 많습니다. 미리 안전한 공간(케이지나 방)을 마련해두고, 번개가 치기 전에 조용한 활동으로 기분을 전환시켜주세요. 압박 조끼도 효과적입니다.",
      likes: 38,
      comments: 20,
      tag: { text: "행동교정", variant: "blue" }
    },
    {
      id: 6,
      user: {
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        name: "이사회",
        time: "5일 전"
      },
      title: "반려견 카페 방문 시 예절",
      content: "반려견 카페 방문 시 주의사항을 공유합니다. 다른 강아지들과 사람들을 존중하는 기본 예절이 중요해요. 기본 명령어를 잘 따르는지 확인하고, 목줄을 항상 착용하세요. 배변 패드와 물티슈도 꼭 챙기시는 것 좋아요.",
      likes: 31,
      comments: 25,
      tag: { text: "사회화", variant: "green" }
    }
  ];
  
  const filteredPosts = communityPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">커뮤니티</h1>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="커뮤니티 검색" 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <MessageSquare className="w-4 h-4" />
              글쓰기
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="popular" className="mb-8">
        <TabsList>
          <TabsTrigger value="popular">
            <TrendingUp className="w-4 h-4 mr-2" />
            인기글
          </TabsTrigger>
          <TabsTrigger value="recent">
            <MessageCircle className="w-4 h-4 mr-2" />
            최신글
          </TabsTrigger>
          <TabsTrigger value="filter">
            <Filter className="w-4 h-4 mr-2" />
            태그별
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <CommunityCard
                key={post.id}
                user={post.user}
                title={post.title}
                content={post.content}
                likes={post.likes}
                comments={post.comments}
                tag={post.tag}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...filteredPosts].sort((a, b) => b.id - a.id).map((post) => (
              <CommunityCard
                key={post.id}
                user={post.user}
                title={post.title}
                content={post.content}
                likes={post.likes}
                comments={post.comments}
                tag={post.tag}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="filter" className="mt-6">
          <div className="flex gap-2 mb-6">
            <Badge variant="blue" className="cursor-pointer py-1">산책팁</Badge>
            <Badge variant="green" className="cursor-pointer py-1">훈련팁</Badge>
            <Badge variant="purple" className="cursor-pointer py-1">성공후기</Badge>
            <Badge variant="red" className="cursor-pointer py-1">건강</Badge>
            <Badge variant="accent" className="cursor-pointer py-1">질문</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <CommunityCard
                key={post.id}
                user={post.user}
                title={post.title}
                content={post.content}
                likes={post.likes}
                comments={post.comments}
                tag={post.tag}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">인기 훈련사의 꿀팁</h2>
              <Button variant="outline" size="sm">더 보기</Button>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex gap-4 items-start pb-4 border-b border-gray-100 dark:border-gray-800">
                <Avatar 
                  src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c"
                  alt="김훈련 트레이너"
                  size="md"
                />
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-medium mr-2">김훈련 트레이너</span>
                    <Badge variant="accent" size="sm">인기 훈련사</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    강아지가 소파에 올라가는 문제를 해결하려면 일관성 있게 규칙을 지키는 것이 중요합니다. 
                    소파 근처에 강아지 전용 침대를 마련하고 칭찬과 보상으로 그곳을 사용하도록 유도하세요.
                  </p>
                  <div className="text-xs text-gray-500">어제 작성</div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <Avatar 
                  src="https://images.unsplash.com/photo-1548535537-3cfaf1fc327c"
                  alt="박민첩 트레이너"
                  size="md"
                />
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-medium mr-2">박민첩 트레이너</span>
                    <Badge variant="blue" size="sm">어질리티 전문가</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    장난감을 이용한 10분 놀이도 좋은 운동이 됩니다. 
                    매일 규칙적인 놀이 시간을 가지면 강아지의 에너지를 발산하고 스트레스를 줄일 수 있어요.
                  </p>
                  <div className="text-xs text-gray-500">3일 전 작성</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
