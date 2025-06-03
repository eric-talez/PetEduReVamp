import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';

export function TestClickChart() {
  const [, setLocation] = useLocation();
  const [clickCount, setClickCount] = useState(0);

  const handleClick = (path: string, title: string) => {
    console.log('TestClickChart - 클릭됨:', title, path);
    setClickCount(prev => prev + 1);
    alert(`클릭됨: ${title} (총 ${clickCount + 1}번째)`);
    setLocation(path);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>클릭 테스트 차트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <button
            className="w-full p-4 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg text-left"
            onClick={() => handleClick('/course/1', '강좌 테스트')}
          >
            <div className="font-semibold">강좌 테스트 아이템</div>
            <div className="text-sm text-gray-600">클릭해보세요</div>
          </button>
          
          <div
            className="w-full p-4 bg-green-100 hover:bg-green-200 border border-green-300 rounded-lg cursor-pointer"
            onClick={() => handleClick('/trainer/1', '훈련사 테스트')}
          >
            <div className="font-semibold">훈련사 테스트 아이템</div>
            <div className="text-sm text-gray-600">클릭해보세요</div>
          </div>
          
          <div
            className="w-full p-4 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 rounded-lg cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClick('/events/1', '이벤트 테스트');
            }}
          >
            <div className="font-semibold">이벤트 테스트 아이템</div>
            <div className="text-sm text-gray-600">클릭해보세요</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-gray-500">
          총 클릭 횟수: {clickCount}
        </div>
      </CardContent>
    </Card>
  );
}