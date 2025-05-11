import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';
import { Link } from 'wouter';

/**
 * 페이지를 찾을 수 없을 때 표시되는 404 페이지 컴포넌트
 */
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <SearchX className="h-16 w-16 text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        요청하신 페이지가 존재하지 않거나, 이동되었거나, 접근 권한이 없습니다.
        주소가 정확한지 확인하시거나 아래 버튼을 눌러 다른 페이지로 이동하세요.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild>
          <Link href="/">홈으로 이동</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          이전 페이지로
        </Button>
      </div>
      
      <div className="mt-12 space-y-4">
        <h2 className="text-lg font-medium">다음 페이지를 찾고 계신가요?</h2>
        <div className="flex flex-col space-y-2">
          <Link href="/courses" className="text-primary hover:underline">강좌 둘러보기</Link>
          <Link href="/trainers" className="text-primary hover:underline">훈련사 찾기</Link>
          <Link href="/institutes" className="text-primary hover:underline">교육기관 찾기</Link>
          <Link href="/help/faq" className="text-primary hover:underline">자주 묻는 질문</Link>
        </div>
      </div>
    </div>
  );
}