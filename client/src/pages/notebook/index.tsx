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
  const [userRole, setUserRole] = useState<string | null>(null); // 사용자 권한 상태 추가
  const [user, setUser] = useState<any>(null); // 사용자 정보 상태 추가
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateFilterMode, setDateFilterMode] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');

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
        photos: [
          'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80'
        ],
        videos: [
          'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
        ],
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
        photos: [
          'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop&q=80'
        ],
        videos: [
          'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4'
        ],
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
        // 사용자 권한 및 정보 설정 (가정)
        setUserRole('trainer'); // 예시: 훈련사 권한
        setUser({
            id: 'trainer1',
            instituteId: 'institute1'
        });
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

    // 날짜 필터
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (dateFilterMode === 'today') {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfToday && entryDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
      });
    } else if (dateFilterMode === 'week') {
      const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfWeek && entryDate < endOfWeek;
      });
    } else if (dateFilterMode === 'month') {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfMonth && entryDate <= endOfMonth;
      });
    } else if (dateFilterMode === 'custom' && selectedCalendarDate) {
      const selectedDateStart = new Date(selectedCalendarDate.getFullYear(), selectedCalendarDate.getMonth(), selectedCalendarDate.getDate());
      const selectedDateEnd = new Date(selectedDateStart.getTime() + 24 * 60 * 60 * 1000);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= selectedDateStart && entryDate < selectedDateEnd;
      });
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
  }, [entries, searchQuery, selectedPet, selectedTrainer, sortBy, showRead, showUnread, dateFilterMode, selectedCalendarDate]);

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

  // 권한별 알림장 접근 제어
  const checkNotebookAccess = (entry: any) => {
    if (!userRole) return false;

    // 기관 관리자는 소속 훈련사의 알림장 조회 가능
    if (userRole === 'institute-admin') {
      return entry.trainerId && entry.instituteId === user?.instituteId;
    }

    // 훈련사는 자신이 담당하는 반려동물의 알림장만 접근
    if (userRole === 'trainer') {
      return entry.trainerId === user?.id;
    }

    // 반려인은 자신의 반려동물 알림장만 접근
    if (userRole === 'pet-owner') {
      return entry.ownerId === user?.id;
    }

    // 관리자는 모든 알림장 접근 가능
    return userRole === 'admin';
  };

  // AI 알림장 생성 (중복 제거)
  const handleAIGenerate = async (petData: any) => {
    // 권한 체크
    if (!['trainer', 'institute-admin', 'admin'].includes(userRole || '')) {
      toast({
        title: "권한 부족",
        description: "AI 알림장 생성은 훈련사 이상의 권한이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
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

  // 날짜별 알림장 통계 계산
  const getDateStats = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayCount = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfToday && entryDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    const weekCount = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
      return entryDate >= startOfWeek && entryDate < endOfWeek;
    }).length;

    const monthCount = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return entryDate >= startOfMonth && entryDate <= endOfMonth;
    }).length;

    const selectedDateCount = selectedCalendarDate ? entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const selectedDateStart = new Date(selectedCalendarDate.getFullYear(), selectedCalendarDate.getMonth(), selectedCalendarDate.getDate());
      const selectedDateEnd = new Date(selectedDateStart.getTime() + 24 * 60 * 60 * 1000);
      return entryDate >= selectedDateStart && entryDate < selectedDateEnd;
    }).length : 0;

    return {
      today: todayCount,
      week: weekCount,
      month: monthCount,
      selectedDate: selectedDateCount
    };
  }, [entries, selectedCalendarDate]);

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

  // 이미지 업로드 처리
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast({
          title: '파일 형식 오류',
          description: '이미지 파일만 업로드할 수 있습니다.',
          variant: 'destructive'
        });
        return false;
      }

      if (!isValidSize) {
        toast({
          title: '파일 크기 오류',
          description: '이미지 파일은 10MB 이하여야 합니다.',
          variant: 'destructive'
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setIsLoading(true);

    try {
      const uploadedImages = await Promise.all(
        validFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);

          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('이미지 업로드 실패');
          }

          const data = await response.json();
          return data.imageUrl;
        })
      );

      setNewEntry(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedImages]
      }));

      toast({
        title: '이미지 업로드 완료',
        description: `${uploadedImages.length}개의 이미지가 업로드되었습니다.`
      });

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast({
        title: '업로드 실패',
        description: '이미지 업로드 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 동영상 업로드 처리
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB

      if (!isValidType) {
        toast({
          title: '파일 형식 오류',
          description: '동영상 파일만 업로드할 수 있습니다.',
          variant: 'destructive'
        });
        return false;
      }

      if (!isValidSize) {
        toast({
          title: '파일 크기 오류',
          description: '동영상 파일은 50MB 이하여야 합니다.',
          variant: 'destructive'
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setIsLoading(true);

    try {
      const uploadedVideos = await Promise.all(
        validFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('video', file);

          const response = await fetch('/api/upload/video', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('동영상 업로드 실패');
          }

          const data = await response.json();
          return data.videoUrl;
        })
      );

      setNewEntry(prev => ({
        ...prev,
        videos: [...prev.videos, ...uploadedVideos]
      }));

      toast({
        title: '동영상 업로드 완료',
        description: `${uploadedVideos.length}개의 동영상이 업로드되었습니다.`
      });

    } catch (error) {
      console.error('동영상 업로드 실패:', error);
      toast({
        title: '업로드 실패',
        description: '동영상 업로드 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 삭제
  const removePhoto = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // 동영상 삭제
  const removeVideo = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
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
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-gray-200">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=${newEntry.petName || 'pet'}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&eyesColor=2563eb,7c3aed,dc2626,059669,ea580c&mouthColor=2563eb,7c3aed,dc2626,059669`} 
                      alt={newEntry.petName || '반려동물'}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <PawPrint className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">새 알림장 작성</h2>
                    <p className="text-sm text-gray-600">{newEntry.petName || '반려동물'}의 일일 기록</p>
                  </div>
                </DialogTitle>
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
                  <div className="space-y-4">
                    {/* 이미지 업로드 섹션 */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">사진 업로드</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">클릭하여 사진 선택</span>
                          <span className="text-xs text-gray-500 mt-1">JPG, PNG 등 (최대 10MB)</span>
                        </label>
                      </div>
                      {/* 업로드된 이미지 미리보기 */}
                      {newEntry.photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {newEntry.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 동영상 업로드 섹션 */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">동영상 업로드</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="video/*"
                          multiple
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">클릭하여 동영상 선택</span>
                          <span className="text-xs text-gray-500 mt-1">MP4, AVI 등 (최대 50MB)</span>
                        </label>
                      </div>
                      {/* 업로드된 동영상 미리보기 */}
                      {newEntry.videos.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {newEntry.videos.map((video, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">동영상 {index + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVideo(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
          <div className="flex flex-col gap-4">
            {/* 첫 번째 줄: 검색 및 기본 필터 */}
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

            {/* 두 번째 줄: 날짜 필터 */}
            <div className="flex flex-col sm:flex-row gap-4 items-center border-t pt-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">날짜 필터:</span>
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  variant={dateFilterMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilterMode('all')}
                >
                  전체 <Badge variant="secondary" className="ml-1">{entries.length}</Badge>
                </Button>
                <Button
                  variant={dateFilterMode === 'today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilterMode('today')}
                >
                  오늘 <Badge variant="secondary" className="ml-1">{getDateStats.today}</Badge>
                </Button>
                <Button
                  variant={dateFilterMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilterMode('week')}
                >
                  이번 주 <Badge variant="secondary" className="ml-1">{getDateStats.week}</Badge>
                </Button>
                <Button
                  variant={dateFilterMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilterMode('month')}
                >
                  이번 달 <Badge variant="secondary" className="ml-1">{getDateStats.month}</Badge>
                </Button>
                <Button
                  variant={dateFilterMode === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowCalendar(true)}
                >
                  날짜 선택
                  {dateFilterMode === 'custom' && selectedCalendarDate && (
                    <Badge variant="secondary" className="ml-1">{getDateStats.selectedDate}</Badge>
                  )}
                </Button>
              </div>

              {/* 선택된 날짜 표시 */}
              {dateFilterMode === 'custom' && selectedCalendarDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>선택된 날짜:</span>
                  <Badge variant="outline">
                    {format(selectedCalendarDate, 'yyyy년 MM월 dd일', { locale: ko })}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCalendarDate(undefined);
                      setDateFilterMode('all');
                    }}
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 캘린더 다이얼로그 */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>날짜 선택</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedCalendarDate}
              onSelect={(date) => {
                setSelectedCalendarDate(date);
                setDateFilterMode('custom');
                setShowCalendar(false);
              }}
              locale={ko}
              className="rounded-md border"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 결과 상태 표시 */}
      {filteredEntries.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {dateFilterMode === 'all' 
                ? `전체 ${filteredEntries.length}개의 알림장` 
                : `${dateFilterMode === 'today' ? '오늘' : 
                     dateFilterMode === 'week' ? '이번 주' : 
                     dateFilterMode === 'month' ? '이번 달' : 
                     '선택된 날짜'} ${filteredEntries.length}개의 알림장`
              }
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>읽지 않음: {filteredEntries.filter(e => !e.isRead).length}개</span>
            <span>미디어 포함: {filteredEntries.filter(e => e.photos.length > 0 || e.videos.length > 0).length}개</span>
          </div>
        </div>
      )}

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
                    <Avatar className="h-12 w-12 border-2 border-gray-200">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/big-ears${entry.petId === 'pet1' ? '-neutral' : ''}/svg?seed=${entry.petName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&eyesColor=2563eb,7c3aed,dc2626,059669,ea580c&mouthColor=2563eb,7c3aed,dc2626,059669`} 
                        alt={entry.petName}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
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

                {/* 미디어 미리보기 */}
                {(entry.photos.length > 0 || entry.videos.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">첨부 파일</h4>
                    <div className="flex gap-2">
                      {/* 이미지 미리보기 */}
                      {entry.photos.slice(0, 3).map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                          {entry.photos.length > 3 && index === 2 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-medium">+{entry.photos.length - 3}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {/* 동영상 미리보기 */}
                      {entry.videos.slice(0, 2).map((video, index) => (
                        <div key={index} className="relative">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <Video className="h-6 w-6 text-gray-400" />
                          </div>
                          {entry.videos.length > 2 && index === 1 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {entry.videos.length - 2}
                            </div>
                          )}
                        </div>
                      ))}
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
                  {/* 미디어 개수 표시 */}
                  {entry.photos.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {entry.photos.length}개 사진
                    </span>
                  )}
                  {entry.videos.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      {entry.videos.length}개 동영상
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
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-gray-200">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/big-ears${selectedEntry.petId === 'pet1' ? '-neutral' : ''}/svg?seed=${selectedEntry.petName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&eyesColor=2563eb,7c3aed,dc2626,059669,ea580c&mouthColor=2563eb,7c3aed,dc2626,059669`} 
                    alt={selectedEntry.petName}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <PawPrint className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedEntry.title}</h2>
                  <p className="text-sm text-gray-600">{selectedEntry.petName}의 알림장</p>
                </div>
                <div className="text-2xl ml-auto">{moodEmojis[selectedEntry.mood]}</div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">반려동물:</span>
                  <div className="flex items-center gap-2 font-medium">
                    <PawPrint className="h-4 w-4 text-blue-500" />
                    {selectedEntry.petName}
                  </div>
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

              {/* 미디어 갤러리 */}
              {(selectedEntry.photos.length > 0 || selectedEntry.videos.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">미디어 갤러리</h3>
                  <div className="space-y-4">
                    {/* 이미지 갤러리 */}
                    {selectedEntry.photos.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-600 mb-2">사진 ({selectedEntry.photos.length}장)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {selectedEntry.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(photo, '_blank')}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 동영상 갤러리 */}
                    {selectedEntry.videos.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-600 mb-2">동영상 ({selectedEntry.videos.length}개)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedEntry.videos.map((video, index) => (
                            <div key={index} className="relative">
                              <video
                                src={video}
                                controls
                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                preload="metadata"
                              />
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                동영상 {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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