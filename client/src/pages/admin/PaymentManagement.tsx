
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  Download, 
  Eye, 
  Check, 
  X, 
  Plus,
  Calculator,
  AlertCircle,
  RefreshCw,
  Filter,
  Search,
  Settings,
  TestTube,
  Phone,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PaymentProvider {
  id: string;
  name: string;
  type: 'card' | 'phone' | 'transfer';
  status: 'active' | 'inactive' | 'testing';
  apiKey?: string;
  secretKey?: string;
  testMode: boolean;
}

interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'cancelled';
  paymentMethod: string;
  provider: string;
  userRole: 'pet_owner' | 'trainer' | 'institute_admin';
  createdAt: string;
  paymentKey?: string;
}

interface WebhookLog {
  id: string;
  provider: string;
  eventType: string;
  data: any;
  timestamp: string;
  status: 'received' | 'processed' | 'failed';
}

export default function PaymentManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // 결제 제공업체 설정
  const [tossSettings, setTossSettings] = useState({
    clientKey: '',
    secretKey: '',
    testMode: true
  });

  const [danalSettings, setDanalSettings] = useState({
    cid: '',
    url: 'https://web.nicepay.co.kr/v3/smart.jsp',
    testMode: true
  });

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setIsLoading(true);
    try {
      // 결제 제공업체 설정 로드
      const providersResponse = await fetch('/api/admin/payment/providers');
      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        setProviders(providersData);
      }

      // 결제 내역 로드
      const transactionsResponse = await fetch('/api/admin/payment/transactions');
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
      }

      // 웹훅 로그 로드
      const webhookResponse = await fetch('/api/admin/payment/webhook/logs');
      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        setWebhookLogs(webhookData);
      }
    } catch (error) {
      console.error('결제 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPayment = async (provider: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/payment/test/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000,
          orderId: `TEST_${Date.now()}`,
          orderName: '관리자 테스트 결제'
        }),
      });

      const result = await response.json();
      setTestResult(result);
      
      if (result.success) {
        loadPaymentData(); // 데이터 새로고침
      }
    } catch (error) {
      console.error('테스트 결제 실패:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPayment = async (paymentKey: string) => {
    if (!confirm('정말로 이 결제를 취소하시겠습니까?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/payment/cancel/${paymentKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelReason: '관리자 취소 처리'
        }),
      });

      if (response.ok) {
        loadPaymentData(); // 데이터 새로고침
        alert('결제가 취소되었습니다.');
      } else {
        alert('결제 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('결제 취소 실패:', error);
      alert('결제 취소 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProviderSettings = async (provider: string) => {
    setIsLoading(true);
    try {
      const settings = provider === 'toss' ? tossSettings : danalSettings;
      
      const response = await fetch(`/api/admin/payment/providers/${provider}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert(`${provider.toUpperCase()} 설정이 저장되었습니다.`);
        loadPaymentData();
      } else {
        alert('설정 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'success',
      failed: 'destructive',
      pending: 'warning',
      cancelled: 'secondary',
      active: 'success',
      inactive: 'destructive',
      testing: 'warning'
    };
    
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            관리자 권한이 필요합니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">결제연동 관리</h1>
          <p className="text-muted-foreground">
            결제 시스템 설정, 거래 내역 관리, 테스트 및 모니터링
          </p>
        </div>
        <Button onClick={loadPaymentData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="toss">토스페이먼츠</TabsTrigger>
          <TabsTrigger value="danal">다날 (휴대폰)</TabsTrigger>
          <TabsTrigger value="transactions">거래 내역</TabsTrigger>
          <TabsTrigger value="webhooks">웹훅 로그</TabsTrigger>
          <TabsTrigger value="test">테스트</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 거래액</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatAmount(transactions.reduce((sum, t) => sum + t.amount, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  전체 거래 {transactions.length}건
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">성공률</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transactions.length > 0 
                    ? ((transactions.filter(t => t.status === 'success').length / transactions.length) * 100).toFixed(1)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  성공 {transactions.filter(t => t.status === 'success').length}건 / 전체 {transactions.length}건
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">활성 제공업체</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {providers.filter(p => p.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  총 {providers.length}개 제공업체
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>결제 제공업체 상태</CardTitle>
              <CardDescription>등록된 결제 제공업체들의 현재 상태</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {provider.type === 'phone' ? <Phone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {provider.testMode ? '테스트 모드' : '운영 모드'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(provider.status)}
                      <Button variant="outline" size="sm" onClick={() => setActiveTab(provider.id)}>
                        <Settings className="w-4 h-4 mr-1" />
                        설정
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 토스페이먼츠 설정 탭 */}
        <TabsContent value="toss" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>토스페이먼츠 설정</span>
              </CardTitle>
              <CardDescription>
                토스페이먼츠 API 키 설정 및 테스트 환경 구성
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="toss-client-key">클라이언트 키</Label>
                  <Input
                    id="toss-client-key"
                    value={tossSettings.clientKey}
                    onChange={(e) => setTossSettings({...tossSettings, clientKey: e.target.value})}
                    placeholder="test_ck_..."
                  />
                </div>
                <div>
                  <Label htmlFor="toss-secret-key">시크릿 키</Label>
                  <Input
                    id="toss-secret-key"
                    type="password"
                    value={tossSettings.secretKey}
                    onChange={(e) => setTossSettings({...tossSettings, secretKey: e.target.value})}
                    placeholder="test_sk_..."
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="toss-test-mode"
                  checked={tossSettings.testMode}
                  onChange={(e) => setTossSettings({...tossSettings, testMode: e.target.checked})}
                />
                <Label htmlFor="toss-test-mode">테스트 모드</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => handleSaveProviderSettings('toss')} disabled={isLoading}>
                  <Settings className="w-4 h-4 mr-2" />
                  설정 저장
                </Button>
                <Button variant="outline" onClick={() => handleTestPayment('toss')} disabled={isLoading}>
                  <TestTube className="w-4 h-4 mr-2" />
                  테스트 결제
                </Button>
              </div>

              {testResult && (
                <Alert className={testResult.success ? "border-green-500" : "border-red-500"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {testResult.success ? '테스트 결제가 성공했습니다.' : `테스트 실패: ${testResult.error}`}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 다날 설정 탭 */}
        <TabsContent value="danal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>다날 (휴대폰) 설정</span>
              </CardTitle>
              <CardDescription>
                휴대폰 본인인증 및 결제 설정
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="danal-cid">CID (상점 ID)</Label>
                  <Input
                    id="danal-cid"
                    value={danalSettings.cid}
                    onChange={(e) => setDanalSettings({...danalSettings, cid: e.target.value})}
                    placeholder="상점 ID 입력"
                  />
                </div>
                <div>
                  <Label htmlFor="danal-url">API URL</Label>
                  <Input
                    id="danal-url"
                    value={danalSettings.url}
                    onChange={(e) => setDanalSettings({...danalSettings, url: e.target.value})}
                    placeholder="API 엔드포인트"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="danal-test-mode"
                  checked={danalSettings.testMode}
                  onChange={(e) => setDanalSettings({...danalSettings, testMode: e.target.checked})}
                />
                <Label htmlFor="danal-test-mode">테스트 모드</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => handleSaveProviderSettings('danal')} disabled={isLoading}>
                  <Settings className="w-4 h-4 mr-2" />
                  설정 저장
                </Button>
                <Button variant="outline" onClick={() => handleTestPayment('danal')} disabled={isLoading}>
                  <TestTube className="w-4 h-4 mr-2" />
                  인증 테스트
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 거래 내역 탭 */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>결제 거래 내역</CardTitle>
              <CardDescription>모든 결제 거래의 상세 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문 ID</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>결제 방법</TableHead>
                    <TableHead>사용자 유형</TableHead>
                    <TableHead>결제일</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.orderId}</TableCell>
                      <TableCell>{formatAmount(transaction.amount)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.userRole === 'pet_owner' ? '반려인' : 
                           transaction.userRole === 'trainer' ? '훈련사' : '기관'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.createdAt).toLocaleString('ko-KR')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {transaction.status === 'success' && transaction.paymentKey && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelPayment(transaction.paymentKey!)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 웹훅 로그 탭 */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>웹훅 로그</CardTitle>
              <CardDescription>결제 제공업체로부터 수신된 웹훅 이벤트</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제공업체</TableHead>
                    <TableHead>이벤트 타입</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>수신일시</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.provider}</TableCell>
                      <TableCell>{log.eventType}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString('ko-KR')}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>웹훅 데이터</DialogTitle>
                              <DialogDescription>
                                {log.provider} - {log.eventType}
                              </DialogDescription>
                            </DialogHeader>
                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 테스트 탭 */}
        <TabsContent value="test" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>토스페이먼츠 테스트</CardTitle>
                <CardDescription>카드 결제 테스트</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleTestPayment('toss')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  테스트 결제 (1,000원)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>다날 테스트</CardTitle>
                <CardDescription>휴대폰 인증/결제 테스트</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleTestPayment('danal')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  휴대폰 인증 테스트
                </Button>
              </CardContent>
            </Card>
          </div>

          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle>테스트 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
