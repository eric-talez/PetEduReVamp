import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, CheckCircle, XCircle, Clock, PawPrint, Building,
  Syringe, MapPin, AlertTriangle, User, Loader2
} from "lucide-react";

interface VerifyResponse {
  success: boolean;
  error?: string;
  errorCode?: string;
  session?: {
    id: number;
    expiresAt: string;
    todayConcern: string | null;
    todayGoal: string | null;
    vaccineStatus: Record<number, { valid: boolean; vaccines: any[] }>;
    temperamentLevels: Record<number, string | null>;
    zonePermissions: Record<number, string[]>;
  };
  institute?: { id: number; name: string; address: string | null; phone: string | null };
  member?: { name: string; phone: string | null };
  pets?: Array<{
    id: number; name: string | null; breed: string | null;
    species: string | null; temperamentLevel: string | null;
    profileImage: string | null;
  }>;
}

const TEMPERAMENT_MAP: Record<string, { label: string; color: string; bg: string }> = {
  A: { label: "사회성 양호", color: "text-green-700", bg: "bg-green-100" },
  B: { label: "흥분 조절", color: "text-blue-700", bg: "bg-blue-100" },
  C: { label: "짖음/경계", color: "text-yellow-700", bg: "bg-yellow-100" },
  D: { label: "공격성 주의", color: "text-red-700", bg: "bg-red-100" },
  E: { label: "분리불안", color: "text-purple-700", bg: "bg-purple-100" },
};

export default function VisitVerifyPage() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const { data, isLoading, error } = useQuery<VerifyResponse>({
    queryKey: ["/api/visit-sessions/verify", token],
    queryFn: async () => {
      const res = await fetch(`/api/visit-sessions/verify/${token}`);
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.error, errorCode: json.errorCode };
      return json;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const confirmMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/visit-sessions/confirm/${token}`),
    onSuccess: () => {
      setConfirmed(true);
      toast({ title: "체크인 완료", description: "방문이 확인되었습니다." });
    },
    onError: () => toast({ title: "오류", description: "체크인 확인에 실패했습니다.", variant: "destructive" }),
  });

  useEffect(() => {
    if (!data?.session?.expiresAt) return;
    const timer = setInterval(() => {
      const diff = new Date(data.session!.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("만료됨");
        clearInterval(timer);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}분 ${secs}초`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data?.session?.expiresAt]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">방문 세션 확인 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.success || data.error) {
    const errorMessages: Record<string, { icon: any; title: string; desc: string }> = {
      INVALID: { icon: XCircle, title: "유효하지 않은 QR", desc: "해당 방문 세션을 찾을 수 없습니다. 올바른 QR 코드인지 확인해 주세요." },
      USED: { icon: CheckCircle, title: "이미 사용된 QR", desc: "이 방문 세션은 이미 체크인에 사용되었습니다. 1회용 QR은 재사용할 수 없습니다." },
      EXPIRED: { icon: Clock, title: "만료된 QR", desc: "이 방문 세션의 유효시간(10분)이 경과했습니다. 새 QR을 발급받아 주세요." },
    };
    const errInfo = errorMessages[data?.errorCode || ''] || { icon: AlertTriangle, title: "오류", desc: data?.error || "알 수 없는 오류" };
    const ErrIcon = errInfo.icon;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <ErrIcon className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">{errInfo.title}</h2>
            <p className="text-muted-foreground">{errInfo.desc}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-xl font-bold mb-2">체크인 완료!</h2>
            <p className="text-muted-foreground">방문이 성공적으로 확인되었습니다.</p>
            {data.institute && (
              <p className="mt-2 text-sm font-medium">{data.institute.name}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const session = data.session!;
  const vaccineStatus = session.vaccineStatus || {};
  const temperamentLevels = session.temperamentLevels || {};
  const zonePermissions = session.zonePermissions || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="max-w-md mx-auto space-y-4 pt-4">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 mx-auto mb-2 text-primary" />
          <h1 className="text-xl font-bold">반려견 방문 신뢰 인증</h1>
          <Badge className="mt-2 bg-green-100 text-green-800">
            <Clock className="w-3 h-3 mr-1" />
            남은 시간: {timeLeft}
          </Badge>
        </div>

        {data.institute && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold text-lg">{data.institute.name}</p>
                  {data.institute.address && (
                    <p className="text-sm text-muted-foreground">{data.institute.address}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {data.member && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                보호자 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{data.member.name}</p>
              {data.member.phone && <p className="text-sm text-muted-foreground">{data.member.phone}</p>}
            </CardContent>
          </Card>
        )}

        {data.pets && data.pets.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PawPrint className="w-4 h-4" />
                반려동물 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.pets.map(pet => {
                const petVaccine = vaccineStatus[pet.id];
                const petTemperament = temperamentLevels[pet.id] as string;
                const petZones = zonePermissions[pet.id] || [];
                const tempInfo = petTemperament ? TEMPERAMENT_MAP[petTemperament] : null;

                return (
                  <div key={pet.id} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PawPrint className="w-5 h-5 text-primary" />
                        <span className="font-bold text-lg">{pet.name || '이름 미등록'}</span>
                      </div>
                      {tempInfo && (
                        <Badge className={`${tempInfo.bg} ${tempInfo.color}`}>
                          {petTemperament} ({tempInfo.label})
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {pet.breed || ''} {pet.species ? `· ${pet.species}` : ''}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Syringe className="w-4 h-4" />
                        <span className="text-sm font-medium">접종 상태:</span>
                        {petVaccine?.valid ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            접종 완료
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            미접종/만료
                          </Badge>
                        )}
                      </div>

                      {petZones.length > 0 && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium">입장 가능 구역:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {petZones.map(zone => (
                                <Badge key={zone} variant="outline" className="text-xs">
                                  {zone}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {(session.todayConcern || session.todayGoal) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">오늘의 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {session.todayConcern && (
                <div>
                  <span className="font-medium text-muted-foreground">고민:</span>
                  <p>{session.todayConcern}</p>
                </div>
              )}
              {session.todayGoal && (
                <div>
                  <span className="font-medium text-muted-foreground">목표:</span>
                  <p>{session.todayGoal}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full h-14 text-lg gap-2"
          onClick={() => confirmMutation.mutate()}
          disabled={confirmMutation.isPending}
        >
          {confirmMutation.isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> 확인 중...</>
          ) : (
            <><CheckCircle className="w-5 h-5" /> 체크인 확인</>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground pb-4">
          이 QR은 1회용이며 확인 즉시 폐기됩니다.
        </p>
      </div>
    </div>
  );
}
