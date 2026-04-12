import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Plus, Trash2, Copy, Edit2, Check, X } from "lucide-react";

export default function QrCodeManagement() {
  const { toast } = useToast();
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/institute/qr-codes"],
  });

  const createMutation = useMutation({
    mutationFn: async (label: string) => {
      return apiRequest("POST", "/api/institute/qr-codes", { label });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institute/qr-codes"] });
      setNewLabel("");
      toast({ title: "QR 코드 생성 완료", description: "새 QR 코드가 생성되었습니다." });
    },
    onError: () => {
      toast({ title: "오류", description: "QR 코드 생성에 실패했습니다.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/institute/qr-codes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institute/qr-codes"] });
      setEditingId(null);
      toast({ title: "수정 완료" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/institute/qr-codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institute/qr-codes"] });
      toast({ title: "삭제 완료", description: "QR 코드가 삭제되었습니다." });
    },
  });

  const qrCodes = (data as any)?.qrCodes || [];

  const copyCheckinUrl = (token: string) => {
    const url = `${window.location.origin}/checkin/${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "복사 완료", description: "체크인 URL이 클립보드에 복사되었습니다." });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">QR 코드 관리</h1>
          <p className="text-gray-500 text-sm">기관 체크인용 QR 코드를 생성하고 관리합니다</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">새 QR 코드 생성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="label" className="text-sm">QR 코드 이름</Label>
              <Input
                id="label"
                placeholder="예: 1층 프론트 데스크, 2층 훈련실"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <Button
              className="self-end"
              onClick={() => createMutation.mutate(newLabel || '기본 QR 코드')}
              disabled={createMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              생성
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : qrCodes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <QrCode className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">아직 생성된 QR 코드가 없습니다</p>
            <p className="text-gray-400 text-sm mt-1">위에서 새 QR 코드를 생성해 주세요</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {qrCodes.map((qr: any) => (
            <Card key={qr.id} className={!qr.isActive ? "opacity-60" : ""}>
              <CardContent className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center gap-4 flex-1">
                  <QrCode className="w-10 h-10 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingId === qr.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="h-8"
                        />
                        <Button size="sm" variant="ghost" onClick={() => updateMutation.mutate({ id: qr.id, data: { label: editLabel } })}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium">{qr.label}</p>
                        <p className="text-xs text-gray-400 truncate">{window.location.origin}/checkin/{qr.token}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={qr.isActive ? "default" : "secondary"}>
                      {qr.isActive ? "활성" : "비활성"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={qr.isActive}
                    onCheckedChange={(checked) => updateMutation.mutate({ id: qr.id, data: { isActive: checked } })}
                  />
                  <Button size="sm" variant="ghost" onClick={() => copyCheckinUrl(qr.token)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditingId(qr.id); setEditLabel(qr.label || ""); }}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => {
                    if (confirm("이 QR 코드를 삭제하시겠습니까?")) deleteMutation.mutate(qr.id);
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
