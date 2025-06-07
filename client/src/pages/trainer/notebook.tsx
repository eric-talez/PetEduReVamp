import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  BookOpen, 
  PawPrint,
  Calendar,
  Clock,
  User,
  MapPin,
  Star,
  Edit,
  Eye,
  Send,
  FileText,
  Camera,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface NotebookEntry {
  id: string;
  date: string;
  petName: string;
  petId: string;
  ownerName: string;
  ownerId: string;
  title: string;
  content: string;
  activities: string[];
  mood: 'excellent' | 'good' | 'normal' | 'tired' | 'anxious';
  duration: number;
  location: string;
  photos: string[];
  nextGoals: string[];
  isRead: boolean;
  createdAt: string;
  // 새로 추가된 일상 관리 필드들
  mealTimes?: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: { time: string; type: string }[];
  };
  bathroomBreaks?: { time: string; type: 'urine' | 'feces' | 'both'; location: string }[];
  walkSchedule?: { time: string; duration: number; location: string; intensity: 'light' | 'moderate' | 'intense' }[];
}

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  ownerName: string;
  ownerId: string;
  avatar?: string;
}

export default function TrainerNotebookPage() {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<NotebookEntry | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 새 알림장 폼 상태
  const [newEntry, setNewEntry] = useState({
    petId: '',
    title: '',
    content: '',
    activities: [] as string[],
    mood: 'good' as NotebookEntry['mood'],
    duration: 60,
    location: 'PetEdu 훈련장',
    nextGoals: [] as string[],
    photos: [] as string[],
    // 새로 추가된 일상 관리 필드들
    mealTimes: {
      breakfast: '',
      lunch: '', 
      dinner: '',
      snacks: [] as { time: string; type: string }[]
    },
    bathroomBreaks: [] as { time: string; type: 'urine' | 'feces' | 'both'; location: string }[],
    walkSchedule: [] as { time: string; duration: number; location: string; intensity: 'light' | 'moderate' | 'intense' }[]
  });

  // 기분 이모지 매핑
  const moodEmojis = {
    excellent: '😊',
    good: '🙂',
    normal: '😐',
    tired: '😴',
    anxious: '😰'
  };

  const moodLabels = {
    excellent: '최고',
    good: '좋음',
    normal: '보통',
    tired: '피곤',
    anxious: '불안'
  };

  // 활동 옵션
  const activityOptions = [
    '기본 명령어', '리드줄 훈련', '사회화 훈련', '공 던지기', '터그놀이',
    '배변 훈련', '행동 교정', '놀이 훈련', '민첩성 훈련', '산책 훈련'
  ];

  // 샘플 데이터 로드
  useEffect(() => {
    // 담당 반려동물 목록
    const samplePets: Pet[] = [
      {
        id: 'pet1',
        name: 'Max',
        breed: '골든 리트리버',
        age: 3,
        ownerName: '김철수',
        ownerId: 'owner1',
        avatar: '/api/placeholder/50/50'
      },
      {
        id: 'pet2',
        name: 'Luna',
        breed: '말티즈',
        age: 2,
        ownerName: '이영희',
        ownerId: 'owner2',
        avatar: '/api/placeholder/50/50'
      },
      {
        id: 'pet3',
        name: 'Storm',
        breed: '시베리안 허스키',
        age: 4,
        ownerName: '박민수',
        ownerId: 'owner3',
        avatar: '/api/placeholder/50/50'
      },
      {
        id: 'pet4',
        name: 'Coco',
        breed: '푸들',
        age: 1,
        ownerName: '최지영',
        ownerId: 'owner4',
        avatar: '/api/placeholder/50/50'
      }
    ];

    const sampleEntries: NotebookEntry[] = [
      {
        id: '1',
        date: '2024-01-20',
        petName: 'Max',
        petId: 'pet1',
        ownerName: '김철수',
        ownerId: 'owner1',
        title: '기본 복종 훈련 - 앉기와 기다리기',
        content: '오늘은 Max와 함께 기본적인 복종 훈련을 진행했습니다. 앉기 명령에 대해서는 90% 성공률을 보였으며, 기다리기 명령도 점차 향상되고 있습니다. 집중력이 좋고 학습 의욕이 높은 편입니다.',
        activities: ['기본 명령어', '놀이 훈련'],
        mood: 'excellent',
        duration: 90,
        location: 'PetEdu 훈련장 A동',
        photos: [],
        nextGoals: ['엎드려 명령 추가', '산만함 줄이기'],
        isRead: false,
        createdAt: '2024-01-20T10:00:00Z',
        mealTimes: {
          breakfast: '08:00',
          lunch: '12:30',
          dinner: '18:00',
          snacks: [{ time: '15:00', type: '간식' }]
        },
        bathroomBreaks: [
          { time: '09:30', type: 'both', location: '야외' },
          { time: '14:00', type: 'urine', location: '실내' }
        ],
        walkSchedule: [
          { time: '07:00', duration: 30, location: '동네 공원', intensity: 'moderate' },
          { time: '19:00', duration: 45, location: '강변 산책로', intensity: 'intense' }
        ]
      },
      {
        id: '2',
        date: '2024-01-19',
        petName: 'Luna',
        petId: 'pet2',
        ownerName: '이영희',
        ownerId: 'owner2',
        title: '짖음 교정 훈련',
        content: 'Luna의 과도한 짖음 문제를 해결하기 위한 훈련을 실시했습니다. 방문자나 다른 개들을 볼 때 나타나는 반응성 짖음을 중점적으로 다뤘습니다. 조용히 하기 명령에 대한 반응이 개선되고 있습니다.',
        activities: ['행동 교정', '사회화 훈련'],
        mood: 'good',
        duration: 60,
        location: 'PetEdu 훈련장 B동',
        photos: [],
        nextGoals: ['외부 자극에 대한 둔감화', '긍정적 강화 지속'],
        isRead: true,
        createdAt: '2024-01-19T14:00:00Z'
      }
    ];

    setMyPets(samplePets);
    setEntries(sampleEntries);
  }, []);

  // 필터링된 알림장 목록
  const filteredEntries = entries.filter(entry => {
    const matchesPet = selectedPet === 'all' || entry.petId === selectedPet;
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.petName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPet && matchesSearch;
  });

  // AI 내용 생성 함수
  const generateAIContent = async () => {
    if (!newEntry.petId) {
      toast({
        title: '반려동물을 선택해주세요',
        description: 'AI 내용 생성을 위해 먼저 반려동물을 선택해야 합니다.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const selectedPetData = myPets.find(pet => pet.id === newEntry.petId);
      
      const response = await fetch('/api/ai/generate-notebook-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          petName: selectedPetData?.name,
          breed: selectedPetData?.breed,
          age: selectedPetData?.age
        })
      });

      if (response.ok) {
        const result = await response.json();
        setNewEntry(prev => ({
          ...prev,
          title: result.content.title,
          content: result.content.content,
          activities: [...prev.activities, ...result.content.activities],
          nextGoals: result.content.nextGoals
        }));

        toast({
          title: 'AI 내용 생성 완료',
          description: 'AI가 알림장 내용을 생성했습니다.'
        });
      }
    } catch (error) {
      toast({
        title: 'AI 생성 실패',
        description: 'AI 내용 생성 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 알림장 저장
  const handleSaveEntry = async () => {
    if (!newEntry.petId || !newEntry.title || !newEntry.content) {
      toast({
        title: '필수 정보를 입력해주세요',
        description: '반려동물, 제목, 내용은 필수 입력 항목입니다.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const selectedPetData = myPets.find(pet => pet.id === newEntry.petId);
      if (!selectedPetData) return;

      const response = await fetch('/api/notebook-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEntry,
          petName: selectedPetData.name,
          ownerName: selectedPetData.ownerName,
          ownerId: selectedPetData.ownerId
        })
      });

      const result = await response.json();
      if (result.success) {
        const entry: NotebookEntry = {
          id: result.id,
          date: new Date().toISOString().split('T')[0],
          petName: selectedPetData.name,
          ownerName: selectedPetData.ownerName,
          ownerId: selectedPetData.ownerId,
          ...newEntry,
          isRead: false,
          createdAt: new Date().toISOString()
        };

        setEntries(prev => [entry, ...prev]);
        
        // 폼 초기화
        setNewEntry({
          petId: '',
          title: '',
          content: '',
          activities: [],
          mood: 'good',
          duration: 60,
          location: 'PetEdu 훈련장',
          nextGoals: [],
          photos: [],
          mealTimes: {
            breakfast: '',
            lunch: '', 
            dinner: '',
            snacks: []
          },
          bathroomBreaks: [],
          walkSchedule: []
        });

        setIsNewEntryOpen(false);
        
        toast({
          title: '알림장 저장 완료',
          description: '새로운 알림장이 성공적으로 저장되었습니다.'
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '알림장 저장 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 알림장 조회
  const viewEntry = (entry: NotebookEntry) => {
    setSelectedEntry(entry);
    setIsViewDialogOpen(true);
    
    // 읽음 상태 업데이트
    if (!entry.isRead) {
      setEntries(prev => prev.map(e => 
        e.id === entry.id ? { ...e, isRead: true } : e
      ));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            훈련 알림장 관리
          </h1>
          <p className="text-gray-600 mt-2">담당 반려동물들의 훈련 기록을 작성하고 관리하세요</p>
        </div>
        
        <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              새 알림장 작성
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 훈련 알림장 작성</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">담당 반려동물 *</label>
                  <Select value={newEntry.petId} onValueChange={(value) => 
                    setNewEntry(prev => ({ ...prev, petId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="반려동물을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {myPets.map(pet => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} ({pet.ownerName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">기분 상태</label>
                  <Select value={newEntry.mood} onValueChange={(value: NotebookEntry['mood']) => 
                    setNewEntry(prev => ({ ...prev, mood: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(moodLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {moodEmojis[key as keyof typeof moodEmojis]} {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">제목 *</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="훈련 세션 제목을 입력하세요"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">훈련 내용 *</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="오늘의 훈련 내용과 반려동물의 상태를 자세히 기록해주세요"
                  rows={6}
                />
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateAIContent}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {loading ? 'AI 생성 중...' : 'AI로 내용 생성'}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">훈련 시간 (분)</label>
                  <Input
                    type="number"
                    value={newEntry.duration}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    placeholder="60"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block">장소</label>
                  <Input
                    value={newEntry.location}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="훈련 장소"
                  />
                </div>
              </div>

              {/* 일상 관리 섹션 */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  일상 관리 기록
                </h3>

                {/* 식사 시간 */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-700">🍽️ 식사 시간</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">아침 식사</label>
                      <Input
                        type="time"
                        value={newEntry.mealTimes.breakfast}
                        onChange={(e) => setNewEntry(prev => ({ 
                          ...prev, 
                          mealTimes: { ...prev.mealTimes, breakfast: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">점심 식사</label>
                      <Input
                        type="time"
                        value={newEntry.mealTimes.lunch}
                        onChange={(e) => setNewEntry(prev => ({ 
                          ...prev, 
                          mealTimes: { ...prev.mealTimes, lunch: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">저녁 식사</label>
                      <Input
                        type="time"
                        value={newEntry.mealTimes.dinner}
                        onChange={(e) => setNewEntry(prev => ({ 
                          ...prev, 
                          mealTimes: { ...prev.mealTimes, dinner: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* 배변 기록 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-700">🚽 배변 기록</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewEntry(prev => ({
                        ...prev,
                        bathroomBreaks: [...prev.bathroomBreaks, { time: '', type: 'urine', location: '' }]
                      }))}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      배변 기록 추가
                    </Button>
                  </div>
                  {newEntry.bathroomBreaks.map((breakItem, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="text-sm font-medium mb-2 block">시간</label>
                        <Input
                          type="time"
                          value={breakItem.time}
                          onChange={(e) => {
                            const updated = [...newEntry.bathroomBreaks];
                            updated[index].time = e.target.value;
                            setNewEntry(prev => ({ ...prev, bathroomBreaks: updated }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">종류</label>
                        <Select
                          value={breakItem.type}
                          onValueChange={(value: 'urine' | 'feces' | 'both') => {
                            const updated = [...newEntry.bathroomBreaks];
                            updated[index].type = value;
                            setNewEntry(prev => ({ ...prev, bathroomBreaks: updated }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urine">소변</SelectItem>
                            <SelectItem value="feces">대변</SelectItem>
                            <SelectItem value="both">소변+대변</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">장소</label>
                        <Input
                          value={breakItem.location}
                          onChange={(e) => {
                            const updated = [...newEntry.bathroomBreaks];
                            updated[index].location = e.target.value;
                            setNewEntry(prev => ({ ...prev, bathroomBreaks: updated }));
                          }}
                          placeholder="실내/야외"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = newEntry.bathroomBreaks.filter((_, i) => i !== index);
                          setNewEntry(prev => ({ ...prev, bathroomBreaks: updated }));
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>

                {/* 산책 스케줄 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-700">🚶 산책 스케줄</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewEntry(prev => ({
                        ...prev,
                        walkSchedule: [...prev.walkSchedule, { time: '', duration: 30, location: '', intensity: 'moderate' }]
                      }))}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      산책 기록 추가
                    </Button>
                  </div>
                  {newEntry.walkSchedule.map((walk, index) => (
                    <div key={index} className="grid grid-cols-5 gap-3 items-end">
                      <div>
                        <label className="text-sm font-medium mb-2 block">시간</label>
                        <Input
                          type="time"
                          value={walk.time}
                          onChange={(e) => {
                            const updated = [...newEntry.walkSchedule];
                            updated[index].time = e.target.value;
                            setNewEntry(prev => ({ ...prev, walkSchedule: updated }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">시간(분)</label>
                        <Input
                          type="number"
                          value={walk.duration}
                          onChange={(e) => {
                            const updated = [...newEntry.walkSchedule];
                            updated[index].duration = parseInt(e.target.value) || 0;
                            setNewEntry(prev => ({ ...prev, walkSchedule: updated }));
                          }}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">장소</label>
                        <Input
                          value={walk.location}
                          onChange={(e) => {
                            const updated = [...newEntry.walkSchedule];
                            updated[index].location = e.target.value;
                            setNewEntry(prev => ({ ...prev, walkSchedule: updated }));
                          }}
                          placeholder="공원, 동네 등"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">강도</label>
                        <Select
                          value={walk.intensity}
                          onValueChange={(value: 'light' | 'moderate' | 'intense') => {
                            const updated = [...newEntry.walkSchedule];
                            updated[index].intensity = value;
                            setNewEntry(prev => ({ ...prev, walkSchedule: updated }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">가벼움</SelectItem>
                            <SelectItem value="moderate">보통</SelectItem>
                            <SelectItem value="intense">강함</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = newEntry.walkSchedule.filter((_, i) => i !== index);
                          setNewEntry(prev => ({ ...prev, walkSchedule: updated }));
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSaveEntry} disabled={loading}>
                {loading ? '저장 중...' : '저장'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="제목, 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedPet} onValueChange={setSelectedPet}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="반려동물 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 반려동물</SelectItem>
                {myPets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.ownerName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 알림장 목록 */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">알림장이 없습니다</h3>
              <p className="text-gray-500 mb-4">첫 번째 훈련 알림장을 작성해보세요!</p>
              <Button onClick={() => setIsNewEntryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                새 알림장 작성
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={myPets.find(p => p.id === entry.petId)?.avatar} />
                      <AvatarFallback>
                        <PawPrint className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{entry.title}</h3>
                        {!entry.isRead && (
                          <Badge variant="destructive" className="text-xs px-2 py-0">새글</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <PawPrint className="h-3 w-3" />
                          {entry.petName}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.ownerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(entry.date), 'MM월 dd일', { locale: ko })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {entry.duration}분
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm">
                      <span>{moodEmojis[entry.mood]}</span>
                      <span className="text-gray-500">{moodLabels[entry.mood]}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewEntry(entry)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      보기
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {entry.content}
                </p>
                
                {entry.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.activities.map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {entry.location}
                  </div>
                  {entry.nextGoals.length > 0 && (
                    <div className="text-right">
                      <span>다음 목표: {entry.nextGoals[0]}...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 알림장 상세 보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={myPets.find(p => p.id === selectedEntry.petId)?.avatar} />
                    <AvatarFallback>
                      <PawPrint className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedEntry.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{selectedEntry.petName}</span>
                      <span>{selectedEntry.ownerName}</span>
                      <span>{format(new Date(selectedEntry.date), 'yyyy년 MM월 dd일', { locale: ko })}</span>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">훈련 내용</TabsTrigger>
                    <TabsTrigger value="daily">일상 관리</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          훈련 상세 내용
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl mb-1">{moodEmojis[selectedEntry.mood]}</div>
                            <div className="font-medium">{moodLabels[selectedEntry.mood]}</div>
                            <div className="text-gray-500">기분 상태</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600 mb-1">{selectedEntry.duration}분</div>
                            <div className="text-gray-500">훈련 시간</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium mb-1">{selectedEntry.location}</div>
                            <div className="text-gray-500">훈련 장소</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">훈련 내용</h4>
                          <p className="text-gray-700 leading-relaxed">{selectedEntry.content}</p>
                        </div>
                        
                        {selectedEntry.activities.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">진행한 활동</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedEntry.activities.map((activity, index) => (
                                <Badge key={index} variant="outline">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedEntry.nextGoals.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">다음 목표</h4>
                            <ul className="space-y-1">
                              {selectedEntry.nextGoals.map((goal, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  {goal}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="daily" className="space-y-4">
                    {selectedEntry.mealTimes && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            🍽️ 식사 시간
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <div className="font-medium">아침</div>
                              <div className="text-lg">{selectedEntry.mealTimes.breakfast || '미기록'}</div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                              <div className="font-medium">점심</div>
                              <div className="text-lg">{selectedEntry.mealTimes.lunch || '미기록'}</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="font-medium">저녁</div>
                              <div className="text-lg">{selectedEntry.mealTimes.dinner || '미기록'}</div>
                            </div>
                          </div>
                          {selectedEntry.mealTimes.snacks.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">간식</h5>
                              <div className="flex flex-wrap gap-2">
                                {selectedEntry.mealTimes.snacks.map((snack, index) => (
                                  <Badge key={index} variant="outline">
                                    {snack.time} - {snack.type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedEntry.bathroomBreaks && selectedEntry.bathroomBreaks.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            🚽 배변 기록
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedEntry.bathroomBreaks.map((record, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <span className="font-medium">{record.time}</span>
                                  <Badge variant={record.type === 'both' ? 'default' : 'secondary'}>
                                    {record.type === 'urine' ? '소변' : record.type === 'feces' ? '대변' : '소변+대변'}
                                  </Badge>
                                </div>
                                <span className="text-sm text-gray-500">{record.location}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedEntry.walkSchedule && selectedEntry.walkSchedule.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            🚶 산책 스케줄
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedEntry.walkSchedule.map((walk, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <span className="font-medium">{walk.time}</span>
                                  <span className="text-sm text-gray-600">{walk.duration}분</span>
                                  <Badge variant={walk.intensity === 'intense' ? 'destructive' : walk.intensity === 'moderate' ? 'default' : 'secondary'}>
                                    {walk.intensity === 'light' ? '가벼움' : walk.intensity === 'moderate' ? '보통' : '강함'}
                                  </Badge>
                                </div>
                                <span className="text-sm text-gray-500">{walk.location}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}