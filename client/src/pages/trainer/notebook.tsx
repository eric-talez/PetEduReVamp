import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Edit, Trash2, BookOpen, Calendar, User } from "lucide-react";
import { useState } from "react";

export default function TrainerNotebook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 샘플 노트북 데이터
  const notes = [
    {
      id: 1,
      title: "골든 리트리버 - 기본 복종 훈련",
      student: "김철수",
      pet: "Max",
      category: "basic-training",
      date: "2024-01-20",
      content: "오늘은 앉기와 기다리기 명령을 집중적으로 훈련했습니다. Max는 앉기에 대해서는 90% 성공률을 보였으나...",
      tags: ["복종훈련", "골든리트리버", "기초"]
    },
    {
      id: 2,
      title: "말티즈 - 짖음 교정 훈련",
      student: "이영희",
      pet: "Luna",
      category: "behavior-correction",
      date: "2024-01-19",
      content: "방문자에 대한 과도한 짖음을 줄이기 위한 훈련을 진행했습니다. 조용히 하기 명령에 대한 반응이...",
      tags: ["행동교정", "말티즈", "짖음"]
    },
    {
      id: 3,
      title: "시베리안 허스키 - 산책 훈련",
      student: "박민수",
      pet: "Storm",
      category: "leash-training",
      date: "2024-01-18",
      content: "끌림 없는 산책을 위한 리드줄 훈련을 실시했습니다. 허스키 특성상 에너지가 많아서...",
      tags: ["산책훈련", "허스키", "리드줄"]
    }
  ];

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; className: string }> = {
      'basic-training': { label: '기초훈련', className: 'bg-blue-100 text-blue-800' },
      'behavior-correction': { label: '행동교정', className: 'bg-orange-100 text-orange-800' },
      'leash-training': { label: '산책훈련', className: 'bg-green-100 text-green-800' },
      'agility': { label: '민첩성', className: 'bg-purple-100 text-purple-800' }
    };
    
    const categoryInfo = categoryMap[category] || { label: category, className: 'bg-gray-100 text-gray-800' };
    return (
      <Badge className={categoryInfo.className}>
        {categoryInfo.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">훈련 노트북</h1>
          <p className="text-muted-foreground">훈련 과정과 진행 상황을 기록하고 관리합니다</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 훈련 기록 작성
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 훈련 기록</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +12 이번주 신규
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 훈련생</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              현재 훈련 진행 중
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번주 세션</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              +3 지난주 대비
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              목표 달성률
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>훈련 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 훈련생, 반려동물명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="카테고리 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="basic-training">기초훈련</SelectItem>
                <SelectItem value="behavior-correction">행동교정</SelectItem>
                <SelectItem value="leash-training">산책훈련</SelectItem>
                <SelectItem value="agility">민첩성</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              고급 필터
            </Button>
          </div>

          {/* 노트 카드 목록 */}
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>훈련생: {note.student}</span>
                        <span>반려동물: {note.pet}</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(note.category)}
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex gap-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
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
    photos: [] as string[]
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
        name: '멍멍이',
        breed: '골든 리트리버',
        age: 2,
        ownerName: '김반려',
        ownerId: 'owner1'
      },
      {
        id: 'pet2',
        name: '야옹이',
        breed: '러시안 블루',
        age: 3,
        ownerName: '이반려',
        ownerId: 'owner2'
      }
    ];

    // 기존 알림장 목록
    const sampleEntries: NotebookEntry[] = [
      {
        id: '1',
        date: format(new Date(), 'yyyy-MM-dd'),
        petName: '멍멍이',
        petId: 'pet1',
        ownerName: '김반려',
        ownerId: 'owner1',
        title: '기본 훈련 세션',
        content: '오늘 멍멍이는 앉기와 기다리기 명령을 잘 따라했습니다.',
        activities: ['기본 명령어', '리드줄 훈련'],
        mood: 'excellent',
        duration: 90,
        location: 'PetEdu 훈련장 A',
        photos: [],
        nextGoals: ['산책 훈련', '다른 강아지와의 사회화'],
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];

    setMyPets(samplePets);
    setEntries(sampleEntries);
  }, []);

  // 필터링된 알림장 목록
  const filteredEntries = entries.filter(entry => {
    if (selectedPet !== 'all' && entry.petId !== selectedPet) return false;
    if (searchQuery && !entry.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !entry.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // 새 알림장 저장
  const handleSaveEntry = async () => {
    if (!newEntry.petId || !newEntry.title || !newEntry.content) {
      toast({
        title: '필수 항목 누락',
        description: '반려동물, 제목, 내용을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const selectedPetData = myPets.find(pet => pet.id === newEntry.petId);
      if (!selectedPetData) return;

      const response = await fetch('/api/notebook/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEntry,
          petName: selectedPetData.name,
          ownerName: selectedPetData.ownerName,
          ownerId: selectedPetData.ownerId,
          date: format(new Date(), 'yyyy-MM-dd')
        }),
      });

      const result = await response.json();

      if (result.success) {
        const entry: NotebookEntry = {
          id: Date.now().toString(),
          date: format(new Date(), 'yyyy-MM-dd'),
          petName: selectedPetData.name,
          petId: newEntry.petId,
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
          photos: []
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

  // 알림장 상세 보기
  const viewEntry = (entry: NotebookEntry) => {
    setSelectedEntry(entry);
    setIsViewDialogOpen(true);
  };

  // AI 도우미로 내용 생성
  const generateAIContent = async () => {
    if (!newEntry.petId) {
      toast({
        title: '반려동물 선택 필요',
        description: 'AI 도우미를 사용하려면 반려동물을 먼저 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const selectedPetData = myPets.find(pet => pet.id === newEntry.petId);
      if (!selectedPetData) return;

      const response = await fetch('/api/notebook/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petName: selectedPetData.name,
          petBreed: selectedPetData.breed,
          activities: newEntry.activities,
          additionalContext: '트레이너가 작성하는 훈련 일지'
        }),
      });

      const result = await response.json();

      if (result.success) {
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
                    <div className="text-xl" title={moodLabels[entry.mood]}>
                      {moodEmojis[entry.mood]}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewEntry(entry)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      상세보기
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">{entry.content}</p>
                
                {entry.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.activities.map((activity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {entry.location}
                  </span>
                  <span>{format(new Date(entry.createdAt), 'HH:mm')}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 상세보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {selectedEntry.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <PawPrint className="h-4 w-4" />
                    {selectedEntry.petName}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedEntry.ownerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(selectedEntry.date), 'yyyy년 MM월 dd일', { locale: ko })}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{moodEmojis[selectedEntry.mood]}</span>
                    <span>{moodLabels[selectedEntry.mood]}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">훈련 내용</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedEntry.content}</p>
                </div>
                
                {selectedEntry.activities.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">오늘의 활동</h4>
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
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">훈련 시간:</span> {selectedEntry.duration}분
                  </div>
                  <div>
                    <span className="font-medium">장소:</span> {selectedEntry.location}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
