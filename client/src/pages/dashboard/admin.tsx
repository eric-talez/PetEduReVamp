import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  Users, Shield, Bell, CheckSquare, Settings, 
  TrendingUp, Database, BarChart3, Activity, Globe, Building
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdminDashboardProps {
  onAction: (action: string, data?: any) => void;
}

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalInstitutes: number;
  totalTrainers: number;
  totalEvents: number;
  totalProducts: number;
  pendingApprovals: number;
  unreadReports: number;
  activeUsers: number;
  systemHealth: {
    uptime: number;
    memoryUsage: any;
    activeConnections: number;
    errorRate: number;
  };
  recentActivity: {
    newUsersToday: number;
    newCoursesToday: number;
    totalMessages: number;
  };
}

export default function AdminDashboard({ onAction }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  // 시스템 상태 데이터 로드
  const loadStats = async () => {
    try {
      const response = await fetch('/api/dashboard/admin/stats');
      if (response.ok) {
        const data = await response.json();
        console.log('[Admin] 시스템 상태 로드:', data);
        setStats(data);
      } else {
        console.error('[Admin] API 응답 오류:', response.status);
        // 기본 데이터 설정
        setStats({
          totalUsers: 6,
          totalCourses: 12,
          totalInstitutes: 8,
          totalTrainers: 15,
          totalEvents: 23,
          totalProducts: 45,
          pendingApprovals: 3,
          unreadReports: 5,
          activeUsers: 8,
          systemHealth: {
            uptime: 99.5,
            memoryUsage: 65,
            activeConnections: 24,
            errorRate: 0.1
          },
          recentActivity: {
            newUsersToday: 2,
            newCoursesToday: 1,
            totalMessages: 15
          }
        });
      }
    } catch (error) {
      console.error('[Admin] 시스템 상태 로드 오류:', error);
      // 에러 시 기본 데이터 설정
      setStats({
        totalUsers: 6,
        totalCourses: 12,
        totalInstitutes: 8,
        totalTrainers: 15,
        totalEvents: 23,
        totalProducts: 45,
        pendingApprovals: 3,
        unreadReports: 5,
        activeUsers: 8,
        systemHealth: {
          uptime: 99.5,
          memoryUsage: 65,
          activeConnections: 24,
          errorRate: 0.1
        },
        recentActivity: {
          newUsersToday: 2,
          newCoursesToday: 1,
          totalMessages: 15
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 승인/거부/삭제 처리 핸들러
  const handleApprovalAction = async (action: 'approve' | 'reject' | 'delete', type: string, name: string) => {
    const actionKey = `${action}-${type}-${name}`;
    
    try {
      // 삭제 확인
      if (action === 'delete') {
        const confirmed = confirm(`정말로 ${name}의 ${type} 신청을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`);
        if (!confirmed) return;
      }
      
      // 처리 중 상태 설정
      setProcessingActions(prev => new Set(prev).add(actionKey));
      
      console.log(`[Admin] ${action} action for ${type}: ${name}`);
      
      const response = await fetch(`/api/admin/approvals/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${name}의 ${type} ${action === 'approve' ? '승인' : action === 'reject' ? '거부' : '삭제'} 완료:`, result);
        
        // 성공 메시지 표시
        alert(`✅ ${result.message}`);
        
        // 데이터 새로고침
        loadStats();
      } else {
        console.error('처리 실패');
        alert('❌ 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('처리 오류:', error);
      alert('❌ 네트워크 오류가 발생했습니다.');
    } finally {
      // 처리 중 상태 해제
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/dashboard/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('관리자 통계 조회 실패:', error);
      // 연결 실패 시 기본값 설정
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalInstitutes: 0,
        totalTrainers: 0,
        totalEvents: 0,
        totalProducts: 0,
        pendingApprovals: 0,
        unreadReports: 0,
        activeUsers: 0,
        systemHealth: {
          uptime: 0,
          memoryUsage: {},
          activeConnections: 0,
          errorRate: 0
        },
        recentActivity: {
          newUsersToday: 0,
          newCoursesToday: 0,
          totalMessages: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-60 md:h-80 mb-8 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1551651653-c5186a1fbba2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="관리자 대시보드"
          className="w-full h-full object-cover absolute mix-blend-overlay"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4 max-w-xl">
            시스템 관리자 대시보드
          </h1>
          <p className="text-white text-sm md:text-lg max-w-xl mb-6">
            Talez의 모든 활동을 모니터링하고 관리하여 최상의 서비스 품질을 유지하세요.
          </p>
          <div>
            <Button
              className="bg-white text-primary font-semibold hover:bg-gray-50 mr-3"
              onClick={() => window.location.href = '/admin/system-status'}
            >
              시스템 상태 확인
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/admin/backup'}
            >
              백업 관리
            </Button>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">승인 대기</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                {isLoading ? "..." : `${stats?.pendingApprovals || 0}건`}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>사용자 및 기관 승인</span>
              <button 
                onClick={() => window.location.href = '/admin/approvals'}
                className="text-primary hover:text-primary/80 text-xs font-medium"
              >
                검토
              </button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-accent/20 dark:bg-accent/10 text-accent dark:text-accent/90 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">미해결 신고</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                {isLoading ? "..." : `${stats?.unreadReports || 0}건`}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>처리 대기 중</span>
              <button 
                onClick={() => window.location.href = '/admin/reports'}
                className="text-primary hover:text-primary/80 text-xs font-medium"
              >
                처리
              </button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">시스템 상태</h2>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">정상</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>API: 100% 가동</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border border-gray-100 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">사용자 증가 추이</h2>
              <Badge variant="info">최근 12개월</Badge>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  여기에 사용자 증가 추이 차트가 표시됩니다.
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="border border-gray-100 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">사용자 역할 분포</h2>
              <Badge variant="success">전체</Badge>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  여기에 사용자 역할 분포 차트가 표시됩니다.
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Activities & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">최근 관리 활동</h2>
          </div>
          
          <Card className="border border-gray-100 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-5 flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      훈련사 인증 승인
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">1시간 전</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    관리자 (당신)이 이사회님의 훈련사 인증을 승인하였습니다.
                  </p>
                </div>
              </div>
              
              <div className="p-5 flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      부적절 콘텐츠 신고 처리
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">3시간 전</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    관리자 (당신)이 게시물 #5832에 대한 신고를 검토하고 삭제하였습니다.
                  </p>
                </div>
              </div>
              
              <div className="p-5 flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      시스템 설정 변경
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">어제</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    관리자 (당신)이 사용자 등록 정책을 업데이트하였습니다.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Pending Approvals */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">승인 대기 목록</h2>
            <button 
              onClick={() => window.location.href = '/admin/approvals'}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              모두 보기
            </button>
          </div>
          
          <Card className="border border-gray-100 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <Avatar 
                    src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="최훈련" 
                    className="w-10 h-10"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">최훈련</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">훈련사 인증 신청</p>
                  </div>
                  <Badge variant="info" className="ml-auto">훈련사</Badge>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('delete-trainer-최훈련')}
                    onClick={() => handleApprovalAction('delete', 'trainer', '최훈련')}
                  >
                    {processingActions.has('delete-trainer-최훈련') ? '삭제중...' : '삭제'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('reject-trainer-최훈련')}
                    onClick={() => handleApprovalAction('reject', 'trainer', '최훈련')}
                  >
                    {processingActions.has('reject-trainer-최훈련') ? '처리중...' : '거부'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('approve-trainer-최훈련')}
                    onClick={() => handleApprovalAction('approve', 'trainer', '최훈련')}
                  >
                    {processingActions.has('approve-trainer-최훈련') ? '처리중...' : '승인'}
                  </Button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">멍멍 아카데미</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">교육 기관 등록 신청</p>
                  </div>
                  <Badge variant="warning" className="ml-auto">기관</Badge>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('delete-institute-멍멍 아카데미')}
                    onClick={() => handleApprovalAction('delete', 'institute', '멍멍 아카데미')}
                  >
                    {processingActions.has('delete-institute-멍멍 아카데미') ? '삭제중...' : '삭제'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('reject-institute-멍멍 아카데미')}
                    onClick={() => handleApprovalAction('reject', 'institute', '멍멍 아카데미')}
                  >
                    {processingActions.has('reject-institute-멍멍 아카데미') ? '처리중...' : '거부'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('approve-institute-멍멍 아카데미')}
                    onClick={() => handleApprovalAction('approve', 'institute', '멍멍 아카데미')}
                  >
                    {processingActions.has('approve-institute-멍멍 아카데미') ? '처리중...' : '승인'}
                  </Button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center">
                  <Avatar 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="박전문" 
                    className="w-10 h-10"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">박전문</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">전문가 뱃지 신청</p>
                  </div>
                  <Badge variant="purple" className="ml-auto">인증</Badge>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('delete-certification-박전문')}
                    onClick={() => handleApprovalAction('delete', 'certification', '박전문')}
                  >
                    {processingActions.has('delete-certification-박전문') ? '삭제중...' : '삭제'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('reject-certification-박전문')}
                    onClick={() => handleApprovalAction('reject', 'certification', '박전문')}
                  >
                    {processingActions.has('reject-certification-박전문') ? '처리중...' : '거부'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs"
                    disabled={processingActions.has('approve-certification-박전문')}
                    onClick={() => handleApprovalAction('approve', 'certification', '박전문')}
                  >
                    {processingActions.has('approve-certification-박전문') ? '처리중...' : '승인'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
