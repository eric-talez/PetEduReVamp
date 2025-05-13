import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  Filter,
  Send,
  RefreshCw,
  BookOpen,
  MessageSquare,
  MoreVertical,
  FileImage,
  FileVideo,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, isSameDay, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

// 커스텀 컴포넌트 가져오기
import NotebookCalendar from '@/components/notebook/NotebookCalendar';
import ActivityRecorder, { Activity } from '@/components/notebook/ActivityRecorder';
import TemplateSelector, { TemplateType } from '@/components/notebook/TemplateSelector';
import MediaViewer from '@/components/notebook/MediaViewer';
import NotebookDialog from '@/components/notebook/NotebookDialog';

interface NotebookEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  petId: number;
  petName: string;
  petAvatar?: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'tired';
  photos?: string[];
  videos?: string[];
  comments: Comment[];
  taggedItems: string[];
  activities?: Activity;
}

interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'trainer' | 'pet-owner' | 'institute-admin';
  content: string;
  timestamp: string;
}

export interface Pet {
  id: number;
  name: string;
  avatar?: string;
  breed: string;
}

export default function Notebook() {
  const { userName, userRole } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<NotebookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterPet, setFilterPet] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterMood, setFilterMood] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEntry, setSelectedEntry] = useState<NotebookEntry | null>(null);
  const [showEntryDetail, setShowEntryDetail] = useState(false);
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [commentText, setCommentText] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0);
  const [mediaViewerFiles, setMediaViewerFiles] = useState<{type: 'photo' | 'video', url: string}[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 반려동물 데이터
        const mockPets: Pet[] = [
          {
            id: 1,
            name: '초코',
            breed: '푸들',
            avatar: 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHVwcHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
          },
          {
            id: 2,
            name: '루시',
            breed: '말티즈',
            avatar: 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHB1cHB5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
          },
          {
            id: 3,
            name: '콩이',
            breed: '웰시코기',
            avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHB1cHB5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
          }
        ];
        
        // 임시 알림장 데이터
        const mockEntries: NotebookEntry[] = [
          {
            id: 1,
            date: '2024-05-12',
            title: '초코의 첫 훈련 수업',
            content: '오늘 초코가 첫 훈련 수업을 시작했어요! 처음에는 조금 긴장한 모습이었지만, 수업이 진행되면서 점점 적응하는 모습을 보였습니다. 특히 기본 복종 훈련에서 생각보다 빠르게 배우는 모습이 인상적이었어요. 앉기와 엎드리기를 훈련했고, 집에서도 꾸준히 연습하면 더 좋은 결과가 있을 것 같습니다.',
            petId: 1,
            petName: '초코',
            petAvatar: 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHVwcHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
            mood: 'excited',
            comments: [
              {
                id: 1,
                authorId: 101,
                authorName: '김훈련사',
                authorRole: 'trainer',
                content: '초코가 정말 똑똑하네요! 다음 수업도 기대됩니다. 집에서 복습할 때는 간식을 활용하면 더 효과적일 거예요.',
                timestamp: '2024-05-12T14:30:00'
              }
            ],
            taggedItems: ['훈련', '첫 수업', '복종 훈련']
          },
          {
            id: 2,
            date: '2024-05-10',
            title: '루시의 산책 시간',
            content: '오늘은 루시와 함께 한강공원에 다녀왔어요. 날씨가 정말 좋아서 오랜만에 긴 산책을 했습니다. 루시가 다른 강아지들과도 잘 어울리고, 특히 물가에서 놀 때 정말 즐거워했어요. 다만 리드줄 훈련이 아직 완벽하지 않아서 가끔 강하게 당기는 모습이 있었습니다. 이 부분은 좀 더 연습이 필요할 것 같아요.',
            petId: 2,
            petName: '루시',
            petAvatar: 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHB1cHB5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
            mood: 'happy',
            comments: [],
            taggedItems: ['산책', '한강', '사회화']
          },
          {
            id: 3,
            date: '2024-05-08',
            title: '콩이 건강 체크',
            content: '콩이가 어제부터 식욕이 조금 떨어진 것 같아 병원에 다녀왔습니다. 다행히 큰 문제는 없고, 일시적인 소화 불량으로 진단받았어요. 소화를 돕는 약을 처방받았고, 당분간은 소화가 잘 되는 음식으로 식단을 조절하라는 조언을 받았습니다. 오늘 저녁부터는 조금씩 식욕이 돌아오는 것 같아 다행입니다.',
            petId: 3,
            petName: '콩이',
            petAvatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHB1cHB5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
            mood: 'tired',
            comments: [
              {
                id: 2,
                authorId: 102,
                authorName: '박수의사',
                authorRole: 'trainer',
                content: '식단 조절 잘 하고 계신 것 같네요. 약은 꼭 정해진 시간에 복용하시고, 상태가 계속 좋아지는지 지켜봐 주세요.',
                timestamp: '2024-05-08T18:45:00'
              },
              {
                id: 3,
                authorId: 103,
                authorName: '이반려인',
                authorRole: 'pet-owner',
                content: '우리 콩이 빨리 나아서 다행이에요. 건강이 최우선이죠!',
                timestamp: '2024-05-09T09:15:00'
              }
            ],
            taggedItems: ['건강', '병원', '식단']
          }
        ];
        
        setPets(mockPets);
        setEntries(mockEntries);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '알림장 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // 필터링된 항목 업데이트
  useEffect(() => {
    let result = [...entries];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        entry => 
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.petName.toLowerCase().includes(query) ||
          entry.taggedItems.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // 반려동물 필터링
    if (filterPet !== null) {
      result = result.filter(entry => entry.petId === filterPet);
    }
    
    // 날짜 필터링
    if (filterDate) {
      const dateStr = format(filterDate, 'yyyy-MM-dd');
      result = result.filter(entry => entry.date === dateStr);
    }
    
    // 기분 필터링
    if (filterMood) {
      result = result.filter(entry => entry.mood === filterMood);
    }
    
    // 날짜 기준 내림차순 정렬 (최신순)
    result.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setFilteredEntries(result);
  }, [entries, searchQuery, filterPet, filterDate, filterMood]);
  
  // 항목 상세 보기
  const handleViewEntry = (entry: NotebookEntry) => {
    setSelectedEntry(entry);
    setShowEntryDetail(true);
  };
  
  // 댓글 추가
  const handleAddComment = () => {
    if (!selectedEntry || !commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now(),
      authorId: 104,
      authorName: userName || '사용자',
      authorRole: userRole as 'pet-owner' | 'trainer' | 'institute-admin',
      content: commentText,
      timestamp: new Date().toISOString()
    };
    
    const updatedEntry = {
      ...selectedEntry,
      comments: [...selectedEntry.comments, newComment]
    };
    
    setEntries(prev => prev.map(e => 
      e.id === selectedEntry.id ? updatedEntry : e
    ));
    
    setSelectedEntry(updatedEntry);
    setCommentText('');
    
    toast({
      title: '댓글 추가됨',
      description: '댓글이 성공적으로 추가되었습니다.',
    });
  };
  
  // 새 알림장 추가
  const handleAddEntry = (data: any) => {
    const pet = pets.find(p => p.id === data.petId);
    if (!pet) return;
    
    const newEntry: NotebookEntry = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      title: data.title,
      content: data.content,
      petId: data.petId,
      petName: pet.name,
      petAvatar: pet.avatar,
      mood: data.mood,
      photos: data.photos || [],
      videos: data.videos || [],
      comments: [],
      taggedItems: data.taggedItems || [],
      activities: data.activities || {}
    };
    
    setEntries(prev => [newEntry, ...prev]);
    
    toast({
      title: '알림장 추가됨',
      description: '새 알림장이 성공적으로 추가되었습니다.',
    });
  };
  
  // 알림장 삭제
  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    
    setEntries(prev => prev.filter(e => e.id !== selectedEntry.id));
    setShowEntryDetail(false);
    
    toast({
      title: '알림장 삭제됨',
      description: '알림장이 성공적으로 삭제되었습니다.',
    });
  };
  
  // 알림장 수정
  const handleUpdateEntry = (data: any) => {
    if (!selectedEntry) return;
    
    const pet = pets.find(p => p.id === data.petId);
    if (!pet) return;
    
    const updatedEntry: NotebookEntry = {
      ...selectedEntry,
      title: data.title,
      content: data.content,
      petId: data.petId,
      petName: pet.name,
      petAvatar: pet.avatar,
      mood: data.mood,
      photos: data.photos || [],
      videos: data.videos || [],
      taggedItems: data.taggedItems || [],
      activities: data.activities || {}
    };
    
    setEntries(prev => prev.map(e => 
      e.id === selectedEntry.id ? updatedEntry : e
    ));
    
    setSelectedEntry(updatedEntry);
    setShowEntryDetail(true);
    
    toast({
      title: '알림장 수정됨',
      description: '알림장이 성공적으로 수정되었습니다.',
    });
  };
  
  // 필터 초기화
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterPet(null);
    setFilterDate(null);
    setFilterMood(null);
  };
  
  // 달력에서 날짜 선택 시
  const handleDaySelect = (day: Date | null) => {
    setSelectedDay(day);
    if (day) {
      setFilterDate(day);
    }
  };
  
  // 미디어 뷰어 열기
  const handleOpenMediaViewer = (entry: NotebookEntry, type: 'photo' | 'video', index: number) => {
    const mediaFiles: {type: 'photo' | 'video', url: string}[] = [];
    
    if (type === 'photo' && entry.photos) {
      mediaFiles.push(...entry.photos.map(url => ({ type: 'photo' as const, url })));
    } else if (type === 'video' && entry.videos) {
      mediaFiles.push(...entry.videos.map(url => ({ type: 'video' as const, url })));
    }
    
    if (mediaFiles.length > 0) {
      setMediaViewerFiles(mediaFiles);
      setMediaViewerIndex(index);
      setShowMediaViewer(true);
    }
  };
  
  // 템플릿 적용
  const handleApplyTemplate = (template: TemplateType, data: any) => {
    setShowTemplateDialog(false);
    setSelectedTemplate(template);
    
    // 선택된 템플릿을 기존 폼에 적용하는 로직은 NotebookDialog에서 처리합니다
  };
  
  // 알림장 수정 시작
  const handleStartEdit = (entry: NotebookEntry) => {
    setSelectedEntry(entry);
    setIsEditMode(true);
    setShowNewEntryDialog(true);
    setShowEntryDetail(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">알림장</h1>
        <Button onClick={() => setShowNewEntryDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          새 알림장 작성
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>필터</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">검색</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="검색어 입력..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">반려동물</label>
                <Select
                  value={filterPet?.toString() || 'all'}
                  onValueChange={(value) => setFilterPet(value === 'all' ? null : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="모든 반려동물" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 반려동물</SelectItem>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">날짜</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDate ? (
                        format(filterDate, 'PPP', { locale: ko })
                      ) : (
                        <span>날짜 선택</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterDate ?? undefined}
                      onSelect={(date: Date | undefined) => {
                        if (date instanceof Date) setFilterDate(date);
                        else setFilterDate(null);
                      }}
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">기분</label>
                <Select
                  value={filterMood || 'all'}
                  onValueChange={(value) => setFilterMood(value === 'all' ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="모든 기분" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 기분</SelectItem>
                    <SelectItem value="happy">행복해요 😊</SelectItem>
                    <SelectItem value="sad">슬퍼요 😢</SelectItem>
                    <SelectItem value="neutral">보통이에요 😐</SelectItem>
                    <SelectItem value="excited">신나요 😃</SelectItem>
                    <SelectItem value="tired">피곤해요 😴</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="w-full" onClick={handleResetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                필터 초기화
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>일정</CardTitle>
            </CardHeader>
            <CardContent>
              <NotebookCalendar 
                entries={entries} 
                onDaySelect={handleDaySelect}
                selectedDay={selectedDay}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="today">오늘</TabsTrigger>
                <TabsTrigger value="week">이번 주</TabsTrigger>
                <TabsTrigger value="month">이번 달</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  그리드
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  리스트
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">알림장이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">새 알림장을 작성해보세요</p>
                  <Button onClick={() => setShowNewEntryDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    새 알림장 작성
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                  : 'space-y-4'
                }>
                  {filteredEntries.map(entry => (
                    <Card key={entry.id} className="overflow-hidden h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={entry.petAvatar} alt={entry.petName} />
                              <AvatarFallback>{entry.petName.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{entry.title}</CardTitle>
                              <CardDescription>
                                {entry.petName} • {format(new Date(entry.date), 'yyyy년 MM월 dd일')}
                              </CardDescription>
                            </div>
                          </div>
                          
                          {(entry.mood === 'happy' && '😊') ||
                           (entry.mood === 'sad' && '😢') ||
                           (entry.mood === 'neutral' && '😐') ||
                           (entry.mood === 'excited' && '😃') ||
                           (entry.mood === 'tired' && '😴')}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="line-clamp-3 text-sm">{entry.content}</p>
                        
                        {(entry.photos && entry.photos.length > 0 || entry.videos && entry.videos.length > 0) && (
                          <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
                            {entry.photos && entry.photos.map((photo, index) => (
                              <div 
                                key={`photo-${index}`} 
                                className="relative flex-shrink-0 h-20 w-20 rounded-md overflow-hidden cursor-pointer"
                                onClick={() => handleOpenMediaViewer(entry, 'photo', index)}
                              >
                                <img src={photo} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                              </div>
                            ))}
                            {entry.videos && entry.videos.map((video, index) => (
                              <div 
                                key={`video-${index}`} 
                                className="relative flex-shrink-0 h-20 w-20 rounded-md overflow-hidden cursor-pointer"
                                onClick={() => handleOpenMediaViewer(entry, 'video', index)}
                              >
                                <video src={video} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                  <FileVideo className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {entry.taggedItems.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.taggedItems.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {entry.comments.length}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleViewEntry(entry)}>
                          자세히 보기
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="today" className="mt-0">
              {/* 오늘 탭 내용 - 구현 생략 */}
              <div className="text-center py-12 bg-muted rounded-lg">
                <p>오늘의 알림장을 표시합니다</p>
              </div>
            </TabsContent>
            
            <TabsContent value="week" className="mt-0">
              {/* 이번 주 탭 내용 - 구현 생략 */}
              <div className="text-center py-12 bg-muted rounded-lg">
                <p>이번 주 알림장을 표시합니다</p>
              </div>
            </TabsContent>
            
            <TabsContent value="month" className="mt-0">
              {/* 이번 달 탭 내용 - 구현 생략 */}
              <div className="text-center py-12 bg-muted rounded-lg">
                <p>이번 달 알림장을 표시합니다</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* 알림장 상세 보기 다이얼로그 */}
      <Dialog open={showEntryDetail} onOpenChange={setShowEntryDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedEntry.title}</span>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>작업</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStartEdit(selectedEntry)}>
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={handleDeleteEntry}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedEntry.petAvatar} alt={selectedEntry.petName} />
                    <AvatarFallback>{selectedEntry.petName.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedEntry.petName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedEntry.date), 'yyyy년 MM월 dd일')}
                    </p>
                  </div>
                  <div className="ml-auto text-2xl">
                    {(selectedEntry.mood === 'happy' && '😊') ||
                     (selectedEntry.mood === 'sad' && '😢') ||
                     (selectedEntry.mood === 'neutral' && '😐') ||
                     (selectedEntry.mood === 'excited' && '😃') ||
                     (selectedEntry.mood === 'tired' && '😴')}
                  </div>
                </div>
                
                <div className="mt-2 whitespace-pre-wrap">{selectedEntry.content}</div>
                
                {selectedEntry.activities && Object.keys(selectedEntry.activities).length > 0 && (
                  <div className="mt-4 border rounded-md p-4">
                    <h3 className="font-medium mb-2">오늘의 활동</h3>
                    <ActivityRecorder 
                      value={selectedEntry.activities} 
                      onChange={() => {}} // 읽기 전용
                      readOnly
                    />
                  </div>
                )}
                
                {(selectedEntry.photos && selectedEntry.photos.length > 0 || 
                  selectedEntry.videos && selectedEntry.videos.length > 0) && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">미디어</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {selectedEntry.photos && selectedEntry.photos.map((photo, index) => (
                        <div 
                          key={`photo-${index}`} 
                          className="aspect-square rounded-md overflow-hidden cursor-pointer"
                          onClick={() => handleOpenMediaViewer(selectedEntry, 'photo', index)}
                        >
                          <img src={photo} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {selectedEntry.videos && selectedEntry.videos.map((video, index) => (
                        <div 
                          key={`video-${index}`} 
                          className="aspect-square rounded-md overflow-hidden cursor-pointer relative"
                          onClick={() => handleOpenMediaViewer(selectedEntry, 'video', index)}
                        >
                          <video src={video} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <FileVideo className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEntry.taggedItems.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">태그</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedEntry.taggedItems.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">댓글 ({selectedEntry.comments.length})</h3>
                  
                  {selectedEntry.comments.length === 0 ? (
                    <div className="text-center py-6 bg-muted rounded-lg">
                      <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">첫 댓글을 남겨보세요</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedEntry.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 pb-4 border-b">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                            <AvatarFallback>{comment.authorName.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{comment.authorName}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {comment.authorRole === 'trainer' ? '훈련사' :
                                   comment.authorRole === 'pet-owner' ? '반려인' : '기관관리자'}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.timestamp), 'yyyy-MM-dd HH:mm')}
                              </span>
                            </div>
                            <p className="mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex gap-2">
                    <Textarea
                      ref={commentInputRef}
                      placeholder="댓글을 입력하세요..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      disabled={!commentText.trim()}
                      onClick={handleAddComment}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 새 알림장 작성 다이얼로그 */}
      <NotebookDialog
        open={showNewEntryDialog}
        onOpenChange={setShowNewEntryDialog}
        pets={pets}
        onSubmit={isEditMode ? handleUpdateEntry : handleAddEntry}
        onShowTemplateDialog={() => setShowTemplateDialog(true)}
        initialData={isEditMode ? selectedEntry : undefined}
      />
      
      {/* 템플릿 선택 다이얼로그 */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>템플릿 선택</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TemplateSelector onSelectTemplate={handleApplyTemplate} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 미디어 뷰어 */}
      <MediaViewer
        open={showMediaViewer}
        onOpenChange={setShowMediaViewer}
        files={mediaViewerFiles}
        initialIndex={mediaViewerIndex}
      />
    </div>
  );
}