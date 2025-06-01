import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, CheckCircle, AlertCircle } from "lucide-react";

export default function SubscriptionsPage() {
  const subscription = {
    plan: "프리미엄",
    status: "활성",
    nextBilling: "2025-07-01",
    amount: "29,900원",
    features: [
      "무제한 훈련 세션",
      "1:1 맞춤 상담",
      "AI 분석 리포트",
      "24시간 고객 지원"
    ]
  };

  const billingHistory = [
    {
      id: 1,
      date: "2025-06-01",
      amount: "29,900원",
      status: "결제 완료",
      method: "카드"
    },
    {
      id: 2,
      date: "2025-05-01", 
      amount: "29,900원",
      status: "결제 완료",
      method: "카드"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">구독 관리</h1>
        <p className="text-gray-600">현재 구독 플랜과 결제 내역을 관리하세요.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">현재 구독 플랜</CardTitle>
                  <CardDescription className="mt-1">
                    {subscription.plan} 플랜을 이용 중입니다
                  </CardDescription>
                </div>
                <Badge variant={subscription.status === "활성" ? "default" : "secondary"}>
                  {subscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">월 요금</span>
                  <span className="text-xl font-bold">{subscription.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">다음 결제일</span>
                  <span className="font-medium">{subscription.nextBilling}</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">포함된 기능</h4>
                  <ul className="space-y-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline">플랜 변경</Button>
                  <Button variant="outline">구독 취소</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
              <CardDescription>최근 결제 기록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="font-medium">{bill.amount}</p>
                        <p className="text-sm text-gray-600">{bill.date} • {bill.method}</p>
                      </div>
                    </div>
                    <Badge variant={bill.status === "결제 완료" ? "default" : "secondary"}>
                      {bill.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    다음 결제일이 30일 남았습니다.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    이번 달 훈련 세션을 모두 완료했습니다!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>결제 수단</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">**** **** **** 1234</p>
                    <p className="text-sm text-gray-600">만료: 12/27</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  변경
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}