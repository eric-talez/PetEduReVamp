import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogOut, CheckCircle, Mail, XCircle } from "lucide-react";

export default function PendingApprovalPage() {
  const { user, logout } = useAuth();
  const isRejected = user?.approvalStatus === 'rejected';

  if (isRejected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-lg text-center">
          <CardHeader className="pb-2">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">가입이 거절되었습니다</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              관리자가 회원가입을 승인하지 않았습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 rounded-lg p-4 text-left">
              <p className="text-red-700 text-sm">
                회원가입 신청이 거절되었습니다. 
                추가 문의사항은 관리자에게 연락해주세요.
              </p>
            </div>
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => logout()}
                className="w-full"
                data-testid="button-logout-rejected"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg text-center">
        <CardHeader className="pb-2">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">승인 대기 중</CardTitle>
          <CardDescription className="text-gray-600 text-base">
            회원가입이 완료되었습니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 rounded-lg p-4 text-left">
            <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user?.email || "사용자"}님
            </h3>
            <p className="text-amber-700 text-sm">
              관리자가 회원가입 신청을 검토 중입니다. 
              승인이 완료되면 모든 기능을 이용하실 수 있습니다.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">회원가입 신청 완료</p>
                <p className="text-sm text-gray-500">프로필 정보가 저장되었습니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left">
              <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">관리자 승인 대기</p>
                <p className="text-sm text-gray-500">보통 1-2 영업일 내 처리됩니다</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-4">
              문의사항이 있으시면 관리자에게 연락해주세요
            </p>
            <Button 
              variant="outline" 
              onClick={() => logout()}
              className="w-full"
              data-testid="button-logout-pending"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
