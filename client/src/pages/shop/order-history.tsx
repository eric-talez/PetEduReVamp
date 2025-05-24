import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Package, Truck, CheckCircle, Search, FileText, ArrowLeft, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 주문 상태 타입
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// 주문 아이템 타입
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options?: { [key: string]: string };
}

// 주문 데이터 타입
interface Order {
  id: string;
  date: Date;
  totalAmount: number;
  status: OrderStatus;
  trackingNumber?: string;
  items: OrderItem[];
}

// 샘플 주문 데이터
const sampleOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    date: new Date(2024, 4, 20), // 5월 20일
    totalAmount: 45000,
    status: 'delivered',
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: 'ITEM001',
        name: '프리미엄 강아지 사료 2kg',
        price: 25000,
        quantity: 1,
        image: 'https://placedog.net/100/100?random=1',
        options: {
          '맛': '닭고기',
          '특징': '알러지 방지'
        }
      },
      {
        id: 'ITEM002',
        name: '반려동물 장난감 세트',
        price: 20000,
        quantity: 1,
        image: 'https://placedog.net/100/100?random=2'
      }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: new Date(2024, 4, 15), // 5월 15일
    totalAmount: 36000,
    status: 'shipped',
    trackingNumber: 'TRK987654321',
    items: [
      {
        id: 'ITEM003',
        name: '강아지 영양제 100정',
        price: 36000,
        quantity: 1,
        image: 'https://placedog.net/100/100?random=3',
        options: {
          '성분': '종합 비타민',
          '복용방법': '1일 1정'
        }
      }
    ]
  },
  {
    id: 'ORD-2024-003',
    date: new Date(2024, 4, 10), // 5월 10일
    totalAmount: 58000,
    status: 'processing',
    items: [
      {
        id: 'ITEM004',
        name: '반려동물 침대 (중형)',
        price: 58000,
        quantity: 1,
        image: 'https://placedog.net/100/100?random=4',
        options: {
          '크기': '중형',
          '색상': '베이지'
        }
      }
    ]
  }
];

// 주문 상태에 따른 UI 정보
const statusInfo = {
  pending: {
    label: '결제 대기',
    color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    icon: <ShoppingBag className="h-4 w-4" />
  },
  processing: {
    label: '주문 처리 중',
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    icon: <Package className="h-4 w-4" />
  },
  shipped: {
    label: '배송 중',
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    icon: <Truck className="h-4 w-4" />
  },
  delivered: {
    label: '배송 완료',
    color: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    icon: <CheckCircle className="h-4 w-4" />
  },
  cancelled: {
    label: '주문 취소',
    color: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    icon: <FileText className="h-4 w-4" />
  }
};

// 날짜 포맷 함수
function formatDate(date: Date): string {
  return format(date, 'yyyy년 MM월 dd일', { locale: ko });
}

// 가격 포맷 함수
function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // 주문 필터링
  const filteredOrders = orders.filter(order => {
    // 상태 필터
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }
    
    // 검색어 필터
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // 배송 추적 함수
  const trackOrder = (trackingNumber: string) => {
    toast({
      title: "배송 추적",
      description: `택배사 웹사이트에서 ${trackingNumber} 번호로 배송 상태를 확인합니다.`,
    });
    // 실제로는 택배사 추적 페이지로 이동
    window.open(`https://tracker.delivery/#/${trackingNumber}`, '_blank');
  };

  // 주문 취소 함수
  const cancelOrder = (orderId: string) => {
    toast({
      title: "주문 취소 요청",
      description: "주문 취소 요청이 접수되었습니다. 관리자 확인 후 처리됩니다.",
    });
    
    // 주문 상태 업데이트 (실제로는 API 호출)
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as OrderStatus } 
          : order
      )
    );
  };

  // 기간별 탭 변경 시 필터링
  useEffect(() => {
    if (activeTab === 'all') {
      setOrders(sampleOrders);
      return;
    }
    
    const now = new Date();
    const filterOrders = () => {
      switch (activeTab) {
        case '1month':
          // 1개월 이내 주문
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return sampleOrders.filter(order => order.date >= oneMonthAgo);
        case '3months':
          // 3개월 이내 주문
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return sampleOrders.filter(order => order.date >= threeMonthsAgo);
        case '6months':
          // 6개월 이내 주문
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return sampleOrders.filter(order => order.date >= sixMonthsAgo);
        default:
          return sampleOrders;
      }
    };
    
    setOrders(filterOrders());
  }, [activeTab]);

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-3"
            onClick={() => setLocation('/shop')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            쇼핑몰로 돌아가기
          </Button>
          <h1 className="text-2xl font-bold">주문 내역</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.print()}
            className="hidden md:flex"
          >
            <FileText className="h-4 w-4 mr-2" />
            주문 내역 인쇄
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-4 bg-background">
            <TabsTrigger value="all">전체 기간</TabsTrigger>
            <TabsTrigger value="1month">1개월</TabsTrigger>
            <TabsTrigger value="3months">3개월</TabsTrigger>
            <TabsTrigger value="6months">6개월</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Input
              placeholder="주문 번호 또는 상품명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48 bg-background">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="pending">결제 대기</SelectItem>
              <SelectItem value="processing">주문 처리 중</SelectItem>
              <SelectItem value="shipped">배송 중</SelectItem>
              <SelectItem value="delivered">배송 완료</SelectItem>
              <SelectItem value="cancelled">주문 취소</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <Card className="text-center p-10">
          <div className="flex flex-col items-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <p className="text-xl font-medium mb-2">주문 내역이 없습니다</p>
            <p className="text-muted-foreground mb-6">해당 기간에 주문한 내역이 없거나 검색 조건에 맞는 주문이 없습니다.</p>
            <Button onClick={() => setLocation('/shop')}>
              쇼핑하러 가기
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <span className="text-sm text-muted-foreground ml-4">
                        <Calendar className="h-3.5 w-3.5 inline-block mr-1" />
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <CardDescription>
                      {order.items.length}개 상품 · {formatPrice(order.totalAmount)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full flex items-center ${statusInfo[order.status].color}`}>
                      {statusInfo[order.status].icon}
                      <span className="ml-1.5 text-sm font-medium">{statusInfo[order.status].label}</span>
                    </div>
                    {order.status === 'shipped' && order.trackingNumber && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => trackOrder(order.trackingNumber!)}
                      >
                        <Truck className="h-3.5 w-3.5 mr-1.5" />
                        배송 조회
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelOrder(order.id)}
                      >
                        주문 취소
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex p-4 gap-4 hover:bg-muted/40 transition-colors">
                      <div className="w-20 h-20 rounded-md overflow-hidden shrink-0 border border-border">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-base mb-2">{item.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end">
                          <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
                            <div className="flex items-center text-foreground">
                              <span className="font-medium mr-1">{formatPrice(item.price)}</span> 
                              <span className="mx-1">×</span> 
                              <span>{item.quantity}개</span>
                            </div>
                            {item.options && (
                              <div className="mt-2 text-xs flex flex-wrap gap-2">
                                {Object.entries(item.options).map(([key, value]) => (
                                  <span key={key} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="font-medium text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between bg-muted/20 p-4 gap-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">주문 금액:</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(`/shop/order-invoice/${order.id}`, '_blank')}>
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    영수증
                  </Button>
                  <Button variant="default" size="sm" onClick={() => setLocation(`/shop/order-detail/${order.id}`)}>
                    주문 상세 보기
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}