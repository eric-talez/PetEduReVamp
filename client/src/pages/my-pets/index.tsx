import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Calendar, FileText } from "lucide-react";

export default function MyPetsPage() {
  const pets = [
    {
      id: 1,
      name: "멍멍이",
      breed: "골든 리트리버",
      age: "2세 5개월",
      weight: "28kg",
      trainerId: "김훈련사",
      status: "훈련중",
      lastSession: "2025-05-30",
      nextSession: "2025-06-02",
      photo: null
    },
    {
      id: 2,
      name: "뽀삐",
      breed: "말티즈",
      age: "1세 3개월",
      weight: "3.2kg",
      trainerId: "박훈련사",
      status: "평가 대기",
      lastSession: null,
      nextSession: "2025-06-03",
      photo: null
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">내 반려견</h1>
        <p className="text-gray-600">반려견 정보와 훈련 현황을 관리하세요.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <Card key={pet.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{pet.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {pet.breed} • {pet.age}
                  </CardDescription>
                </div>
                <Badge variant={pet.status === "훈련중" ? "default" : "secondary"}>
                  {pet.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gray-100 rounded-full">
                  <PawPrint className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">체중</span>
                    <p className="font-medium">{pet.weight}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">담당 훈련사</span>
                    <p className="font-medium">{pet.trainerId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {pet.lastSession && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      마지막 훈련: {pet.lastSession}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    다음 훈련: {pet.nextSession}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    케어 일지
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    상세 정보
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12">
          <PawPrint className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 반려견이 없습니다</h3>
          <p className="text-gray-600 mb-4">새로운 반려견을 등록해보세요.</p>
          <Button>반려견 등록</Button>
        </div>
      )}
    </div>
  );
}