import { useState, useEffect } from "react";
import { Dog, ExternalLink, Maximize, Minimize, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DogAnalysisPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    window.open('https://talezaitool.com', '_blank');
  };

  return (
    <div id="dog-ai-container" className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <div className="bg-white border-b shadow-sm px-4 py-3">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dog className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">강아지 AI 분석</h1>
              <p className="text-xs text-gray-500">TALEZ AI Tool - 고급 행동 분석 시스템</p>
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
          src="https://talezaitool.com"
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
