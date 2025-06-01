import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Calendar, MessageSquare, FileText, User } from "lucide-react";

export default function NotebookPage() {
  const notebooks = [
    {
      id: 1,
      petName: "멍멍이",
      trainerName: "김훈련사",
      date: "2025-06-01",
      title: "기초 앉기 훈련",
      content: "오늘은 기초 앉기 훈련을 진행했습니다. 멍멍이가 집중력이 좋아서 빠르게 학습하고 있습니다.",
      status: "완료",
      type: "훈련 일지"
    },
    {
      id: 2,
      petName: "뽀삐",
      trainerName: "박훈련사",
      date: "2025-05-30",
      title: "사회화 훈련 평가",
      content: "다른 강아지들과의 상호작용을 관찰했습니다. 초기 긴장감은 있었지만 점차 적응하는 모습을 보였습니다.",
      status: "검토중",
      type: "평가 보고서"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">알림장</h1>
        <p className="text-gray-600">훈련사가 작성한 반려견의 훈련 일지와 피드백을 확인하세요.</p>
      </div>

      <div className="space-y-6">
        {notebooks.map((notebook) => (
          <Card key={notebook.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{notebook.title}</CardTitle>
                    <Badge variant={notebook.status === "완료" ? "default" : "secondary"}>
                      {notebook.status}
                    </Badge>
                    <Badge variant="outline">{notebook.type}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {notebook.petName}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {notebook.trainerName}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {notebook.date}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {notebook.content}
                </p>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    전체 보기
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    댓글 작성
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notebooks.length === 0 && (
        <div className="text-center py-12">
          <Edit className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">작성된 알림장이 없습니다</h3>
          <p className="text-gray-600 mb-4">훈련사가 알림장을 작성하면 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}