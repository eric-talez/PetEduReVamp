import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  PlusCircle,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  UserCog,
  Lock,
  Unlock,
  Shield,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// 사용자 타입 정의
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  avatar?: string;
  joinDate: string;
  lastLogin?: string;
  phone?: string;
  permissions?: string[];
  twoFactorEnabled?: boolean;
}

export default function AdminUsers() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 데이터
        const mockUsers: User[] = [
          {
            id: 1,
            name: '김관리자',
            username: 'admin1',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            joinDate: '2023-01-15',
            lastLogin: '2024-05-10 09:12:45',
            phone: '010-1234-5678',
            permissions: ['all'],
            twoFactorEnabled: true
          },
          {
            id: 2,
            name: '이기관',
            username: 'institute1',
            email: 'institute@example.com',
            role: 'institute-admin',
            status: 'active',
            joinDate: '2023-02-20',
            lastLogin: '2024-05-09 15:30:12',
            phone: '010-2345-6789',
            permissions: ['institute-manage', 'trainer-manage', 'course-manage'],
            twoFactorEnabled: false
          },
          {
            id: 3,
            name: '박훈련',
            username: 'trainer1',
            email: 'trainer@example.com',
            role: 'trainer',
            status: 'active',
            joinDate: '2023-03-10',
            lastLogin: '2024-05-10 11:45:30',
            phone: '010-3456-7890',
            permissions: ['course-teach', 'student-manage'],
            twoFactorEnabled: false
          },
          {
            id: 4,
            name: '최견주',
            username: 'petowner1',
            email: 'petowner@example.com',
            role: 'pet-owner',
            status: 'active',
            joinDate: '2023-04-05',
            lastLogin: '2024-05-08 18:20:15',
            phone: '010-4567-8901',
            twoFactorEnabled: false
          },
          {
            id: 5,
            name: '정사용자',
            username: 'user1',
            email: 'user@example.com',
            role: 'user',
            status: 'pending',
            joinDate: '2023-05-15',
            twoFactorEnabled: false
          },
          {
            id: 6,
            name: '강차단',
            username: 'blocked1',
            email: 'blocked@example.com',
            role: 'user',
            status: 'blocked',
            joinDate: '2023-05-20',
            lastLogin: '2023-12-01 10:15:30',
            twoFactorEnabled: false
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('사용자 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '사용자 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, [toast]);

  // 필터링된 사용자 목록 업데이트
  useEffect(() => {
    let result = [...users];
    
    // 탭 필터링
    if (activeTab !== 'all') {
      result = result.filter(user => user.status === activeTab);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );
    }
    
    // 역할 필터링
    if (filterRole) {
      result = result.filter(user => user.role === filterRole);
    }
    
    // 상태 필터링
    if (filterStatus) {
      result = result.filter(user => user.status === filterStatus);
    }
    
    // 정렬
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredUsers(result);
  }, [users, activeTab, searchQuery, filterRole, filterStatus, sortBy, sortOrder]);

  // 사용자 상세 정보 보기
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowUserModal(true);
  };

  // 사용자 편집 모드
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowUserModal(true);
  };

  // 새 사용자 추가 모드
  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setShowUserModal(true);
  };

  // 사용자 삭제 처리
  const handleDeleteUser = (userId: number) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: '사용자 삭제',
        description: '사용자가 성공적으로 삭제되었습니다.',
      });
    }
  };

  // 사용자 상태 변경
  const handleChangeStatus = (userId: number, newStatus: 'active' | 'inactive' | 'pending' | 'blocked') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    const statusMap = {
      active: '활성',
      inactive: '비활성',
      pending: '대기',
      blocked: '차단'
    };
    
    toast({
      title: '사용자 상태 변경',
      description: `사용자 상태가 '${statusMap[newStatus]}'(으)로 변경되었습니다.`,
    });
  };

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 역할별 배지 색상
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'purple';
      case 'institute-admin':
        return 'amber';
      case 'trainer':
        return 'green';
      case 'pet-owner':
        return 'blue';
      case 'user':
      default:
        return 'gray';
    }
  };

  // 역할 한글명 변환
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '시스템 관리자';
      case 'institute-admin':
        return '기관 관리자';
      case 'trainer':
        return '훈련사';
      case 'pet-owner':
        return '견주';
      case 'user':
      default:
        return '일반 사용자';
    }
  };

  // 상태별 배지 색상 및 아이콘
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            활성
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="text-gray-500">
            <XCircle className="w-3 h-3 mr-1" />
            비활성
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            대기
          </Badge>
        );
      case 'blocked':
        return (
          <Badge className="bg-red-500">
            <Lock className="w-3 h-3 mr-1" />
            차단
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
        description: '사용자 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleAddUser()} variant="default">
            <UserPlus className="mr-2 h-4 w-4" />
            사용자 추가
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">활성</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="blocked">차단</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름, 이메일, 사용자명 검색..."
                className="pl-8 h-9 md:w-[300px] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterRole || 'all'} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 역할</SelectItem>
                <SelectItem value="admin">시스템 관리자</SelectItem>
                <SelectItem value="institute-admin">기관 관리자</SelectItem>
                <SelectItem value="trainer">훈련사</SelectItem>
                <SelectItem value="pet-owner">견주</SelectItem>
                <SelectItem value="user">일반 사용자</SelectItem>
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
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>사용자</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">데이터를 불러오고 있습니다...</div>
                    </TableCell>
                  </TableRow>
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-${getRoleBadgeVariant(user.role)}-500 text-${getRoleBadgeVariant(user.role)}-500`}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user)}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleChangeStatus(user.id, 'blocked')}
                              className="text-red-500"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleChangeStatus(user.id, 'active')}
                              className="text-green-500"
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
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
                총 {filteredUsers.length}명 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}명 표시
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
      
      {/* 사용자 상세 정보 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'add' ? '새 사용자 추가' : modalMode === 'edit' ? '사용자 정보 수정' : '사용자 상세 정보'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'add' ? '새로운 사용자를 시스템에 추가합니다.' : 
               modalMode === 'edit' ? '사용자 정보를 수정합니다.' : 
               selectedUser ? `${selectedUser.name}님의 상세 정보입니다.` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (modalMode === 'view' || modalMode === 'edit') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback className="text-2xl">{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">@{selectedUser.username}</p>
                  </div>
                  
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="outline" className={`border-${getRoleBadgeVariant(selectedUser.role)}-500 text-${getRoleBadgeVariant(selectedUser.role)}-500`}>
                      {getRoleLabel(selectedUser.role)}
                    </Badge>
                    {getStatusBadge(selectedUser.status)}
                    {selectedUser.twoFactorEnabled && (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        <Shield className="w-3 h-3 mr-1" />
                        2FA
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">기본 정보</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>가입일: {selectedUser.joinDate}</span>
                    </div>
                    {selectedUser.lastLogin && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>최근 로그인: {selectedUser.lastLogin}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">권한 정보</h4>
                  {selectedUser.permissions && selectedUser.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.permissions.map(permission => (
                        <Badge key={permission} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">권한 정보가 없습니다.</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground">보안 설정</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2단계 인증 활성화</span>
                      <span className={selectedUser.twoFactorEnabled ? "text-green-500" : "text-red-500"}>
                        {selectedUser.twoFactorEnabled ? "활성화됨" : "비활성화됨"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 편집 모드일 때만 보이는 버튼들 */}
                {modalMode === 'edit' && (
                  <div className="space-y-4 mt-6">
                    <Button className="w-full" onClick={() => { }}>변경사항 저장</Button>
                  </div>
                )}
                
                {/* 보기 모드일 때만 보이는 버튼들 */}
                {modalMode === 'view' && (
                  <div className="space-y-4 mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => { setModalMode('edit'); }}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      사용자 정보 수정
                    </Button>
                    {selectedUser.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        className="w-full text-red-500" 
                        onClick={() => { handleChangeStatus(selectedUser.id, 'blocked'); setShowUserModal(false); }}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        사용자 차단
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full text-green-500" 
                        onClick={() => { handleChangeStatus(selectedUser.id, 'active'); setShowUserModal(false); }}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        사용자 활성화
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => { handleDeleteUser(selectedUser.id); setShowUserModal(false); }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      사용자 삭제
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 추가 모드 양식 */}
          {modalMode === 'add' && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm">이름</label>
                <Input id="name" className="col-span-3" placeholder="사용자 이름" autoFocus />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="username" className="text-right text-sm">사용자명</label>
                <Input id="username" className="col-span-3" placeholder="로그인 ID" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm">이메일</label>
                <Input id="email" type="email" className="col-span-3" placeholder="이메일 주소" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="password" className="text-right text-sm">비밀번호</label>
                <Input id="password" type="password" className="col-span-3" placeholder="비밀번호" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right text-sm">연락처</label>
                <Input id="phone" className="col-span-3" placeholder="전화번호" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm">역할</label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">시스템 관리자</SelectItem>
                    <SelectItem value="institute-admin">기관 관리자</SelectItem>
                    <SelectItem value="trainer">훈련사</SelectItem>
                    <SelectItem value="pet-owner">견주</SelectItem>
                    <SelectItem value="user">일반 사용자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {modalMode === 'add' && (
              <Button type="submit" onClick={() => setShowUserModal(false)}>사용자 추가</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}