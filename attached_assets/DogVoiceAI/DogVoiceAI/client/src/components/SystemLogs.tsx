import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Download, Trash2 } from "lucide-react";
import type { SystemLog } from "@shared/schema";

export default function SystemLogs() {
  const { data: logs, refetch } = useQuery<SystemLog[]>({
    queryKey: ["/api/system-logs"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  });

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'INFO':
        return 'text-green-400';
      case 'WARN':
        return 'text-yellow-400';
      case 'ERROR':
        return 'text-red-400';
      case 'DEBUG':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string | Date | null) => {
    if (!timestamp) return '시간 미정';
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const clearLogs = () => {
    // In a real implementation, this would call an API to clear logs
    console.log('Clearing logs...');
  };

  const downloadLogs = () => {
    if (!logs) return;
    
    const logContent = logs.map(log => 
      `[${formatTimestamp(log.timestamp)}] ${log.level}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-gray-600" />
            <span>실시간 시스템 로그</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="animate-pulse">
              실시간
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full">
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            {logs && logs.length > 0 ? (
              <div className="space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="log-entry">
                    <span className="log-timestamp">
                      [{formatTimestamp(log.timestamp)}]
                    </span>{' '}
                    <span className={`font-medium ${getLevelColor(log.level)}`}>
                      {log.level}:
                    </span>{' '}
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                시스템 로그를 불러오는 중...
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearLogs}
            className="flex-1 text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            로그 지우기
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadLogs}
            className="flex-1 text-xs"
            disabled={!logs || logs.length === 0}
          >
            <Download className="w-3 h-3 mr-1" />
            다운로드
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}