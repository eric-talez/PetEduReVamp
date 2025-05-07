
import React from 'react';
import { Card } from '@/components/ui/card';

export default function HealthRecordPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">반려견 건강 기록</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">건강 기록</h2>
          {/* 건강 기록 컴포넌트 */}
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">예방접종 기록</h2>
          {/* 예방접종 기록 컴포넌트 */}
        </Card>
      </div>
    </div>
  );
}
