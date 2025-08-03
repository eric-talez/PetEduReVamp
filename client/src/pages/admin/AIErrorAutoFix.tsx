
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Eye, 
  Settings, 
  Activity,
  RefreshCw,
  Code,
  Database,
  Network,
  Server
} from 'lucide-react';

interface ErrorLog {
  id: string;
  type: 'javascript' | 'api' | 'database' | 'network' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  url?: string;
  stackTrace?: string;
  autoFixApplied: boolean;
  autoFixSuccess: boolean;
  resolution?: string;
}

interface AutoFixConfig {
  enabled: boolean;
  autoFixTypes: {
    javascript: boolean;
    api: boolean;
    database: boolean;
    network: boolean;
    performance: boolean;
  };
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  maxAutoFixAttempts: number;
  cooldownPeriod: number;
}

const AIErrorAutoFix: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [config, setConfig] = useState<AutoFixConfig>({
    enabled: false,
    autoFixTypes: {
      javascript: true,
      api: true,
      database: false,
      network: true,
      performance: true
    },
    severityThreshold: 'medium',
    maxAutoFixAttempts: 3,
    cooldownPeriod: 300
  });
  const [loading, setLoading] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [stats, setStats] = useState({
    totalErrors: 0,
    fixedErrors: 0,
    fixSuccessRate: 0,
    avgFixTime: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadErrorLogs();
    loadConfig();
    loadStats();
  }, []);

  // 실시간 모니터링 시작/중지
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (monitoring) {
      interval = setInterval(loadErrorLogs, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [monitoring]);

  const loadErrorLogs = async () => {
    try {
      const response = await fetch('/api/ai/error-logs');
      const data = await response.json();
      setErrors(data);
    } catch (error) {
      console.error('오류 로그 로드 실패:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/ai/autofix-config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/ai/autofix-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('통계 로드 실패:', error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/autofix-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        toast({
          title: "설정 저장 완료",
          description: "AI 자동수정 설정이 성공적으로 저장되었습니다.",
        });
      }
    } catch (error) {
      toast({
        title: "설정 저장 실패",
        description: "설정을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerManualFix = async (errorId: string) => {
    try {
      const response = await fetch(`/api/ai/manual-fix/${errorId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: result.success ? "수정 성공" : "수정 실패",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        });
        loadErrorLogs();
      }
    } catch (error) {
      toast({
        title: "수정 요청 실패",
        description: "수동 수정을 요청하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'javascript': return <Code className="h-4 w-4" />;
      case 'api': return <Network className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'network': return <Server className="h-4 w-4" />;
      case 'performance': return <Activity className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI 오류 자동수정</h1>
          <p className="text-gray-600 mt-2">
            AI 기반 자동 오류 감지 및 수정 시스템
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={monitoring ? "destructive" : "default"}
            onClick={() => setMonitoring(!monitoring)}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{monitoring ? '모니터링 중지' : '실시간 모니터링'}</span>
          </Button>
          <Button onClick={loadErrorLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalErrors}</p>
                <p className="text-sm text-gray-600">총 오류</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.fixedErrors}</p>
                <p className="text-sm text-gray-600">수정된 오류</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.fixSuccessRate}%</p>
                <p className="text-sm text-gray-600">수정 성공률</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.avgFixTime}s</p>
                <p className="text-sm text-gray-600">평균 수정 시간</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">오류 로그</TabsTrigger>
          <TabsTrigger value="config">설정</TabsTrigger>
          <TabsTrigger value="monitoring">모니터링</TabsTrigger>
        </TabsList>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>최근 오류 로그</span>
              </CardTitle>
              <CardDescription>
                AI가 감지하고 처리한 오류들의 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>현재 감지된 오류가 없습니다.</p>
                  </div>
                ) : (
                  errors.map((error) => (
                    <div
                      key={error.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getErrorIcon(error.type)}
                          <div>
                            <h3 className="font-semibold">{error.message}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(error.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                          <Badge variant={error.autoFixApplied ? "default" : "secondary"}>
                            {error.autoFixApplied ? '자동수정 적용' : '수동 확인 필요'}
                          </Badge>
                          {error.autoFixApplied && (
                            <Badge variant={error.autoFixSuccess ? "default" : "destructive"}>
                              {error.autoFixSuccess ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {error.url && (
                        <div className="text-sm text-gray-600">
                          <strong>URL:</strong> {error.url}
                        </div>
                      )}
                      
                      {error.resolution && (
                        <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                          <p className="text-sm"><strong>적용된 수정:</strong> {error.resolution}</p>
                        </div>
                      )}
                      
                      {!error.autoFixApplied && (
                        <Button
                          size="sm"
                          onClick={() => triggerManualFix(error.id)}
                          className="flex items-center space-x-1"
                        >
                          <Bot className="h-3 w-3" />
                          <span>AI 수정 적용</span>
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>AI 자동수정 설정</span>
              </CardTitle>
              <CardDescription>
                자동 오류 수정 시스템의 동작을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">AI 자동수정 활성화</h3>
                  <p className="text-sm text-gray-600">오류 감지시 자동으로 수정을 시도합니다.</p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">자동수정 대상 오류 유형</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(config.autoFixTypes).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-2">
                        {getErrorIcon(type)}
                        <span className="capitalize">{type}</span>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({
                            ...prev,
                            autoFixTypes: { ...prev.autoFixTypes, [type]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">심각도 임계값</label>
                  <select
                    value={config.severityThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, severityThreshold: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="low">낮음 이상</option>
                    <option value="medium">보통 이상</option>
                    <option value="high">높음 이상</option>
                    <option value="critical">심각한 오류만</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">최대 시도 횟수</label>
                  <Input
                    type="number"
                    value={config.maxAutoFixAttempts}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxAutoFixAttempts: parseInt(e.target.value) }))}
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">대기 시간 (초)</label>
                  <Input
                    type="number"
                    value={config.cooldownPeriod}
                    onChange={(e) => setConfig(prev => ({ ...prev, cooldownPeriod: parseInt(e.target.value) }))}
                    min="60"
                    max="3600"
                  />
                </div>
              </div>

              <Button onClick={saveConfig} disabled={loading} className="w-full">
                {loading ? '저장 중...' : '설정 저장'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>실시간 모니터링</span>
              </CardTitle>
              <CardDescription>
                시스템 상태와 AI 자동수정 작업을 실시간으로 모니터링합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monitoring ? (
                <div className="space-y-4">
                  <Alert>
                    <Activity className="h-4 w-4" />
                    <AlertDescription>
                      실시간 모니터링이 활성화되었습니다. 5초마다 새로운 오류를 확인합니다.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">시스템 상태</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>AI 엔진</span>
                            <Badge variant="default">정상</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>오류 감지</span>
                            <Badge variant="default">활성</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>자동수정</span>
                            <Badge variant={config.enabled ? "default" : "secondary"}>
                              {config.enabled ? '활성' : '비활성'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">최근 활동</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>시스템 정상 작동 중</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>마지막 검사: 방금 전</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>처리 대기: 0건</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">실시간 모니터링이 비활성화되어 있습니다.</p>
                  <Button onClick={() => setMonitoring(true)}>
                    모니터링 시작
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIErrorAutoFix;
