
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Heart, 
  Camera,
  MessageSquare,
  Star,
  Clock,
  MapPin,
  User,
  PawPrint,
  Stethoscope,
  Utensils,
  Gamepad2,
  Moon,
  Sun,
  Activity,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Download,
  Share,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { format, isToday, isYesterday, subDays, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// 알림장 엔트리 타입 정의
interface NotebookEntry {
  id: string;
  date: string;
  petName: string;
  petId: string;
  trainerName: string;
  trainerId: string;
  title: string;
  content: string;
  activities: {
    training?: string[];
    play?: string[];
    meal?: string[];
    health?: string[];
    behavior?: string[];
  };
  mood: 'excellent' | 'good' | 'normal' | 'tired' | 'anxious';
  photos: string[];
  videos: string[];
  notes: string;
  nextGoals: string[];
  weather: string;
  duration: number; // 분 단위
  location: string;
  tags: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// 템플릿 타입 정의
interface NotebookTemplate {
  id: string;
  name: string;
  description: string;
  activities: string[];
  defaultContent: string;
  tags: string[];
}

export default function NotebookPage() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<NotebookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<NotebookEntry | null>(null);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'pet' | 'trainer'>('date');
  const [showRead, setShowRead] = useState(true);
  const [showUnread, setShowUnread] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // 새 알림장 폼 상태
  const [newEntry, setNewEntry] = useState({
    petName: '',
    petId: '',
    trainerName: '',
    trainerId: '',
    title: '',
    content: '',
    activities: {
      training: [] as string[],
      play: [] as string[],
      meal: [] as string[],
      health: [] as string[],
      behavior: [] as string[]
    },
    mood: 'good' as NotebookEntry['mood'],
    photos: [] as string[],
    videos: [] as string[],
    notes: '',
    nextGoals: [] as string[],
    weather: '',
    duration: 60,
    location: '',
    tags: [] as string[]
  });

  // 템플릿 데이터
  const templates: NotebookTemplate[] = [
    {
      id: 'basic-training',
      name: '기본 훈련 템플릿',
      description: '일반적인 반려동물 기본 훈련 세션용',
      activities: ['기본 명령어', '리드줄 훈련', '사회화 훈련'],
      defaultContent: '오늘 {petName}는 기본 훈련을 진행했습니다.',
      tags: ['기본훈련', '초급']
    },
    {
      id: 'behavior-correction',
      name: '행동 교정 템플릿',
      description: '문제 행동 교정을 위한 세션용',
      activities: ['문제행동 분석', '교정 훈련', '대안행동 제시'],
      defaultContent: '{petName}의 행동 교정을 위한 훈련을 실시했습니다.',
      tags: ['행동교정', '치료']
    },
    {
      id: 'socialization',
      name: '사회화 훈련 템플릿',
      description: '다른 동물이나 사람과의 사회화 훈련용',
      activities: ['타 반려동물과의 만남', '사람과의 교감', '환경 적응'],
      defaultContent: '{petName}의 사회화 능력 향상을 위한 훈련을 진행했습니다.',
      tags: ['사회화', '적응']
    }
  ];

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

  // 샘플 데이터 로드
  useEffect(() => {
    const sampleEntries: NotebookEntry[] = [
      {
        id: '1',
        date: format(new Date(), 'yyyy-MM-dd'),
        petName: '멍멍이',
        petId: 'pet1',
        trainerName: '김민수',
        trainerId: 'trainer1',
        title: '오늘의 기본 훈련 세션',
        content: '오늘 멍멍이는 기본 명령어 훈련을 매우 잘 따라했습니다. 특히 "앉아"와 "기다려" 명령에 대한 반응이 지난주보다 훨씬 개선되었어요.',
        activities: {
          training: ['기본 명령어', '리드줄 훈련'],
          play: ['공 던지기', '터그놀이'],
          meal: ['아침 사료', '간식 훈련'],
          health: ['구강 검진'],
          behavior: ['긍정적 반응', '집중력 향상']
        },
        mood: 'excellent',
        photos: [],
        videos: [],
        notes: '내일은 산책 훈련을 추가로 진행할 예정입니다.',
        nextGoals: ['산책 훈련', '다른 강아지와의 사회화'],
        weather: '맑음',
        duration: 90,
        location: 'PetEdu 훈련장 A',
        tags: ['기본훈련', '개선됨', '추천'],
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        petName: '야옹이',
        petId: 'pet2',
        trainerName: '이영희',
        trainerId: 'trainer2',
        title: '고양이 행동 교정 세션',
        content: '야옹이의 스크래칭 문제를 개선하기 위한 훈련을 진행했습니다. 전용 스크래칭 포스트 사용법을 익혔고, 가구 긁기가 50% 정도 줄어들었습니다.',
        activities: {
          training: ['스크래칭 교정', '장난감 활용'],
          play: ['깃털 놀이', '레이저 포인터'],
          meal: ['습식 사료', '고양이 풀'],
          health: ['털갈이 관리'],
          behavior: ['스크래칭 개선', '활동성 증가']
        },
        mood: 'good',
        photos: [],
        videos: [],
        notes: '점진적으로 개선되고 있습니다. 꾸준한 훈련이 필요해요.',
        nextGoals: ['완전한 스크래칭 교정', '새로운 장난감 적응'],
        weather: '흐림',
        duration: 75,
        location: 'PetEdu 고양이 전용실',
        tags: ['행동교정', '진행중'],
        isRead: true,
        createdAt: subDays(new Date(), 1).toISOString(),
        updatedAt: subDays(new Date(), 1).toISOString()
      }
    ];

    setEntries(sampleEntries);
  }, []);

  // 필터링 및 검색
  useEffect(() => {
    let filtered = entries;

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.trainerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 반려동물 필터
    if (selectedPet !== 'all') {
      filtered = filtered.filter(entry => entry.petId === selectedPet);
    }

    // 훈련사 필터
    if (selectedTrainer !== 'all') {
      filtered = filtered.filter(entry => entry.trainerId === selectedTrainer);
    }

    // 읽음/안읽음 필터
    if (!showRead && !showUnread) {
      filtered = [];
    } else if (!showRead) {
      filtered = filtered.filter(entry => !entry.isRead);
    } else if (!showUnread) {
      filtered = filtered.filter(entry => entry.isRead);
    }

    // 날짜 정렬
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'pet') {
      filtered.sort((a, b) => a.petName.localeCompare(b.petName));
    } else if (sortBy === 'trainer') {
      filtered.sort((a, b) => a.trainerName.localeCompare(b.trainerName));
    }

    setFilteredEntries(filtered);
  }, [entries, searchQuery, selectedPet, selectedTrainer, sortBy, showRead, showUnread]);

  // 알림장 목록 조회
  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams();
      if (selectedPet !== 'all') queryParams.append('petId', selectedPet);
      if (selectedTrainer !== 'all') queryParams.append('trainerId', selectedTrainer);

      const response = await fetch(`/api/notebook/entries?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setEntries(data.entries || []);
      } else {
        throw new Error(data.error || '알림장을 불러올 수 없습니다');
      }
    } catch (error) {
      console.error('알림장 조회 실패:', error);
      toast({
        title: "오류",
        description: "알림장을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPet, selectedTrainer, toast]);

  // 새 알림장 저장
  const handleSaveEntry = async () => {
    if (!newEntry.title || !newEntry.content || !newEntry.petName) {
      toast({
        title: '필수 항목 누락',
        description: '제목, 내용, 반려동물 이름을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/notebook/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEntry,
          date: format(selectedDate, 'yyyy-MM-dd')
        }),
      });

      const data = await response.json();

      if (data.success) {
        const entry: NotebookEntry = {
          id: data.entry.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          ...newEntry,
          isRead: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setEntries(prev => [entry, ...prev]);

        // 폼 초기화
        setNewEntry({
          petName: '',
          petId: '',
          trainerName: '',
          trainerId: '',
          title: '',
          content: '',
          activities: {
            training: [],
            play: [],
            meal: [],
            health: [],
            behavior: []
          },
          mood: 'good',
          photos: [],
          videos: [],
          notes: '',
          nextGoals: [],
          weather: '',
          duration: 60,
          location: '',
          tags: []
        });

        setIsNewEntryOpen(false);

        toast({
          title: '알림장 저장 완료',
          description: '새로운 알림장이 성공적으로 저장되었습니다.'
        });
      } else {
        throw new Error(data.error);
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

  // AI 도우미로 내용 생성
  const handleAIGenerate = async () => {
    if (!newEntry.petName) {
      toast({
        title: '반려동물 정보 필요',
        description: 'AI 도우미를 사용하려면 반려동물 이름을 먼저 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/notebook/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: newEntry.petName,
          petBreed: '',
          activities: Object.values(newEntry.activities).flat(),
          additionalContext: newEntry.notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setNewEntry(prev => ({
          ...prev,
          content: data.content.content,
          title: data.content.title,
          tags: data.content.tags,
          activities: {
            ...prev.activities,
            training: data.content.activities || prev.activities.training
          },
          nextGoals: data.content.nextGoals || prev.nextGoals
        }));

        toast({
          title: 'AI 내용 생성 완료',
          description: 'AI가 알림장 내용을 생성했습니다. 필요에 따라 수정해주세요.'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'AI 생성 실패',
        description: 'AI 내용 생성 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setIsAIHelperOpen(false);
    }
  };

  // 템플릿 적용
  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setNewEntry(prev => ({
      ...prev,
      title: template.defaultContent.replace('{petName}', prev.petName || '[반려동물 이름]'),
      content: template.defaultContent.replace('{petName}', prev.petName || '[반려동물 이름]'),
      tags: template.tags,
      activities: {
        ...prev.activities,
        training: template.activities
      }
    }));

    setSelectedTemplate(templateId);

    toast({
      title: '템플릿 적용 완료',
      description: `${template.name}이 적용되었습니다.`
    });
  };

  // 날짜 포맷팅
  const formatEntryDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return '오늘';
    if (isYesterday(date)) return '어제';
    return format(date, 'MM월 dd일', { locale: ko });
  };

  // 알림장 읽음 처리
  const markAsRead = async (entryId: string) => {
    try {
      const response = await fetch(`/api/notebook/entries/${entryId}/read`, {
        method: 'PATCH'
      });

      if (response.ok) {
        setEntries(prev => prev.map(entry => 
          entry.id === entryId ? { ...entry, isRead: true } : entry
        ));
      }
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            알림장
          </h1>
          <p className="text-gray-600 mt-2">반려동물의 일일 훈련 기록과 상태를 관리하세요</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isAIHelperOpen} onOpenChange={setIsAIHelperOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI 도우미
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI 알림장 도우미</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  AI가 반려동물 정보를 바탕으로 알림장 내용을 자동 생성해드립니다.
                </p>
                <Button onClick={handleAIGenerate} disabled={loading} className="w-full">
                  {loading ? '생성 중...' : 'AI로 내용 생성'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                새 알림장 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 알림장 작성</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="activities">활동 기록</TabsTrigger>
                  <TabsTrigger value="media">미디어</TabsTrigger>
                  <TabsTrigger value="ai">AI 도우미</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">반려동물 이름 *</label>
                      <Input
                        value={newEntry.petName}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, petName: e.target.value }))}
                        placeholder="반려동물 이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">훈련사 이름</label>
                      <Input
                        value={newEntry.trainerName}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, trainerName: e.target.value }))}
                        placeholder="훈련사 이름을 입력하세요"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">제목 *</label>
                    <Input
                      value={newEntry.title}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="알림장 제목을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">내용 *</label>
                    <Textarea
                      value={newEntry.content}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="오늘의 훈련 내용과 반려동물의 상태를 자세히 기록해주세요"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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
                    <div>
                      <label className="text-sm font-medium mb-2 block">훈련 시간 (분)</label>
                      <Input
                        type="number"
                        value={newEntry.duration}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">장소</label>
                      <Input
                        value={newEntry.location}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="훈련 장소"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activities" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">특별 노트</label>
                    <Textarea
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="특별히 기록하고 싶은 내용이나 다음 세션을 위한 메모"
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">사진이나 동영상을 업로드하세요</p>
                    <Button variant="outline" className="mt-2">
                      파일 선택
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  <div className="text-center p-8 border border-blue-200 rounded-lg bg-blue-50">
                    <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">AI 알림장 도우미</h3>
                    <p className="text-gray-600 mb-4">
                      AI가 반려동물 정보를 바탕으로 알림장 내용을 자동 생성해드립니다.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {templates.map(template => (
                        <Card 
                          key={template.id} 
                          className={`cursor-pointer transition-colors ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : ''}`}
                          onClick={() => applyTemplate(template.id)}
                        >
                          <CardContent className="p-3 text-center">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button onClick={handleAIGenerate} disabled={loading}>
                      {loading ? '생성 중...' : 'AI로 내용 생성'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

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
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="제목, 내용, 반려동물 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-read"
                  checked={showRead}
                  onCheckedChange={setShowRead}
                />
                <label htmlFor="show-read" className="text-sm">읽음</label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="show-unread"
                  checked={showUnread}
                  onCheckedChange={setShowUnread}
                />
                <label htmlFor="show-unread" className="text-sm">안읽음</label>
              </div>

              <Select value={selectedPet} onValueChange={setSelectedPet}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="반려동물" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 반려동물</SelectItem>
                  <SelectItem value="pet1">멍멍이</SelectItem>
                  <SelectItem value="pet2">야옹이</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="훈련사" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 훈련사</SelectItem>
                  <SelectItem value="trainer1">김민수</SelectItem>
                  <SelectItem value="trainer2">이영희</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: 'date' | 'pet' | 'trainer') => setSortBy(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">날짜순</SelectItem>
                  <SelectItem value="pet">반려동물순</SelectItem>
                  <SelectItem value="trainer">훈련사순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 알림장 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">알림장을 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">알림장이 없습니다</h3>
              <p className="text-gray-500 mb-4">첫 번째 알림장을 작성해보세요!</p>
              <Button onClick={() => setIsNewEntryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                새 알림장 작성
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card 
              key={entry.id} 
              className={`transition-all hover:shadow-md cursor-pointer ${!entry.isRead ? 'border-blue-200 bg-blue-50/30' : ''}`}
              onClick={() => {
                setSelectedEntry(entry);
                if (!entry.isRead) {
                  markAsRead(entry.id);
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/images/pets/${entry.petId}.jpg`} />
                      <AvatarFallback>
                        <PawPrint className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <PawPrint className="h-3 w-3" />
                          {entry.petName}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.trainerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatEntryDate(entry.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {entry.duration}분
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-xl" title={moodLabels[entry.mood]}>
                      {moodEmojis[entry.mood]}
                    </div>
                    {!entry.isRead && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        새로움
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed line-clamp-3">{entry.content}</p>

                {/* 활동 태그 */}
                {Object.entries(entry.activities).some(([_, activities]) => activities.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">오늘의 활동</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(entry.activities).map(([category, activities]) =>
                        activities.map((activity, index) => (
                          <Badge key={`${category}-${index}`} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 추가 정보 */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  {entry.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {entry.location}
                    </span>
                  )}
                  {entry.weather && (
                    <span className="flex items-center gap-1">
                      <Sun className="h-3 w-3" />
                      {entry.weather}
                    </span>
                  )}
                  {entry.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {entry.tags.join(', ')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 알림장 상세 보기 모달 */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedEntry.title}
                <div className="text-xl">{moodEmojis[selectedEntry.mood]}</div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">반려동물:</span>
                  <p className="font-medium">{selectedEntry.petName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">훈련사:</span>
                  <p className="font-medium">{selectedEntry.trainerName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">날짜:</span>
                  <p className="font-medium">{formatEntryDate(selectedEntry.date)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">훈련 시간:</span>
                  <p className="font-medium">{selectedEntry.duration}분</p>
                </div>
              </div>

              {/* 내용 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">훈련 내용</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedEntry.content}
                </p>
              </div>

              {/* 활동 */}
              {Object.entries(selectedEntry.activities).some(([_, activities]) => activities.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">오늘의 활동</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedEntry.activities).map(([category, activities]) => (
                      activities.length > 0 && (
                        <div key={category}>
                          <h4 className="font-medium text-gray-600 mb-2 capitalize">{category}</h4>
                          <div className="flex flex-wrap gap-1">
                            {activities.map((activity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* 다음 목표 */}
              {selectedEntry.nextGoals.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">다음 목표</h3>
                  <ul className="space-y-2">
                    {selectedEntry.nextGoals.map((goal, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 특별 노트 */}
              {selectedEntry.notes && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">특별 노트</h4>
                  <p className="text-yellow-700">{selectedEntry.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
