import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { X, Plus, Dog, Coffee, Utensils, MountainSnow, Moon } from 'lucide-react';
import { generateNotebookEntry } from '@/lib/notebook-ai';

export interface Activity {
  training?: string[];
  meal?: { time: string; description: string }[];
  potty?: { time: string; status: string }[];
  walk?: { duration: string; description: string }[];
  play?: string[];
  rest?: string[];
  other?: string[];
}

interface ActivityRecorderProps {
  petName: string;
  petBreed: string;
  onGenerateContent: (title: string, content: string) => void;
  onAddActivities: (activities: Activity) => void;
}

export default function ActivityRecorder({
  petName,
  petBreed,
  onGenerateContent,
  onAddActivities
}: ActivityRecorderProps) {
  const [activities, setActivities] = useState<Activity>({
    training: [],
    meal: [],
    potty: [],
    walk: [],
    play: [],
    rest: [],
    other: []
  });
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 훈련 활동 추가
  const [trainingInput, setTrainingInput] = useState('');
  const addTraining = () => {
    if (!trainingInput.trim()) return;
    setActivities(prev => ({
      ...prev,
      training: [...(prev.training || []), trainingInput]
    }));
    setTrainingInput('');
  };
  
  // 식사 활동 추가
  const [mealTime, setMealTime] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const addMeal = () => {
    if (!mealTime || !mealDescription.trim()) return;
    setActivities(prev => ({
      ...prev,
      meal: [...(prev.meal || []), { time: mealTime, description: mealDescription }]
    }));
    setMealTime('');
    setMealDescription('');
  };
  
  // 배변 활동 추가
  const [pottyTime, setPottyTime] = useState('');
  const [pottyStatus, setPottyStatus] = useState('');
  const addPotty = () => {
    if (!pottyTime || !pottyStatus) return;
    setActivities(prev => ({
      ...prev,
      potty: [...(prev.potty || []), { time: pottyTime, status: pottyStatus }]
    }));
    setPottyTime('');
    setPottyStatus('');
  };
  
  // 산책 활동 추가
  const [walkDuration, setWalkDuration] = useState('');
  const [walkDescription, setWalkDescription] = useState('');
  const addWalk = () => {
    if (!walkDuration || !walkDescription.trim()) return;
    setActivities(prev => ({
      ...prev,
      walk: [...(prev.walk || []), { duration: walkDuration, description: walkDescription }]
    }));
    setWalkDuration('');
    setWalkDescription('');
  };
  
  // 놀이 활동 추가
  const [playInput, setPlayInput] = useState('');
  const addPlay = () => {
    if (!playInput.trim()) return;
    setActivities(prev => ({
      ...prev,
      play: [...(prev.play || []), playInput]
    }));
    setPlayInput('');
  };
  
  // 휴식 활동 추가
  const [restInput, setRestInput] = useState('');
  const addRest = () => {
    if (!restInput.trim()) return;
    setActivities(prev => ({
      ...prev,
      rest: [...(prev.rest || []), restInput]
    }));
    setRestInput('');
  };
  
  // 기타 활동 추가
  const [otherInput, setOtherInput] = useState('');
  const addOther = () => {
    if (!otherInput.trim()) return;
    setActivities(prev => ({
      ...prev,
      other: [...(prev.other || []), otherInput]
    }));
    setOtherInput('');
  };
  
  // 활동 제거
  const removeActivity = (type: keyof Activity, index: number) => {
    setActivities(prev => {
      const updated = { ...prev };
      if (updated[type]) {
        (updated[type] as any[]).splice(index, 1);
      }
      return updated;
    });
  };
  
  // AI를 사용하여 알림장 생성
  const generateEntry = async () => {
    setIsGenerating(true);
    try {
      const result = await generateNotebookEntry(
        petName,
        petBreed,
        activities,
        additionalNotes
      );
      
      onGenerateContent(result.title, result.content);
      onAddActivities(activities);
    } catch (error) {
      console.error('알림장 생성 오류:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 모든 입력 초기화
  const resetAll = () => {
    setActivities({
      training: [],
      meal: [],
      potty: [],
      walk: [],
      play: [],
      rest: [],
      other: []
    });
    setAdditionalNotes('');
  };
  
  // 활동 목록 표시
  const renderActivityList = (type: keyof Activity, icon: React.ReactNode, label: string) => {
    const items = activities[type] as any[];
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mt-2">
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-1">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {typeof item === 'string' ? (
                <span>{item}</span>
              ) : 'time' in item && 'description' in item ? (
                <span>{item.time} - {item.description}</span>
              ) : 'time' in item && 'status' in item ? (
                <span>{item.time} - {item.status}</span>
              ) : 'duration' in item && 'description' in item ? (
                <span>{item.duration} - {item.description}</span>
              ) : (
                <span>{JSON.stringify(item)}</span>
              )}
              <button
                type="button"
                onClick={() => removeActivity(type, index)}
                className="ml-1 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">활동 기록</h3>
      
      <Accordion type="multiple" defaultValue={['training', 'meal', 'potty', 'walk']}>
        {/* 훈련 섹션 */}
        <AccordionItem value="training">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Dog className="h-4 w-4" />
              <span>훈련 활동</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {renderActivityList('training', <Dog className="h-4 w-4" />, '추가된 훈련')}
              <div className="flex gap-2">
                <Input
                  placeholder="훈련 내용을 입력하세요"
                  value={trainingInput}
                  onChange={(e) => setTrainingInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTraining()}
                />
                <Button type="button" size="sm" onClick={addTraining}>추가</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* 식사 섹션 */}
        <AccordionItem value="meal">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span>식사 기록</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {renderActivityList('meal', <Utensils className="h-4 w-4" />, '추가된 식사')}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <Select value={mealTime} onValueChange={setMealTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="시간" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="아침">아침</SelectItem>
                        <SelectItem value="점심">점심</SelectItem>
                        <SelectItem value="저녁">저녁</SelectItem>
                        <SelectItem value="간식">간식</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="식사 내용"
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                  />
                  <Button type="button" size="sm" onClick={addMeal}>추가</Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* 배변 섹션 */}
        <AccordionItem value="potty">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              <span>배변 기록</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {renderActivityList('potty', <Coffee className="h-4 w-4" />, '추가된 배변')}
              <div className="flex gap-2">
                <div className="w-1/3">
                  <Input
                    type="time"
                    placeholder="시간"
                    value={pottyTime}
                    onChange={(e) => setPottyTime(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Select value={pottyStatus} onValueChange={setPottyStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="정상">정상</SelectItem>
                      <SelectItem value="설사">설사</SelectItem>
                      <SelectItem value="변비">변비</SelectItem>
                      <SelectItem value="소변">소변</SelectItem>
                      <SelectItem value="실내배변">실내배변</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" size="sm" onClick={addPotty}>추가</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* 산책 섹션 */}
        <AccordionItem value="walk">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <MountainSnow className="h-4 w-4" />
              <span>산책 기록</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {renderActivityList('walk', <MountainSnow className="h-4 w-4" />, '추가된 산책')}
              <div className="flex gap-2">
                <div className="w-1/3">
                  <Select value={walkDuration} onValueChange={setWalkDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="시간" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10분">10분</SelectItem>
                      <SelectItem value="15분">15분</SelectItem>
                      <SelectItem value="20분">20분</SelectItem>
                      <SelectItem value="30분">30분</SelectItem>
                      <SelectItem value="45분">45분</SelectItem>
                      <SelectItem value="1시간">1시간</SelectItem>
                      <SelectItem value="1시간 이상">1시간 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="산책 내용"
                  value={walkDescription}
                  onChange={(e) => setWalkDescription(e.target.value)}
                />
                <Button type="button" size="sm" onClick={addWalk}>추가</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* 놀이 섹션 */}
        <AccordionItem value="play">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>놀이 활동</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {renderActivityList('play', <Plus className="h-4 w-4" />, '추가된 놀이')}
              <div className="flex gap-2">
                <Input
                  placeholder="놀이 내용"
                  value={playInput}
                  onChange={(e) => setPlayInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlay()}
                />
                <Button type="button" size="sm" onClick={addPlay}>추가</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* 휴식 섹션 */}
        <AccordionItem value="rest">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>휴식</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {renderActivityList('rest', <Moon className="h-4 w-4" />, '추가된 휴식')}
              <div className="flex gap-2">
                <Input
                  placeholder="휴식 내용"
                  value={restInput}
                  onChange={(e) => setRestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRest()}
                />
                <Button type="button" size="sm" onClick={addRest}>추가</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* 기타 섹션 */}
        <AccordionItem value="other">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>기타 활동</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {renderActivityList('other', <Plus className="h-4 w-4" />, '추가된 기타 활동')}
              <div className="flex gap-2">
                <Input
                  placeholder="활동 내용"
                  value={otherInput}
                  onChange={(e) => setOtherInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addOther()}
                />
                <Button type="button" size="sm" onClick={addOther}>추가</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-4">
        <Label htmlFor="additionalNotes">추가 메모</Label>
        <Textarea
          id="additionalNotes"
          placeholder="추가 메모를 입력하세요"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={resetAll}
        >
          초기화
        </Button>
        <Button
          type="button"
          onClick={generateEntry}
          disabled={isGenerating}
        >
          {isGenerating ? '생성 중...' : 'AI로 알림장 작성'}
        </Button>
      </div>
    </div>
  );
}