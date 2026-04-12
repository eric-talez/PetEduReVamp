import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, TrendingUp, UserCheck, PawPrint, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import type { CheckinRecord } from "@shared/schema";

interface PetInfo {
  name: string | null;
  breed: string | null;
  species: string | null;
  temperamentLevel: string | null;
}

interface OwnerInfo {
  name: string | null;
  phone: string | null;
}

interface EnrichedCheckin extends CheckinRecord {
  petInfo: PetInfo | null;
  ownerInfo: OwnerInfo | null;
}

interface CheckinListResponse {
  success: boolean;
  checkins: EnrichedCheckin[];
}

interface StatsResponse {
  success: boolean;
  stats: {
    todayCount: number;
    weekCount: number;
    monthCount: number;
    uniqueVisitors: number;
  };
}

export default function CheckinDashboard() {
  const [, navigate] = useLocation();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const { data: statsData, isLoading: statsLoading } = useQuery<StatsResponse>({
    queryKey: ["/api/institute/checkins/stats"],
  });

  const { data: checkinsData, isLoading: checkinsLoading } = useQuery<CheckinListResponse>({
    queryKey: ["/api/institute/checkins", selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/institute/checkins?date=${selectedDate}`);
      if (!res.ok) throw new Error("체크인 조회 실패");
      return res.json();
    },
  });

  const stats = statsData?.stats ?? { todayCount: 0, weekCount: 0, monthCount: 0, uniqueVisitors: 0 };
  const checkins = checkinsData?.checkins ?? [];

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

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">체크인 대시보드</h1>
          <p className="text-sm text-gray-500">방문 고객 현황을 실시간으로 확인합니다</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/institute/qr-codes")}>
          QR 코드 관리
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">오늘</p>
              <p className="text-2xl font-bold">{stats.todayCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">주간</p>
              <p className="text-2xl font-bold">{stats.weekCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">월간</p>
              <p className="text-2xl font-bold">{stats.monthCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">누적 방문자</p>
              <p className="text-2xl font-bold">{stats.uniqueVisitors}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">방문 기록</CardTitle>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </CardHeader>
        <CardContent>
          {checkinsLoading || statsLoading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : checkins.length === 0 ? (
            <div className="text-center py-12">
              <PawPrint className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">이 날짜의 체크인 기록이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {checkins.map((checkin) => (
                <div
                  key={checkin.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (checkin.ownerId) navigate(`/institute/customer-history/${checkin.ownerId}`);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <PawPrint className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{checkin.ownerInfo?.name || checkin.ownerName || '비회원'}</span>
                          {checkin.isNewVisitor && (
                            <Badge variant="outline" className="text-xs border-blue-400 text-blue-600">신규</Badge>
                          )}
                          {checkin.hasPackage && (
                            <Badge variant="outline" className="text-xs border-green-400 text-green-600">정기권</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {checkin.petInfo ? (
                            <span className="text-sm text-gray-500">
                              {checkin.petInfo.name} ({checkin.petInfo.breed || '반려동물'})
                            </span>
                          ) : checkin.petName ? (
                            <span className="text-sm text-gray-500">{checkin.petName}</span>
                          ) : null}
                          {checkin.petInfo?.temperamentLevel && temperamentBadge(checkin.petInfo.temperamentLevel)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {new Date(checkin.checkinAt!).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                      {checkin.ownerId && <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {(checkin.todayConcern || checkin.recentProblemBehavior) && (
                    <div className="mt-3 pl-13 space-y-1">
                      {checkin.todayConcern && (
                        <div className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{checkin.todayConcern}</span>
                        </div>
                      )}
                      {checkin.todayGoal && (
                        <div className="text-sm text-gray-500 ml-6">
                          목표: {checkin.todayGoal}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
