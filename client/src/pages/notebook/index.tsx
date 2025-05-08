import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '../../SimpleApp';
import {
  PawPrint,
  Calendar,
  User,
  FileText,
  Award,
  Edit,
  Plus,
  ChevronRight,
  Trash2,
  ChevronLeft,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Filter,
  Clock,
  AlertCircle,
  Camera,
  Send,
  StickyNote,
  X,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, addDays, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// 반려견 정보 타입
interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  image?: string;
  gender: 'male' | 'female';
  weight: number;
  birthdate: string;
  ownerId: number;
  ownerName: string;
  trainerId?: number;
  trainerName?: string;
}

// 알림장 항목 타입
interface NotebookEntry {
  id: number;
  petId: string;
  date: string;
  authorId: number;
  authorName: string;
  authorRole: 'trainer' | 'owner';
  authorAvatar?: string;
  content: string;
  category: 'training' | 'meal' | 'health' | 'behavior' | 'etc';
  photos?: string[];
  mood?: 'good' | 'normal' | 'bad';
  tags?: string[];
  comments?: NotebookComment[];
  trainingDetails?: {
    focus: string;
    duration: number;
    progress: number;
    exercises: string[];
  };
  mealDetails?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
    amount: number;
  };
  healthDetails?: {
    weight?: number;
    symptoms?: string[];
    medication?: string;
    notes?: string;
  };
}

// 알림장 댓글 타입
interface NotebookComment {
  id: number;
  authorId: number;
  authorName: string;
  authorRole: 'trainer' | 'owner';
  authorAvatar?: string;
  content: string;
  date: string;
}

export default function NotebookPage() {
  const [match, params] = useRoute<{ id: string }>('/notebook/:id');
  const [location, navigate] = useLocation();
  const { isAuthenticated, userRole } = useAuth();
  const { toast } = useToast();

  // 인증되지 않은 사용자 리디렉션
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "알림장 기능을 이용하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate, toast]);

  // 상태 관리
  const [pet, setPet] = useState<Pet | null>(null);
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<NotebookEntry | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newEntry, setNewEntry] = useState<Partial<NotebookEntry>>({
    category: 'training',
    content: '',
    mood: 'normal',
    tags: [],
    photos: [],
    trainingDetails: {
      focus: '',
      duration: 30,
      progress: 50,
      exercises: []
    },
    mealDetails: {
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: '',
      amount: 0
    },
    healthDetails: {
      weight: 0,
      symptoms: [],
      medication: '',
      notes: ''
    }
  });

  // 데모 데이터 로드
  useEffect(() => {
    if (params?.id) {
      // 반려견 정보 샘플 데이터
      const mockPet: Pet = {
        id: params.id,
        name: "몽이",
        breed: "골든리트리버",
        age: 2,
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        gender: 'male',
        weight: 25.5,
        birthdate: "2021-05-15",
        ownerId: 1,
        ownerName: "홍길동",
        trainerId: 2,
        trainerName: "김훈련"
      };

      // 알림장 항목 샘플 데이터
      const mockEntries: NotebookEntry[] = [
        {
          id: 1,
          petId: params.id,
          date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
          authorId: 2,
          authorName: "김훈련",
          authorRole: 'trainer',
          authorAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          content: "오늘 몽이의 기본 복종 훈련을 진행했습니다. 앉아, 엎드려 명령에 대한 반응이 점점 좋아지고 있습니다. 특히 '기다려' 명령에 대한 집중력이 향상되었습니다.",
          category: 'training',
          mood: 'good',
          tags: ['기본훈련', '복종훈련'],
          trainingDetails: {
            focus: '기본 복종 훈련',
            duration: 45,
            progress: 70,
            exercises: ['앉아', '엎드려', '기다려', '이리와']
          },
          comments: [
            {
              id: 101,
              authorId: 1,
              authorName: "홍길동",
              authorRole: 'owner',
              content: "감사합니다! 집에서도 연습해보겠습니다. 특별히 주의해야 할 점이 있을까요?",
              date: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm')
            },
            {
              id: 102,
              authorId: 2,
              authorName: "김훈련",
              authorRole: 'trainer',
              authorAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
              content: "네, 기다려 명령은 조금씩 시간을 늘려가며 훈련하시는 것이 좋습니다. 처음에는 10초, 그다음에는 20초 식으로 늘려가세요.",
              date: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm')
            }
          ]
        },
        {
          id: 2,
          petId: params.id,
          date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
          authorId: 1,
          authorName: "홍길동",
          authorRole: 'owner',
          content: "오늘 몽이가 아침에 식사를 잘 하지 않았습니다. 점심에는 평소보다 적게 먹었고, 저녁에는 정상적으로 식사했습니다. 특별한 이상 증세는 보이지 않습니다.",
          category: 'meal',
          mood: 'normal',
          mealDetails: {
            breakfast: '드라이 푸드 100g (절반만 섭취)',
            lunch: '드라이 푸드 150g + 닭가슴살 소량',
            dinner: '드라이 푸드 200g + 영양제',
            snacks: '덴탈껌 1개',
            amount: 300
          }
        },
        {
          id: 3,
          petId: params.id,
          date: format(new Date(), 'yyyy-MM-dd'),
          authorId: 2,
          authorName: "김훈련",
          authorRole: 'trainer',
          authorAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          content: "오늘은 산책 중 다른 강아지를 만났을 때의 사회화 훈련을 진행했습니다. 처음에는 약간 긴장했지만, 점차 적응하여 좋은 모습을 보여주었습니다. 특히 작은 강아지들에게 온순한 태도를 보여 칭찬해주었습니다.",
          category: 'training',
          photos: [
            "https://images.unsplash.com/photo-1558929996-da64ba858215?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1562176566-e9afd27531d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          ],
          mood: 'good',
          tags: ['사회화', '산책훈련'],
          trainingDetails: {
            focus: '사회화 훈련',
            duration: 60,
            progress: 75,
            exercises: ['다른 강아지 만나기', '차분하게 인사하기', '리드줄 착용 상태에서 걷기']
          }
        },
        {
          id: 4,
          petId: params.id,
          date: format(new Date(), 'yyyy-MM-dd'),
          authorId: 1,
          authorName: "홍길동",
          authorRole: 'owner',
          content: "오늘 아침 몽이의 체중을 측정했습니다. 지난주보다 약간 증가했네요. 적절한 운동과 식이 조절이 필요할 것 같습니다.",
          category: 'health',
          mood: 'normal',
          healthDetails: {
            weight: 26.2,
            notes: '지난주 측정 시 25.5kg였음, 약간의 체중 증가'
          }
        }
      ];

      setPet(mockPet);
      setEntries(mockEntries);
    }
  }, [params]);

  // 선택된 날짜의 알림장 항목 필터링
  const entriesForSelectedDate = entries.filter(entry => {
    const sameDay = isSameDay(new Date(entry.date), selectedDate);
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return sameDay && matchesCategory;
  });

  // 알림장 항목 추가
  const addEntry = () => {
    if (!pet || !newEntry.content) {
      toast({
        title: "내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    const entryToAdd: NotebookEntry = {
      id: Date.now(),
      petId: pet.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      authorId: userRole === 'trainer' ? (pet.trainerId || 0) : pet.ownerId,
      authorName: userRole === 'trainer' ? (pet.trainerName || '') : pet.ownerName,
      authorRole: userRole === 'trainer' ? 'trainer' : 'owner',
      content: newEntry.content || '',
      category: (newEntry.category as NotebookEntry['category']) || 'etc',
      mood: (newEntry.mood as NotebookEntry['mood']) || 'normal',
      tags: newEntry.tags || [],
      photos: newEntry.photos || [],
      comments: [],
      ...(newEntry.category === 'training' && {
        trainingDetails: newEntry.trainingDetails
      }),
      ...(newEntry.category === 'meal' && {
        mealDetails: newEntry.mealDetails
      }),
      ...(newEntry.category === 'health' && {
        healthDetails: newEntry.healthDetails
      })
    };

    setEntries([...entries, entryToAdd]);
    setIsAddEntryDialogOpen(false);

    // 입력 폼 초기화
    setNewEntry({
      category: 'training',
      content: '',
      mood: 'normal',
      tags: [],
      photos: [],
      trainingDetails: {
        focus: '',
        duration: 30,
        progress: 50,
        exercises: []
      },
      mealDetails: {
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: '',
        amount: 0
      },
      healthDetails: {
        weight: 0,
        symptoms: [],
        medication: '',
        notes: ''
      }
    });

    toast({
      title: "알림장 작성 완료",
      description: "새로운 알림장 항목이 추가되었습니다.",
    });
  };

  // 알림장 항목 삭제
  const deleteEntry = () => {
    if (!selectedEntry) return;

    setEntries(entries.filter(entry => entry.id !== selectedEntry.id));
    setIsDeleteDialogOpen(false);
    setSelectedEntry(null);

    toast({
      title: "알림장 항목 삭제 완료",
      description: "선택한 항목이 삭제되었습니다.",
    });
  };

  // 댓글 추가
  const addComment = () => {
    if (!selectedEntry || !commentText.trim()) {
      toast({
        title: "댓글 내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    const newComment: NotebookComment = {
      id: Date.now(),
      authorId: userRole === 'trainer' ? (pet?.trainerId || 0) : (pet?.ownerId || 0),
      authorName: userRole === 'trainer' ? (pet?.trainerName || '') : (pet?.ownerName || ''),
      authorRole: userRole === 'trainer' ? 'trainer' : 'owner',
      content: commentText,
      date: format(new Date(), 'yyyy-MM-dd HH:mm')
    };

    const updatedEntries = entries.map(entry => {
      if (entry.id === selectedEntry.id) {
        return {
          ...entry,
          comments: [...(entry.comments || []), newComment]
        };
      }
      return entry;
    });

    setEntries(updatedEntries);
    setCommentText('');
    setIsCommentDialogOpen(false);

    toast({
      title: "댓글 추가 완료",
      description: "댓글이 추가되었습니다.",
    });
  };

  // 이전 날짜로 이동
  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  // 다음 날짜로 이동
  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  // 로딩 중이거나 반려견 정보가 없을 때
  if (!pet) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-primary">홈</a>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-700 font-medium">알림장</span>
      </div>

      {/* 반려견 정보 및 날짜 네비게이션 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Avatar
            src={pet.image}
            fallback={pet.name[0]}
            alt={pet.name}
            className="w-16 h-16 mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {pet.name}의 알림장
              <Badge className="ml-2 text-xs">{pet.breed}</Badge>
            </h1>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span className="mr-3">나이: {pet.age}세</span>
              <span className="mr-3">성별: {pet.gender === 'male' ? '남아' : '여아'}</span>
              <span>몸무게: {pet.weight}kg</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousDay}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md border text-center min-w-[140px]">
            <div className="text-sm font-medium">
              {format(selectedDate, 'PPP', { locale: ko })}
            </div>
            <div className="text-xs text-gray-500">
              {format(selectedDate, 'EEEE', { locale: ko })}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextDay}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button onClick={() => setIsAddEntryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            작성하기
          </Button>
        </div>
      </div>

      {/* 담당자 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-4">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm text-gray-500">보호자</div>
                <div className="font-medium">{pet.ownerName}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-4">
                <Award className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-sm text-gray-500">담당 훈련사</div>
                <div className="font-medium">{pet.trainerName || '미지정'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full mr-4">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <div className="text-sm text-gray-500">총 기록 수</div>
                <div className="font-medium">{entries.length}개</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추가된 카드 컴포넌트 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">오늘의 알림</h2>
            </div>
            <button className="text-primary hover:text-primary/80">
              <Edit className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium">산책 기록</h3>
              <p className="text-sm text-gray-600 mt-1">오전 30분 산책 완료</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium">식사량</h3>
              <p className="text-sm text-gray-600 mt-1">아침, 점심 식사 완료</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">훈련사 피드백</h2>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">기본 훈련 진행상황</h3>
                <span className="text-sm text-green-600">양호</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                기본 명령어 습득이 잘 되고 있습니다.
                지속적인 보상 훈련을 추천드립니다.
              </p>
            </div>
          </div>
        </Card>
      </div>


      {/* 알림장 내용 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">알림장 내용</h2>

          <div className="flex items-center gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="모든 카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                <SelectItem value="training">훈련</SelectItem>
                <SelectItem value="meal">식사</SelectItem>
                <SelectItem value="health">건강</SelectItem>
                <SelectItem value="behavior">행동</SelectItem>
                <SelectItem value="etc">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {entriesForSelectedDate.length > 0 ? (
          <div className="space-y-6">
            {entriesForSelectedDate.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar
                        src={entry.authorAvatar}
                        fallback={entry.authorName[0]}
                        alt={entry.authorName}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium flex items-center">
                          {entry.authorName}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {entry.authorRole === 'trainer' ? '훈련사' : '보호자'}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(entry.date), 'PPP', { locale: ko })} {' '}
                          {format(new Date(entry.date), 'a h:mm', { locale: ko })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={`
                          ${entry.category === 'training' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                          ${entry.category === 'meal' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                          ${entry.category === 'health' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                          ${entry.category === 'behavior' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                          ${entry.category === 'etc' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                        `}
                      >
                        {entry.category === 'training' && '훈련'}
                        {entry.category === 'meal' && '식사'}
                        {entry.category === 'health' && '건강'}
                        {entry.category === 'behavior' && '행동'}
                        {entry.category === 'etc' && '기타'}
                      </Badge>

                      <div className="flex ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setIsCommentDialogOpen(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {(userRole === 'trainer' && entry.authorRole === 'trainer') ||
                          (userRole === 'pet-owner' && entry.authorRole === 'owner') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => {
                                setSelectedEntry(entry);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  {/* 내용 */}
                  <div className="mb-4">
                    <p className="whitespace-pre-line">{entry.content}</p>
                  </div>

                  {/* 사진 */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                      {entry.photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 기분 */}
                  {entry.mood && (
                    <div className="flex items-center mb-3">
                      <span className="text-sm font-medium mr-2">기분:</span>
                      <Badge
                        variant="outline"
                        className={`
                          ${entry.mood === 'good' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                          ${entry.mood === 'normal' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                          ${entry.mood === 'bad' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                        `}
                      >
                        {entry.mood === 'good' && '좋음'}
                        {entry.mood === 'normal' && '보통'}
                        {entry.mood === 'bad' && '나쁨'}
                      </Badge>
                    </div>
                  )}

                  {/* 태그 */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* 훈련 상세 */}
                  {entry.category === 'training' && entry.trainingDetails && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-3">
                      <div className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">
                        훈련 세부 정보
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">훈련 주제:</span>
                          <span>{entry.trainingDetails.focus}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">훈련 시간:</span>
                          <span>{entry.trainingDetails.duration}분</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">진행도:</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${entry.trainingDetails.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">{entry.trainingDetails.progress}%</span>
                        </div>
                        <div className="flex items-center col-span-full">
                          <span className="text-gray-500 mr-2">훈련 항목:</span>
                          <div className="flex flex-wrap gap-1">
                            {entry.trainingDetails.exercises.map((exercise, index) => (
                              <Badge key={index}                              variant="outline" className="bg-white">
                                {exercise}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 식사 상세 */}
                  {entry.category === 'meal' && entry.mealDetails && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mb-3">
                      <div className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                        식사 세부 정보
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {entry.mealDetails.breakfast && (
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2 w-16">아침:</span>
                            <span>{entry.mealDetails.breakfast}</span>
                          </div>
                        )}
                        {entry.mealDetails.lunch && (
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2 w-16">점심:</span>
                            <span>{entry.mealDetails.lunch}</span>
                          </div>
                        )}
                        {entry.mealDetails.dinner && (
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2 w-16">저녁:</span>
                            <span>{entry.mealDetails.dinner}</span>
                          </div>
                        )}
                        {entry.mealDetails.snacks && (
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2 w-16">간식:</span>
                            <span>{entry.mealDetails.snacks}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2 w-16">총량:</span>
                          <span>{entry.mealDetails.amount}g</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 건강 상세 */}
                  {entry.category === 'health' && entry.healthDetails && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-3">
                      <div className="text-sm font-medium mb-2 text-red-700 dark:text-red-300">
                        건강 세부 정보
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {entry.healthDetails.weight && (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2 w-16">체중:</span>
                            <span>{entry.healthDetails.weight}kg</span>
                          </div>
                        )}
                        {entry.healthDetails.symptoms && entry.healthDetails.symptoms.length > 0 && (
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2 w-16">증상:</span>
                            <div className="flex flex-wrap gap-1">
                              {entry.healthDetails.symptoms.map((symptom, index) => (
                                <Badge key={index} variant="outline" className="bg-white">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {entry.healthDetails.medication && (
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2 w-16">약물:</span>
                            <span>{entry.healthDetails.medication}</span>
                          </div>
                        )}
                        {entry.healthDetails.notes && (
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2 w-16">메모:</span>
                            <span>{entry.healthDetails.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 댓글 */}
                  {entry.comments && entry.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium mb-2">댓글 ({entry.comments.length})</div>
                      <div className="space-y-3">
                        {entry.comments.map((comment) => (
                          <div key={comment.id} className="flex">
                            <Avatar
                              src={comment.authorAvatar}
                              fallback={comment.authorName[0]}
                              alt={comment.authorName}
                              className="w-8 h-8 mr-3 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="font-medium text-sm flex items-center">
                                    {comment.authorName}
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {comment.authorRole === 'trainer' ? '훈련사' : '보호자'}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-500">{comment.date}</div>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => {
                      setSelectedEntry(entry);
                      setIsCommentDialogOpen(true);
                    }}
                  >
                    댓글 작성
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <StickyNote className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                오늘의 기록이 없습니다
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                오늘의 훈련, 식사, 건강 상태 등을 기록해보세요.
                반려견의 성장 과정을 함께 공유할 수 있습니다.
              </p>
              <Button onClick={() => setIsAddEntryDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                알림장 작성하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 알림장 작성 다이얼로그 */}
      <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>알림장 작성</DialogTitle>
            <DialogDescription>
              {pet.name}의 {format(selectedDate, 'PPP', { locale: ko })} 알림장을 작성합니다.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="training"
            value={newEntry.category}
            onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
          >
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="training">훈련</TabsTrigger>
              <TabsTrigger value="meal">식사</TabsTrigger>
              <TabsTrigger value="health">건강</TabsTrigger>
              <TabsTrigger value="behavior">행동</TabsTrigger>
              <TabsTrigger value="etc">기타</TabsTrigger>
            </TabsList>

            <div className="space-y-4 mb-4">
              <div>
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="오늘의 활동, 특이사항 등을 자세히 기록해주세요."
                  className="mt-1"
                  rows={5}
                />
              </div>

              <div>
                <Label>기분</Label>
                <div className="flex space-x-2 mt-1">
                  <Button
                    type="button"
                    variant={newEntry.mood === 'good' ? 'default' : 'outline'}
                    className={newEntry.mood === 'good' ? 'bg-green-500 hover:bg-green-600' : ''}
                    onClick={() => setNewEntry({ ...newEntry, mood: 'good' })}
                  >
                    좋음
                  </Button>
                  <Button
                    type="button"
                    variant={newEntry.mood === 'normal' ? 'default' : 'outline'}
                    className={newEntry.mood === 'normal' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    onClick={() => setNewEntry({ ...newEntry, mood: 'normal' })}
                  >
                    보통
                  </Button>
                  <Button
                    type="button"
                    variant={newEntry.mood === 'bad' ? 'default' : 'outline'}
                    className={newEntry.mood === 'bad' ? 'bg-red-500 hover:bg-red-600' : ''}
                    onClick={() => setNewEntry({ ...newEntry, mood: 'bad' })}
                  >
                    나쁨
                  </Button>
                </div>
              </div>

              <div>
                <Label>태그 (선택사항)</Label>
                <Input
                  placeholder="태그를 입력하고 엔터를 누르세요 (예: 기본훈련, 산책, 식사거부)"
                  className="mt-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const inputElement = e.target as HTMLInputElement;
                      const value = inputElement.value.trim();
                      if (value && !newEntry.tags?.includes(value)) {
                        setNewEntry({
                          ...newEntry,
                          tags: [...(newEntry.tags || []), value]
                        });
                        inputElement.value = '';
                      }
                    }
                  }}
                />
                {newEntry.tags && newEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newEntry.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setNewEntry({
                            ...newEntry,
                            tags: newEntry.tags?.filter((_, i) => i !== index)
                          });
                        }}
                      >
                        #{tag} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>사진 (선택사항)</Label>
                <div className="mt-1">
                  <Label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-primary"
                  >
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">사진을 추가하려면 클릭하세요</span>
                    <span className="text-xs text-gray-400 mt-1">최대 3장까지 업로드 가능합니다</span>
                  </Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={newEntry.photos && newEntry.photos.length >= 3}
                    onChange={(e) => {
                      // 실제로는 파일 업로드 API를 호출해야 합니다.
                      // 여기서는 간단히 URL을 추가하는 방식으로 구현합니다.
                      if (e.target.files && e.target.files.length > 0) {
                        const mockUrls = [
                          "https://images.unsplash.com/photo-1558929996-da64ba858215?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                          "https://images.unsplash.com/photo-1562176566-e9afd27531d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                          "https://images.unsplash.com/photo-1598875384021-4a23470c7997?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        ];

                        const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];
                        setNewEntry({
                          ...newEntry,
                          photos: [...(newEntry.photos || []), randomUrl]
                        });
                      }
                    }}
                  />
                </div>

                {newEntry.photos && newEntry.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {newEntry.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                          onClick={() => {
                            setNewEntry({
                              ...newEntry,
                              photos: newEntry.photos?.filter((_, i) => i !== index)
                            });
                          }}
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 카테고리별 추가 필드 */}
              {newEntry.category === 'training' && (
                <div className="border p-4 rounded-md bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-medium mb-3">훈련 세부 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="training-focus">훈련 주제</Label>
                      <Input
                        id="training-focus"
                        placeholder="예: 기본 복종 훈련, 사회화 훈련"
                        className="mt-1"
                        value={newEntry.trainingDetails?.focus || ''}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          trainingDetails: {
                            ...newEntry.trainingDetails!,
                            focus: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="training-duration">훈련 시간 (분)</Label>
                      <Input
                        id="training-duration"
                        type="number"
                        min="5"
                        max="180"
                        className="mt-1"
                        value={newEntry.trainingDetails?.duration || 30}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          trainingDetails: {
                            ...newEntry.trainingDetails!,
                            duration: parseInt(e.target.value) || 30
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="training-progress">진행도 (%)</Label>
                      <Input
                        id="training-progress"
                        type="number"
                        min="0"
                        max="100"
                        className="mt-1"
                        value={newEntry.trainingDetails?.progress || 50}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          trainingDetails: {
                            ...newEntry.trainingDetails!,
                            progress: parseInt(e.target.value) || 50
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label>훈련 항목</Label>
                      <Input
                        placeholder="항목을 입력하고 엔터를 누르세요 (예: 앉아, 엎드려, 기다려)"
                        className="mt-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const inputElement = e.target as HTMLInputElement;
                            const value = inputElement.value.trim();
                            if (value && !newEntry.trainingDetails?.exercises.includes(value)) {
                              setNewEntry({
                                ...newEntry,
                                trainingDetails: {
                                  ...newEntry.trainingDetails!,
                                  exercises: [...(newEntry.trainingDetails?.exercises || []), value]
                                }
                              });
                              inputElement.value = '';
                            }
                          }
                        }}
                      />
                      {newEntry.trainingDetails?.exercises && newEntry.trainingDetails.exercises.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {newEntry.trainingDetails.exercises.map((exercise, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-white cursor-pointer"
                              onClick={() => {
                                setNewEntry({
                                  ...newEntry,
                                  trainingDetails: {
                                    ...newEntry.trainingDetails!,
                                    exercises: newEntry.trainingDetails?.exercises.filter((_, i) => i !== index)
                                  }
                                });
                              }}
                            >
                              {exercise} <X className="ml-1 h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {newEntry.category === 'meal' && (
                <div className="border p-4 rounded-md bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-medium mb-3">식사 세부 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="meal-breakfast">아침</Label>
                      <Input
                        id="meal-breakfast"
                        placeholder="예: 드라이 푸드 200g"
                        className="mt-1"
                        value={newEntry.mealDetails?.breakfast || ''}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          mealDetails: {
                            ...newEntry.mealDetails!,
                            breakfast: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="meal-lunch">점심</Label>
                      <Input
                        id="meal-lunch"
                        placeholder="예: 드라이 푸드 150g, 닭가슴살 소량"
                        className="mt-1"
                        value={newEntry.mealDetails?.lunch || ''}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          mealDetails: {
                            ...newEntry.mealDetails!,
                            lunch: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="meal-dinner">저녁</Label>
                      <Input
                        id="meal-dinner"
                        placeholder="예: 드라이 푸드 200g, 영양제"
                        className="mt-1"
                        value={newEntry.mealDetails?.dinner || ''}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          mealDetails: {
                            ...newEntry.mealDetails!,
                            dinner: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="meal-snacks">간식</Label>
                      <Input
                        id="meal-snacks"
                        placeholder="예: 덴탈껌 1개, 트릿 소량"
                        className="mt-1"
                        value={newEntry.mealDetails?.snacks || ''}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          mealDetails: {
                            ...newEntry.mealDetails!,
                            snacks: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="meal-amount">총 식사량 (g)</Label>
                      <Input
                        id="meal-amount"
                        type="number"
                        min="0"
                        className="mt-1"
                        value={newEntry.mealDetails?.amount || 0}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          mealDetails: {
                            ...newEntry.mealDetails!,
                            amount: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {newEntry.category === 'health' && (
                <div className="border p-4 rounded-md bg-red-50 dark:bg-red-900/20">
                  <h3 className="font-medium mb-3">건강 세부 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="health-weight">체중 (kg)</Label>
                      <Input
                        id="health-weight"
                        type="number"
                        step="0.1"
                        min="0"
                        className="mt-1"
                        value={newEntry.healthDetails?.weight || 0}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          healthDetails: {
                            ...newEntry.healthDetails!,
                            weight: parseFloat(e.target.value) || 0
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label>증상</Label>
                      <Input
                        placeholder="증상을 입력하고 엔터를 누르세요 (예: 설사, 구토, 식욕부진)"
                        className="mt-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const inputElement = e.target as HTMLInputElement;
                            const value = inputElement.value.trim();
                            if (value && !newEntry.healthDetails?.symptoms?.includes(value)) {
                              setNewEntry({
                                ...newEntry,
                                healthDetails: {
                                  ...newEntry.healthDetails!,
                                  symptoms: [...(newEntry.healthDetails?.symptoms || []), value]
                                }
                              });
                              inputElement.value = '';
                            }
                          }
                        }}
                      />
                      {newEntry.healthDetails?.symptoms && newEntry.healthDetails.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {newEntry.healthDetails.symptoms.map((symptom, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-white cursor-pointer"
                              onClick={() => {
                                setNewEntry({
                                  ...newEntry,
                                  healthDetails: {
                                    ...newEntry.healthDetails!,
                                    symptoms: newEntry.healthDetails?.symptoms?.filter((_, i) => i !== index)
                                  }
                                });
                              }}
                            >
                              {symptom} <X className="ml-1 h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="health-medication">약물/처치</Label>
                      <Input
                        id="health-medication"
                        placeholder="예: 정장제 1정, 항생제 처방"
                        className="mt-1"
                        value={newEntry.healthDetails?.medication || ''}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          healthDetails: {
                            ...newEntry.healthDetails!,
                            medication: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="health-notes">특이사항</Label>
                      <Textarea
                        id="health-notes"
                        placeholder="기타 건강 관련 특이사항을 입력해주세요"
                        className="mt-1"
                        value={newEntry.healthDetails?.notes || ''}
                        onChange={(e) => setNewEntry({
                          ...newEntry,
                          healthDetails: {
                            ...newEntry.healthDetails!,
                            notes: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEntryDialogOpen(false)}>취소</Button>
            <Button onClick={addEntry}>작성 완료</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 댓글 작성 다이얼로그 */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>댓글 작성</DialogTitle>
            <DialogDescription>
              {selectedEntry?.authorName}님의 알림장에 댓글을 작성합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="댓글 내용을 입력하세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>취소</Button>
            <Button onClick={addComment}>댓글 작성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림장 항목 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 알림장 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEntry} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}