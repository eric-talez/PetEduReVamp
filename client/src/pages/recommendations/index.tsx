
import { Card } from "@/components/ui/Card";

export default function RecommendationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">맞춤 추천</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">추천 훈련 코스</h3>
          <p className="text-sm text-gray-600">
            반려견의 성향과 현재 교육 수준에 맞는 맞춤형 훈련 코스입니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
