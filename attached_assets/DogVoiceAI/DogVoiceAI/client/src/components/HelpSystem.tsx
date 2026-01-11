import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  Search,
  BookOpen,
  Video,
  MessageCircle,
  X,
  ChevronRight,
  Dog,
  Brain,
  Mic,
  BarChart3
} from "lucide-react";

const helpTopics = {
  "연구 대상견": [
    {
      title: "새 대상견 등록하기",
      content: "연구 대상견 탭에서 '새 대상견 등록' 버튼을 클릭하여 강아지의 기본 정보, 소유자 정보, 행동 특성을 입력할 수 있습니다.",
      tags: ["등록", "대상견", "강아지"]
    },
    {
      title: "대상견 정보 수정",
      content: "등록된 대상견 카드에서 편집 버튼을 클릭하여 정보를 수정할 수 있습니다.",
      tags: ["수정", "편집"]
    },
    {
      title: "검색 및 필터링",
      content: "이름, 견종, 소유자로 검색하거나 견종별 필터를 사용하여 원하는 대상견을 찾을 수 있습니다.",
      tags: ["검색", "필터"]
    }
  ],
  "행동 분석": [
    {
      title: "실시간 행동 분석 시작",
      content: "행동 분석 탭에서 '실시간 분석 시작' 버튼을 클릭하여 카메라를 통한 실시간 행동 분석을 시작할 수 있습니다.",
      tags: ["실시간", "카메라", "분석"]
    },
    {
      title: "행동 유형 이해하기",
      content: "놀이 행동, 불안 행동, 공격적 행동, 복종 행동 등 다양한 행동 유형과 특징을 행동 유형 탭에서 확인할 수 있습니다.",
      tags: ["행동유형", "특징"]
    },
    {
      title: "분석 감도 조절",
      content: "분석 감도 슬라이더를 사용하여 행동 감지의 민감도를 조절할 수 있습니다.",
      tags: ["감도", "설정"]
    }
  ],
  "음성 분석": [
    {
      title: "음성 녹음하기",
      content: "음성 분석 탭에서 녹음 버튼을 클릭하여 강아지의 소리를 녹음하고 분석할 수 있습니다.",
      tags: ["녹음", "음성"]
    },
    {
      title: "주파수 패턴 이해",
      content: "식사 요구(440Hz), 산책 요구(330Hz), 놀이(550Hz) 등 다양한 소리 패턴을 확인할 수 있습니다.",
      tags: ["주파수", "패턴"]
    }
  ],
  "접근성": [
    {
      title: "텍스트 크기 조절",
      content: "우측 하단의 접근성 버튼을 클릭하여 텍스트 크기를 75%~150% 범위에서 조절할 수 있습니다.",
      tags: ["텍스트", "크기"]
    },
    {
      title: "키보드 단축키",
      content: "Ctrl+1-4로 탭을 전환하고, F1로 도움말을 열며, ESC로 포커스를 해제할 수 있습니다.",
      tags: ["키보드", "단축키"]
    },
    {
      title: "고대비 모드",
      content: "접근성 설정에서 고대비 모드를 활성화하여 더 명확한 시각적 대비를 얻을 수 있습니다.",
      tags: ["고대비", "시각"]
    }
  ]
};

const quickActions = [
  { icon: Dog, title: "새 대상견 등록", description: "연구에 참여할 강아지 등록", action: "대상견 등록 페이지로 이동" },
  { icon: Brain, title: "행동 분석 시작", description: "실시간 행동 패턴 분석", action: "행동 분석 시작" },
  { icon: Mic, title: "음성 녹음", description: "강아지 소리 분석", action: "음성 분석 탭으로 이동" },
  { icon: BarChart3, title: "통계 확인", description: "연구 결과 및 통계 보기", action: "통계 탭으로 이동" }
];

export default function HelpSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTopics = Object.entries(helpTopics).reduce((acc, [category, topics]) => {
    const filtered = topics.filter(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof helpTopics[keyof typeof helpTopics]>);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 p-0 bg-green-600 hover:bg-green-700 text-white shadow-lg"
        aria-label="도움말"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 left-0 w-96 h-[32rem] shadow-xl border-2 border-green-200 bg-white z-50 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                도움말 센터
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                aria-label="도움말 닫기"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="도움말 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="h-full overflow-y-auto pb-20">
            {!searchQuery ? (
              <Tabs defaultValue="topics" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="topics">주제별 도움말</TabsTrigger>
                  <TabsTrigger value="actions">빠른 실행</TabsTrigger>
                </TabsList>

                <TabsContent value="topics" className="space-y-4">
                  {selectedCategory ? (
                    <div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedCategory(null)}
                        className="mb-4"
                      >
                        ← 뒤로 가기
                      </Button>
                      <div className="space-y-3">
                        {helpTopics[selectedCategory]?.map((topic, index) => (
                          <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                            <h4 className="font-medium text-sm mb-2">{topic.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">{topic.content}</p>
                            <div className="flex flex-wrap gap-1">
                              {topic.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.keys(helpTopics).map((category) => (
                        <Button
                          key={category}
                          variant="ghost"
                          className="w-full justify-between h-12"
                          onClick={() => setSelectedCategory(category)}
                        >
                          <span>{category}</span>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {helpTopics[category].length}
                            </Badge>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-3">
                  {quickActions.map((action, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <action.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{action.title}</h4>
                          <p className="text-xs text-gray-600 mb-1">{action.description}</p>
                          <span className="text-xs text-blue-600">{action.action}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              /* 검색 결과 */
              <div className="space-y-4">
                <h3 className="font-medium">검색 결과</h3>
                {Object.keys(filteredTopics).length > 0 ? (
                  Object.entries(filteredTopics).map(([category, topics]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                      <div className="space-y-2">
                        {topics.map((topic, index) => (
                          <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                            <h5 className="font-medium text-sm mb-1">{topic.title}</h5>
                            <p className="text-xs text-gray-600 mb-2">{topic.content}</p>
                            <div className="flex flex-wrap gap-1">
                              {topic.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {/* 추가 도움말 링크 */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-3">추가 지원</h4>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  동영상 튜토리얼
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  문의하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}