import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users,
  UserCheck,
  Shield,
  Building,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  PieChart,
  BarChart3
} from 'lucide-react';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  instituteId?: number;
  createdAt: string;
  avatar?: string;
}

interface MembersStatusData {
  totalMembers: number;
  membersByRole: {
    [key: string]: Member[];
  };
  instituteMemberships: any[];
  memberGrowth: any[];
  activeMembers: number;
  newMembersThisMonth: number;
  verifiedMembers: number;
}

export default function MembersStatus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 회원 현황 데이터 조회
  const { data: membersData, isLoading, error } = useQuery<MembersStatusData>({
    queryKey: ['/api/admin/members-status'],
    retry: 1,
  });

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      'pet-owner': '반려인',
      'trainer': '훈련사',
      'institute-admin': '기관 관리자',
      'admin': '시스템 관리자'
    };
    return roleLabels[role] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants = {
      'pet-owner': 'default',
      'trainer': 'secondary',
      'institute-admin': 'outline',
      'admin': 'destructive'
    };
    return variants[role] || 'default';
  };

  // 검색 및 필터링된 회원 목록
  const getFilteredMembers = () => {
    if (!membersData) return [];

    let allMembers: Member[] = [];
    Object.values(membersData.membersByRole).forEach(members => {
      allMembers = allMembers.concat(members);
    });

    return allMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'verified' && member.isVerified) ||
                           (statusFilter === 'unverified' && !member.isVerified);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const filteredMembers = getFilteredMembers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">회원 현황을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600">회원 현황을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">회원 현황</h1>
          <p className="text-muted-foreground">플랫폼 회원 현황 및 관리</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          새 회원 등록
        </Button>
      </div>

      {/* 전체 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 회원</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersData?.totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              이번 달 +{membersData?.newMembersThisMonth || 0}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 회원</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersData?.activeMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              전체의 {membersData?.totalMembers ? Math.round((membersData.activeMembers / membersData.totalMembers) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">인증 회원</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersData?.verifiedMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              인증률 {membersData?.totalMembers ? Math.round((membersData.verifiedMembers / membersData.totalMembers) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">기관 소속</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersData?.instituteMemberships?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              기관 연결 회원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 역할별 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {membersData?.membersByRole && Object.entries(membersData.membersByRole).map(([role, members]) => (
          <Card key={role}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getRoleLabel(role)}</CardTitle>
              <Badge variant={getRoleBadgeVariant(role)}>{members.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground">
                전체의 {membersData.totalMembers ? Math.round((members.length / membersData.totalMembers) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="이름 또는 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>역할</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pet-owner">반려인</SelectItem>
                  <SelectItem value="trainer">훈련사</SelectItem>
                  <SelectItem value="institute-admin">기관 관리자</SelectItem>
                  <SelectItem value="admin">시스템 관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>상태</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="verified">인증됨</SelectItem>
                  <SelectItem value="unverified">미인증</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 회원 목록 테이블 */}
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>회원</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {getRoleLabel(member.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {member.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {member.isVerified ? '인증됨' : '미인증'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(member.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}