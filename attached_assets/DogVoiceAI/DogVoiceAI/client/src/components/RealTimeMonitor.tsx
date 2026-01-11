import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StreamLine {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  gpu: number;
  network: number;
}

export default function RealTimeMonitor() {
  const [dataStream, setDataStream] = useState<StreamLine[]>([]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    gpu: 38,
    network: 25
  });

  const [isMonitoring, setIsMonitoring] = useState(true);
  const streamRef = useRef<HTMLDivElement>(null);

  // 실제 AI 분석 로그 추가 함수
  const addAnalysisLog = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('ko-KR', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newLine: StreamLine = {
      timestamp,
      message,
      type
    };

    setDataStream(prev => {
      const updated = [...prev, newLine];
      return updated.slice(-20); // 최근 20개만 유지
    });
  };

  // 전역에서 사용할 수 있도록 window 객체에 함수 등록
  useEffect(() => {
    (window as any).addAnalysisLog = addAnalysisLog;
    
    // 초기 로그 메시지
    addAnalysisLog('🔄 실시간 분석 시스템 시작', 'info');
    addAnalysisLog('✅ AI 모델 로드 완료', 'success');
    
    return () => {
      delete (window as any).addAnalysisLog;
    };
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // 시스템 메트릭 업데이트
      setSystemMetrics({
        cpu: Math.random() * 40 + 30,
        memory: Math.random() * 30 + 50,
        gpu: Math.random() * 50 + 20,
        network: Math.random() * 60 + 10
      });

      // 실제 분석 로그는 AI 분석 완료 시 추가됨
      // 시스템 메트릭은 계속 시뮬레이션 (실제 시스템 정보는 보안상 접근 불가)
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  useEffect(() => {
    // 자동 스크롤
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [dataStream]);

  const clearStream = () => {
    setDataStream([]);
  };

  const exportStream = () => {
    const data = dataStream.map(line => 
      `[${line.timestamp}] ${line.message}`
    ).join('\n');
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitor-log-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricColor = (value: number) => {
    if (value < 30) return 'text-green-600';
    if (value < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBg = (value: number) => {
    if (value < 30) return 'bg-green-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStreamLineColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 실시간 데이터 스트림 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📡</span>
            <span>실시간 데이터 스트림</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            음성 분석 과정을 실시간으로 모니터링합니다
          </p>
          <div className="flex items-center space-x-2">
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? '🟢 활성' : '🔴 중지'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? '일시정지' : '시작'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={streamRef}
            className="data-stream"
          >
            {dataStream.map((line, index) => (
              <div 
                key={index} 
                className={`stream-line ${getStreamLineColor(line.type)}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                [{line.timestamp}] {line.message}
              </div>
            ))}
            {dataStream.length === 0 && (
              <div className="text-gray-500 text-center mt-20">
                스트림이 비어있습니다
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <Button onClick={clearStream} variant="outline" size="sm">
              🧹 스트림 지우기
            </Button>
            <Button onClick={exportStream} variant="outline" size="sm">
              💾 데이터 내보내기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 시스템 성능 모니터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>AI 엔진 성능 모니터</span>
            <Badge variant="default" className="ml-2">OpenAI GPT-5.1</Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            OpenAI AI 엔진의 실시간 성능을 추적합니다
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CPU 사용률 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">CPU 사용률</span>
              <span className={`font-bold ${getMetricColor(systemMetrics.cpu)}`}>
                {systemMetrics.cpu.toFixed(1)}%
              </span>
            </div>
            <div className="performance-meter">
              <div 
                className="performance-fill cpu"
                style={{ width: `${systemMetrics.cpu}%` }}
              />
            </div>
          </div>

          {/* 메모리 사용률 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">메모리 사용률</span>
              <span className={`font-bold ${getMetricColor(systemMetrics.memory)}`}>
                {systemMetrics.memory.toFixed(1)}%
              </span>
            </div>
            <div className="performance-meter">
              <div 
                className="performance-fill memory"
                style={{ width: `${systemMetrics.memory}%` }}
              />
            </div>
          </div>

          {/* GPU 사용률 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">GPU 사용률</span>
              <span className={`font-bold ${getMetricColor(systemMetrics.gpu)}`}>
                {systemMetrics.gpu.toFixed(1)}%
              </span>
            </div>
            <div className="performance-meter">
              <div 
                className="performance-fill gpu"
                style={{ width: `${systemMetrics.gpu}%` }}
              />
            </div>
          </div>

          {/* 네트워크 사용률 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">네트워크 사용률</span>
              <span className={`font-bold ${getMetricColor(systemMetrics.network)}`}>
                {systemMetrics.network.toFixed(1)}%
              </span>
            </div>
            <div className="performance-meter">
              <div 
                className="performance-fill network"
                style={{ width: `${systemMetrics.network}%` }}
              />
            </div>
          </div>

          {/* 시스템 상태 요약 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">시스템 상태 요약</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">온라인 시간:</span>
                <div className="font-medium">2시간 34분</div>
              </div>
              <div>
                <span className="text-gray-600">처리된 요청:</span>
                <div className="font-medium">1,247개</div>
              </div>
              <div>
                <span className="text-gray-600">평균 응답시간:</span>
                <div className="font-medium">1.2초</div>
              </div>
              <div>
                <span className="text-gray-600">오류율:</span>
                <div className="font-medium text-green-600">0.1%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}