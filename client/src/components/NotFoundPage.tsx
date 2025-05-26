import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { DogIcon } from 'lucide-react';

/**
 * 404 페이지 컴포넌트
 * 
 * 사용자가 존재하지 않는 페이지에 접근했을 때 표시되는 페이지
 * 사용자 친화적인 메시지와 함께 홈페이지로 돌아갈 수 있는 버튼 제공
 */
const NotFoundPage: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <DogIcon className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-3 text-primary">페이지를 찾을 수 없습니다</h1>
        
        <div className="relative mb-6">
          <div className="text-6xl font-extrabold text-primary/10 mb-[-2rem]">404</div>
          <p className="text-lg text-muted-foreground relative z-10">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        
        <div className="max-w-xs mx-auto text-sm text-muted-foreground mb-8">
          <p>주소가 정확한지 확인하시거나, 하단의 버튼을 클릭하여 홈페이지로 돌아가실 수 있습니다.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/')}
            size="lg"
            className="flex-1 sm:flex-initial"
          >
            홈으로 돌아가기
          </Button>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-initial"
          >
            이전 페이지로 돌아가기
          </Button>
        </div>
        
        {/* 도움말 */}
        <div className="mt-12 p-4 border rounded-lg bg-muted/30">
          <h3 className="font-medium mb-2">도움이 필요하신가요?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            페이지를 찾는데 문제가 있으시면 아래 방법을 통해 도움을 받으실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 text-sm text-primary">
            <a href="/help" className="hover:underline">도움말 센터</a>
            <span className="hidden sm:block text-muted-foreground">•</span>
            <a href="/contact" className="hover:underline">고객센터 문의</a>
            <span className="hidden sm:block text-muted-foreground">•</span>
            <a href="/sitemap" className="hover:underline">사이트맵</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;