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
        <TabsList className="grid grid-cols-5 mb-4">
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
            <Coffee className="h-4 w-4" />
            <span className="text-xs">훈련</span>
          </TabsTrigger>
          <TabsTrigger value="play" className="flex flex-col items-center gap-1">
            <Play className="h-4 w-4" />
            <span className="text-xs">놀이</span>
          </TabsTrigger>
        </TabsList>
        
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
          
          <div className="mt-4">
            <Label htmlFor="training-custom">기타 훈련 내용</Label>
            <Input 
              id="training-custom"
              placeholder="추가 훈련 내용이 있다면 입력하세요"
              value={value.training?.custom || ''}
              onChange={(e) => handleTrainingChange('custom', e.target.value)}
              className="mt-1"
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
      </Tabs>
    </div>
  );
}