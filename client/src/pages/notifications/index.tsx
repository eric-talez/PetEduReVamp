
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">알림장</h1>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">오늘의 훈련 피드백</h3>
              <p className="text-sm text-gray-600 mt-1">
                반려견의 오늘 훈련 진행상황과 피드백을 확인하세요.
              </p>
            </div>
            <Badge>새로운 알림</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
