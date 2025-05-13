import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MenuManagement() {
  console.log('[DEBUG] 간단한 MenuManagement 컴포넌트 렌더링 시작');

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>메뉴 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <p>메뉴 관리 페이지입니다. 이곳에서 메뉴 설정을 관리할 수 있습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}