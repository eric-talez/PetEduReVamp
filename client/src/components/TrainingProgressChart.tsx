import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAIAnalysis, type TrainingProgress } from '@/hooks/useAIAnalysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrainingProgressChartProps {
  petId: number;
  petName: string;
}

export function TrainingProgressChart({ petId, petName }: TrainingProgressChartProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);
  const [progressData, setProgressData] = useState<TrainingProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getTrainingProgress } = useAIAnalysis();

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getTrainingProgress(petId, selectedCourseId);
        setProgressData(data);
      } catch (error: any) {
        console.error('훈련 진행 상황 조회 실패:', error);
        setError(error.message || '훈련 진행 상황을 가져오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [petId, selectedCourseId, getTrainingProgress]);

  // 그래프 데이터 준비
  const prepareChartData = (skill: TrainingProgress) => {
    return skill.history.map(item => ({
      date: item.date,
      점수: item.score,
      label: item.label
    }));
  };

  // 훈련 기술별 색상 매핑
  const getSkillColor = (index: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return colors[index % colors.length];
  };

  // 평균 진행률 계산
  const calculateAverage = () => {
    if (progressData.length === 0) return 0;
    const total = progressData.reduce((sum, skill) => sum + skill.progress, 0);
    return Math.round(total / progressData.length);
  };

  // 훈련 과정 이름 (샘플)
  const getCourseNameById = (courseId: number): string => {
    const courseNames: Record<number, string> = {
      1: '기초 훈련',
      2: '중급 훈련'
    };
    return courseNames[courseId] || `훈련 과정 ${courseId}`;
  };

  // 진행률에 따른 레벨 결정
  const getProgressLevel = (progress: number): {label: string, color: string} => {
    if (progress >= 80) return { label: '탁월함', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' };
    if (progress >= 60) return { label: '우수함', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' };
    if (progress >= 40) return { label: '보통', color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' };
    if (progress >= 20) return { label: '기초', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30' };
    return { label: '시작 단계', color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30' };
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">훈련 진행 현황</h2>
      
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{petName}의 훈련 그래프</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">시간에 따른 훈련 진행 상황을 확인하세요</p>
        </div>
        
        <div className="w-full md:w-64">
          <Select
            value={selectedCourseId?.toString() || "all"}
            onValueChange={(value) => setSelectedCourseId(value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="모든 훈련 과정" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 훈련 과정</SelectItem>
              <SelectItem value="1">기초 훈련</SelectItem>
              <SelectItem value="2">중급 훈련</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">훈련 데이터 로딩 중...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">데이터를 불러올 수 없습니다</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : progressData.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">훈련 데이터가 없습니다</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">아직 훈련 데이터가 기록되지 않았습니다. 훈련이 시작되면 여기에 진행 상황이 표시됩니다.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 종합 진행 상황 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>종합 훈련 진행률</CardTitle>
                  <CardDescription>
                    {selectedCourseId 
                      ? `${getCourseNameById(selectedCourseId)} 과정`
                      : '모든 훈련 과정'}
                  </CardDescription>
                </div>
                <Badge 
                  className={getProgressLevel(calculateAverage()).color} 
                  variant="outline"
                >
                  {getProgressLevel(calculateAverage()).label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">전체 평균 진행률</span>
                  <span className="text-sm font-bold">{calculateAverage()}%</span>
                </div>
                <Progress value={calculateAverage()} max={100} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {progressData.map((skill, index) => (
                    <div key={skill.skillId} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{skill.skillName}</h4>
                          <p className="text-xs text-gray-500">
                            {getCourseNameById(skill.courseId)}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getProgressLevel(skill.progress).color}
                        >
                          {skill.progress}%
                        </Badge>
                      </div>
                      <Progress 
                        value={skill.progress} 
                        max={100} 
                        className="h-1.5" 
                        style={{ backgroundColor: `${getSkillColor(index)}20`, '--progress-color': getSkillColor(index) } as any} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 세부 그래프 */}
          <Tabs defaultValue="combined" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="combined">종합 그래프</TabsTrigger>
              <TabsTrigger value="individual">개별 그래프</TabsTrigger>
            </TabsList>
            
            <TabsContent value="combined">
              <Card>
                <CardHeader>
                  <CardTitle>시간에 따른 훈련 진행 상황</CardTitle>
                  <CardDescription>모든 기술의 시간별 향상도를 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                        <XAxis
                          dataKey="date" 
                          domain={['dataMin', 'dataMax']}
                          tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          stroke="#9ca3af"
                        />
                        <YAxis domain={[0, 100]} stroke="#9ca3af" />
                        <Tooltip 
                          formatter={(value) => [`${value}점`, '']}
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Legend />
                        {progressData.map((skill, index) => (
                          <Line
                            key={skill.skillId}
                            data={prepareChartData(skill)}
                            type="monotone"
                            dataKey="점수"
                            name={skill.skillName}
                            stroke={getSkillColor(index)}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            connectNulls
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="individual">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progressData.map((skill, index) => (
                  <Card key={skill.skillId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{skill.skillName}</CardTitle>
                          <CardDescription>{getCourseNameById(skill.courseId)}</CardDescription>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getProgressLevel(skill.progress).color}
                        >
                          {skill.progress}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={prepareChartData(skill)}
                            margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              stroke="#9ca3af"
                            />
                            <YAxis domain={[0, 100]} stroke="#9ca3af" />
                            <Tooltip 
                              formatter={(value) => [`${value}점`, '']}
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            />
                            <Line
                              type="monotone"
                              dataKey="점수"
                              name={skill.skillName}
                              stroke={getSkillColor(index)}
                              activeDot={{ r: 6 }}
                              isAnimationActive={true}
                              connectNulls
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>
                          최근 30일 동안{' '}
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {skill.history.length > 2 ? Math.abs(skill.history[skill.history.length - 1].score - skill.history[0].score) : 0}%
                          </span>
                          {' '}향상되었습니다.
                        </span>
                      </div>
                      
                      {skill.progress >= 75 && (
                        <div className="flex items-center space-x-2 text-sm mt-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          <span>이 기술은 거의 완벽하게 습득되었습니다!</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}