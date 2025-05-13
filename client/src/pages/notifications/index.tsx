import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  Clipboard, 
  CheckSquare, 
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  X,
  Search
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// 알림장 항목 타입 정의
interface NotebookEntry {
  id: string;
  date: string;
  petId: number;
  petName: string;
  content: string;
  author: {
    id: number;
    name: string;
    role: 'trainer' | 'pet-owner' | 'admin';
    avatar?: string;
  };
  activities: string[];
  status: 'completed' | 'in-progress' | 'planned';
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  tags: string[];
  isImportant: boolean;
  reactions?: {
    likes: number;
    hasLiked: boolean;
    comments: number;
  };
  createdAt: string;
  updatedAt?: string;
  isFavorite: boolean;
}

// 반려동물 타입 정의
interface Pet {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  avatar?: string;
}

// 훈련사 타입 정의
interface Trainer {
  id: number;
  name: string;
  specialty: string;
  avatar?: string;
}

// 활동 타입 정의
interface Activity {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'training' | 'care' | 'play' | 'health';
}

// 템플릿 타입 정의
interface Template {
  id: string;
  title: string;
  content: string;
  activities: string[];
}

// 알림장 컴포넌트
export default function NotebookPage() {
  const { toast } = useToast();
  
  // 상태 관리
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [viewEntry, setViewEntry] = useState<NotebookEntry | null>(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [entryContent, setEntryContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  
  // 사용자 정보 (전역 상태에서 가져올 예정)
  const [userInfo, setUserInfo] = useState({
    id: 1,
    name: '사용자',
    role: 'pet-owner' as 'trainer' | 'pet-owner' | 'admin',
    avatar: ''
  });
  
  // 미디어 업로드 상태
  const [uploadedMedia, setUploadedMedia] = useState<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    file?: File;
  }[]>([]);
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    // 가상 데이터 로드 (실제로는 API 호출)
    loadMockData();
    
    // 전역 사용자 정보 가져오기
    const windowAuth = window.__peteduAuthState;
    if (windowAuth && windowAuth.isAuthenticated) {
      setUserInfo({
        id: 1,
        name: windowAuth.userName || '사용자',
        role: (windowAuth.userRole === 'trainer' ? 'trainer' : 'pet-owner') as 'trainer' | 'pet-owner',
        avatar: ''
      });
    }
  }, []);
  
  // 선택된 날짜에 해당하는 알림장 항목 필터링
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    
    // 날짜 필터
    const matchesDate = isSameDay(entryDate, selectedDate);
    
    // 반려동물 필터
    const matchesPet = selectedPet === null || entry.petId === selectedPet;
    
    // 탭 필터
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'favorites' && entry.isFavorite) ||
      (activeTab === 'important' && entry.isImportant) ||
      (activeTab === 'by-me' && entry.author.id === userInfo.id) ||
      (activeTab === 'by-trainer' && entry.author.role === 'trainer');
    
    // 검색어 필터
    const matchesSearch = 
      !searchQuery ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.activities.some(act => act.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDate && matchesPet && matchesTab && matchesSearch;
  });
  
  // 항목 정렬
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sort === 'important') {
      return b.isImportant ? 1 : -1;
    }
    return 0;
  });
  
  // 가상 데이터 로드 (실제로는 API 호출)
  const loadMockData = () => {
    setLoading(true);
    
    // 반려동물 목록
    const mockPets: Pet[] = [
      { id: 1, name: '쿠키', type: 'dog', breed: '말티즈', age: 3, avatar: '/images/dog1.jpg' },
      { id: 2, name: '초코', type: 'dog', breed: '포메라니안', age: 2, avatar: '/images/dog2.jpg' },
      { id: 3, name: '나비', type: 'cat', breed: '코리안 숏헤어', age: 1, avatar: '/images/cat1.jpg' }
    ];
    
    // 훈련사 목록
    const mockTrainers: Trainer[] = [
      { id: 1, name: '김훈련', specialty: '기본 훈련', avatar: '/images/trainer1.jpg' },
      { id: 2, name: '이행동', specialty: '행동 교정', avatar: '/images/trainer2.jpg' }
    ];
    
    // 활동 목록
    const mockActivities: Activity[] = [
      { id: 'sit', name: '앉아 훈련', icon: <CheckSquare className="h-4 w-4 mr-2" />, category: 'training' },
      { id: 'stay', name: '기다려 훈련', icon: <Clock className="h-4 w-4 mr-2" />, category: 'training' },
      { id: 'walk', name: '산책', icon: <FileText className="h-4 w-4 mr-2" />, category: 'play' },
      { id: 'bath', name: '목욕', icon: <FileText className="h-4 w-4 mr-2" />, category: 'care' },
      { id: 'play', name: '장난감 놀이', icon: <FileText className="h-4 w-4 mr-2" />, category: 'play' },
      { id: 'groom', name: '브러싱', icon: <FileText className="h-4 w-4 mr-2" />, category: 'care' },
      { id: 'feed', name: '식사', icon: <FileText className="h-4 w-4 mr-2" />, category: 'care' },
      { id: 'checkup', name: '건강 체크', icon: <FileText className="h-4 w-4 mr-2" />, category: 'health' }
    ];
    
    // 템플릿 목록
    const mockTemplates: Template[] = [
      { 
        id: 'daily', 
        title: '일일 훈련 기록', 
        content: '오늘은 {petName}와 함께 기본 훈련을 진행했습니다. {activities}을(를) 중점적으로 연습했으며, 전반적인 집중도는 좋았습니다. 내일은 다른 행동들도 연습해볼 예정입니다.', 
        activities: ['sit', 'stay'] 
      },
      { 
        id: 'play', 
        title: '놀이 활동 기록', 
        content: '{petName}와 오늘 즐거운 시간을 보냈습니다. {activities}을(를) 통해 충분한 활동량을 채웠으며, 상호작용 능력이 점점 향상되고 있습니다.', 
        activities: ['walk', 'play'] 
      },
      { 
        id: 'care', 
        title: '케어 기록', 
        content: '오늘은 {petName}의 건강관리에 중점을 두었습니다. {activities}을(를) 진행했으며, 전반적인 상태는 양호합니다.', 
        activities: ['bath', 'groom', 'checkup'] 
      }
    ];
    
    // 알림장 항목
    const mockEntries: NotebookEntry[] = [
      {
        id: '1',
        date: format(new Date(), 'yyyy-MM-dd'),
        petId: 1,
        petName: '쿠키',
        content: '오늘 쿠키는 앉아 훈련을 매우 잘 수행했습니다. 집중력이 향상되고 있으며, 산책 중에도 지시에 잘 따르고 있습니다. 내일은 기다려 훈련을 추가로 진행해볼 예정입니다.',
        author: {
          id: 1,
          name: '김훈련',
          role: 'trainer',
          avatar: '/images/trainer1.jpg'
        },
        activities: ['sit', 'walk'],
        status: 'completed',
        media: [
          { type: 'image', url: '/images/training1.jpg' }
        ],
        tags: ['훈련', '진행중'],
        isImportant: true,
        reactions: {
          likes: 2,
          hasLiked: false,
          comments: 1
        },
        createdAt: new Date().toISOString(),
        isFavorite: false
      },
      {
        id: '2',
        date: format(new Date(), 'yyyy-MM-dd'),
        petId: 2,
        petName: '초코',
        content: '초코는 오늘 목욕을 했습니다. 처음에는 약간 긴장했지만 곧 적응했습니다. 목욕 후에는 브러싱을 하면서 모발 관리도 함께 해주었습니다.',
        author: {
          id: 2,
          name: '이행동',
          role: 'trainer',
          avatar: '/images/trainer2.jpg'
        },
        activities: ['bath', 'groom'],
        status: 'completed',
        media: [
          { type: 'image', url: '/images/grooming1.jpg' }
        ],
        tags: ['케어', '완료'],
        isImportant: false,
        reactions: {
          likes: 1,
          hasLiked: true,
          comments: 0
        },
        createdAt: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
        isFavorite: true
      },
      {
        id: '3',
        date: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
        petId: 3,
        petName: '나비',
        content: '나비는 오늘 건강 체크를 했습니다. 모든 수치가 정상이며 특별한 이상은 없습니다. 식사량과 활동량도 적절합니다.',
        author: {
          id: 1,
          name: '김훈련',
          role: 'trainer',
          avatar: '/images/trainer1.jpg'
        },
        activities: ['checkup', 'feed'],
        status: 'completed',
        tags: ['건강', '완료'],
        isImportant: false,
        reactions: {
          likes: 0,
          hasLiked: false,
          comments: 0
        },
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        isFavorite: false
      },
      {
        id: '4',
        date: format(new Date(), 'yyyy-MM-dd'),
        petId: 1,
        petName: '쿠키',
        content: '오늘 쿠키와 함께 공원에서 산책했습니다. 다른 강아지들과도 친근하게 놀았고, 장난감 놀이도 즐겼습니다. 활동량이 충분했습니다.',
        author: {
          id: 3,
          name: '사용자',
          role: 'pet-owner'
        },
        activities: ['walk', 'play'],
        status: 'completed',
        media: [
          { type: 'image', url: '/images/park1.jpg' },
          { type: 'image', url: '/images/park2.jpg' }
        ],
        tags: ['산책', '놀이'],
        isImportant: false,
        reactions: {
          likes: 1,
          hasLiked: false,
          comments: 1
        },
        createdAt: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
        isFavorite: false
      }
    ];
    
    // 상태 업데이트
    setPets(mockPets);
    setTrainers(mockTrainers);
    setActivities(mockActivities);
    setTemplates(mockTemplates);
    setEntries(mockEntries);
    
    if (mockPets.length > 0) {
      setSelectedPet(mockPets[0].id);
    }
    
    setLoading(false);
  };
  
  // 템플릿 선택 시 내용 업데이트
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        // 선택된 반려동물 이름 가져오기
        const pet = pets.find(p => p.id === selectedPet);
        const petName = pet ? pet.name : '반려동물';
        
        // 활동 명칭으로 변환
        const activityNames = template.activities
          .map(actId => {
            const activity = activities.find(a => a.id === actId);
            return activity ? activity.name : '';
          })
          .filter(Boolean)
          .join(', ');
        
        // 템플릿 내용에 변수 대체
        let content = template.content
          .replace('{petName}', petName)
          .replace('{activities}', activityNames);
        
        setEntryContent(content);
        setSelectedActivities(template.activities);
      }
    }
  }, [selectedTemplate, selectedPet, pets, activities, templates]);
  
  // 선택된 활동 변경 시 템플릿 내용 업데이트
  useEffect(() => {
    if (entryContent && selectedActivities.length > 0 && !selectedTemplate) {
      // 활동 명칭으로 변환
      const activityNames = selectedActivities
        .map(actId => {
          const activity = activities.find(a => a.id === actId);
          return activity ? activity.name : '';
        })
        .filter(Boolean)
        .join(', ');
      
      // 선택된 반려동물 이름 가져오기
      const pet = pets.find(p => p.id === selectedPet);
      const petName = pet ? pet.name : '반려동물';
      
      // 기본 내용 생성
      const defaultContent = `오늘 ${petName}와(과) 함께 ${activityNames}을(를) 진행했습니다.`;
      
      // 내용이 기본 내용이거나 비어있으면 업데이트
      if (!entryContent || entryContent === defaultContent) {
        setEntryContent(defaultContent);
      }
    }
  }, [selectedActivities, selectedPet, pets, activities, entryContent]);
  
  // 알림장 항목 추가
  const addEntry = () => {
    if (!entryContent.trim() || !selectedPet) {
      toast({
        title: "입력 오류",
        description: "내용과 반려동물을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    const pet = pets.find(p => p.id === selectedPet);
    
    // 새 항목 생성
    const newEntry: NotebookEntry = {
      id: Date.now().toString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      petId: selectedPet,
      petName: pet?.name || '반려동물',
      content: entryContent,
      author: {
        id: userInfo.id,
        name: userInfo.name,
        role: userInfo.role,
        avatar: userInfo.avatar
      },
      activities: selectedActivities,
      status: 'completed',
      media: uploadedMedia.map(media => ({
        type: media.type,
        url: media.url,
        thumbnail: media.thumbnail
      })),
      tags: ['기록'],
      isImportant: isImportant,
      reactions: {
        likes: 0,
        hasLiked: false,
        comments: 0
      },
      createdAt: new Date().toISOString(),
      isFavorite: false
    };
    
    // 알림장 목록에 추가
    setEntries([newEntry, ...entries]);
    
    // 입력값 초기화
    setEntryContent('');
    setSelectedActivities([]);
    setUploadedMedia([]);
    setSelectedTemplate('');
    setIsImportant(false);
    setShowNewEntryDialog(false);
    
    toast({
      title: "알림장 기록 완료",
      description: "알림장 기록이 성공적으로 저장되었습니다.",
    });
  };
  
  // 미디어 업로드 처리
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // 파일 처리
    Array.from(files).forEach(file => {
      // 이미지 또는 비디오 확인
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        toast({
          title: "지원되지 않는 파일 형식",
          description: "이미지 또는 비디오 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "10MB 이하의 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      
      // 파일 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      
      // 미디어 목록에 추가
      setUploadedMedia(prev => [
        ...prev,
        {
          type: isImage ? 'image' : 'video',
          url,
          file
        }
      ]);
    });
    
    // 입력 필드 초기화
    e.target.value = '';
  };
  
  // 미디어 제거
  const removeMedia = (index: number) => {
    setUploadedMedia(prev => {
      const newMedia = [...prev];
      
      // URL 객체 해제
      if (newMedia[index].url) {
        URL.revokeObjectURL(newMedia[index].url);
      }
      
      // 배열에서 제거
      newMedia.splice(index, 1);
      return newMedia;
    });
  };
  
  // 좋아요 토글
  const toggleLike = (entryId: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        const hasLiked = entry.reactions?.hasLiked || false;
        const newLikes = (entry.reactions?.likes || 0) + (hasLiked ? -1 : 1);
        
        return {
          ...entry,
          reactions: {
            ...entry.reactions,
            likes: newLikes,
            hasLiked: !hasLiked
          }
        };
      }
      return entry;
    }));
  };
  
  // 즐겨찾기 토글
  const toggleFavorite = (entryId: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          isFavorite: !entry.isFavorite
        };
      }
      return entry;
    }));
  };
  
  // 중요 표시 토글
  const toggleImportant = (entryId: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          isImportant: !entry.isImportant
        };
      }
      return entry;
    }));
  };
  
  // 새 알림장 입력 다이얼로그
  const renderNewEntryDialog = () => (
    <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>알림장 작성하기</DialogTitle>
          <DialogDescription>
            반려동물의 훈련, 활동, 케어에 대한 내용을 기록해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          {/* 반려동물 선택 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pet" className="text-right">반려동물</Label>
            <div className="col-span-3">
              <Select
                value={selectedPet?.toString() || ''}
                onValueChange={(value) => setSelectedPet(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="반려동물을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map(pet => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name} ({pet.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 템플릿 선택 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template" className="text-right">템플릿</Label>
            <div className="col-span-3">
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="템플릿 선택 (선택사항)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">직접 작성</SelectItem>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 활동 선택 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">활동</Label>
            <div className="col-span-3 border rounded-md p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`activity-${activity.id}`}
                      checked={selectedActivities.includes(activity.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedActivities(prev => [...prev, activity.id]);
                        } else {
                          setSelectedActivities(prev => 
                            prev.filter(id => id !== activity.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`activity-${activity.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <div className="flex items-center">
                        {activity.icon}
                        <span>{activity.name}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 내용 입력 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right mt-2">내용</Label>
            <div className="col-span-3">
              <Textarea
                id="content"
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
                rows={8}
                placeholder="반려동물의 활동, 훈련, 케어에 대한 내용을 자세히 입력해주세요."
              />
            </div>
          </div>
          
          {/* 미디어 업로드 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">미디어</Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="media-upload"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  multiple
                  className="hidden"
                />
                <Label
                  htmlFor="media-upload"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  사진/영상 업로드
                </Label>
                <span className="text-xs text-gray-500">
                  (최대 10MB, 이미지/비디오)
                </span>
              </div>
              
              {/* 미디어 프리뷰 */}
              {uploadedMedia.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {uploadedMedia.map((media, index) => (
                    <div key={index} className="relative">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-md"
                        />
                      ) : (
                        <div className="relative w-full h-24 bg-gray-100 rounded-md flex items-center justify-center">
                          <video
                            src={media.url}
                            controls
                            className="max-h-full max-w-full"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 중요 표시 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3 flex items-center space-x-2">
              <Checkbox
                id="important"
                checked={isImportant}
                onCheckedChange={(checked) => 
                  setIsImportant(checked as boolean)
                }
              />
              <label
                htmlFor="important"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                중요 알림장으로 표시
              </label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewEntryDialog(false)}>
            취소
          </Button>
          <Button onClick={addEntry}>저장하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // 알림장 상세 보기 다이얼로그
  const renderViewEntryDialog = () => (
    <Dialog open={!!viewEntry} onOpenChange={(open) => !open && setViewEntry(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {viewEntry && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <span>{viewEntry.petName}의 알림장</span>
                  {viewEntry.isImportant && (
                    <Badge variant="destructive" className="ml-2">중요</Badge>
                  )}
                </DialogTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(viewEntry.id)}
                    className={viewEntry.isFavorite ? "text-yellow-500" : ""}
                  >
                    {viewEntry.isFavorite ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleImportant(viewEntry.id)}
                    className={viewEntry.isImportant ? "text-red-500" : ""}
                  >
                    <AlertCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <DialogDescription>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={viewEntry.author.avatar} />
                      <AvatarFallback>{viewEntry.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">{viewEntry.author.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(viewEntry.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {viewEntry.activities.map(activityId => {
                      const activity = activities.find(a => a.id === activityId);
                      return activity ? (
                        <Badge key={activityId} variant="outline" className="text-xs">
                          {activity.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {/* 본문 내용 */}
              <div className="text-sm whitespace-pre-line">
                {viewEntry.content}
              </div>
              
              {/* 미디어 표시 */}
              {viewEntry.media && viewEntry.media.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {viewEntry.media.map((media, index) => (
                    <div key={index} className="overflow-hidden rounded-md">
                      {media.type === 'image' ? (
                        <img 
                          src={media.url} 
                          alt="알림장 첨부 이미지" 
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <video
                          src={media.url}
                          controls
                          className="w-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* 반응 */}
              <div className="flex justify-between border-t pt-4 mt-4">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleLike(viewEntry.id)}
                    className={`flex items-center gap-1 ${viewEntry.reactions?.hasLiked ? 'text-blue-500' : ''}`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{viewEntry.reactions?.likes || 0}</span>
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  작성일: {new Date(viewEntry.createdAt).toLocaleString('ko-KR')}
                  {viewEntry.updatedAt && ` (수정됨: ${new Date(viewEntry.updatedAt).toLocaleString('ko-KR')})`}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
  
  // 켈린더 렌더링
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // 각 날짜의 알림장 개수 계산
    const entriesPerDay = days.map(day => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const dayEntries = entries.filter(entry => entry.date === formattedDate);
      
      // 사용자 작성 항목
      const userEntries = dayEntries.filter(entry => entry.author.id === userInfo.id);
      
      // 훈련사 작성 항목
      const trainerEntries = dayEntries.filter(entry => entry.author.role === 'trainer');
      
      // 중요 표시된 항목
      const importantEntries = dayEntries.filter(entry => entry.isImportant);
      
      return {
        date: day,
        total: dayEntries.length,
        userEntries: userEntries.length,
        trainerEntries: trainerEntries.length,
        importantEntries: importantEntries.length,
        isInCurrentMonth: isSameMonth(day, monthStart)
      };
    });
    
    // 달력 헤더
    const calendarHeader = (
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">{format(currentDate, 'yyyy년 MM월', { locale: ko })}</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setCurrentDate(new Date())}
          >
            오늘
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
    
    // 달력 본문
    return (
      <Card>
        <CardContent className="pt-6">
          {calendarHeader}
          
          <div className="grid grid-cols-7 gap-1">
            {/* 요일 표시 */}
            {dayNames.map((day, i) => (
              <div 
                key={i} 
                className={`text-center p-2 text-sm font-medium ${i === 0 ? 'text-red-500' : ''} ${i === 6 ? 'text-blue-500' : ''}`}
              >
                {day}
              </div>
            ))}
            
            {/* 날짜 표시 */}
            {entriesPerDay.map((dayInfo, i) => {
              const isSelected = isSameDay(dayInfo.date, selectedDate);
              
              return (
                <div 
                  key={i}
                  className={`
                    p-2 rounded-md min-h-12 text-center relative
                    ${!dayInfo.isInCurrentMonth ? 'text-gray-400' : ''}
                    ${isToday(dayInfo.date) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    ${isSelected ? 'bg-blue-100 dark:bg-blue-800/30' : ''}
                    ${
                      dayInfo.total > 0 
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' 
                        : ''
                    }
                  `}
                  onClick={() => setSelectedDate(dayInfo.date)}
                >
                  <div className={`
                    text-sm font-medium
                    ${
                      isToday(dayInfo.date) 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : ''
                    }
                  `}>
                    {format(dayInfo.date, 'd')}
                  </div>
                  
                  {/* 항목 표시 */}
                  {dayInfo.total > 0 && (
                    <div className="flex flex-col items-center gap-1 mt-1">
                      {dayInfo.importantEntries > 0 && (
                        <span className="flex items-center text-[10px] text-red-500">
                          <AlertCircle className="h-2 w-2 mr-0.5" />
                          {dayInfo.importantEntries}
                        </span>
                      )}
                      
                      {dayInfo.trainerEntries > 0 && (
                        <span className="flex items-center text-[10px] text-blue-500">
                          <MessageSquare className="h-2 w-2 mr-0.5" />
                          {dayInfo.trainerEntries}
                        </span>
                      )}
                      
                      {dayInfo.userEntries > 0 && (
                        <span className="flex items-center text-[10px] text-green-500">
                          <FileText className="h-2 w-2 mr-0.5" />
                          {dayInfo.userEntries}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // 항목 카드 렌더링
  const renderEntryCard = (entry: NotebookEntry) => (
    <Card 
      key={entry.id} 
      className="overflow-hidden transition-all hover:shadow-md"
      onClick={() => setViewEntry(entry)}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={entry.author.avatar} />
              <AvatarFallback>{entry.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{entry.author.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {entry.author.role === 'trainer' ? '훈련사' : '보호자'}
                </Badge>
              </div>
              <div className="flex gap-1 items-center text-xs text-gray-500">
                <span>{entry.petName}</span>
                <span>•</span>
                <span>{new Date(entry.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {entry.isImportant && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {entry.isFavorite && (
              <BookmarkCheck className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {entry.activities.map(activityId => {
            const activity = activities.find(a => a.id === activityId);
            return activity ? (
              <Badge key={activityId} variant="secondary" className="text-xs">
                {activity.name}
              </Badge>
            ) : null;
          })}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="text-sm line-clamp-3 whitespace-pre-line mb-3">
          {entry.content}
        </div>
        
        {/* 미디어 미리보기 */}
        {entry.media && entry.media.length > 0 && (
          <div className="grid grid-cols-3 gap-1">
            {entry.media.slice(0, 3).map((media, index) => (
              <div 
                key={index} 
                className={`overflow-hidden rounded-md aspect-square ${
                  entry.media && entry.media.length > 3 && index === 2
                    ? 'relative'
                    : ''
                }`}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="알림장 첨부 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                
                {/* 추가 미디어 표시 */}
                {entry.media && entry.media.length > 3 && index === 2 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                    +{entry.media.length - 2}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <button
            className={`flex items-center gap-1 ${
              entry.reactions?.hasLiked ? 'text-blue-500' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(entry.id);
            }}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{entry.reactions?.likes || 0}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={`p-1 rounded-full ${
              entry.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(entry.id);
            }}
          >
            {entry.isFavorite ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
  
  // 메인 렌더링
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">알림장</h1>
        <Button onClick={() => setShowNewEntryDialog(true)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          알림장 작성하기
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 좌측: 캘린더와 필터 */}
        <div className="space-y-6">
          {/* 캘린더 컴포넌트 */}
          {renderCalendar()}
          
          {/* 필터 카드 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">필터</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 반려동물 필터 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">반려동물</Label>
                <Select
                  value={selectedPet?.toString() || ''}
                  onValueChange={(value) => 
                    setSelectedPet(value ? parseInt(value) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="모든 반려동물" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">모든 반려동물</SelectItem>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 정렬 순서 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">정렬</Label>
                <Select
                  value={sort}
                  onValueChange={setSort}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                    <SelectItem value="important">중요도순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 검색 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">검색</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="내용, 이름, 활동 검색"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 도움말 카드 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">도움말</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>중요 알림장</span>
              </div>
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                <span>즐겨찾기 알림장</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>훈련사 작성</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                <span>보호자 작성</span>
              </div>
              <Separator className="my-2" />
              <p className="text-gray-500">
                캘린더에서 날짜를 선택하면 해당 일자의 알림장만 표시됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* 우측: 알림장 목록 */}
        <div className="md:col-span-2 space-y-6">
          {/* 탭 및 통계 */}
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="all" className="flex-1">전체</TabsTrigger>
                  <TabsTrigger value="favorites" className="flex-1">즐겨찾기</TabsTrigger>
                  <TabsTrigger value="important" className="flex-1">중요</TabsTrigger>
                  <TabsTrigger value="by-trainer" className="flex-1">훈련사</TabsTrigger>
                  <TabsTrigger value="by-me" className="flex-1">내 작성</TabsTrigger>
                </TabsList>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">
                      {format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko })}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {sortedEntries.length}개의 알림장
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedDate(new Date())}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    오늘
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* 알림장 목록 */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sortedEntries.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <MessageSquare className="h-10 w-10 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">알림장이 없습니다</h3>
              <p className="text-gray-500 mb-6">
                선택한 날짜에 등록된 알림장이 없습니다. 새로운 알림장을 작성해보세요.
              </p>
              <Button onClick={() => setShowNewEntryDialog(true)}>
                알림장 작성하기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sortedEntries.map(entry => renderEntryCard(entry))}
            </div>
          )}
        </div>
      </div>
      
      {/* 다이얼로그 */}
      {renderNewEntryDialog()}
      {renderViewEntryDialog()}
    </div>
  );
}