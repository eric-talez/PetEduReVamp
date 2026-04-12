import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PawPrint, Calendar, AlertTriangle, Target, Clock, Package } from "lucide-react";
import { useLocation } from "wouter";

export default function CustomerHistory() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ["/api/institute/checkins/history", ownerId],
    queryFn: async () => {
      const res = await fetch(`/api/institute/checkins/history/${ownerId}`);
      if (!res.ok) throw new Error("히스토리 조회 실패");
      return res.json();
    },
    enabled: !!ownerId,
  });

  const temperamentBadge = (level: string | null) => {
    const map: Record<string, { label: string; color: string }> = {
      A: { label: "A 사회성 양호", color: "bg-green-100 text-green-700" },
      B: { label: "B 흥분 조절", color: "bg-yellow-100 text-yellow-700" },
      C: { label: "C 짖음/경계", color: "bg-orange-100 text-orange-700" },
      D: { label: "D 공격성", color: "bg-red-100 text-red-700" },
      E: { label: "E 분리불안", color: "bg-purple-100 text-purple-700" },
    };
    if (!level || !map[level]) return null;
    const info = map[level];
    return <span className={`text-xs px-2 py-0.5 rounded-full ${info.color}`}>{info.label}</span>;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px] text-gray-500">로딩 중...</div>;
  }

  const owner = (data as any)?.owner;
  const pets = (data as any)?.pets || [];
  const history = (data as any)?.history || [];
  const totalVisits = (data as any)?.totalVisits || 0;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/institute/checkin-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          돌아가기
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{owner?.name || '고객'}</h1>
              {owner?.phone && <p className="text-gray-500 text-sm mt-1">{owner.phone}</p>}
              {owner?.email && <p className="text-gray-400 text-xs">{owner.email}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">총 방문 횟수</p>
              <p className="text-3xl font-bold text-primary">{totalVisits}</p>
            </div>
          </div>

          {pets.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-600 mb-2">보유 반려동물</p>
              <div className="flex flex-wrap gap-2">
                {pets.map((pet: any) => (
                  <div key={pet.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <PawPrint className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{pet.name}</span>
                    {pet.breed && <span className="text-xs text-gray-400">({pet.breed})</span>}
                    {temperamentBadge(pet.temperamentLevel)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            방문 기록 ({history.length}건)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">방문 기록이 없습니다</div>
          ) : (
            <div className="space-y-4">
              {history.map((record: any, idx: number) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {new Date(record.checkinAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(record.checkinAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <Badge variant="outline" className="text-xs">#{history.length - idx}회</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {record.hasPackage && (
                        <Badge variant="outline" className="text-xs border-green-400 text-green-600">
                          <Package className="w-3 h-3 mr-1" />
                          정기권
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {record.petName && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <PawPrint className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{record.petName}</span>
                      </div>
                    )}
                    {record.todayConcern && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{record.todayConcern}</span>
                      </div>
                    )}
                    {record.recentProblemBehavior && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{record.recentProblemBehavior}</span>
                      </div>
                    )}
                    {record.todayGoal && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{record.todayGoal}</span>
                      </div>
                    )}
                    {record.packageNote && (
                      <div className="text-xs text-gray-400 mt-1">패키지 메모: {record.packageNote}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
