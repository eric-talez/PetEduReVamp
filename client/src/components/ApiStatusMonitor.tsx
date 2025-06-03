
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Server, Image, Users, BookOpen } from 'lucide-react';

interface ApiEndpoint {
  name: string;
  url: string;
  status: 'checking' | 'success' | 'error';
  responseTime?: number;
  error?: string;
  dataCount?: number;
}

export const ApiStatusMonitor: React.FC = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    { name: '인증 API', url: '/api/auth/me', status: 'checking' },
    { name: '사용자 API', url: '/api/spring/users', status: 'checking' },
    { name: '강좌 API', url: '/api/courses', status: 'checking' },
    { name: '이벤트 API', url: '/api/events', status: 'checking' },
    { name: '반려동물 API', url: '/api/spring/pets', status: 'checking' },
    { name: '훈련사 API', url: '/api/trainers', status: 'checking' },
    { name: '쇼핑 API', url: '/api/shopping/products', status: 'checking' }
  ]);

  const [isChecking, setIsChecking] = useState(false);

  const checkEndpoint = async (endpoint: ApiEndpoint): Promise<ApiEndpoint> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        let dataCount = 0;
        try {
          const data = await response.json();
          dataCount = Array.isArray(data) ? data.length : (data ? 1 : 0);
        } catch (e) {
          // JSON 파싱 실패해도 응답은 성공으로 간주
        }

        return {
          ...endpoint,
          status: 'success',
          responseTime,
          dataCount
        };
      } else {
        return {
          ...endpoint,
          status: 'error',
          responseTime,
          error: `${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        ...endpoint,
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : '연결 실패'
      };
    }
  };

  const checkAllEndpoints = async () => {
    setIsChecking(true);
    
    const results = await Promise.all(
      endpoints.map(endpoint => checkEndpoint(endpoint))
    );
    
    setEndpoints(results);
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllEndpoints();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">정상</Badge>;
      case 'error':
        return <Badge variant="destructive">오류</Badge>;
      case 'checking':
        return <Badge variant="secondary">확인중</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const successCount = endpoints.filter(e => e.status === 'success').length;
  const totalCount = endpoints.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              API 연동 상태
            </CardTitle>
            <CardDescription>
              실시간 서비스 API 상태 모니터링 ({successCount}/{totalCount} 정상)
            </CardDescription>
          </div>
          <Button
            onClick={checkAllEndpoints}
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getStatusIcon(endpoint.status)}</span>
                  <span className="font-medium text-sm">{endpoint.name}</span>
                </div>
                {getStatusBadge(endpoint.status)}
              </div>
              
              <div className="text-xs text-gray-500">
                <div>URL: {endpoint.url}</div>
                {endpoint.responseTime && (
                  <div>응답시간: {endpoint.responseTime}ms</div>
                )}
                {endpoint.dataCount !== undefined && (
                  <div>데이터: {endpoint.dataCount}개</div>
                )}
                {endpoint.error && (
                  <div className="text-red-500">오류: {endpoint.error}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">데이터베이스</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                연결 상태 및 데이터 확인
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="text-sm font-medium">이미지 업로드</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                파일 업로드 기능 상태
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">인증 시스템</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                로그인/세션 관리
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatusMonitor;
