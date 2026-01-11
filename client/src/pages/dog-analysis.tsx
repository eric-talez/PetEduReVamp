import { useState, useEffect, useMemo } from "react";
import { Dog, ExternalLink, Maximize, Minimize, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: number;
  username: string;
  email?: string;
  name?: string;
  role?: string;
}

export default function DogAnalysisPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const { data: user } = useQuery<UserProfile>({
    queryKey: ['/api/user'],
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const iframeSrc = useMemo(() => {
    const baseUrl = 'https://talezaitool.com';
    if (!user) return baseUrl;
    
    const params = new URLSearchParams();
    if (user.id) params.append('userId', String(user.id));
    if (user.username) params.append('username', user.username);
    if (user.name) params.append('name', user.name);
    if (user.role) params.append('role', user.role);
    params.append('platform', 'talez');
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [user]);

  const toggleFullscreen = async () => {
    try {
      const container = document.getElementById('dog-ai-container');
      if (!isFullscreen) {
        if (container?.requestFullscreen) {
          await container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleOpenNewTab = () => {
    window.open(iframeSrc, '_blank');
  };

  return (
    <div id="dog-ai-container" className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <div className="bg-white border-b shadow-sm px-4 py-3">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dog className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">강아지 AI 분석</h1>
              <p className="text-xs text-gray-500">
                TALEZ AI Tool - 고급 행동 분석 시스템
                {user?.name && <span className="ml-2 text-green-600">({user.name}님)</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} title="새로고침">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen} title={isFullscreen ? "전체화면 종료" : "전체화면"}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenNewTab} title="새 탭에서 열기">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">TALEZ AI Tool 로딩 중...</p>
            </div>
          </div>
        )}
        <iframe
          key={iframeKey}
          src={iframeSrc}
          className="w-full h-full border-0"
          style={{ minHeight: 'calc(100vh - 80px)' }}
          onLoad={() => setIsLoading(false)}
          allow="camera; microphone; fullscreen; autoplay"
          title="TALEZ AI Tool"
        />
      </div>
    </div>
  );
}
