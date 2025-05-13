import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  ArrowUpDown, 
  Eye, 
  EyeOff, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Plus, 
  Save, 
  Filter, 
  Search 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DEFAULT_MENU_GROUPS, 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_MENU_CONFIGURATION,
  MenuConfiguration,
  MenuGroup,
  MenuItem,
  MenuCategory
} from '@shared/menu-config';
import { UserRole } from '@shared/schema';

// 각 메뉴 항목 편집 폼 스키마
const menuItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "제목은 필수입니다"),
  path: z.string().min(1, "경로는 필수입니다"),
  icon: z.string(),
  type: z.enum(["internal", "external"]),
  category: z.string(),
  orderIndex: z.number().min(0),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  roles: z.array(z.string()),
  instituteId: z.number().nullable().optional(),
  openInNewWindow: z.boolean().optional()
});

// 메뉴 그룹 편집 폼 스키마
const menuGroupSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "제목은 필수입니다"),
  icon: z.string(),
  orderIndex: z.number().min(0),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  roles: z.array(z.string()),
  isOpen: z.boolean(),
  instituteId: z.number().nullable().optional()
});

// 역할 옵션들
const roleOptions = [
  { value: 'user', label: '비회원' },
  { value: 'pet-owner', label: '반려견 주인' },
  { value: 'trainer', label: '훈련사' },
  { value: 'institute-admin', label: '기관 관리자' },
  { value: 'admin', label: '관리자' }
];

// 기관 목록
const getInstitutes = async () => {
  const res = await apiRequest('GET', '/api/institutes');
  return await res.json();
};

// 현재 메뉴 설정 가져오기
const getMenuConfiguration = async (instituteId: number | null = null) => {
  try {
    const url = instituteId 
      ? `/api/menu-configuration?instituteId=${instituteId}` 
      : '/api/menu-configuration';
    const res = await apiRequest('GET', url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('메뉴 설정 가져오기 오류:', error);
    return DEFAULT_MENU_CONFIGURATION;
  }
};

// 메뉴 설정 저장하기
const saveMenuConfiguration = async (
  config: MenuConfiguration, 
  instituteId: number | null = null
) => {
  try {
    const res = await apiRequest('POST', '/api/menu-configuration', {
      configuration: config,
      instituteId,
      isActive: true,
      updatedAt: new Date().toISOString()
    });
    return await res.json();
  } catch (error) {
    console.error('메뉴 설정 저장 오류:', error);
    throw error;
  }
};

export default function MenuManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'groups' | 'items'>('groups');
  const [instituteId, setInstituteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'orderIndex', direction: 'asc' });

  // 기관 목록 가져오기
  const { data: institutes = [] } = useQuery({
    queryKey: ['/api/institutes'],
    queryFn: getInstitutes,
  });

  // 메뉴 설정 가져오기
  const { 
    data: menuConfig = DEFAULT_MENU_CONFIGURATION,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['/api/menu-configuration', instituteId],
    queryFn: () => getMenuConfiguration(instituteId),
  });

  // 메뉴 설정 저장 mutation
  const saveMenuMutation = useMutation({
    mutationFn: (config: MenuConfiguration) => 
      saveMenuConfiguration(config, instituteId),
    onSuccess: () => {
      toast({ 
        title: '저장 완료', 
        description: '메뉴 설정이 성공적으로 저장되었습니다.',
      });
      refetch();
      queryClient.invalidateQueries({
        queryKey: ['/api/menu-configuration']
      });
    },
    onError: (error) => {
      toast({ 
        title: '저장 실패', 
        description: '메뉴 설정 저장 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  });

  // 메뉴 그룹 폼
  const groupForm = useForm<z.infer<typeof menuGroupSchema>>({
    resolver: zodResolver(menuGroupSchema),
    defaultValues: {
      id: '',
      title: '',
      icon: '',
      orderIndex: 0,
      isActive: true,
      isPublic: false,
      roles: [],
      isOpen: false,
      instituteId: null
    }
  });

  // 메뉴 아이템 폼
  const itemForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      id: '',
      title: '',
      path: '',
      icon: '',
      type: 'internal',
      category: '',
      orderIndex: 0,
      isActive: true,
      isPublic: false,
      roles: [],
      instituteId: null,
      openInNewWindow: false
    }
  });

  // 정렬 처리 함수
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    });
  };

  // 데이터 정렬 함수
  const sortedGroups = [...menuConfig.groups].sort((a, b) => {
    if (sortConfig.key === 'orderIndex') {
      return sortConfig.direction === 'asc' 
        ? a.orderIndex - b.orderIndex 
        : b.orderIndex - a.orderIndex;
    }
    
    // 문자열 기반 정렬
    const aValue = a[sortConfig.key as keyof MenuGroup];
    const bValue = b[sortConfig.key as keyof MenuGroup];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const sortedItems = [...menuConfig.items]
    .filter(item => {
      if (!searchTerm) return true;
      return (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'orderIndex') {
        return sortConfig.direction === 'asc' 
          ? a.orderIndex - b.orderIndex 
          : b.orderIndex - a.orderIndex;
      }
      
      // 문자열 기반 정렬
      const aValue = a[sortConfig.key as keyof MenuItem];
      const bValue = b[sortConfig.key as keyof MenuItem];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  // 그룹 편집 처리
  const handleEditGroup = (group: MenuGroup) => {
    setEditingGroup(group);
    groupForm.reset({
      id: group.id,
      title: group.title,
      icon: group.icon,
      orderIndex: group.orderIndex,
      isActive: group.isActive,
      isPublic: group.isPublic,
      roles: group.roles as string[],
      isOpen: group.isOpen,
      instituteId: group.instituteId || null
    });
    setIsDialogOpen(true);
  };

  // 아이템 편집 처리
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    itemForm.reset({
      id: item.id,
      title: item.title,
      path: item.path,
      icon: item.icon,
      type: item.type,
      category: item.category,
      orderIndex: item.orderIndex,
      isActive: item.isActive,
      isPublic: item.isPublic,
      roles: item.roles as string[],
      instituteId: item.instituteId || null,
      openInNewWindow: item.openInNewWindow || false
    });
    setIsDialogOpen(true);
  };

  // 그룹 저장 처리
  const onGroupSubmit = (values: z.infer<typeof menuGroupSchema>) => {
    const updatedGroups = menuConfig.groups.map((group: MenuGroup) => 
      group.id === values.id ? { ...values } : group
    );
    
    const updatedConfig = {
      ...menuConfig,
      groups: updatedGroups,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin' // 나중에 실제 로그인 사용자 ID로 변경
    };
    
    saveMenuMutation.mutate(updatedConfig);
    setIsDialogOpen(false);
    setEditingGroup(null);
  };

  // 아이템 저장 처리
  const onItemSubmit = (values: z.infer<typeof menuItemSchema>) => {
    const updatedItems = menuConfig.items.map((item: MenuItem) => 
      item.id === values.id ? { ...values } : item
    );
    
    const updatedConfig = {
      ...menuConfig,
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin' // 나중에 실제 로그인 사용자 ID로 변경
    };
    
    saveMenuMutation.mutate(updatedConfig);
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  // 그룹 활성화 토글
  const toggleGroupActive = (groupId: string, currentState: boolean) => {
    const updatedGroups = menuConfig.groups.map((group: MenuGroup) => 
      group.id === groupId ? { ...group, isActive: !currentState } : group
    );
    
    const updatedConfig = {
      ...menuConfig,
      groups: updatedGroups,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin' // 나중에 실제 로그인 사용자 ID로 변경
    };
    
    saveMenuMutation.mutate(updatedConfig);
  };

  // 아이템 활성화 토글
  const toggleItemActive = (itemId: string, currentState: boolean) => {
    const updatedItems = menuConfig.items.map((item: MenuItem) => 
      item.id === itemId ? { ...item, isActive: !currentState } : item
    );
    
    const updatedConfig = {
      ...menuConfig,
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin' // 나중에 실제 로그인 사용자 ID로 변경
    };
    
    saveMenuMutation.mutate(updatedConfig);
  };

  // 메뉴 그룹 추가
  const addNewGroup = () => {
    const newGroupId = `group-${Date.now()}`;
    const newGroup: MenuGroup = {
      id: newGroupId as MenuCategory,
      title: '새 메뉴 그룹',
      icon: 'Menu',
      orderIndex: menuConfig.groups.length,
      isActive: true,
      isPublic: false,
      roles: ['admin'],
      isOpen: false,
      instituteId: instituteId
    };
    
    setEditingGroup(newGroup);
    groupForm.reset({
      id: newGroup.id,
      title: newGroup.title,
      icon: newGroup.icon,
      orderIndex: newGroup.orderIndex,
      isActive: newGroup.isActive,
      isPublic: newGroup.isPublic,
      roles: newGroup.roles as string[],
      isOpen: newGroup.isOpen,
      instituteId: newGroup.instituteId || null
    });
    setIsDialogOpen(true);
  };

  // 메뉴 아이템 추가
  const addNewItem = () => {
    const newItemId = `item-${Date.now()}`;
    const newItem: MenuItem = {
      id: newItemId,
      title: '새 메뉴 항목',
      path: '/new-path',
      icon: 'Menu',
      type: 'internal',
      category: menuConfig.groups[0]?.id || 'main',
      orderIndex: menuConfig.items.length,
      isActive: true,
      isPublic: false,
      roles: ['admin'],
      instituteId: instituteId
    };
    
    setEditingItem(newItem);
    itemForm.reset({
      id: newItem.id,
      title: newItem.title,
      path: newItem.path,
      icon: newItem.icon,
      type: newItem.type,
      category: newItem.category,
      orderIndex: newItem.orderIndex,
      isActive: newItem.isActive,
      isPublic: newItem.isPublic,
      roles: newItem.roles as string[],
      instituteId: newItem.instituteId || null,
      openInNewWindow: newItem.openInNewWindow || false
    });
    setIsDialogOpen(true);
  };

  // 그룹 삭제
  const deleteGroup = (groupId: string) => {
    // 해당 그룹에 속한 아이템이 있는지 확인
    const itemsInGroup = menuConfig.items.filter(item => item.category === groupId);
    
    if (itemsInGroup.length > 0) {
      toast({
        title: '삭제 불가',
        description: '이 그룹에 속한 메뉴 항목이 있습니다. 먼저 해당 항목들을 다른 그룹으로 이동하세요.',
        variant: 'destructive'
      });
      return;
    }
    
    const updatedGroups = menuConfig.groups.filter(group => group.id !== groupId);
    
    const updatedConfig = {
      ...menuConfig,
      groups: updatedGroups,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin' // 나중에 실제 로그인 사용자 ID로 변경
    };
    
    saveMenuMutation.mutate(updatedConfig);
  };

  // 아이템 삭제
  const deleteItem = (itemId: string) => {
    const updatedItems = menuConfig.items.filter(item => item.id !== itemId);
    
    const updatedConfig = {
      ...menuConfig,
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin' // 나중에 실제 로그인 사용자 ID로 변경
    };
    
    saveMenuMutation.mutate(updatedConfig);
  };

  // 아이콘 목록 (일부만 예시로 표현)
  const iconOptions = [
    { value: 'Home', label: 'Home' },
    { value: 'User', label: 'User' },
    { value: 'Settings', label: 'Settings' },
    { value: 'Calendar', label: 'Calendar' },
    { value: 'Mail', label: 'Mail' },
    { value: 'MessageSquare', label: 'MessageSquare' },
    { value: 'ShoppingBag', label: 'ShoppingBag' },
    { value: 'BarChart2', label: 'BarChart2' },
    { value: 'Menu', label: 'Menu' },
    { value: 'Building', label: 'Building' },
    { value: 'BookOpen', label: 'BookOpen' },
    { value: 'Gift', label: 'Gift' },
    { value: 'UserRoundCheck', label: 'UserRoundCheck' },
    { value: 'Shield', label: 'Shield' },
    { value: 'GraduationCap', label: 'GraduationCap' },
    { value: 'PawPrint', label: 'PawPrint' },
    { value: 'Award', label: 'Award' },
    { value: 'Presentation', label: 'Presentation' },
    { value: 'Edit', label: 'Edit' },
    { value: 'Video', label: 'Video' },
    { value: 'VideoIcon', label: 'VideoIcon' },
    { value: 'Activity', label: 'Activity' },
    { value: 'Bell', label: 'Bell' },
    { value: 'MapPin', label: 'MapPin' },
    { value: 'Users', label: 'Users' },
    { value: 'LineChart', label: 'LineChart' },
    { value: 'AreaChart', label: 'AreaChart' },
    { value: 'Cog', label: 'Cog' },
    { value: 'UserCog', label: 'UserCog' },
    { value: 'Sparkles', label: 'Sparkles' },
    { value: 'ListReorder', label: 'ListReorder' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">메뉴 관리</h1>
      <p className="text-muted-foreground">
        사이트 메뉴 구성을 관리하고 사용자 권한별로 메뉴 노출을 설정합니다.
      </p>

      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <Select
            value={instituteId?.toString() || ""}
            onValueChange={(value) => 
              setInstituteId(value ? parseInt(value) : null)
            }
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="전체 시스템 메뉴 (기본)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">전체 시스템 메뉴 (기본)</SelectItem>
              {institutes.map((institute: any) => (
                <SelectItem key={institute.id} value={institute.id.toString()}>
                  {institute.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => refetch()}>
            새로고침
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => saveMenuMutation.mutate(menuConfig)}>
            <Save className="mr-2 h-4 w-4" />
            모든 변경사항 저장
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="groups" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'groups' | 'items')}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="groups">메뉴 그룹</TabsTrigger>
          <TabsTrigger value="items">메뉴 항목</TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>메뉴 그룹 관리</CardTitle>
                <CardDescription>
                  사이드바에 표시되는 메뉴 그룹을 관리합니다.
                </CardDescription>
              </div>
              <Button onClick={addNewGroup}>
                <Plus className="mr-2 h-4 w-4" />
                새 그룹 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('orderIndex')}
                      >
                        <span>순서</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('title')}
                      >
                        <span>그룹명</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>아이콘</TableHead>
                    <TableHead>접근 권한</TableHead>
                    <TableHead>공개 여부</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        데이터를 불러오는 중...
                      </TableCell>
                    </TableRow>
                  ) : sortedGroups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        메뉴 그룹이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell>{group.orderIndex}</TableCell>
                        <TableCell className="font-medium">{group.title}</TableCell>
                        <TableCell>{group.icon}</TableCell>
                        <TableCell>
                          {group.roles.map((role: string) => {
                            const roleOption = roleOptions.find(r => r.value === role);
                            return (
                              <span 
                                key={role} 
                                className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs mr-1 mb-1"
                              >
                                {roleOption?.label || role}
                              </span>
                            );
                          })}
                        </TableCell>
                        <TableCell>
                          {group.isPublic ? (
                            <Badge className="bg-green-100 text-green-800">공개</Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800">비공개</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {group.isActive ? (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => toggleGroupActive(group.id, group.isActive)}
                              >
                                <Eye className="h-4 w-4 text-green-600" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => toggleGroupActive(group.id, group.isActive)}
                              >
                                <EyeOff className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                            <span className={group.isActive ? "text-green-600" : "text-red-600"}>
                              {group.isActive ? "활성화" : "비활성화"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                                <Edit className="mr-2 h-4 w-4" />
                                편집
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteGroup(group.id)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>메뉴 항목 관리</CardTitle>
                <CardDescription>
                  각 메뉴 그룹에 속한 메뉴 항목을 관리합니다.
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="메뉴 검색..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={addNewItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  새 항목 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('orderIndex')}
                      >
                        <span>순서</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('title')}
                      >
                        <span>항목명</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('path')}
                      >
                        <span>경로</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('category')}
                      >
                        <span>그룹</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        데이터를 불러오는 중...
                      </TableCell>
                    </TableRow>
                  ) : sortedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        메뉴 항목이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.orderIndex}</TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.openInNewWindow && '🔗 '}
                          {item.path}
                        </TableCell>
                        <TableCell>
                          {menuConfig.groups.find(g => g.id === item.category)?.title || item.category}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {item.isActive ? (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => toggleItemActive(item.id, item.isActive)}
                              >
                                <Eye className="h-4 w-4 text-green-600" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => toggleItemActive(item.id, item.isActive)}
                              >
                                <EyeOff className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                            <span className={item.isActive ? "text-green-600" : "text-red-600"}>
                              {item.isActive ? "활성화" : "비활성화"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                편집
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteItem(item.id)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 메뉴 그룹 편집 다이얼로그 */}
      <Dialog open={isDialogOpen && !!editingGroup} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setEditingGroup(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>메뉴 그룹 {editingGroup?.id.startsWith('group-') ? '추가' : '편집'}</DialogTitle>
            <DialogDescription>
              메뉴 그룹의 속성을 설정합니다. ID는 변경할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...groupForm}>
            <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-4">
              <FormField
                control={groupForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>그룹명</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>사이드바에 표시될 그룹 이름</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이콘</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="아이콘 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>그룹에 표시될 아이콘</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupForm.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>표시 순서</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                      />
                    </FormControl>
                    <FormDescription>값이 작을수록 먼저 표시됩니다</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div>
                      <FormLabel>활성화 상태</FormLabel>
                      <FormDescription>비활성화하면 메뉴에 표시되지 않습니다</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div>
                      <FormLabel>공개 여부</FormLabel>
                      <FormDescription>활성화하면 비로그인 사용자에게도 보입니다</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupForm.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <FormLabel>접근 권한</FormLabel>
                    <div className="space-y-2">
                      {roleOptions.map((role) => (
                        <FormField
                          key={role.value}
                          control={groupForm.control}
                          name="roles"
                          render={({ field }) => {
                            return (
                              <FormItem key={role.value} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, role.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== role.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {role.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      선택한 역할의 사용자에게 메뉴가 표시됩니다
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 메뉴 아이템 편집 다이얼로그 */}
      <Dialog open={isDialogOpen && !!editingItem} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setEditingItem(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>메뉴 항목 {editingItem?.id.startsWith('item-') ? '추가' : '편집'}</DialogTitle>
            <DialogDescription>
              메뉴 항목의 속성을 설정합니다.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4">
              <FormField
                control={itemForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>항목명</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>메뉴에 표시될 항목 이름</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경로</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>메뉴 클릭 시 이동할 경로 (예: /dashboard)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이콘</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="아이콘 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>항목에 표시될 아이콘</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>링크 유형</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="유형 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">내부 링크</SelectItem>
                        <SelectItem value="external">외부 링크</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>내부 페이지 링크인지 외부 URL인지 선택</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>소속 그룹</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="그룹 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {menuConfig.groups.map(group => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>항목이 소속될 메뉴 그룹</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>표시 순서</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                      />
                    </FormControl>
                    <FormDescription>그룹 내에서의 정렬 순서</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div>
                      <FormLabel>활성화 상태</FormLabel>
                      <FormDescription>비활성화하면 메뉴에 표시되지 않습니다</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div>
                      <FormLabel>공개 여부</FormLabel>
                      <FormDescription>활성화하면 비로그인 사용자에게도 보입니다</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="openInNewWindow"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div>
                      <FormLabel>새 창에서 열기</FormLabel>
                      <FormDescription>활성화하면 새 탭/창에서 링크가 열립니다</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <FormLabel>접근 권한</FormLabel>
                    <div className="space-y-2">
                      {roleOptions.map((role) => (
                        <FormField
                          key={role.value}
                          control={itemForm.control}
                          name="roles"
                          render={({ field }) => {
                            return (
                              <FormItem key={role.value} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, role.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== role.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {role.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      선택한 역할의 사용자에게 메뉴가 표시됩니다
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Badge 컴포넌트 정의
function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${className}`}>
      {children}
    </span>
  );
}