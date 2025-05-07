
import React from 'react';
import { Card } from '@/components/ui/card';

export default function AIAnalysisPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 분석</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">행동 분석</h2>
          {/* AI 행동 분석 컴포넌트 */}
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">건강 상태 분석</h2>
          {/* AI 건강 분석 컴포넌트 */}
        </Card>
      </div>
    </div>
  );
}
