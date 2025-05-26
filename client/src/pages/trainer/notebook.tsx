import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Dog,
  User,
  Clock,
  Filter,
  RefreshCw,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TrainingNote {
  id: number;
  petName: string;
  ownerName: string;
  date: string;
  duration: number; // 분 단위
  content: string;
  tags: string[];
  progress: 'excellent' | 'good' | 'average' | 'needs_improvement';
  nextPlan?: string;
  attachments?: string[];
}

export default function TrainerNotebook() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<TrainingNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<TrainingNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgress, setSelectedProgress] = useState<string>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<TrainingNote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // 새 노트 입력 상태
  const [newNote, setNewNote] = useState({
    petName: '',
    ownerName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 60,
    content: '',
    tags: '',
    progress: 'good' as TrainingNote['progress'],
    nextPlan: ''
  });

  // 훈련 노트 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 훈련 노트 데이터
        const mockNotes: TrainingNote[] = [
          {
            id: 1,
            petName: '코코',
            ownerName: '김철수',
            date: '2024-05-15',
            duration: 90,
            content: '기본 명령어 훈련을 진행했습니다. "앉아", "기다려", "엎드려" 명령에 대한 반응이 향상되었습니다. 특히 "앉아" 명령은 거의 완벽하게 수행합니다.',
            tags: ['기본훈련', '명령어', '복종'],
            progress: 'excellent',
            nextPlan: '다음 시간에는 "손" 명령어를 추가로 가르칠 예정입니다.'
          },
          {
            id: 2,
            petName: '망고',
            ownerName: '이영희',
            date: '2024-05-14',
            duration: 60,
            content: '짖음 문제 교정 훈련을 실시했습니다. 벨소리에 대한 과도한 반응을 줄이는 연습을 했고, 약간의 개선이 보입니다.',
            tags: ['문제행동', '짖음교정', '행동수정'],
            progress: 'good',
            nextPlan: '지속적인 둔감화 훈련이 필요합니다.'
          },
          {
            id: 3,
            petName: '보리',
            ownerName: '정민수',
            date: '2024-05-13',
            duration: 120,
            content: '어질리티 기본 동작 훈련을 진행했습니다. 허들 점프와 터널 통과를 연습했고, 터널 통과는 성공했으나 허들 점프에서 약간 주저하는 모습을 보였습니다.',
            tags: ['어질리티', '점프', '터널'],
            progress: 'average',
            nextPlan: '허들 높이를 낮춰서 점진적으로 높여갈 예정입니다.'
          },
          {
            id: 4,
            petName: '루나',
            ownerName: '한소희',
            date: '2024-05-12',
            duration: 45,
            content: '사회화 훈련을 진행했습니다. 다른 강아지들과의 상호작용에서 여전히 소극적인 모습을 보입니다. 천천히 접근하고 있습니다.',
            tags: ['사회화', '상호작용', '소극적'],
            progress: 'needs_improvement',
            nextPlan: '더 친근한 강아지와의 만남을 계획합니다.'
          },
          {
            id: 5,
            petName: '몽이',
            ownerName: '장수현',
            date: '2024-05-11',
            duration: 75,
            content: '산책 에티켓 훈련을 실시했습니다. 줄 당기기가 많이 줄어들었고, 주인과의 보조 맞추기가 향상되었습니다.',
            tags: ['산책', '에티켓', '줄당기기'],
            progress: 'good',
            nextPlan: '다양한 환경에서의 산책 연습이 필요합니다.'
          },
          {
            id: 6,
            petName: '초코',
            ownerName: '김민준',
            date: '2024-05-10',
            duration: 90,
            content: '공격성 교정 훈련을 진행했습니다. 낯선 사람에 대한 경계심이 여전히 강하지만, 훈련사에 대한 신뢰는 쌓이고 있습니다.',
            tags: ['공격성', '교정', '신뢰구축'],
            progress: 'average',
            nextPlan: '점진적인 사회화와 신뢰 관계 강화가 필요합니다.'
          }
        ];
        
        setNotes(mockNotes);
      } catch (error) {
        console.error('훈련 노트 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '훈련 노트 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // 필터링된 노트 업데이트
  useEffect(() => {
    let result = [...notes];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        note => 
          note.petName.toLowerCase().includes(query) ||
          note.ownerName.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // 진행 상태 필터링
    if (selectedProgress !== 'all') {
      result = result.filter(note => note.progress === selectedProgress);
    }
    
    // 날짜 기준 내림차순 정렬
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredNotes(result);
  }, [notes, searchQuery, selectedProgress]);

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 진행 상태에 따른 배지 스타일
  const getProgressBadge = (progress: TrainingNote['progress']) => {
    switch(progress) {
      case 'excellent':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">매우 좋음</Badge>;
      case 'good':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">좋음</Badge>;
      case 'average':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">보통</Badge>;
      case 'needs_improvement':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">개선 필요</Badge>;
      default:
        return <Badge variant="outline">미정</Badge>;
    }
  };

  // 새 노트 추가
  const handleAddNote = async () => {
    try {
      const note: TrainingNote = {
        id: Date.now(),
        petName: newNote.petName,
        ownerName: newNote.ownerName,
        date: newNote.date,
        duration: newNote.duration,
        content: newNote.content,
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        progress: newNote.progress,
        nextPlan: newNote.nextPlan
      };

      setNotes(prev => [note, ...prev]);
      setIsAddingNote(false);
      setNewNote({
        petName: '',
        ownerName: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        duration: 60,
        content: '',
        tags: '',
        progress: 'good',
        nextPlan: ''
      });

      toast({
        title: '훈련 노트 추가',
        description: '새로운 훈련 노트가 추가되었습니다.',
      });
    } catch (error) {
      toast({
        title: '노트 추가 실패',
        description: '훈련 노트 추가 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 노트 삭제
  const handleDeleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: '훈련 노트 삭제',
      description: '선택한 훈련 노트가 삭제되었습니다.',
    });
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '훈련 노트 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <BookOpen className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">훈련 노트 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">훈련 노트</h1>
          <p className="text-muted-foreground">반려견 훈련 기록을 체계적으로 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          <Button onClick={() => setIsAddingNote(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 노트 작성
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 노트 수</p>
                <p className="text-2xl font-bold">{notes.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Dog className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">담당 반려견</p>
                <p className="text-2xl font-bold">{new Set(notes.map(n => n.petName)).size}마리</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 훈련 시간</p>
                <p className="text-2xl font-bold">{notes.reduce((sum, note) => sum + note.duration, 0)}분</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">담당 고객</p>
                <p className="text-2xl font-bold">{new Set(notes.map(n => n.ownerName)).size}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="반려견 이름, 고객명, 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedProgress}
            onChange={(e) => setSelectedProgress(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">모든 진행 상태</option>
            <option value="excellent">매우 좋음</option>
            <option value="good">좋음</option>
            <option value="average">보통</option>
            <option value="needs_improvement">개선 필요</option>
          </select>
        </div>
      </div>

      {/* 노트 목록 */}
      {paginatedNotes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Dog className="h-5 w-5 text-primary" />
                      {note.petName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {note.ownerName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getProgressBadge(note.progress)}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(note.date), 'yyyy년 MM월 dd일 (eee)', {locale: ko})}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {note.duration}분
                  </span>
                </div>
                
                <div>
                  <p className="text-sm leading-relaxed">{note.content}</p>
                </div>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {note.nextPlan && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>다음 계획:</strong> {note.nextPlan}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">훈련 노트가 없습니다</h3>
          <p className="text-muted-foreground mb-4">첫 번째 훈련 노트를 작성해보세요.</p>
          <Button onClick={() => setIsAddingNote(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 노트 작성
          </Button>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {/* 새 노트 작성 모달 (실제로는 Dialog 컴포넌트 사용) */}
      {isAddingNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>새 훈련 노트 작성</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingNote(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">반려견 이름</label>
                  <Input
                    value={newNote.petName}
                    onChange={(e) => setNewNote(prev => ({...prev, petName: e.target.value}))}
                    placeholder="반려견 이름"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">견주 이름</label>
                  <Input
                    value={newNote.ownerName}
                    onChange={(e) => setNewNote(prev => ({...prev, ownerName: e.target.value}))}
                    placeholder="견주 이름"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">훈련 날짜</label>
                  <Input
                    type="date"
                    value={newNote.date}
                    onChange={(e) => setNewNote(prev => ({...prev, date: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">훈련 시간 (분)</label>
                  <Input
                    type="number"
                    value={newNote.duration}
                    onChange={(e) => setNewNote(prev => ({...prev, duration: parseInt(e.target.value) || 60}))}
                    placeholder="60"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">훈련 내용</label>
                <Textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({...prev, content: e.target.value}))}
                  placeholder="오늘 진행한 훈련 내용을 상세히 기록해주세요..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">태그 (쉼표로 구분)</label>
                <Input
                  value={newNote.tags}
                  onChange={(e) => setNewNote(prev => ({...prev, tags: e.target.value}))}
                  placeholder="기본훈련, 명령어, 복종"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">진행 상태</label>
                <select
                  value={newNote.progress}
                  onChange={(e) => setNewNote(prev => ({...prev, progress: e.target.value as TrainingNote['progress']}))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="excellent">매우 좋음</option>
                  <option value="good">좋음</option>
                  <option value="average">보통</option>
                  <option value="needs_improvement">개선 필요</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">다음 계획</label>
                <Textarea
                  value={newNote.nextPlan}
                  onChange={(e) => setNewNote(prev => ({...prev, nextPlan: e.target.value}))}
                  placeholder="다음 훈련에서 진행할 계획을 작성해주세요..."
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                  취소
                </Button>
                <Button 
                  onClick={handleAddNote}
                  disabled={!newNote.petName || !newNote.ownerName || !newNote.content}
                >
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}