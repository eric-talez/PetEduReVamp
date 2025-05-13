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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Calendar as CalendarIcon,
  Search,
  Check,
  Plus,
  X,
  ChevronDown,
  Edit,
  Trash2,
  Filter,
  Send,
  Image,
  RefreshCw,
  Paperclip,
  BookOpen,
  MessageSquare,
  MoreVertical,
  Smile
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
  comments: Comment[];
  taggedItems: string[];
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

interface Pet {
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
  const [newEntryForm, setNewEntryForm] = useState({
    title: '',
    content: '',
    petId: 0,
    mood: 'happy' as 'happy' | 'sad' | 'neutral' | 'excited' | 'tired',
    taggedItems: [] as string[]
  });
  const [commentText, setCommentText] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  
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
            avatar: ''
          },
          {
            id: 2,
            name: '루시',
            breed: '말티즈',
            avatar: ''
          },
          {
            id: 3,
            name: '콩이',
            breed: '웰시코기',
            avatar: ''
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
            petAvatar: '',
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
            petAvatar: '',
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
            petAvatar: '',
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
          },
          {
            id: 4,
            date: '2024-05-15',
            title: '초코 훈련 2주차',
            content: '초코의 훈련 2주차가 지났습니다. 처음보다 훨씬 더 집중력이 좋아졌고, 기본 명령어에 대한 반응도 빨라졌어요. 특히 앉아와 기다려 명령에 대한 반응이 훨씬 안정적이 되었습니다. 이번 주에는 손 훈련을 새롭게 시작했는데, 조금 더 연습이 필요할 것 같아요. 전반적으로 초코의 발전 속도가 빠른 편이라 매우 만족스럽습니다.',
            petId: 1,
            petName: '초코',
            petAvatar: '',
            mood: 'happy',
            comments: [],
            taggedItems: ['훈련', '2주차', '발전']
          },
          {
            id: 5,
            date: '2024-05-14',
            title: '루시 미용하는 날',
            content: '오늘 루시를 미용샵에 데려갔어요. 여름이 다가와서 좀 더 시원하게 짧은 스타일로 미용을 했습니다. 처음에는 미용을 무서워했지만, 미용사 선생님이 차분하게 대해주셔서 나중에는 꽤 편안해 했어요. 미용 후에는 평소보다 활발하게 움직이는 모습을 보여서 시원함을 느끼는 것 같습니다. 미용 후 특별히 간식도 사줬어요!',
            petId: 2,
            petName: '루시',
            petAvatar: '',
            mood: 'neutral',
            comments: [],
            taggedItems: ['미용', '여름준비', '털관리']
          }
        ];
        
        setPets(mockPets);
        setEntries(mockEntries);
        
        // 새 입력 폼의 기본 반려동물 설정
        if (mockPets.length > 0) {
          setNewEntryForm(prev => ({ ...prev, petId: mockPets[0].id }));
        }
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
  const handleAddEntry = () => {
    if (!newEntryForm.title.trim() || !newEntryForm.content.trim() || !newEntryForm.petId) {
      toast({
        title: '입력 확인',
        description: '제목, 내용, 반려동물은 필수 입력 항목입니다.',
        variant: 'destructive',
      });
      return;
    }
    
    const pet = pets.find(p => p.id === newEntryForm.petId);
    if (!pet) return;
    
    const newEntry: NotebookEntry = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      title: newEntryForm.title,
      content: newEntryForm.content,
      petId: newEntryForm.petId,
      petName: pet.name,
      petAvatar: pet.avatar,
      mood: newEntryForm.mood,
      comments: [],
      taggedItems: newEntryForm.taggedItems
    };
    
    setEntries(prev => [newEntry, ...prev]);
    
    setShowNewEntryDialog(false);
    setNewEntryForm({
      title: '',
      content: '',
      petId: pet.id,
      mood: 'happy',
      taggedItems: []
    });
    
    toast({
      title: '알림장 추가됨',
      description: '새 알림장이 성공적으로 추가되었습니다.',
    });
  };
  
  // 알림장 수정
  const handleEditEntry = () => {
    if (!selectedEntry) return;
    
    setNewEntryForm({
      title: selectedEntry.title,
      content: selectedEntry.content,
      petId: selectedEntry.petId,
      mood: selectedEntry.mood,
      taggedItems: selectedEntry.taggedItems
    });
    
    setIsEditMode(true);
    setShowEntryDetail(false);
    setShowNewEntryDialog(true);
  };
  
  // 알림장 수정 저장
  const handleSaveEdit = () => {
    if (!selectedEntry || !newEntryForm.title.trim() || !newEntryForm.content.trim()) return;
    
    const pet = pets.find(p => p.id === newEntryForm.petId);
    if (!pet) return;
    
    const updatedEntry: NotebookEntry = {
      ...selectedEntry,
      title: newEntryForm.title,
      content: newEntryForm.content,
      petId: newEntryForm.petId,
      petName: pet.name,
      petAvatar: pet.avatar,
      mood: newEntryForm.mood,
      taggedItems: newEntryForm.taggedItems
    };
    
    setEntries(prev => prev.map(e => 
      e.id === selectedEntry.id ? updatedEntry : e
    ));
    
    setShowNewEntryDialog(false);
    setIsEditMode(false);
    setSelectedEntry(updatedEntry);
    setShowEntryDetail(true);
    
    toast({
      title: '알림장 수정됨',
      description: '알림장이 성공적으로 수정되었습니다.',
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
  
  // 태그 추가
  const handleAddTag = (tag: string) => {
    if (!tag.trim()) return;
    
    setNewEntryForm(prev => ({
      ...prev,
      taggedItems: [...prev.taggedItems, tag]
    }));
  };
  
  // 태그 제거
  const handleRemoveTag = (tag: string) => {
    setNewEntryForm(prev => ({
      ...prev,
      taggedItems: prev.taggedItems.filter(t => t !== tag)
    }));
  };
  
  // 필터 초기화
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterPet(null);
    setFilterDate(null);
    setFilterMood(null);
  };
  
  // 기분 아이콘 렌더링
  const renderMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500">😊</div>;
      case 'sad':
        return <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">😢</div>;
      case 'neutral':
        return <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">😐</div>;
      case 'excited':
        return <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">😃</div>;
      case 'tired':
        return <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">😴</div>;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">😐</div>;
    }
  };
  
  // 기분 텍스트
  const getMoodText = (mood: string) => {
    switch (mood) {
      case 'happy': return '행복';
      case 'sad': return '슬픔';
      case 'neutral': return '보통';
      case 'excited': return '신남';
      case 'tired': return '피곤';
      default: return '보통';
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* 알림장 상세 모달 */}
      <Dialog open={showEntryDetail} onOpenChange={setShowEntryDetail}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">{selectedEntry.title}</DialogTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEditEntry}>
                        <Edit className="mr-2 h-4 w-4" />
                        수정하기
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDeleteEntry} className="text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <DialogDescription>
                  {format(new Date(selectedEntry.date), 'PPP', { locale: ko })} · {selectedEntry.petName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedEntry.petAvatar} alt={selectedEntry.petName} />
                    <AvatarFallback>{selectedEntry.petName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{selectedEntry.petName}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-sm text-muted-foreground">기분:</span>
                    {renderMoodIcon(selectedEntry.mood)}
                    <span className="text-sm">{getMoodText(selectedEntry.mood)}</span>
                  </div>
                </div>
                
                <div className="whitespace-pre-wrap text-base mt-2">
                  {selectedEntry.content}
                </div>
                
                {selectedEntry.taggedItems.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedEntry.taggedItems.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">댓글 {selectedEntry.comments.length}개</h3>
                  <div className="space-y-4">
                    {selectedEntry.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                          <AvatarFallback>{comment.authorName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.authorName}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.authorRole === 'trainer' ? '훈련사' : 
                               comment.authorRole === 'institute-admin' ? '기관관리자' : '반려인'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.timestamp), 'PPp', { locale: ko })}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {selectedEntry.comments.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{userName?.substring(0, 2) || '사용자'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          ref={commentInputRef}
                          placeholder="댓글을 입력하세요..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end mt-2">
                          <Button 
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            댓글 추가
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 새 알림장 작성 모달 */}
      <Dialog open={showNewEntryDialog} onOpenChange={(open) => {
        setShowNewEntryDialog(open);
        if (!open) setIsEditMode(false);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? '알림장 수정' : '새 알림장 작성'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? '알림장 내용을 수정합니다.' : '오늘의 반려동물 활동을 기록해보세요.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                제목
              </label>
              <Input
                id="title"
                placeholder="알림장 제목을 입력하세요"
                value={newEntryForm.title}
                onChange={(e) => setNewEntryForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="pet" className="block text-sm font-medium mb-1">
                반려동물
              </label>
              <Select
                value={newEntryForm.petId.toString()}
                onValueChange={(value) => setNewEntryForm(prev => ({ ...prev, petId: parseInt(value) }))}
              >
                <SelectTrigger id="pet">
                  <SelectValue placeholder="반려동물을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name} ({pet.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="mood" className="block text-sm font-medium mb-1">
                오늘의 기분
              </label>
              <Select
                value={newEntryForm.mood}
                onValueChange={(value: any) => setNewEntryForm(prev => ({ ...prev, mood: value }))}
              >
                <SelectTrigger id="mood">
                  <SelectValue placeholder="기분을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">
                    <div className="flex items-center">
                      <span className="mr-2">😊</span> 행복해요
                    </div>
                  </SelectItem>
                  <SelectItem value="sad">
                    <div className="flex items-center">
                      <span className="mr-2">😢</span> 슬퍼요
                    </div>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <div className="flex items-center">
                      <span className="mr-2">😐</span> 보통이에요
                    </div>
                  </SelectItem>
                  <SelectItem value="excited">
                    <div className="flex items-center">
                      <span className="mr-2">😃</span> 신나요
                    </div>
                  </SelectItem>
                  <SelectItem value="tired">
                    <div className="flex items-center">
                      <span className="mr-2">😴</span> 피곤해요
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                내용
              </label>
              <Textarea
                id="content"
                placeholder="알림장 내용을 입력하세요"
                value={newEntryForm.content}
                onChange={(e) => setNewEntryForm(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[150px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                태그
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newEntryForm.taggedItems.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    #{tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="태그 입력 후 추가 버튼 클릭"
                  value={(newEntryForm as any).tagInput || ''}
                  onChange={(e) => setNewEntryForm(prev => ({ ...prev, tagInput: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag((newEntryForm as any).tagInput);
                      setNewEntryForm(prev => ({ ...prev, tagInput: '' }));
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleAddTag((newEntryForm as any).tagInput);
                    setNewEntryForm(prev => ({ ...prev, tagInput: '' }));
                  }}
                  disabled={!((newEntryForm as any).tagInput || '').trim()}
                >
                  추가
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewEntryDialog(false);
                setIsEditMode(false);
              }}
            >
              취소
            </Button>
            <Button onClick={isEditMode ? handleSaveEdit : handleAddEntry}>
              {isEditMode ? '수정하기' : '등록하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">알림장</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                리스트 보기
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                그리드 보기
              </>
            )}
          </Button>
          <Button onClick={() => setShowNewEntryDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            새 알림장
          </Button>
        </div>
      </div>
      
      {/* 필터링 도구 */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="알림장 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterPet?.toString() || 'all'} onValueChange={(value) => setFilterPet(value === 'all' ? null : parseInt(value))}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="반려동물" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 반려동물</SelectItem>
            {pets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id.toString()}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={filterDate ? '' : 'text-muted-foreground'}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, 'PPP', { locale: ko }) : '날짜 선택'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filterDate || undefined}
              onSelect={(date) => setFilterDate(date)}
              locale={ko}
            />
          </PopoverContent>
        </Popover>
        
        <Select value={filterMood || 'all'} onValueChange={(value) => setFilterMood(value === 'all' ? null : value)}>
          <SelectTrigger className="md:w-[150px]">
            <SelectValue placeholder="기분" />
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
        
        <Button variant="ghost" size="sm" onClick={handleResetFilters}>
          필터 초기화
        </Button>
      </div>
      
      {/* 알림장 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center p-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">알림장이 없습니다</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            새 알림장을 작성하거나 검색 필터를 조정해보세요.
          </p>
          <Button onClick={() => setShowNewEntryDialog(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            새 알림장 작성
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        // 그리드 뷰
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(entry.date), 'PPP', { locale: ko })}
                    </CardDescription>
                  </div>
                  {renderMoodIcon(entry.mood)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center mb-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={entry.petAvatar} alt={entry.petName} />
                    <AvatarFallback>{entry.petName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{entry.petName}</span>
                </div>
                <p className="text-sm line-clamp-3">{entry.content}</p>
                {entry.taggedItems.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.taggedItems.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {entry.taggedItems.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{entry.taggedItems.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {entry.comments.length}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewEntry(entry)}>
                  상세 보기
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // 리스트 뷰
        <div className="divide-y">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="py-4 hover:bg-muted/50 px-2 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <h3 className="font-medium text-base">{entry.title}</h3>
                      {renderMoodIcon(entry.mood)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), 'PPP', { locale: ko })}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={entry.petAvatar} alt={entry.petName} />
                      <AvatarFallback>{entry.petName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{entry.petName}</span>
                  </div>
                  
                  <p className="text-sm line-clamp-2 mb-2">{entry.content}</p>
                  
                  {entry.taggedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.taggedItems.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {entry.comments.length} 댓글
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleViewEntry(entry)}>
                      상세 보기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}