import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  CheckCircle2, 
  Coffee, 
  Footprints, 
  UtensilsCrossed, 
  Play, 
  Activity as ActivityIcon, 
  Heart, 
  Brain, 
  Users, 
  ThumbsUp
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// 집중력 평가 텍스트
const getConcentrationText = (value: number): string => {
  if (value >= 9) return '탁월함';
  if (value >= 7) return '우수함';
  if (value >= 5) return '양호함';
  if (value >= 3) return '산만함';
  return '매우 산만함';
};

// 훈련 진도 평가 텍스트
const getProgressText = (value: number): string => {
  if (value >= 9) return '완벽함';
  if (value >= 7) return '빠른 진전';
  if (value >= 5) return '진전 있음';
  if (value >= 3) return '느린 진전';
  return '진전 미미';
};

export interface Activity {
  meal?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
    snack?: boolean;
    water?: boolean;
    custom?: string;
    appetite?: 'excellent' | 'good' | 'normal' | 'poor' | 'none';
    foodType?: string;
  };
  potty?: {
    pee?: boolean;
    poop?: boolean;
    quality?: 'good' | 'normal' | 'bad';
    count?: number;
    color?: string;
    consistency?: 'firm' | 'normal' | 'soft' | 'loose' | 'watery';
  };
  walk?: {
    morning?: boolean;
    afternoon?: boolean;
    evening?: boolean;
    duration?: number; // 분 단위
    distance?: number; // 미터 단위
    leashBehavior?: 'excellent' | 'good' | 'normal' | 'poor';
    environment?: string[];
  };
  training?: {
    // 기본 명령어
    sit?: boolean;
    stay?: boolean;
    come?: boolean;
    down?: boolean;
    paw?: boolean;
    // 추가 명령어
    heel?: boolean;
    leave?: boolean;
    wait?: boolean;
    focus?: boolean;
    quiet?: boolean;
    stand?: boolean;
    roll?: boolean;
    custom?: string;
    // 훈련 평가
    concentration?: number;
    progress?: number; // 0-10
    notes?: string;
  };
  play?: {
    fetch?: boolean;
    tug?: boolean;
    chase?: boolean;
    puzzle?: boolean;
    custom?: string;
    duration?: number;
    enjoyment?: number; // 0-10
    intensity?: 'low' | 'medium' | 'high';
  };
  health?: {
    weight?: number;
    temperature?: number;
    appetite?: 'excellent' | 'good' | 'normal' | 'poor' | 'none';
    energy?: 'high' | 'normal' | 'low' | 'lethargic';
    hydration?: 'good' | 'normal' | 'concerning';
    coat?: 'shiny' | 'normal' | 'dull' | 'shedding';
    issues?: string[];
    notes?: string;
  };
  behavior?: {
    socialization?: {
      humanAdults?: number; // 0-10
      humanChildren?: number; // 0-10
      maleDogs?: number; // 0-10
      femaleDogs?: number; // 0-10
      otherAnimals?: number; // 0-10
    };
    reactivity?: 'none' | 'mild' | 'moderate' | 'severe';
    fearfulness?: 'none' | 'mild' | 'moderate' | 'severe';
    confidence?: number; // 0-10
    environSensitivity?: number; // 0-10
    notes?: string;
  };
  mood?: {
    overall?: 'extremely_happy' | 'happy' | 'content' | 'neutral' | 'anxious' | 'stressed' | 'tired' | 'excited'; 
    focus?: number; // 0-10
    calmness?: number; // 0-10
    notes?: string;
  };
}

interface ActivityRecorderProps {
  value: Activity;
  onChange: (value: Activity) => void;
  readOnly?: boolean;
}

export default function ActivityRecorder({
  value,
  onChange,
  readOnly = false
}: ActivityRecorderProps) {
  const [activeTab, setActiveTab] = useState<string>('meal');

  const handleMealChange = (field: string, checked: boolean | string) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.meal) {
      newValue.meal = {};
    }
    
    if (field === 'custom' || field === 'foodType') {
      (newValue.meal as any)[field] = checked as string;
    } else if (field === 'appetite') {
      newValue.meal.appetite = checked as 'excellent' | 'good' | 'normal' | 'poor' | 'none';
    } else if (field === 'breakfast' || field === 'lunch' || field === 'dinner' || field === 'snack' || field === 'water') {
      (newValue.meal as any)[field] = checked as boolean;
    }
    
    onChange(newValue);
  };
  
  const handlePottyChange = (field: string, checked: boolean | string | number) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.potty) {
      newValue.potty = {};
    }
    
    if (field === 'quality') {
      newValue.potty.quality = checked as 'good' | 'normal' | 'bad';
    } else if (field === 'consistency') {
      newValue.potty.consistency = checked as 'firm' | 'normal' | 'soft' | 'loose' | 'watery';
    } else if (field === 'color') {
      newValue.potty.color = checked as string;
    } else if (field === 'count') {
      newValue.potty.count = checked as number;
    } else if (field === 'pee' || field === 'poop') {
      (newValue.potty as any)[field] = checked as boolean;
    }
    
    onChange(newValue);
  };
  
  const handleWalkChange = (field: string, checked: boolean | number | string | string[]) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.walk) {
      newValue.walk = {};
    }
    
    if (field === 'duration' || field === 'distance') {
      (newValue.walk as any)[field] = checked as number;
    } else if (field === 'leashBehavior') {
      newValue.walk.leashBehavior = checked as 'excellent' | 'good' | 'normal' | 'poor';
    } else if (field === 'environment') {
      newValue.walk.environment = checked as string[];
    } else if (field === 'morning' || field === 'afternoon' || field === 'evening') {
      (newValue.walk as any)[field] = checked as boolean;
    }
    
    onChange(newValue);
  };
  
  const handleTrainingChange = (field: string, checked: boolean | string | number) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.training) {
      newValue.training = {};
    }
    
    if (field === 'custom' || field === 'notes') {
      (newValue.training as any)[field] = checked as string;
    } else if (field === 'concentration' || field === 'progress') {
      (newValue.training as any)[field] = checked as number;
    } else if (
      field === 'sit' || field === 'stay' || field === 'come' || 
      field === 'down' || field === 'paw' || field === 'heel' || 
      field === 'leave' || field === 'wait' || field === 'focus' || 
      field === 'quiet' || field === 'stand' || field === 'roll'
    ) {
      (newValue.training as any)[field] = checked as boolean;
    }
    
    onChange(newValue);
  };
  
  const handlePlayChange = (field: string, checked: boolean | string | number) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.play) {
      newValue.play = {};
    }
    
    if (field === 'custom') {
      newValue.play.custom = checked as string;
    } else if (field === 'duration' || field === 'enjoyment') {
      (newValue.play as any)[field] = checked as number;
    } else if (field === 'intensity') {
      newValue.play.intensity = checked as 'low' | 'medium' | 'high';
    } else if (field === 'fetch' || field === 'tug' || field === 'chase' || field === 'puzzle') {
      (newValue.play as any)[field] = checked as boolean;
    }
    
    onChange(newValue);
  };
  
  const handleHealthChange = (field: string, checked: number | string | string[]) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.health) {
      newValue.health = {};
    }
    
    if (field === 'weight' || field === 'temperature') {
      (newValue.health as any)[field] = Number(checked);
    } else if (field === 'appetite') {
      newValue.health.appetite = checked as 'excellent' | 'good' | 'normal' | 'poor' | 'none';
    } else if (field === 'energy') {
      newValue.health.energy = checked as 'high' | 'normal' | 'low' | 'lethargic';
    } else if (field === 'hydration') {
      newValue.health.hydration = checked as 'good' | 'normal' | 'concerning';
    } else if (field === 'coat') {
      newValue.health.coat = checked as 'shiny' | 'normal' | 'dull' | 'shedding';
    } else if (field === 'issues') {
      newValue.health.issues = checked as string[];
    } else if (field === 'notes') {
      newValue.health.notes = checked as string;
    }
    
    onChange(newValue);
  };
  
  const handleBehaviorChange = (field: string, checked: string | number) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.behavior) {
      newValue.behavior = {};
    }
    
    if (field === 'reactivity') {
      newValue.behavior.reactivity = checked as 'none' | 'mild' | 'moderate' | 'severe';
    } else if (field === 'fearfulness') {
      newValue.behavior.fearfulness = checked as 'none' | 'mild' | 'moderate' | 'severe';
    } else if (field === 'confidence' || field === 'environSensitivity') {
      (newValue.behavior as any)[field] = Number(checked);
    } else if (field === 'notes') {
      newValue.behavior.notes = checked as string;
    } else if (field.startsWith('social-')) {
      // 사회성 하위 항목 처리
      const socialField = field.replace('social-', '');
      if (!newValue.behavior.socialization) {
        newValue.behavior.socialization = {};
      }
      (newValue.behavior.socialization as any)[socialField] = Number(checked);
    }
    
    onChange(newValue);
  };
  
  const handleMoodChange = (field: string, checked: string | number) => {
    if (readOnly) return;
    
    const newValue = { ...value };
    if (!newValue.mood) {
      newValue.mood = {};
    }
    
    if (field === 'overall') {
      newValue.mood.overall = checked as 'extremely_happy' | 'happy' | 'content' | 'neutral' | 'anxious' | 'stressed' | 'tired' | 'excited';
    } else if (field === 'focus' || field === 'calmness') {
      (newValue.mood as any)[field] = Number(checked);
    } else if (field === 'notes') {
      newValue.mood.notes = checked as string;
    }
    
    onChange(newValue);
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-4">오늘의 활동</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="meal" className="flex flex-col items-center gap-1">
              <UtensilsCrossed className="h-4 w-4" />
              <span className="text-xs">식사</span>
            </TabsTrigger>
            <TabsTrigger value="potty" className="flex flex-col items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">배변</span>
            </TabsTrigger>
            <TabsTrigger value="walk" className="flex flex-col items-center gap-1">
              <Footprints className="h-4 w-4" />
              <span className="text-xs">산책</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex flex-col items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="text-xs">훈련</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="play" className="flex flex-col items-center gap-1">
              <Play className="h-4 w-4" />
              <span className="text-xs">놀이</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex flex-col items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">건강</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex flex-col items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">행동</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex flex-col items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-xs">감정</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="meal" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="meal-breakfast"
                checked={value.meal?.breakfast || false}
                onCheckedChange={(checked) => handleMealChange('breakfast', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="meal-breakfast">아침</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="meal-lunch"
                checked={value.meal?.lunch || false}
                onCheckedChange={(checked) => handleMealChange('lunch', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="meal-lunch">점심</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="meal-dinner"
                checked={value.meal?.dinner || false}
                onCheckedChange={(checked) => handleMealChange('dinner', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="meal-dinner">저녁</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="meal-snack"
                checked={value.meal?.snack || false}
                onCheckedChange={(checked) => handleMealChange('snack', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="meal-snack">간식</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="meal-water"
                checked={value.meal?.water || false}
                onCheckedChange={(checked) => handleMealChange('water', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="meal-water">물</Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="meal-custom">기타 식사 내용</Label>
            <Input 
              id="meal-custom"
              placeholder="특별한 식사 내용이 있다면 입력하세요"
              value={value.meal?.custom || ''}
              onChange={(e) => handleMealChange('custom', e.target.value)}
              className="mt-1"
              disabled={readOnly}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="potty" className="mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="potty-pee"
                checked={value.potty?.pee || false}
                onCheckedChange={(checked) => handlePottyChange('pee', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="potty-pee">소변</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="potty-poop"
                checked={value.potty?.poop || false}
                onCheckedChange={(checked) => handlePottyChange('poop', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="potty-poop">대변</Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="potty-quality">상태</Label>
            <Select
              value={value.potty?.quality || 'normal'}
              onValueChange={(val) => handlePottyChange('quality', val)}
              disabled={readOnly}
            >
              <SelectTrigger id="potty-quality" className="mt-1">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">좋음</SelectItem>
                <SelectItem value="normal">보통</SelectItem>
                <SelectItem value="bad">나쁨</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            <Label>횟수: {value.potty?.count || 0}회</Label>
            <Slider
              value={[value.potty?.count || 0]}
              min={0}
              max={10}
              step={1}
              onValueChange={(val) => handlePottyChange('count', val[0])}
              className="mt-2"
              disabled={readOnly}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="walk" className="mt-0">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="walk-morning"
                checked={value.walk?.morning || false}
                onCheckedChange={(checked) => handleWalkChange('morning', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="walk-morning">아침</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="walk-afternoon"
                checked={value.walk?.afternoon || false}
                onCheckedChange={(checked) => handleWalkChange('afternoon', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="walk-afternoon">오후</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="walk-evening"
                checked={value.walk?.evening || false}
                onCheckedChange={(checked) => handleWalkChange('evening', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="walk-evening">저녁</Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Label>시간: {value.walk?.duration || 0}분</Label>
            <Slider
              value={[value.walk?.duration || 0]}
              min={0}
              max={120}
              step={5}
              onValueChange={(val) => handleWalkChange('duration', val[0])}
              className="mt-2"
              disabled={readOnly}
            />
          </div>
          
          <div className="mt-4">
            <Label>거리: {value.walk?.distance ? (value.walk.distance / 1000).toFixed(1) : 0}km</Label>
            <Slider
              value={[value.walk?.distance || 0]}
              min={0}
              max={5000}
              step={100}
              onValueChange={(val) => handleWalkChange('distance', val[0])}
              className="mt-2"
              disabled={readOnly}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="mt-0">
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">기본 명령어</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-sit"
                  checked={value.training?.sit || false}
                  onCheckedChange={(checked) => handleTrainingChange('sit', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-sit">앉아</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-stay"
                  checked={value.training?.stay || false}
                  onCheckedChange={(checked) => handleTrainingChange('stay', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-stay">기다려</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-come"
                  checked={value.training?.come || false}
                  onCheckedChange={(checked) => handleTrainingChange('come', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-come">이리와</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-down"
                  checked={value.training?.down || false}
                  onCheckedChange={(checked) => handleTrainingChange('down', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-down">엎드려</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-paw"
                  checked={value.training?.paw || false}
                  onCheckedChange={(checked) => handleTrainingChange('paw', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-paw">손</Label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">고급 명령어</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-heel"
                  checked={value.training?.heel || false}
                  onCheckedChange={(checked) => handleTrainingChange('heel', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-heel">발 따라</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-leave"
                  checked={value.training?.leave || false}
                  onCheckedChange={(checked) => handleTrainingChange('leave', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-leave">놔줘</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-wait"
                  checked={value.training?.wait || false}
                  onCheckedChange={(checked) => handleTrainingChange('wait', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-wait">기다려</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-focus"
                  checked={value.training?.focus || false}
                  onCheckedChange={(checked) => handleTrainingChange('focus', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-focus">집중</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-quiet"
                  checked={value.training?.quiet || false}
                  onCheckedChange={(checked) => handleTrainingChange('quiet', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-quiet">조용히</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-stand"
                  checked={value.training?.stand || false}
                  onCheckedChange={(checked) => handleTrainingChange('stand', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-stand">서</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training-roll"
                  checked={value.training?.roll || false}
                  onCheckedChange={(checked) => handleTrainingChange('roll', !!checked)}
                  disabled={readOnly}
                />
                <Label htmlFor="training-roll">구르기</Label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">훈련 평가</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between">
                  <Label>집중력: {value.training?.concentration || 0}/10</Label>
                  <span className="text-xs text-muted-foreground">{getConcentrationText(value.training?.concentration || 0)}</span>
                </div>
                <Slider
                  value={[value.training?.concentration || 0]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(val) => handleTrainingChange('concentration', val[0])}
                  className="mt-2"
                  disabled={readOnly}
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label>훈련 진도: {value.training?.progress || 0}/10</Label>
                  <span className="text-xs text-muted-foreground">{getProgressText(value.training?.progress || 0)}</span>
                </div>
                <Slider
                  value={[value.training?.progress || 0]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(val) => handleTrainingChange('progress', val[0])}
                  className="mt-2"
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="training-custom">기타 훈련 내용</Label>
            <Input 
              id="training-custom"
              placeholder="추가 훈련 내용이 있다면 입력하세요"
              value={value.training?.custom || ''}
              onChange={(e) => handleTrainingChange('custom', e.target.value)}
              className="mt-1 mb-2"
              disabled={readOnly}
            />
          </div>
          
          <div>
            <Label htmlFor="training-notes">훈련 관찰 기록</Label>
            <Textarea 
              id="training-notes"
              placeholder="훈련 중 개의 행동, 학습 상태, 문제점 등을 적어주세요"
              value={value.training?.notes || ''}
              onChange={(e) => handleTrainingChange('notes', e.target.value)}
              className="mt-1 min-h-[80px]"
              disabled={readOnly}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="play" className="mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="play-fetch"
                checked={value.play?.fetch || false}
                onCheckedChange={(checked) => handlePlayChange('fetch', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="play-fetch">물건 가져오기</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="play-tug"
                checked={value.play?.tug || false}
                onCheckedChange={(checked) => handlePlayChange('tug', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="play-tug">터그놀이</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="play-chase"
                checked={value.play?.chase || false}
                onCheckedChange={(checked) => handlePlayChange('chase', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="play-chase">쫓기 놀이</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="play-puzzle"
                checked={value.play?.puzzle || false}
                onCheckedChange={(checked) => handlePlayChange('puzzle', !!checked)}
                disabled={readOnly}
              />
              <Label htmlFor="play-puzzle">퍼즐 장난감</Label>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div>
              <Label>놀이 시간: {value.play?.duration || 0}분</Label>
              <Slider
                value={[value.play?.duration || 0]}
                min={0}
                max={60}
                step={5}
                onValueChange={(val) => handlePlayChange('duration', val[0])}
                className="mt-2"
                disabled={readOnly}
              />
            </div>
            
            <div>
              <Label>즐거움 정도: {value.play?.enjoyment || 0}/10</Label>
              <Slider
                value={[value.play?.enjoyment || 0]}
                min={0}
                max={10}
                step={1}
                onValueChange={(val) => handlePlayChange('enjoyment', val[0])}
                className="mt-2"
                disabled={readOnly}
              />
            </div>
            
            <div className="mt-4">
              <Label htmlFor="play-intensity">활동 강도</Label>
              <Select
                value={value.play?.intensity || 'medium'}
                onValueChange={(val) => handlePlayChange('intensity', val)}
                disabled={readOnly}
              >
                <SelectTrigger id="play-intensity" className="mt-1">
                  <SelectValue placeholder="활동 강도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">낮음 (편안한 활동)</SelectItem>
                  <SelectItem value="medium">중간 (일반적인 활동)</SelectItem>
                  <SelectItem value="high">높음 (격렬한 활동)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="play-custom">기타 놀이 내용</Label>
            <Input 
              id="play-custom"
              placeholder="추가 놀이 내용이 있다면 입력하세요"
              value={value.play?.custom || ''}
              onChange={(e) => handlePlayChange('custom', e.target.value)}
              className="mt-1"
              disabled={readOnly}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="mt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="health-weight">체중 (kg)</Label>
                <Input 
                  id="health-weight"
                  type="number"
                  value={value.health?.weight || ''}
                  onChange={(e) => handleHealthChange('weight', e.target.value)}
                  className="mt-1"
                  disabled={readOnly}
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <Label htmlFor="health-temperature">체온 (°C)</Label>
                <Input 
                  id="health-temperature"
                  type="number"
                  value={value.health?.temperature || ''}
                  onChange={(e) => handleHealthChange('temperature', e.target.value)}
                  className="mt-1"
                  disabled={readOnly}
                  min={35}
                  max={42}
                  step={0.1}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="health-appetite">식욕</Label>
                <Select
                  value={value.health?.appetite || 'normal'}
                  onValueChange={(val) => handleHealthChange('appetite', val)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="health-appetite" className="mt-1">
                    <SelectValue placeholder="식욕 상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">매우 좋음 (평소보다 적극적)</SelectItem>
                    <SelectItem value="good">좋음 (건강한 식욕)</SelectItem>
                    <SelectItem value="normal">보통 (일반적인 식사량)</SelectItem>
                    <SelectItem value="poor">저하됨 (식사량 감소)</SelectItem>
                    <SelectItem value="none">매우 저하됨 (거의 먹지 않음)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="health-energy">에너지 수준</Label>
                <Select
                  value={value.health?.energy || 'normal'}
                  onValueChange={(val) => handleHealthChange('energy', val)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="health-energy" className="mt-1">
                    <SelectValue placeholder="에너지 수준 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">높음 (매우 활동적)</SelectItem>
                    <SelectItem value="normal">보통 (적절한 활동량)</SelectItem>
                    <SelectItem value="low">낮음 (평소보다 활동 감소)</SelectItem>
                    <SelectItem value="lethargic">기력 없음 (거의 움직이지 않음)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="health-hydration">수분 상태</Label>
                <Select
                  value={value.health?.hydration || 'normal'}
                  onValueChange={(val) => handleHealthChange('hydration', val)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="health-hydration" className="mt-1">
                    <SelectValue placeholder="수분 상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">좋음 (충분히 수분 섭취)</SelectItem>
                    <SelectItem value="normal">보통 (적절한 수분 상태)</SelectItem>
                    <SelectItem value="concerning">걱정됨 (탈수 징후)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="health-coat">모발 상태</Label>
                <Select
                  value={value.health?.coat || 'normal'}
                  onValueChange={(val) => handleHealthChange('coat', val)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="health-coat" className="mt-1">
                    <SelectValue placeholder="모발 상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shiny">윤기 있음 (매우 건강)</SelectItem>
                    <SelectItem value="normal">정상 (건강한 상태)</SelectItem>
                    <SelectItem value="dull">칙칙함 (윤기 없음)</SelectItem>
                    <SelectItem value="shedding">과도한 탈모</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="health-notes">건강 관찰 사항</Label>
              <Textarea 
                id="health-notes"
                placeholder="건강 상태 관련 관찰 사항을 적어주세요"
                value={value.health?.notes || ''}
                onChange={(e) => handleHealthChange('notes', e.target.value)}
                className="mt-1 min-h-[80px]"
                disabled={readOnly}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior" className="mt-0">
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold mb-3">사회성 평가</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between">
                    <Label>성인과의 상호작용: {value.behavior?.socialization?.humanAdults || 0}/10</Label>
                  </div>
                  <Slider
                    value={[value.behavior?.socialization?.humanAdults || 0]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(val) => handleBehaviorChange('social-humanAdults', val[0])}
                    className="mt-2"
                    disabled={readOnly}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>아이들과의 상호작용: {value.behavior?.socialization?.humanChildren || 0}/10</Label>
                  </div>
                  <Slider
                    value={[value.behavior?.socialization?.humanChildren || 0]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(val) => handleBehaviorChange('social-humanChildren', val[0])}
                    className="mt-2"
                    disabled={readOnly}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>수컷 강아지와의 상호작용: {value.behavior?.socialization?.maleDogs || 0}/10</Label>
                  </div>
                  <Slider
                    value={[value.behavior?.socialization?.maleDogs || 0]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(val) => handleBehaviorChange('social-maleDogs', val[0])}
                    className="mt-2"
                    disabled={readOnly}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>암컷 강아지와의 상호작용: {value.behavior?.socialization?.femaleDogs || 0}/10</Label>
                  </div>
                  <Slider
                    value={[value.behavior?.socialization?.femaleDogs || 0]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(val) => handleBehaviorChange('social-femaleDogs', val[0])}
                    className="mt-2"
                    disabled={readOnly}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>다른 동물과의 상호작용: {value.behavior?.socialization?.otherAnimals || 0}/10</Label>
                  </div>
                  <Slider
                    value={[value.behavior?.socialization?.otherAnimals || 0]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(val) => handleBehaviorChange('social-otherAnimals', val[0])}
                    className="mt-2"
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="behavior-reactivity">반응성</Label>
                <Select
                  value={value.behavior?.reactivity || 'none'}
                  onValueChange={(val) => handleBehaviorChange('reactivity', val)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="behavior-reactivity" className="mt-1">
                    <SelectValue placeholder="반응성 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">없음 (대부분의 자극에 침착)</SelectItem>
                    <SelectItem value="mild">약함 (일부 자극에 약간 반응)</SelectItem>
                    <SelectItem value="moderate">중간 (여러 자극에 뚜렷한 반응)</SelectItem>
                    <SelectItem value="severe">강함 (많은 자극에 강한 반응)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="behavior-fearfulness">두려움</Label>
                <Select
                  value={value.behavior?.fearfulness || 'none'}
                  onValueChange={(val) => handleBehaviorChange('fearfulness', val)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="behavior-fearfulness" className="mt-1">
                    <SelectValue placeholder="두려움 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">없음 (자신감 있고 대담함)</SelectItem>
                    <SelectItem value="mild">약함 (간혹 신중하게 행동)</SelectItem>
                    <SelectItem value="moderate">중간 (새로운 환경에서 뚜렷한 불안)</SelectItem>
                    <SelectItem value="severe">강함 (대부분의 상황에서 두려워함)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <Label>자신감: {value.behavior?.confidence || 0}/10</Label>
                </div>
                <Slider
                  value={[value.behavior?.confidence || 0]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(val) => handleBehaviorChange('confidence', val[0])}
                  className="mt-2"
                  disabled={readOnly}
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label>환경 민감도: {value.behavior?.environSensitivity || 0}/10</Label>
                </div>
                <Slider
                  value={[value.behavior?.environSensitivity || 0]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(val) => handleBehaviorChange('environSensitivity', val[0])}
                  className="mt-2"
                  disabled={readOnly}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="behavior-notes">행동 관찰 기록</Label>
              <Textarea 
                id="behavior-notes"
                placeholder="반려견의 행동 특성, 주목할 만한 행동 패턴 등을 기록하세요"
                value={value.behavior?.notes || ''}
                onChange={(e) => handleBehaviorChange('notes', e.target.value)}
                className="mt-1 min-h-[80px]"
                disabled={readOnly}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mood" className="mt-0">
          <div className="space-y-5">
            <div>
              <Label htmlFor="mood-overall">전반적인 기분</Label>
              <Select
                value={value.mood?.overall || 'neutral'}
                onValueChange={(val) => handleMoodChange('overall', val)}
                disabled={readOnly}
              >
                <SelectTrigger id="mood-overall" className="mt-1">
                  <SelectValue placeholder="기분 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extremely_happy">매우 행복 (활기차고 열정적)</SelectItem>
                  <SelectItem value="happy">행복 (긍정적이고 반응 좋음)</SelectItem>
                  <SelectItem value="content">만족 (편안하고 평온함)</SelectItem>
                  <SelectItem value="neutral">보통 (특별한 감정 표현 없음)</SelectItem>
                  <SelectItem value="anxious">불안 (약간의 걱정이나 경계)</SelectItem>
                  <SelectItem value="stressed">스트레스 (뚜렷한 불안 징후)</SelectItem>
                  <SelectItem value="tired">피곤 (에너지가 낮고 졸려함)</SelectItem>
                  <SelectItem value="excited">흥분 (매우 활동적이고 주의력 산만)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <Label>집중력: {value.mood?.focus || 0}/10</Label>
                </div>
                <Slider
                  value={[value.mood?.focus || 0]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(val) => handleMoodChange('focus', val[0])}
                  className="mt-2"
                  disabled={readOnly}
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label>차분함: {value.mood?.calmness || 0}/10</Label>
                </div>
                <Slider
                  value={[value.mood?.calmness || 0]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(val) => handleMoodChange('calmness', val[0])}
                  className="mt-2"
                  disabled={readOnly}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="mood-notes">감정 상태 관찰</Label>
              <Textarea 
                id="mood-notes"
                placeholder="오늘의 감정 상태와 특이사항을 기록하세요"
                value={value.mood?.notes || ''}
                onChange={(e) => handleMoodChange('notes', e.target.value)}
                className="mt-1 min-h-[80px]"
                disabled={readOnly}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}