import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Star, 
  Users, 
  TrendingUp, 
  Filter, 
  Search, 
  Eye, 
  Gift,
  Calendar,
  Award,
  Building,
  UserCheck,
  ShoppingBag
} from "lucide-react";

interface UserPoints {
  id: string;
  name: string;
  email: string;
  role: '견주' | '훈련사' | '기관 관리자';
  currentPoints: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  monthlyEarned: number;
  monthlyUsed: number;
  totalLifetimePoints: number;
  lastActivity: string;
  status: 'active' | 'inactive';
}

interface PointsOverview {
  totalUsers: number;
  totalPoints: number;
  monthlyPointsIssued: number;
  monthlyPointsUsed: number;
  pointsExpiringSoon: number;
  usersByTier: {
    BRONZE: number;
    SILVER: number;
    GOLD: number;
    PLATINUM: number;
  };
  usersByRole: {
    '견주': number;
    '훈련사': number;
    '기관 관리자': number;
  };
}

interface PointTransaction {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  type: '적립' | '사용' | '만료' | '관리자 지급';
  amount: number;
  description: string;
  date: string;
  category: string;
}

export default function AdminPointsManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserPoints | null>(null);

  const { data: overview, isLoading: overviewLoading } = useQuery<PointsOverview>({
    queryKey: ['/api/admin/points/overview'],
    queryFn: async () => {
      const response = await fetch('/api/admin/points/overview');
      if (!response.ok) {
        throw new Error('포인트 개요 정보를 가져오지 못했습니다');
      }
      return response.json();
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery<UserPoints[]>({
    queryKey: ['/api/admin/points/users', { search: searchTerm, role: roleFilter, tier: tierFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (tierFilter !== 'all') params.append('tier', tierFilter);
      
      const response = await fetch(`/api/admin/points/users?${params}`);
      if (!response.ok) {
        throw new Error('사용자 포인트 정보를 가져오지 못했습니다');
      }
      return response.json();
    }
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<PointTransaction[]>({
    queryKey: ['/api/admin/points/transactions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/points/transactions');
      if (!response.ok) {
        throw new Error('포인트 거래 내역을 가져오지 못했습니다');
      }
      return response.json();
    }
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return 'bg-amber-100 text-amber-800';
      case 'SILVER': return 'bg-gray-100 text-gray-800';
      case 'GOLD': return 'bg-yellow-100 text-yellow-800';
      case 'PLATINUM': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case '견주': return 'bg-green-100 text-green-800';
      case '훈련사': return 'bg-blue-100 text-blue-800';
      case '기관 관리자': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case '견주': return <Users className="w-4 h-4" />;
      case '훈련사': return <UserCheck className="w-4 h-4" />;
      case '기관 관리자': return <Building className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case '적립': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case '사용': return <Gift className="w-4 h-4 text-blue-600" />;
      case '만료': return <Calendar className="w-4 h-4 text-red-600" />;
      case '관리자 지급': return <Award className="w-4 h-4 text-purple-600" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (overviewLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overviewData = overview || {
    totalUsers: 0,
    totalPoints: 0,
    monthlyPointsIssued: 0,
    monthlyPointsUsed: 0,
    pointsExpiringSoon: 0,
    usersByTier: { BRONZE: 0, SILVER: 0, GOLD: 0, PLATINUM: 0 },
    usersByRole: { '견주': 0, '훈련사': 0, '기관 관리자': 0 }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">포인트 관리</h1>
          <p className="text-gray-600 dark:text-gray-400">전체 사용자 포인트 현황 및 관리</p>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600">시스템 관리자</span>
        </div>
      </div>

      {/* 전체 현황 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span>전체 사용자</span>
              <Users className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overviewData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">포인트 보유 회원</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span>전체 포인트</span>
              <Star className="w-4 h-4 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overviewData.totalPoints.toLocaleString()}P</div>
            <p className="text-xs text-gray-500 mt-1">시스템 내 총 포인트</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span>월간 발행</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overviewData.monthlyPointsIssued.toLocaleString()}P</div>
            <p className="text-xs text-gray-500 mt-1">이번 달 발행된 포인트</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span>월간 사용</span>
              <Gift className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overviewData.monthlyPointsUsed.toLocaleString()}P</div>
            <p className="text-xs text-gray-500 mt-1">이번 달 사용된 포인트</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span>만료 예정</span>
              <Calendar className="w-4 h-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overviewData.pointsExpiringSoon.toLocaleString()}P</div>
            <p className="text-xs text-gray-500 mt-1">30일 내 만료 예정</p>
          </CardContent>
        </Card>
      </div>

      {/* 사용자 분포 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>등급별 사용자 분포</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(overviewData.usersByTier).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getTierColor(tier)}>{tier}</Badge>
                  </div>
                  <span className="font-medium">{count.toLocaleString()}명</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>역할별 사용자 분포</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(overviewData.usersByRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(role)}
                    <Badge className={getRoleColor(role)}>{role}</Badge>
                  </div>
                  <span className="font-medium">{count.toLocaleString()}명</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 컨텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">전체 현황</TabsTrigger>
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
          <TabsTrigger value="transactions">거래 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="text-center py-8">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">포인트 시스템 운영 중</h3>
            <p className="text-gray-600">전체 포인트 현황이 위의 카드에 표시됩니다.</p>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {/* 검색 및 필터 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="사용자 이름 또는 이메일 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 역할</SelectItem>
                <SelectItem value="견주">견주</SelectItem>
                <SelectItem value="훈련사">훈련사</SelectItem>
                <SelectItem value="기관 관리자">기관 관리자</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="등급 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 등급</SelectItem>
                <SelectItem value="BRONZE">BRONZE</SelectItem>
                <SelectItem value="SILVER">SILVER</SelectItem>
                <SelectItem value="GOLD">GOLD</SelectItem>
                <SelectItem value="PLATINUM">PLATINUM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 사용자 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 포인트 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-500">로딩 중...</p>
                  </div>
                ) : !users || users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">검색 조건에 맞는 사용자가 없습니다.</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge className={getTierColor(user.tier)}>{user.tier}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-primary">{user.currentPoints.toLocaleString()}P</p>
                          <p className="text-xs text-gray-500">보유 포인트</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">+{user.monthlyEarned.toLocaleString()}P</p>
                          <p className="text-xs text-gray-500">월간 적립</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <Eye className="w-4 h-4 mr-1" />
                              상세
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                {getRoleIcon(user.role)}
                                <span>{user.name} 포인트 상세</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">현재 포인트</p>
                                  <p className="text-2xl font-bold text-primary">{user.currentPoints.toLocaleString()}P</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">총 누적 포인트</p>
                                  <p className="text-2xl font-bold text-gray-900">{user.totalLifetimePoints.toLocaleString()}P</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">이번 달 적립</p>
                                  <p className="text-lg font-semibold text-green-600">{user.monthlyEarned.toLocaleString()}P</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">이번 달 사용</p>
                                  <p className="text-lg font-semibold text-blue-600">{user.monthlyUsed.toLocaleString()}P</p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getTierColor(user.tier)}>{user.tier}</Badge>
                                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                                </div>
                                <p className="text-sm text-gray-500">마지막 활동: {user.lastActivity}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 포인트 거래 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-500">로딩 중...</p>
                  </div>
                ) : !transactions || transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">아직 포인트 거래 내역이 없습니다.</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-sm text-gray-500">{transaction.userName}</p>
                            <Badge variant="outline" className="text-xs">{transaction.userRole}</Badge>
                            <p className="text-sm text-gray-500">· {transaction.category}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === '적립' || transaction.type === '관리자 지급' 
                            ? 'text-green-600' 
                            : transaction.type === '사용' 
                              ? 'text-blue-600' 
                              : 'text-red-600'
                        }`}>
                          {transaction.type === '적립' || transaction.type === '관리자 지급' ? '+' : '-'}
                          {transaction.amount.toLocaleString()}P
                        </p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}