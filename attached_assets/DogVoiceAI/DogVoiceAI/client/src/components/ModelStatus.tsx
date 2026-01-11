import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { MLModel } from "@shared/schema";

export default function ModelStatus() {
  const { data: currentModel } = useQuery<MLModel>({
    queryKey: ["/api/ml-models/current"],
  });

  const { data: models } = useQuery<MLModel[]>({
    queryKey: ["/api/ml-models"],
  });

  if (!currentModel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🎯 현재 모델 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            모델 정보를 불러오는 중...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🎯</span>
          <span>현재 모델 상태</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="text-2xl font-bold text-green-700">{currentModel.version}</div>
            <div className="text-sm text-gray-600">모델 버전</div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="text-2xl font-bold text-blue-700">{currentModel.accuracy}%</div>
            <div className="text-sm text-gray-600">전체 정확도</div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="text-lg font-bold text-yellow-700">
              {currentModel.status === 'production' ? '운영 중' : '개발 중'}
            </div>
            <div className="text-sm text-gray-600">학습 상태</div>
          </div>
        </div>

        {/* Training Progress for non-production models */}
        {currentModel.status !== 'production' && currentModel.trainingProgress !== null && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">학습 진행률</span>
              <span className="text-sm font-bold text-blue-600">{currentModel.trainingProgress}%</span>
            </div>
            <Progress value={currentModel.trainingProgress} className="w-full" />
            <div className="text-xs text-gray-500 mt-2">
              예상 완료: {Math.ceil((100 - currentModel.trainingProgress) / 10)} 시간 후
            </div>
          </div>
        )}

        {/* Model Version Comparison */}
        {models && models.length > 1 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">모델 버전 비교</h4>
            <div className="space-y-2">
              {models.slice(0, 3).map((model) => (
                <div key={model.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{model.version}</span>
                    {model.isActive && (
                      <Badge variant="secondary" className="text-xs">현재</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{model.accuracy}%</span>
                    <Badge 
                      variant={model.status === 'production' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {model.status === 'production' ? '운영' : 
                       model.status === 'testing' ? '테스트' : '개발'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}