import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PetAIChatBox } from '@/components/PetAIChatBox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIAnalysisProvider } from '@/hooks/useAIAnalysis';
import { Dog, Brain, Lock, ChevronRight, Upload } from 'lucide-react';
import { Link } from 'wouter';
import useAuth from '@/hooks/useAuth';

export default function PublicAIPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('chat');
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-3xl font-bold">반려동물 AI 도우미</h1>
        <p className="text-gray-600 dark:text-gray-400">
          반려동물에 대한 질문이나 관리 방법에 대해 AI에게 물어보세요
        </p>
      </div>
      
      <Tabs defaultValue="chat" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 w-full justify-start">
          <TabsTrigger value="chat">AI 채팅</TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="analysis">고급 분석</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="chat" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PetAIChatBox isFullPage={true} />
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Dog className="mr-2 h-5 w-5 text-primary" />
                    반려동물 이해하기
                  </CardTitle>
                  <CardDescription>
                    반려견의 행동과 건강에 대한 질문을 해보세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="bg-slate-100 dark:bg-slate-800 p-2 rounded">우리 강아지가 계속 짖는데 어떻게 해야 할까요?</p>
                    <p className="bg-slate-100 dark:bg-slate-800 p-2 rounded">강아지 사료 선택은 어떻게 하나요?</p>
                    <p className="bg-slate-100 dark:bg-slate-800 p-2 rounded">반려견 기본 훈련은 어떻게 시작하나요?</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" onClick={() => document.querySelector('textarea')?.focus()}>
                    질문하기 <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              {!isAuthenticated && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5 text-primary" />
                      고급 분석 기능
                    </CardTitle>
                    <CardDescription>
                      회원 가입 후 더 많은 AI 기능을 이용하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4 text-primary" />
                      <p>반려동물 영상 행동 분석</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <p>맞춤형 훈련 프로그램 추천</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dog className="h-4 w-4 text-primary" />
                      <p>개인화된 건강 관리 조언</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to="/auth">
                      <Button>회원가입 / 로그인</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {isAuthenticated && (
          <TabsContent value="analysis">
            <AIAnalysisProvider>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>행동 분석</CardTitle>
                    <CardDescription>
                      반려동물의 행동과 습관에 대한 전문적인 분석
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>반려동물 등록 후 영상 업로드를 통해 AI가 행동을 분석해 드립니다.</p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/my-pets">
                      <Button>
                        내 반려동물 관리
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>훈련 진행 상황</CardTitle>
                    <CardDescription>
                      시간에 따른 훈련 진척도와 성장 트래킹
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>등록된 반려동물의 훈련 과정과 발전 상황을 그래프로 확인하세요.</p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/my-courses">
                      <Button>
                        내 강좌 보기
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </AIAnalysisProvider>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}