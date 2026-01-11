import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadAnalysis from "./FileUploadAnalysis";
import FileBasedRealTimeAnalysis from "./FileBasedRealTimeAnalysis";
import {
  Activity,
  Brain,
  Camera,
  Heart,
  Eye,
  Zap,
  Target,
  Timer,
  Users,
  AlertTriangle,
  Play,
  TrendingUp,
  Upload,
  Video
} from "lucide-react";

export default function BehavioralAnalysis() {
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);
  const [intensityLevel, setIntensityLevel] = useState([5]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisTime, setAnalysisTime] = useState(0);

  const behaviorTypes = [
    {
      id: "play",
      name: "놀이 행동",
      description: "장난감과의 상호작용, 달리기, 점프",
      color: "bg-green-100 text-green-800",
      icon: <Play className="w-4 h-4" />,
      frequency: 85,
      intensity: 7,
      triggers: ["장난감 보기", "주인 호출", "다른 개와 만남"],
      bodyLanguage: {
        tail: "높이 올리고 흔듦",
        ears: "앞으로 기울임",
        posture: "낮은 자세로 엉덩이 올림",
        movement: "활발하고 경쾌함"
      }
    },
    {
      id: "anxiety",
      name: "불안 행동",
      description: "스트레스 반응, 회피, 떨림",
      color: "bg-red-100 text-red-800",
      icon: <AlertTriangle className="w-4 h-4" />,
      frequency: 45,
      intensity: 6,
      triggers: ["큰 소리", "낯선 사람", "의료 환경"],
      bodyLanguage: {
        tail: "다리 사이로 말고 있음",
        ears: "뒤로 젖힘",
        posture: "몸을 낮추고 움츠림",
        movement: "느리고 조심스러움"
      }
    },
    {
      id: "aggression",
      name: "공격적 행동",
      description: "으르렁거림, 이빨 드러내기, 돌진",
      color: "bg-orange-100 text-orange-800",
      icon: <Zap className="w-4 h-4" />,
      frequency: 15,
      intensity: 9,
      triggers: ["음식 보호", "영역 침범", "위협적 상황"],
      bodyLanguage: {
        tail: "꼿꼿하게 세움",
        ears: "앞으로 쫑긋 세움",
        posture: "높은 자세, 가슴 펴기",
        movement: "느리고 위협적"
      }
    },
    {
      id: "submission",
      name: "복종 행동",
      description: "낮은 자세, 배 보이기, 핥기",
      color: "bg-blue-100 text-blue-800",
      icon: <Heart className="w-4 h-4" />,
      frequency: 65,
      intensity: 4,
      triggers: ["권위 있는 존재", "다른 개의 우세함", "훈련 상황"],
      bodyLanguage: {
        tail: "낮게 흔들거나 다리 사이",
        ears: "뒤로 젖힘",
        posture: "낮은 자세, 때로는 배 드러냄",
        movement: "천천히, 조심스럽게"
      }
    }
  ];

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisTime(0);

    const timer = setInterval(() => {
      setAnalysisTime(prev => prev + 1);
    }, 1000);

    setTimeout(() => {
      setIsAnalyzing(false);
      clearInterval(timer);
    }, 30000);
  };

  const toggleAnalysis = () => {
    if (isAnalyzing) {
      setIsAnalyzing(false);
    } else {
      startAnalysis();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="file-realtime" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="file-realtime" className="flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>실시간 분석</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>파일 분석</span>
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>카메라 분석</span>
          </TabsTrigger>
          <TabsTrigger value="behaviors" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>행동 유형</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file-realtime" className="space-y-6">
          <FileBasedRealTimeAnalysis />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <FileUploadAnalysis />
        </TabsContent>

        <TabsContent value="camera" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>실시간 행동 분석</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={toggleAnalysis}
                      variant={isAnalyzing ? "destructive" : "default"}
                      className="flex items-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isAnalyzing ? "분석 중지" : "실시간 분석 시작"}</span>
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Timer className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-mono">
                        {formatTime(analysisTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">분석 감도:</span>
                    <div className="w-32">
                      <Slider
                        value={intensityLevel}
                        onValueChange={setIntensityLevel}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm font-medium w-6">{intensityLevel[0]}</span>
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">실시간 분석 중...</span>
                    </div>
                    <p className="text-sm text-green-700">
                      카메라를 통해 강아지의 행동 패턴을 실시간으로 분석하고 있습니다.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Camera className="w-5 h-5 text-blue-500" />
                        <span>비디오 피드</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {isAnalyzing ? (
                          <div className="text-white space-y-4 text-center">
                            <div className="animate-pulse">
                              <Eye className="w-12 h-12 mx-auto mb-2" />
                              <p>행동 패턴 분석 중...</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 w-32">
                              {[...Array(9)].map((_, i) => (
                                <div
                                  key={i}
                                  className="h-2 bg-blue-400 rounded animate-pulse"
                                  style={{ animationDelay: `${i * 0.1}s` }}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-center">
                            <Camera className="w-16 h-16 mx-auto mb-4" />
                            <p>실시간 분석을 시작하려면 위의 버튼을 클릭하세요</p>
                          </div>
                        )}

                        {isAnalyzing && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                            LIVE
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span>실시간 분석 결과</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isAnalyzing ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">🤖 AI 실시간 분석 중</span>
                            <Badge variant="secondary" className="text-xs">OpenAI GPT-5.1</Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">감지된 행동</span>
                            <Badge className="bg-green-100 text-green-800">놀이 행동</Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>강도 수준</span>
                              <span>7/10</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>AI 신뢰도</span>
                              <span>94%</span>
                            </div>
                            <Progress value={94} className="h-2" />
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-medium text-sm mb-2">AI 분석 - 신체 언어</h4>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>꼬리:</span>
                                <span className="text-green-600">높이 올리고 흔듦</span>
                              </div>
                              <div className="flex justify-between">
                                <span>귀:</span>
                                <span className="text-green-600">앞으로 기울임</span>
                              </div>
                              <div className="flex justify-between">
                                <span>자세:</span>
                                <span className="text-green-600">활발하고 경쾌함</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded p-2 text-xs text-blue-700">
                            💡 AI가 실시간으로 행동 패턴을 분석하고 있습니다
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <Target className="w-12 h-12 mx-auto mb-4" />
                          <p>분석을 시작하면 실시간 결과가 여기에 표시됩니다</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behaviors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {behaviorTypes.map((behavior) => (
              <Card
                key={behavior.id}
                className={`cursor-pointer transition-all ${
                  selectedBehavior === behavior.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedBehavior(
                  selectedBehavior === behavior.id ? null : behavior.id
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {behavior.icon}
                      <span>{behavior.name}</span>
                    </CardTitle>
                    <Badge className={behavior.color}>
                      {behavior.frequency}% 빈도
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{behavior.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>평균 강도</span>
                      <span>{behavior.intensity}/10</span>
                    </div>
                    <Progress value={behavior.intensity * 10} className="h-2" />
                  </div>

                  {selectedBehavior === behavior.id && (
                    <div className="pt-4 border-t space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">주요 트리거</h4>
                        <div className="flex flex-wrap gap-2">
                          {behavior.triggers.map((trigger, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">신체 언어 특징</h4>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          {Object.entries(behavior.bodyLanguage).map(([part, description]) => (
                            <div key={part} className="bg-gray-50 p-2 rounded">
                              <span className="font-medium capitalize">{part}:</span>
                              <span className="ml-2">{description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
