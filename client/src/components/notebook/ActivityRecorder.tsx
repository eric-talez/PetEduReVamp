import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Plus,
  Trash2,
  UtensilsCrossed,
  Bone,
  Footprints,
  Wine,
  Dumbbell,
  Moon,
  Timer,
  Clock,
  Edit3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Activity {
  meal?: { time: string; description: string }[];
  potty?: { time: string; status: string }[];
  walk?: { duration: string; description: string }[];
  training?: string[];
  play?: string[];
  rest?: string[];
  other?: string[];
}

interface ActivityRecorderProps {
  value: Activity;
  onChange: (value: Activity) => void;
}

export default function ActivityRecorder({ value, onChange }: ActivityRecorderProps) {
  const [activeTab, setActiveTab] = useState<string>('meal');
  
  // 식사 입력 상태
  const [mealTime, setMealTime] = useState<string>('');
  const [mealDesc, setMealDesc] = useState<string>('');
  
  // 배변 입력 상태
  const [pottyTime, setPottyTime] = useState<string>('');
  const [pottyStatus, setPottyStatus] = useState<string>('');
  
  // 산책 입력 상태
  const [walkDuration, setWalkDuration] = useState<string>('');
  const [walkDesc, setWalkDesc] = useState<string>('');
  
  // 훈련, 놀이, 휴식, 기타 입력 상태
  const [simpleActivity, setSimpleActivity] = useState<string>('');
  
  // 간편 입력 메뉴 선택
  const handleQuickAdd = (type: string, content: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    switch (type) {
      case 'meal':
        addMeal({ time: timeStr, description: content });
        break;
      case 'potty':
        addPotty({ time: timeStr, status: content });
        break;
      case 'walk':
        addWalk({ duration: '30분', description: content });
        break;
      case 'training':
        addSimpleActivity('training', content);
        break;
      case 'play':
        addSimpleActivity('play', content);
        break;
      case 'rest':
        addSimpleActivity('rest', content);
        break;
      case 'other':
        addSimpleActivity('other', content);
        break;
    }
  };

  // 식사 추가
  const addMeal = (item: { time: string; description: string }) => {
    if (!item.time || !item.description) return;
    
    const newValue = { ...value };
    newValue.meal = [...(newValue.meal || []), item];
    onChange(newValue);
    
    // 입력 필드 초기화
    setMealTime('');
    setMealDesc('');
  };
  
  // 식사 제거
  const removeMeal = (index: number) => {
    if (!value.meal) return;
    
    const newValue = { ...value };
    newValue.meal = newValue.meal.filter((_, i) => i !== index);
    onChange(newValue);
  };
  
  // 배변 추가
  const addPotty = (item: { time: string; status: string }) => {
    if (!item.time || !item.status) return;
    
    const newValue = { ...value };
    newValue.potty = [...(newValue.potty || []), item];
    onChange(newValue);
    
    // 입력 필드 초기화
    setPottyTime('');
    setPottyStatus('');
  };
  
  // 배변 제거
  const removePotty = (index: number) => {
    if (!value.potty) return;
    
    const newValue = { ...value };
    newValue.potty = newValue.potty.filter((_, i) => i !== index);
    onChange(newValue);
  };
  
  // 산책 추가
  const addWalk = (item: { duration: string; description: string }) => {
    if (!item.duration || !item.description) return;
    
    const newValue = { ...value };
    newValue.walk = [...(newValue.walk || []), item];
    onChange(newValue);
    
    // 입력 필드 초기화
    setWalkDuration('');
    setWalkDesc('');
  };
  
  // 산책 제거
  const removeWalk = (index: number) => {
    if (!value.walk) return;
    
    const newValue = { ...value };
    newValue.walk = newValue.walk.filter((_, i) => i !== index);
    onChange(newValue);
  };
  
  // 단순 활동 추가 (훈련, 놀이, 휴식, 기타)
  const addSimpleActivity = (type: 'training' | 'play' | 'rest' | 'other', text: string) => {
    if (!text) return;
    
    const newValue = { ...value };
    newValue[type] = [...(newValue[type] || []), text];
    onChange(newValue);
    
    // 입력 필드 초기화
    setSimpleActivity('');
  };
  
  // 단순 활동 제거
  const removeSimpleActivity = (type: 'training' | 'play' | 'rest' | 'other', index: number) => {
    if (!value[type]) return;
    
    const newValue = { ...value };
    newValue[type] = newValue[type]?.filter((_, i) => i !== index);
    onChange(newValue);
  };

  // 현재 시간 설정
  const setCurrentTime = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setter(timeStr);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Edit3 className="w-5 h-5 mr-2" /> 활동 기록
        </CardTitle>
        <CardDescription>오늘 반려견의 활동을 기록해주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="meal" className="flex items-center">
              <UtensilsCrossed className="w-4 h-4 mr-2" /> 식사
            </TabsTrigger>
            <TabsTrigger value="potty" className="flex items-center">
              <Bone className="w-4 h-4 mr-2" /> 배변
            </TabsTrigger>
            <TabsTrigger value="walk" className="flex items-center">
              <Footprints className="w-4 h-4 mr-2" /> 산책
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center">
              <Plus className="w-4 h-4 mr-2" /> 기타
            </TabsTrigger>
          </TabsList>
          
          {/* 식사 탭 */}
          <TabsContent value="meal" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex space-x-2">
                <div className="flex flex-1 flex-col space-y-1">
                  <Label htmlFor="meal-time">시간</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="meal-time"
                      value={mealTime}
                      onChange={(e) => setMealTime(e.target.value)}
                      placeholder="09:00"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentTime(setMealTime)}
                      title="현재 시간"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col space-y-1">
                  <Label htmlFor="meal-desc">내용</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="meal-desc"
                      value={mealDesc}
                      onChange={(e) => setMealDesc(e.target.value)}
                      placeholder="사료 100g"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addMeal({time: mealTime, description: mealDesc})}
                      disabled={!mealTime || !mealDesc}
                    >
                      <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('meal', '건사료 100g')}
                >
                  건사료 100g
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('meal', '생식 100g')}
                >
                  생식 100g
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('meal', '습식 캔 1/2개')}
                >
                  습식 캔 1/2개
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('meal', '간식')}
                >
                  간식
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('meal', '물')}
                >
                  물
                </Button>
              </div>
              
              {/* 추가된 식사 목록 */}
              {value.meal && value.meal.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">추가된 식사</h4>
                  <div className="space-y-2">
                    {value.meal.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                        <div>
                          <span className="font-medium">{item.time}</span> - {item.description}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMeal(index)}
                          className="h-6 w-6 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* 배변 탭 */}
          <TabsContent value="potty" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex space-x-2">
                <div className="flex-1 flex flex-col space-y-1">
                  <Label htmlFor="potty-time">시간</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="potty-time"
                      value={pottyTime}
                      onChange={(e) => setPottyTime(e.target.value)}
                      placeholder="09:00"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentTime(setPottyTime)}
                      title="현재 시간"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col space-y-1">
                  <Label htmlFor="potty-status">상태</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="potty-status"
                      value={pottyStatus}
                      onChange={(e) => setPottyStatus(e.target.value)}
                      placeholder="대변"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addPotty({time: pottyTime, status: pottyStatus})}
                      disabled={!pottyTime || !pottyStatus}
                    >
                      <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('potty', '대변 (정상)')}
                >
                  대변 (정상)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('potty', '대변 (이상)')}
                >
                  대변 (이상)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('potty', '소변 (정상)')}
                >
                  소변 (정상)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('potty', '소변 (이상)')}
                >
                  소변 (이상)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('potty', '실내 배변')}
                >
                  실내 배변
                </Button>
              </div>
              
              {/* 추가된 배변 목록 */}
              {value.potty && value.potty.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">추가된 배변 기록</h4>
                  <div className="space-y-2">
                    {value.potty.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                        <div>
                          <span className="font-medium">{item.time}</span> - {item.status}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePotty(index)}
                          className="h-6 w-6 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* 산책 탭 */}
          <TabsContent value="walk" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex space-x-2">
                <div className="flex-1 flex flex-col space-y-1">
                  <Label htmlFor="walk-duration">시간</Label>
                  <Input
                    id="walk-duration"
                    value={walkDuration}
                    onChange={(e) => setWalkDuration(e.target.value)}
                    placeholder="30분"
                    className="flex-1"
                  />
                </div>
                <div className="flex-1 flex flex-col space-y-1">
                  <Label htmlFor="walk-desc">내용</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="walk-desc"
                      value={walkDesc}
                      onChange={(e) => setWalkDesc(e.target.value)}
                      placeholder="공원 산책"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addWalk({duration: walkDuration, description: walkDesc})}
                      disabled={!walkDuration || !walkDesc}
                    >
                      <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('walk', '공원 산책')}
                >
                  공원 산책
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('walk', '주변 간단 산책')}
                >
                  주변 간단 산책
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('walk', '강가 산책')}
                >
                  강가 산책
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd('walk', '도그 카페 방문')}
                >
                  도그 카페 방문
                </Button>
              </div>
              
              {/* 추가된 산책 목록 */}
              {value.walk && value.walk.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">추가된 산책 기록</h4>
                  <div className="space-y-2">
                    {value.walk.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                        <div>
                          <span className="font-medium">{item.duration}</span> - {item.description}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeWalk(index)}
                          className="h-6 w-6 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* 기타 활동 탭 */}
          <TabsContent value="other" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Tabs defaultValue="training" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="training" className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2" /> 훈련
                  </TabsTrigger>
                  <TabsTrigger value="play" className="flex items-center">
                    <Wine className="w-4 h-4 mr-2" /> 놀이
                  </TabsTrigger>
                  <TabsTrigger value="rest" className="flex items-center">
                    <Moon className="w-4 h-4 mr-2" /> 휴식
                  </TabsTrigger>
                  <TabsTrigger value="other-misc" className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> 기타
                  </TabsTrigger>
                </TabsList>
                
                {/* 훈련 탭 내용 */}
                <TabsContent value="training" className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={simpleActivity}
                      onChange={(e) => setSimpleActivity(e.target.value)}
                      placeholder="앉아 훈련"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSimpleActivity('training', simpleActivity)}
                      disabled={!simpleActivity}
                    >
                      <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('training', '앉아 훈련')}
                    >
                      앉아 훈련
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('training', '기다려 훈련')}
                    >
                      기다려 훈련
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('training', '손 훈련')}
                    >
                      손 훈련
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('training', '집중력 훈련')}
                    >
                      집중력 훈련
                    </Button>
                  </div>
                  
                  {/* 추가된 훈련 목록 */}
                  {value.training && value.training.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">추가된 훈련</h4>
                      <div className="flex flex-wrap gap-2">
                        {value.training.map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSimpleActivity('training', index)}
                              className="h-4 w-4 ml-1 p-0 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* 놀이 탭 내용 */}
                <TabsContent value="play" className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={simpleActivity}
                      onChange={(e) => setSimpleActivity(e.target.value)}
                      placeholder="공 놀이"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSimpleActivity('play', simpleActivity)}
                      disabled={!simpleActivity}
                    >
                      <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('play', '공 놀이')}
                    >
                      공 놀이
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('play', '터그 놀이')}
                    >
                      터그 놀이
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('play', '인형 놀이')}
                    >
                      인형 놀이
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('play', '사회성 놀이')}
                    >
                      사회성 놀이
                    </Button>
                  </div>
                  
                  {/* 추가된 놀이 목록 */}
                  {value.play && value.play.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">추가된 놀이</h4>
                      <div className="flex flex-wrap gap-2">
                        {value.play.map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSimpleActivity('play', index)}
                              className="h-4 w-4 ml-1 p-0 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* 휴식 탭 내용 */}
                <TabsContent value="rest" className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={simpleActivity}
                      onChange={(e) => setSimpleActivity(e.target.value)}
                      placeholder="오전 낮잠"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSimpleActivity('rest', simpleActivity)}
                      disabled={!simpleActivity}
                    >
                      <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('rest', '오전 낮잠')}
                    >
                      오전 낮잠
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('rest', '오후 낮잠')}
                    >
                      오후 낮잠
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('rest', '밤 취침')}
                    >
                      밤 취침
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('rest', '휴식시간')}
                    >
                      휴식시간
                    </Button>
                  </div>
                  
                  {/* 추가된 휴식 목록 */}
                  {value.rest && value.rest.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">추가된 휴식</h4>
                      <div className="flex flex-wrap gap-2">
                        {value.rest.map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSimpleActivity('rest', index)}
                              className="h-4 w-4 ml-1 p-0 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* 기타 세부 탭 내용 */}
                <TabsContent value="other-misc" className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={simpleActivity}
                      onChange={(e) => setSimpleActivity(e.target.value)}
                      placeholder="특이사항 또는 기타 활동"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSimpleActivity('other', simpleActivity)}
                      disabled={!simpleActivity}
                    >
                      <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('other', '목욕')}
                    >
                      목욕
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('other', '약물 복용')}
                    >
                      약물 복용
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('other', '미용')}
                    >
                      미용
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd('other', '건강 체크')}
                    >
                      건강 체크
                    </Button>
                  </div>
                  
                  {/* 추가된 기타 목록 */}
                  {value.other && value.other.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">추가된 기타 활동</h4>
                      <div className="flex flex-wrap gap-2">
                        {value.other.map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSimpleActivity('other', index)}
                              className="h-4 w-4 ml-1 p-0 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          총 활동 수: {(
            (value.meal?.length || 0) +
            (value.potty?.length || 0) +
            (value.walk?.length || 0) +
            (value.training?.length || 0) +
            (value.play?.length || 0) +
            (value.rest?.length || 0) +
            (value.other?.length || 0)
          )}
        </div>
      </CardFooter>
    </Card>
  );
}