import { useState, useEffect, Fragment } from 'react';
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  PlusCircle,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Video,
  Play,
  Pencil,
  Trash2,
  Eye,
  Star,
  Clock,
  Calendar,
  Building,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Upload,
  Download,
  Copy,
  Edit,
  Film,
  ListPlus,
  List,
  ListChecks,
  Layers,
  PlusSquare,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 강의 타입 정의
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  type: string;
  categoryId: number;
  categoryName: string;
  trainerId: number;
  trainerName: string;
  trainerAvatar?: string;
  instituteId?: number;
  instituteName?: string;
  duration: number;
  studentCount: number;
  rating: number;
  reviewCount: number;
  price?: number;
  isFeatured: boolean;
  isPublic: boolean;
  curriculumItems: CurriculumItem[];
}

// 커리큘럼 아이템 타입
interface CurriculumItem {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  type: 'section' | 'video' | 'quiz' | 'text';
  position: number;
  isPublished: boolean;
  parentId?: number;
  duration?: number;
  videoUrl?: string;
  content?: string;
  children?: CurriculumItem[];
}

// 카테고리 타입
interface Category {
  id: number;
  name: string;
  description?: string;
  courseCount: number;
}

export default function AdminCourses() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | 'curriculum'>('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterInstitute, setFilterInstitute] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCurriculumItem, setSelectedCurriculumItem] = useState<CurriculumItem | null>(null);
  const [showCurriculumItemModal, setShowCurriculumItemModal] = useState(false);
  const [curriculumItemMode, setCurriculumItemMode] = useState<'add' | 'edit'>('add');
  const [curriculumItemParent, setCurriculumItemParent] = useState<number | null>(null);

  // 강의 데이터 로드
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 카테고리 데이터
        const mockCategories: Category[] = [
          { id: 1, name: '기초 훈련', description: '기본적인 훈련 과정', courseCount: 15 },
          { id: 2, name: '행동 교정', description: '문제 행동을 교정하는 과정', courseCount: 12 },
          { id: 3, name: '고급 훈련', description: '고급 기술을 훈련하는 과정', courseCount: 8 },
          { id: 4, name: '사회화', description: '사회성을 키우는 과정', courseCount: 10 },
          { id: 5, name: '특수 목적 훈련', description: '특수 목적을 위한 훈련 과정', courseCount: 5 }
        ];
        
        // 임시 강의 데이터
        const mockCourses: Course[] = [
          {
            id: 1,
            title: '반려견 기초 훈련 완성',
            description: '기본적인 명령어를 익히고 반려견과의 유대감을 형성하는 훈련 과정입니다.',
            status: 'published',
            createdAt: '2024-01-15',
            updatedAt: '2024-04-10',
            type: '동영상 강의',
            categoryId: 1,
            categoryName: '기초 훈련',
            trainerId: 3,
            trainerName: '박지민',
            instituteId: 1,
            instituteName: '알파 트레이닝 센터',
            duration: 180, // 분 단위
            studentCount: 248,
            rating: 4.7,
            reviewCount: 156,
            price: 149000,
            isFeatured: true,
            isPublic: true,
            curriculumItems: [
              {
                id: 101,
                courseId: 1,
                title: '강의 소개',
                type: 'section',
                position: 1,
                isPublished: true,
                children: [
                  {
                    id: 102,
                    courseId: 1,
                    title: '강사 소개 및 강의 개요',
                    description: '강의 전반에 대한 소개와 목표를 설명합니다.',
                    type: 'video',
                    position: 1,
                    parentId: 101,
                    isPublished: true,
                    duration: 5,
                    videoUrl: 'https://example.com/videos/intro.mp4'
                  },
                  {
                    id: 103,
                    courseId: 1,
                    title: '수강 전 준비사항',
                    description: '효과적인 학습을 위한 준비물과 환경 설정에 대해 안내합니다.',
                    type: 'text',
                    position: 2,
                    parentId: 101,
                    isPublished: true,
                    content: '- 평평하고 조용한 훈련 공간\n- 강아지 간식\n- 목줄 및 하네스\n- 장난감 2-3개'
                  }
                ]
              },
              {
                id: 104,
                courseId: 1,
                title: '기본 명령어 훈련',
                type: 'section',
                position: 2,
                isPublished: true,
                children: [
                  {
                    id: 105,
                    courseId: 1,
                    title: '앉아(Sit) 명령 훈련하기',
                    description: '가장 기본적인 앉아 명령을 훈련하는 방법을 배웁니다.',
                    type: 'video',
                    position: 1,
                    parentId: 104,
                    isPublished: true,
                    duration: 15,
                    videoUrl: 'https://example.com/videos/sit-command.mp4'
                  },
                  {
                    id: 106,
                    courseId: 1,
                    title: '기다려(Stay) 명령 훈련하기',
                    description: '반려견이 한 자리에서 기다리게 하는 명령을 훈련합니다.',
                    type: 'video',
                    position: 2,
                    parentId: 104,
                    isPublished: true,
                    duration: 18,
                    videoUrl: 'https://example.com/videos/stay-command.mp4'
                  },
                  {
                    id: 107,
                    courseId: 1,
                    title: '엎드려(Down) 명령 훈련하기',
                    description: '반려견이 엎드리도록 하는 명령을 훈련합니다.',
                    type: 'video',
                    position: 3,
                    parentId: 104,
                    isPublished: true,
                    duration: 12,
                    videoUrl: 'https://example.com/videos/down-command.mp4'
                  },
                  {
                    id: 108,
                    courseId: 1,
                    title: '기본 명령어 복습 퀴즈',
                    type: 'quiz',
                    position: 4,
                    parentId: 104,
                    isPublished: true
                  }
                ]
              },
              {
                id: 109,
                courseId: 1,
                title: '산책 훈련',
                type: 'section',
                position: 3,
                isPublished: true,
                children: [
                  {
                    id: 110,
                    courseId: 1,
                    title: '목줄 및 하네스 익숙해지기',
                    description: '반려견이 목줄과 하네스에 익숙해지도록 훈련하는 방법을 배웁니다.',
                    type: 'video',
                    position: 1,
                    parentId: 109,
                    isPublished: true,
                    duration: 10,
                    videoUrl: 'https://example.com/videos/leash-training.mp4'
                  },
                  {
                    id: 111,
                    courseId: 1,
                    title: '바른 산책 자세 훈련',
                    description: '끌거나 당기지 않고 바르게 산책하는 방법을 훈련합니다.',
                    type: 'video',
                    position: 2,
                    parentId: 109,
                    isPublished: true,
                    duration: 22,
                    videoUrl: 'https://example.com/videos/loose-leash-walking.mp4'
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            title: '반려견 분리불안 해결하기',
            description: '혼자 있을 때 불안해하는 반려견의 행동을 교정하는 과정입니다.',
            status: 'published',
            createdAt: '2024-02-05',
            updatedAt: '2024-04-18',
            type: '동영상 강의',
            categoryId: 2,
            categoryName: '행동 교정',
            trainerId: 2,
            trainerName: '이하은',
            instituteId: 2,
            instituteName: '베타 애견 학교',
            duration: 120,
            studentCount: 186,
            rating: 4.8,
            reviewCount: 124,
            price: 169000,
            isFeatured: true,
            isPublic: true,
            curriculumItems: [
              {
                id: 201,
                courseId: 2,
                title: '분리불안 이해하기',
                type: 'section',
                position: 1,
                isPublished: true,
                children: [
                  {
                    id: 202,
                    courseId: 2,
                    title: '분리불안의 정의와 원인',
                    description: '반려견 분리불안의 정의와 주요 원인에 대해 설명합니다.',
                    type: 'video',
                    position: 1,
                    parentId: 201,
                    isPublished: true,
                    duration: 12,
                    videoUrl: 'https://example.com/videos/separation-anxiety-intro.mp4'
                  }
                ]
              },
              {
                id: 203,
                courseId: 2,
                title: '단계별 훈련 프로그램',
                type: 'section',
                position: 2,
                isPublished: true,
                children: [
                  {
                    id: 204,
                    courseId: 2,
                    title: '1단계: 짧은 시간 혼자 있게 하기',
                    description: '반려견이 짧은 시간 동안 혼자 있는 것에 익숙해지도록 훈련합니다.',
                    type: 'video',
                    position: 1,
                    parentId: 203,
                    isPublished: true,
                    duration: 18,
                    videoUrl: 'https://example.com/videos/separation-phase1.mp4'
                  },
                  {
                    id: 205,
                    courseId: 2,
                    title: '2단계: 시간 늘리기',
                    description: '혼자 있는 시간을 점진적으로 늘리는 방법을 배웁니다.',
                    type: 'video',
                    position: 2,
                    parentId: 203,
                    isPublished: true,
                    duration: 15,
                    videoUrl: 'https://example.com/videos/separation-phase2.mp4'
                  }
                ]
              }
            ]
          },
          {
            id: 3,
            title: '반려견 사회화 마스터 과정',
            description: '다양한 환경과 상황에서 반려견이 편안함을 느끼도록 사회화 훈련을 진행합니다.',
            status: 'draft',
            createdAt: '2024-03-10',
            updatedAt: '2024-04-20',
            type: '동영상 강의',
            categoryId: 4,
            categoryName: '사회화',
            trainerId: 3,
            trainerName: '박지민',
            instituteId: 1,
            instituteName: '알파 트레이닝 센터',
            duration: 150,
            studentCount: 0,
            rating: 0,
            reviewCount: 0,
            price: 129000,
            isFeatured: false,
            isPublic: false,
            curriculumItems: [
              {
                id: 301,
                courseId: 3,
                title: '사회화의 중요성',
                type: 'section',
                position: 1,
                isPublished: true,
                children: [
                  {
                    id: 302,
                    courseId: 3,
                    title: '사회화란 무엇인가',
                    description: '반려견 사회화의 개념과 중요성에 대해 설명합니다.',
                    type: 'video',
                    position: 1,
                    parentId: 301,
                    isPublished: true,
                    duration: 10,
                    videoUrl: 'https://example.com/videos/socialization-intro.mp4'
                  }
                ]
              },
              {
                id: 303,
                courseId: 3,
                title: '다양한 환경 노출하기',
                type: 'section',
                position: 2,
                isPublished: false,
                children: [
                  {
                    id: 304,
                    courseId: 3,
                    title: '소음과 다양한 바닥 환경에 노출하기',
                    description: '반려견이 다양한 소음과 바닥 재질에 익숙해지도록 하는 훈련',
                    type: 'video',
                    position: 1,
                    parentId: 303,
                    isPublished: false,
                    duration: 15,
                    videoUrl: 'https://example.com/videos/socialization-environments.mp4'
                  }
                ]
              }
            ]
          }
        ];
        
        setCategories(mockCategories);
        setCourses(mockCourses);
      } catch (error) {
        console.error('강의 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '강의 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourses();
  }, [toast]);
  
  // 필터링된 강의 목록 업데이트
  useEffect(() => {
    let result = [...courses];
    
    // 탭 필터링
    if (activeTab !== 'all') {
      result = result.filter(course => course.status === activeTab);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.trainerName.toLowerCase().includes(query)
      );
    }
    
    // 카테고리 필터링
    if (filterCategory) {
      result = result.filter(course => course.categoryName === filterCategory);
    }
    
    // 기관 필터링
    if (filterInstitute) {
      result = result.filter(course => course.instituteName === filterInstitute);
    }
    
    // 정렬
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'studentCount':
          comparison = a.studentCount - b.studentCount;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = a.title.localeCompare(b.title);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredCourses(result);
  }, [courses, activeTab, searchQuery, filterCategory, filterInstitute, sortBy, sortOrder]);
  
  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // 고유한 기관 목록
  const institutes = Array.from(new Set(
    courses
      .filter(course => course.instituteName)
      .map(course => course.instituteName)
  )) as string[];
  
  // 강의 상세 정보 보기
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setModalMode('view');
    setShowCourseModal(true);
  };
  
  // 강의 편집 모드
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setModalMode('edit');
    setShowCourseModal(true);
  };
  
  // 새 강의 추가 모드
  const handleAddCourse = () => {
    setSelectedCourse(null);
    setModalMode('add');
    setShowCourseModal(true);
  };
  
  // 커리큘럼 편집 모드
  const handleEditCurriculum = (course: Course) => {
    setSelectedCourse(course);
    setModalMode('curriculum');
    setShowCourseModal(true);
  };
  
  // 강의 상태 변경
  const handleChangeStatus = (courseId: number, newStatus: 'published' | 'draft' | 'archived') => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, status: newStatus } : course
    ));
    
    const statusMap = {
      published: '발행됨',
      draft: '임시저장',
      archived: '보관됨'
    };
    
    toast({
      title: '강의 상태 변경',
      description: `강의 상태가 '${statusMap[newStatus]}'(으)로 변경되었습니다.`,
    });
    
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse({ ...selectedCourse, status: newStatus });
    }
  };
  
  // 강의 삭제 처리
  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('정말로 이 강의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
      
      toast({
        title: '강의 삭제',
        description: '강의가 성공적으로 삭제되었습니다.',
      });
      
      if (showCourseModal && selectedCourse && selectedCourse.id === courseId) {
        setShowCourseModal(false);
      }
    }
  };
  
  // 커리큘럼 아이템 추가 모달 열기
  const handleAddCurriculumItem = (parentId: number | null = null) => {
    setSelectedCurriculumItem(null);
    setCurriculumItemMode('add');
    setCurriculumItemParent(parentId);
    setShowCurriculumItemModal(true);
  };
  
  // 커리큘럼 아이템 편집 모달 열기
  const handleEditCurriculumItem = (item: CurriculumItem) => {
    setSelectedCurriculumItem(item);
    setCurriculumItemMode('edit');
    setShowCurriculumItemModal(true);
  };
  
  // 커리큘럼 아이템 삭제
  const handleDeleteCurriculumItem = (itemId: number) => {
    if (window.confirm('정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      if (!selectedCourse) return;
      
      // 아이템 및 하위 아이템 모두 제거
      const removeItems = (items: CurriculumItem[], targetId: number): CurriculumItem[] => {
        return items.filter(item => {
          if (item.id === targetId) return false;
          if (item.children) {
            item.children = removeItems(item.children, targetId);
          }
          return true;
        });
      };
      
      const updatedCurriculumItems = removeItems(selectedCourse.curriculumItems, itemId);
      
      const updatedCourse = {
        ...selectedCourse,
        curriculumItems: updatedCurriculumItems
      };
      
      setSelectedCourse(updatedCourse);
      
      // 전체 강의 목록에서도 업데이트
      setCourses(prev => prev.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      
      toast({
        title: '항목 삭제',
        description: '커리큘럼 항목이 성공적으로 삭제되었습니다.',
      });
    }
  };
  
  // 커리큘럼 아이템 저장
  const handleSaveCurriculumItem = (
    type: 'section' | 'video' | 'quiz' | 'text',
    title: string,
    description: string = '',
    duration: number = 0,
    videoUrl: string = '',
    content: string = ''
  ) => {
    if (!selectedCourse) return;
    
    const newItem: CurriculumItem = curriculumItemMode === 'add' 
      ? {
          id: Math.floor(Math.random() * 1000) + 1000, // 임시 ID 생성
          courseId: selectedCourse.id,
          title,
          description,
          type,
          position: 999, // 임시 위치
          isPublished: false,
          ...(curriculumItemParent ? { parentId: curriculumItemParent } : {}),
          ...(type === 'video' ? { duration, videoUrl } : {}),
          ...(type === 'text' ? { content } : {})
        }
      : {
          ...selectedCurriculumItem!,
          title,
          description,
          ...(type === 'video' ? { duration, videoUrl } : {}),
          ...(type === 'text' ? { content } : {})
        };
    
    let updatedCurriculumItems = [...selectedCourse.curriculumItems];
    
    if (curriculumItemMode === 'add') {
      if (curriculumItemParent) {
        // 하위 아이템 추가
        updatedCurriculumItems = updatedCurriculumItems.map(item => {
          if (item.id === curriculumItemParent) {
            return {
              ...item,
              children: [...(item.children || []), newItem]
            };
          }
          return item;
        });
      } else {
        // 최상위 아이템 추가
        updatedCurriculumItems.push(newItem);
      }
    } else {
      // 아이템 수정
      updatedCurriculumItems = updatedCurriculumItems.map(item => {
        if (item.id === selectedCurriculumItem!.id) {
          return newItem;
        } else if (item.children) {
          return {
            ...item,
            children: item.children.map(child => 
              child.id === selectedCurriculumItem!.id ? newItem : child
            )
          };
        }
        return item;
      });
    }
    
    // 위치 재정렬
    updatedCurriculumItems = updatedCurriculumItems.map((item, index) => ({
      ...item,
      position: index + 1,
      children: item.children?.map((child, childIndex) => ({
        ...child,
        position: childIndex + 1
      }))
    }));
    
    const updatedCourse = {
      ...selectedCourse,
      curriculumItems: updatedCurriculumItems
    };
    
    setSelectedCourse(updatedCourse);
    
    // 전체 강의 목록에서도 업데이트
    setCourses(prev => prev.map(course => 
      course.id === selectedCourse.id ? updatedCourse : course
    ));
    
    setShowCurriculumItemModal(false);
    
    toast({
      title: curriculumItemMode === 'add' ? '항목 추가' : '항목 수정',
      description: `커리큘럼 항목이 성공적으로 ${curriculumItemMode === 'add' ? '추가' : '수정'}되었습니다.`,
    });
  };
  
  // 아이템 위치 이동
  const handleMoveItem = (itemId: number, direction: 'up' | 'down', parentId?: number) => {
    if (!selectedCourse) return;
    
    let updatedCurriculumItems = [...selectedCourse.curriculumItems];
    
    if (parentId) {
      // 하위 아이템 이동
      updatedCurriculumItems = updatedCurriculumItems.map(item => {
        if (item.id === parentId && item.children) {
          const childItems = [...item.children];
          const itemIndex = childItems.findIndex(child => child.id === itemId);
          
          if (itemIndex === -1) return item;
          
          const newIndex = direction === 'up' ? Math.max(0, itemIndex - 1) : Math.min(childItems.length - 1, itemIndex + 1);
          
          if (itemIndex === newIndex) return item;
          
          const [movedItem] = childItems.splice(itemIndex, 1);
          childItems.splice(newIndex, 0, movedItem);
          
          // 위치 재정렬
          const reorderedChildren = childItems.map((child, idx) => ({
            ...child,
            position: idx + 1
          }));
          
          return {
            ...item,
            children: reorderedChildren
          };
        }
        return item;
      });
    } else {
      // 최상위 아이템 이동
      const itemIndex = updatedCurriculumItems.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) return;
      
      const newIndex = direction === 'up' ? Math.max(0, itemIndex - 1) : Math.min(updatedCurriculumItems.length - 1, itemIndex + 1);
      
      if (itemIndex === newIndex) return;
      
      const [movedItem] = updatedCurriculumItems.splice(itemIndex, 1);
      updatedCurriculumItems.splice(newIndex, 0, movedItem);
      
      // 위치 재정렬
      updatedCurriculumItems = updatedCurriculumItems.map((item, idx) => ({
        ...item,
        position: idx + 1
      }));
    }
    
    const updatedCourse = {
      ...selectedCourse,
      curriculumItems: updatedCurriculumItems
    };
    
    setSelectedCourse(updatedCourse);
    
    // 전체 강의 목록에서도 업데이트
    setCourses(prev => prev.map(course => 
      course.id === selectedCourse.id ? updatedCourse : course
    ));
  };
  
  // 아이템 발행 상태 토글
  const handleTogglePublish = (itemId: number, parentId?: number) => {
    if (!selectedCourse) return;
    
    let updatedCurriculumItems = [...selectedCourse.curriculumItems];
    
    if (parentId) {
      // 하위 아이템 상태 변경
      updatedCurriculumItems = updatedCurriculumItems.map(item => {
        if (item.id === parentId && item.children) {
          return {
            ...item,
            children: item.children.map(child => 
              child.id === itemId ? { ...child, isPublished: !child.isPublished } : child
            )
          };
        }
        return item;
      });
    } else {
      // 최상위 아이템 상태 변경
      updatedCurriculumItems = updatedCurriculumItems.map(item => 
        item.id === itemId ? { ...item, isPublished: !item.isPublished } : item
      );
    }
    
    const updatedCourse = {
      ...selectedCourse,
      curriculumItems: updatedCurriculumItems
    };
    
    setSelectedCourse(updatedCourse);
    
    // 전체 강의 목록에서도 업데이트
    setCourses(prev => prev.map(course => 
      course.id === selectedCourse.id ? updatedCourse : course
    ));
  };
  
  // 상태별 배지 색상 및 아이콘
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            발행됨
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-amber-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            임시저장
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="text-gray-500">
            <XCircle className="w-3 h-3 mr-1" />
            보관됨
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '강의 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };
  
  // 별점 표시
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 > 0.3;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-amber-500 text-amber-500" />
        ))}
        {halfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-amber-500" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
        <span className="ml-1 text-xs text-muted-foreground">({selectedCourse?.reviewCount})</span>
      </div>
    );
  };
  
  // 커리큘럼 아이템 타입에 따른 아이콘
  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'section':
        return <List className="h-4 w-4 text-primary" />;
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'quiz':
        return <ListChecks className="h-4 w-4 text-amber-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">강의 관리</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddCourse} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            강의 추가
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="published">발행됨</TabsTrigger>
            <TabsTrigger value="draft">임시저장</TabsTrigger>
            <TabsTrigger value="archived">보관됨</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="강의명, 설명, 훈련사 검색..."
                className="pl-8 h-9 md:w-[300px] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterCategory || 'all'} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterInstitute || 'all'} onValueChange={setFilterInstitute}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="기관" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 기관</SelectItem>
                {institutes.map(institute => (
                  <SelectItem key={institute} value={institute}>{institute}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>강의명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>훈련사</TableHead>
                  <TableHead>기관</TableHead>
                  <TableHead className="text-center">수강생</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">데이터를 불러오고 있습니다...</div>
                    </TableCell>
                  </TableRow>
                ) : paginatedCourses.length > 0 ? (
                  paginatedCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-16 rounded-md bg-muted overflow-hidden">
                            {course.thumbnail ? (
                              <img 
                                src={course.thumbnail} 
                                alt={course.title}
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full bg-secondary">
                                <BookOpen className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {Math.floor(course.duration / 60)}시간 {course.duration % 60}분
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.categoryName}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={course.trainerAvatar} alt={course.trainerName} />
                            <AvatarFallback>{course.trainerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{course.trainerName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.instituteName ? (
                          <div className="flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{course.instituteName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">없음</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{course.studentCount}</TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewCourse(course)}>
                                <Eye className="h-4 w-4 mr-2" />
                                상세 보기
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                강의 편집
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditCurriculum(course)}>
                                <Layers className="h-4 w-4 mr-2" />
                                커리큘럼 편집
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {course.status !== 'published' && (
                                <DropdownMenuItem onClick={() => handleChangeStatus(course.id, 'published')}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  발행하기
                                </DropdownMenuItem>
                              )}
                              {course.status !== 'draft' && (
                                <DropdownMenuItem onClick={() => handleChangeStatus(course.id, 'draft')}>
                                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                                  임시저장으로 변경
                                </DropdownMenuItem>
                              )}
                              {course.status !== 'archived' && (
                                <DropdownMenuItem onClick={() => handleChangeStatus(course.id, 'archived')}>
                                  <XCircle className="h-4 w-4 mr-2 text-gray-500" />
                                  보관하기
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteCourse(course.id)} className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="text-muted-foreground">검색 결과가 없습니다</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {!isLoading && totalPages > 1 && (
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-muted-foreground">
                총 {filteredCourses.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredCourses.length)}개 표시
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ? currentPage - 3 + i + 1 : i + 1;
                  if (pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </Tabs>
      
      {/* 강의 상세 정보 / 편집 모달 */}
      {(modalMode === 'view' || modalMode === 'edit') && (
        <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {modalMode === 'view' ? '강의 상세 정보' : '강의 정보 편집'}
              </DialogTitle>
              <DialogDescription>
                {modalMode === 'view' 
                  ? selectedCourse ? `${selectedCourse.title} 강의의 상세 정보입니다.` : ''
                  : '강의 정보를 수정합니다.'}
              </DialogDescription>
            </DialogHeader>
            
            {selectedCourse && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {selectedCourse.thumbnail ? (
                    <div className="rounded-md overflow-hidden h-48">
                      <img 
                        src={selectedCourse.thumbnail} 
                        alt={selectedCourse.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-secondary rounded-md">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {modalMode === 'view' ? (
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
                      <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">강의명</Label>
                        <Input id="title" defaultValue={selectedCourse.title} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">설명</Label>
                        <Textarea id="description" defaultValue={selectedCourse.description} />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>{getStatusBadge(selectedCourse.status)}</div>
                    <div className="flex items-center">
                      <Star className="text-amber-500 fill-amber-500 h-5 w-5 mr-1" />
                      <span className="font-bold">{selectedCourse.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground ml-1">({selectedCourse.reviewCount})</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">강의 정보</h3>
                    
                    {modalMode === 'view' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <div className="font-medium text-muted-foreground">카테고리</div>
                          <div>{selectedCourse.categoryName}</div>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <div className="font-medium text-muted-foreground">강의 유형</div>
                          <div>{selectedCourse.type}</div>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <div className="font-medium text-muted-foreground">강의 시간</div>
                          <div>{Math.floor(selectedCourse.duration / 60)}시간 {selectedCourse.duration % 60}분</div>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <div className="font-medium text-muted-foreground">생성일</div>
                          <div>{selectedCourse.createdAt}</div>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <div className="font-medium text-muted-foreground">최종 수정일</div>
                          <div>{selectedCourse.updatedAt}</div>
                        </div>
                        {selectedCourse.price && (
                          <div className="grid grid-cols-[120px_1fr] gap-2">
                            <div className="font-medium text-muted-foreground">가격</div>
                            <div>{selectedCourse.price.toLocaleString()}원</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">카테고리</Label>
                          <Select defaultValue={selectedCourse.categoryId.toString()}>
                            <SelectTrigger>
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">강의 유형</Label>
                          <Select defaultValue={selectedCourse.type}>
                            <SelectTrigger>
                              <SelectValue placeholder="유형 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="동영상 강의">동영상 강의</SelectItem>
                              <SelectItem value="라이브 강의">라이브 강의</SelectItem>
                              <SelectItem value="텍스트 강의">텍스트 강의</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">가격 (원)</Label>
                          <Input 
                            id="price" 
                            type="number" 
                            defaultValue={selectedCourse.price?.toString() || ''} 
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="isFeatured" className="cursor-pointer">
                              추천 강의로 표시
                            </Label>
                            <Switch
                              id="isFeatured"
                              defaultChecked={selectedCourse.isFeatured}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="isPublic" className="cursor-pointer">
                              공개 강의로 설정
                            </Label>
                            <Switch
                              id="isPublic"
                              defaultChecked={selectedCourse.isPublic}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">강사 정보</h3>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedCourse.trainerAvatar} alt={selectedCourse.trainerName} />
                        <AvatarFallback>{selectedCourse.trainerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedCourse.trainerName}</p>
                        {selectedCourse.instituteName && (
                          <p className="text-sm text-muted-foreground">
                            {selectedCourse.instituteName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">강의 통계</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-secondary rounded-md">
                        <p className="text-sm text-muted-foreground">수강생</p>
                        <p className="text-xl font-bold">{selectedCourse.studentCount}</p>
                      </div>
                      <div className="p-3 bg-secondary rounded-md">
                        <p className="text-sm text-muted-foreground">평점</p>
                        <div className="flex items-center justify-center">
                          {renderStars(selectedCourse.rating)}
                        </div>
                      </div>
                      <div className="p-3 bg-secondary rounded-md">
                        <p className="text-sm text-muted-foreground">콘텐츠</p>
                        <p className="text-xl font-bold">
                          {selectedCourse.curriculumItems.reduce((acc, item) => 
                            acc + (item.children?.length || 0), 
                            selectedCourse.curriculumItems.length
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {modalMode === 'edit' && (
                    <div className="pt-4 flex space-x-2">
                      <Button className="flex-1">
                        변경사항 저장
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setModalMode('curriculum')}
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        커리큘럼 편집
                      </Button>
                    </div>
                  )}
                  
                  {modalMode === 'view' && (
                    <div className="pt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setModalMode('edit')}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        강의 편집
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setModalMode('curriculum')}
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        커리큘럼 관리
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
      
      {/* 커리큘럼 편집 모달 */}
      {modalMode === 'curriculum' && (
        <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                커리큘럼 관리
              </DialogTitle>
              <DialogDescription>
                {selectedCourse ? `${selectedCourse.title} 강의의 커리큘럼을 관리합니다.` : ''}
              </DialogDescription>
            </DialogHeader>
            
            {selectedCourse && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">강의 구성</h3>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddCurriculumItem()}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    섹션 추가
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {selectedCourse.curriculumItems.length > 0 ? (
                    <Accordion type="multiple" defaultValue={selectedCourse.curriculumItems.map(item => item.id.toString())}>
                      {selectedCourse.curriculumItems.map((section, sectionIndex) => (
                        <AccordionItem key={section.id} value={section.id.toString()}>
                          <AccordionTrigger className="hover:bg-secondary px-3 rounded-md">
                            <div className="flex items-center">
                              <div className="flex items-center space-x-2">
                                {getItemTypeIcon(section.type)}
                                <span className="font-medium">{section.title}</span>
                              </div>
                              <div className="ml-auto flex items-center space-x-1 mr-4">
                                {!section.isPublished && (
                                  <Badge variant="outline" className="mr-2 text-amber-500 border-amber-500">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    비공개
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-6 space-y-3 py-2">
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditCurriculumItem(section)}
                                  >
                                    <Pencil className="h-3.5 w-3.5 mr-1" />
                                    편집
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleTogglePublish(section.id)}
                                  >
                                    {section.isPublished ? (
                                      <>
                                        <XCircle className="h-3.5 w-3.5 mr-1" />
                                        비공개 전환
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                        공개 전환
                                      </>
                                    )}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteCurriculumItem(section.id)}
                                    className="text-red-500"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    삭제
                                  </Button>
                                </div>
                                <div className="flex space-x-1">
                                  <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMoveItem(section.id, 'up')}
                                    disabled={sectionIndex === 0}
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMoveItem(section.id, 'down')}
                                    disabled={sectionIndex === selectedCourse.curriculumItems.length - 1}
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {/* 섹션 내 아이템들 */}
                              <div className="space-y-2 mt-3">
                                {section.children && section.children.length > 0 ? (
                                  section.children.map((item, itemIndex) => (
                                    <div 
                                      key={item.id}
                                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          {getItemTypeIcon(item.type)}
                                          <span>{item.title}</span>
                                        </div>
                                        {!item.isPublished && (
                                          <Badge variant="outline" className="text-amber-500 border-amber-500">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            비공개
                                          </Badge>
                                        )}
                                        {item.type === 'video' && item.duration && (
                                          <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {item.duration}분
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleMoveItem(item.id, 'up', section.id)}
                                          disabled={itemIndex === 0}
                                        >
                                          <MoveUp className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleMoveItem(item.id, 'down', section.id)}
                                          disabled={itemIndex === (section.children?.length || 0) - 1}
                                        >
                                          <MoveDown className="h-3.5 w-3.5" />
                                        </Button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                              <MoreVertical className="h-3.5 w-3.5" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditCurriculumItem(item)}>
                                              <Pencil className="h-3.5 w-3.5 mr-2" />
                                              편집
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleTogglePublish(item.id, section.id)}>
                                              {item.isPublished ? (
                                                <>
                                                  <XCircle className="h-3.5 w-3.5 mr-2" />
                                                  비공개 전환
                                                </>
                                              ) : (
                                                <>
                                                  <CheckCircle className="h-3.5 w-3.5 mr-2" />
                                                  공개 전환
                                                </>
                                              )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              onClick={() => handleDeleteCurriculumItem(item.id)} 
                                              className="text-red-500"
                                            >
                                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                                              삭제
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm text-muted-foreground text-center py-4">
                                    이 섹션에 아직 콘텐츠가 없습니다
                                  </div>
                                )}
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="w-full justify-start mt-2"
                                  onClick={() => handleAddCurriculumItem(section.id)}
                                >
                                  <PlusSquare className="h-4 w-4 mr-2" />
                                  새 콘텐츠 추가
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-10 bg-secondary/50 rounded-md">
                      <Layers className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">커리큘럼이 비어있습니다</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        이 강의에 첫 번째 섹션을 추가해 보세요.
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => handleAddCurriculumItem()}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        섹션 추가
                      </Button>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // 이전 모드로 돌아가기 (view 또는 edit)
                      setModalMode(modalMode === 'curriculum' ? 'view' : modalMode);
                    }}
                  >
                    돌아가기
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
      
      {/* 커리큘럼 아이템 추가/편집 모달 */}
      <Dialog open={showCurriculumItemModal} onOpenChange={setShowCurriculumItemModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {curriculumItemMode === 'add' 
                ? (curriculumItemParent ? '콘텐츠 추가' : '새 섹션 추가')
                : (selectedCurriculumItem?.type === 'section' ? '섹션 편집' : '콘텐츠 편집')}
            </DialogTitle>
            <DialogDescription>
              {curriculumItemMode === 'add'
                ? (curriculumItemParent ? '섹션에 새 콘텐츠를 추가합니다.' : '새 섹션을 추가합니다.')
                : '커리큘럼 항목을 편집합니다.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 항목 유형 선택 (추가 모드, 부모 섹션이 있을 때만) */}
            {curriculumItemMode === 'add' && curriculumItemParent && (
              <div className="space-y-2">
                <Label htmlFor="itemType">콘텐츠 유형</Label>
                <Select
                  defaultValue="video"
                  id="itemType"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="콘텐츠 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">비디오</SelectItem>
                    <SelectItem value="text">텍스트</SelectItem>
                    <SelectItem value="quiz">퀴즈</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* 기본 정보 (모든 유형 공통) */}
            <div className="space-y-2">
              <Label htmlFor="itemTitle">제목</Label>
              <Input 
                id="itemTitle"
                placeholder="제목 입력"
                defaultValue={selectedCurriculumItem?.title || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemDescription">설명 (선택사항)</Label>
              <Textarea 
                id="itemDescription"
                placeholder="설명 입력"
                defaultValue={selectedCurriculumItem?.description || ''}
              />
            </div>
            
            {/* 비디오 유형 전용 필드 */}
            {(selectedCurriculumItem?.type === 'video' || 
              (curriculumItemMode === 'add' && curriculumItemParent)) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="videoDuration">영상 길이 (분)</Label>
                  <Input 
                    id="videoDuration"
                    type="number"
                    min="1"
                    placeholder="분 단위로 입력"
                    defaultValue={selectedCurriculumItem?.duration || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">영상 URL</Label>
                  <Input 
                    id="videoUrl"
                    placeholder="영상 URL 입력"
                    defaultValue={selectedCurriculumItem?.videoUrl || ''}
                  />
                </div>
              </>
            )}
            
            {/* 텍스트 유형 전용 필드 */}
            {selectedCurriculumItem?.type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor="textContent">텍스트 내용</Label>
                <Textarea 
                  id="textContent"
                  placeholder="내용 입력"
                  className="min-h-[200px]"
                  defaultValue={selectedCurriculumItem?.content || ''}
                />
              </div>
            )}
            
            {/* 공개 여부 설정 */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished" className="cursor-pointer">
                  즉시 공개
                </Label>
                <Switch
                  id="isPublished"
                  defaultChecked={selectedCurriculumItem?.isPublished}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                공개하면 학생들이 즉시 이 콘텐츠에 접근할 수 있습니다.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCurriculumItemModal(false)}
            >
              취소
            </Button>
            <Button
              onClick={() => {
                // 실제 구현 시 폼 값 가져와서 처리
                const title = (document.getElementById('itemTitle') as HTMLInputElement)?.value || '';
                const description = (document.getElementById('itemDescription') as HTMLTextAreaElement)?.value || '';
                const isPublished = (document.getElementById('isPublished') as HTMLInputElement)?.checked || false;
                
                // 항목 유형 별 추가 데이터
                let type: 'section' | 'video' | 'quiz' | 'text' = 'section';
                
                if (curriculumItemMode === 'add' && curriculumItemParent) {
                  const itemType = (document.getElementById('itemType') as HTMLSelectElement)?.value;
                  type = itemType as any || 'video';
                } else if (curriculumItemMode === 'edit') {
                  type = selectedCurriculumItem?.type || 'section';
                }
                
                let duration = 0;
                let videoUrl = '';
                let content = '';
                
                if (type === 'video') {
                  duration = parseInt((document.getElementById('videoDuration') as HTMLInputElement)?.value || '0');
                  videoUrl = (document.getElementById('videoUrl') as HTMLInputElement)?.value || '';
                } else if (type === 'text') {
                  content = (document.getElementById('textContent') as HTMLTextAreaElement)?.value || '';
                }
                
                handleSaveCurriculumItem(type, title, description, duration, videoUrl, content);
              }}
            >
              {curriculumItemMode === 'add' ? '추가' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}