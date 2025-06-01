import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Calendar, Target } from "lucide-react";

export default function AnalyticsPage() {
  const analytics = {
    totalSessions: 24,
    completedSessions: 18,
    progressRate: 75,
    averageScore: 85,
    weeklyProgress: [
      { week: "1주차", score: 70 },
      { week: "2주차", score: 75 },
      { week: "3주차", score: 82 },
      { week: "4주차", score: 85 }
    ],
    skills: [
      { name: "기초 명령", progress: 90, level: "우수" },
      { name: "사회화", progress: 70, level: "보통" },
      { name: "문제 행동 교정", progress: 55, level: "개선 필요" }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">분석 및 보고서</h1>
        <p className="text-gray-600">반려견의 훈련 진행 상황과 성과를 분석해보세요.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 훈련 세션</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">지난 달 대비 +12%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 세션</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedSessions}</div>
            <p className="text-xs text-muted-foreground">완료율 {analytics.progressRate}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScore}점</div>
            <p className="text-xs text-muted-foreground">지난 주 대비 +5점</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행률</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.progressRate}%</div>
            <Progress value={analytics.progressRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>주간 진행 상황</CardTitle>
            <CardDescription>최근 4주간의 훈련 성과</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.weeklyProgress.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{week.week}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={week.score} className="w-20" />
                    <span className="text-sm text-gray-600">{week.score}점</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>기능별 진행도</CardTitle>
            <CardDescription>각 훈련 영역별 성취도</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}</span>
                  </div>
                  <Progress value={skill.progress} />
                  <div className="text-right text-xs text-gray-500">
                    {skill.progress}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}