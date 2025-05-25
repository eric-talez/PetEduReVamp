import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AccessibilityChecker } from "@/components/ui/AccessibilityChecker";
import { 
  Bell, 
  Menu, 
  Search,
  MessageSquare,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Package,
  CheckCircle,
  ArrowRight,
  MoreHorizontal,
  X,
  Calendar,
  ShoppingBag,
  CreditCard,
  DollarSign,
  ExternalLink
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useClickAway } from "@/hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 메시지 인터페이스
interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// 알림 인터페이스
interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
}

// 장바구니 아이템 인터페이스
interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  discountRate?: number;
}

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  // 전역 상태에서 인증 정보 직접 확인
  const globalAuth = (window as any).__peteduAuthState;
  
  // 로컬 상태와 전역 상태 둘 다 확인
  const auth = useAuth();
  // 전역 상태가 있으면 우선 사용
  const authState = globalAuth || auth;
  
  // 상태 추출
  const userName = authState?.userName || auth?.userName;
  const userRole = authState?.userRole || auth?.userRole;
  const isAuthenticated = authState?.isAuthenticated || auth?.isAuthenticated;
  const logout = auth?.logout;
  const [location, setLocation] = useLocation();
  
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 팝업 메뉴 상태
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [messagePopupOpen, setMessagePopupOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  
  // 참조 (외부 클릭 감지용)
  const userMenuRef = useClickAway<HTMLDivElement>(() => setUserMenuOpen(false));
  const messagePopupRef = useClickAway<HTMLDivElement>(() => setMessagePopupOpen(false));
  const notificationPopupRef = useClickAway<HTMLDivElement>(() => setNotificationPopupOpen(false));
  const cartPopupRef = useClickAway<HTMLDivElement>(() => setCartPopupOpen(false));
  
  // 샘플 메시지 데이터
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      sender: "김트레이너",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content: "안녕하세요, 다음 훈련 일정 관련해서 문의드립니다.",
      timestamp: "2024-02-15T14:30:00",
      read: false
    },
    {
      id: "msg2",
      sender: "바우멍 훈련소",
      avatar: "https://images.unsplash.com/photo-1579310962131-aa21f240d986?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content: "3월 특별 그룹 클래스 신청이 시작되었습니다!",
      timestamp: "2024-02-14T09:15:00",
      read: false
    },
    {
      id: "msg3",
      sender: "박훈련사",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content: "몽이의 훈련 영상을 첨부했습니다. 확인 부탁드립니다.",
      timestamp: "2024-02-13T16:45:00",
      read: false
    },
    {
      id: "msg4",
      sender: "퍼피스쿨",
      content: "반려견 사회화 클래스가 내일 진행됩니다. 참석 여부 확인 부탁드립니다.",
      timestamp: "2024-02-12T13:20:00",
      read: true
    },
    {
      id: "msg5",
      sender: "고객센터",
      content: "문의하신 내용에 대한 답변이 등록되었습니다.",
      timestamp: "2024-02-10T11:05:00",
      read: true
    }
  ]);
  
  // 샘플 알림 데이터
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif1",
      title: "수업 일정 알림",
      content: "내일 오후 3시 기초 훈련 클래스가 예정되어 있습니다.",
      timestamp: "2024-02-15T09:00:00",
      type: "info",
      read: false,
      link: "/calendar"
    },
    {
      id: "notif2",
      title: "결제 완료",
      content: "프리미엄 반려견 훈련용 클리커 구매가 완료되었습니다.",
      timestamp: "2024-02-14T15:30:00",
      type: "success",
      read: false,
      link: "/shop/orders"
    },
    {
      id: "notif3",
      title: "수강 신청 마감 임박",
      content: "관심 표시한 '반려견 행동 교정 마스터' 클래스 신청이 내일 마감됩니다.",
      timestamp: "2024-02-13T10:15:00",
      type: "warning",
      read: true,
      link: "/courses"
    },
    {
      id: "notif4",
      title: "이벤트 안내",
      content: "서울 강남 지역 반려동물 페스티벌이 이번 주말에 개최됩니다.",
      timestamp: "2024-02-12T13:45:00",
      type: "info",
      read: true,
      link: "/events"
    }
  ]);
  
  // 샘플 장바구니 데이터
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "프리미엄 반려견 훈련용 클리커",
      image: "https://images.unsplash.com/photo-1598875384021-4a23470c7997?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      price: 15000,
      quantity: 1
    },
    {
      id: 4,
      name: "유기농 강아지 간식 모음",
      image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      price: 28000,
      quantity: 1,
      discountRate: 10
    }
  ]);
  
  // 읽지 않은 메시지 수
  const unreadMessagesCount = messages.filter(msg => !msg.read).length;
  
  // 읽지 않은 알림 수
  const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;
  
  // 장바구니 아이템 총 수량
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // 장바구니 총 금액
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.discountRate 
      ? item.price * (1 - item.discountRate / 100) 
      : item.price;
    return total + (price * item.quantity);
  }, 0);
  
  // 메시지를 읽음으로 표시
  const markMessageAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };
  
  // 알림을 읽음으로 표시
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  // 모든 메시지를 읽음으로 표시
  const markAllMessagesAsRead = () => {
    setMessages(messages.map(msg => ({ ...msg, read: true })));
  };
  
  // 모든 알림을 읽음으로 표시
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  // 장바구니에서 아이템 제거
  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // 장바구니 아이템 수량 변경
  const updateCartItemQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  // 검색 기능
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // API 호출 (실제로는 여기서 API 호출)
    console.log('검색 실행:', searchQuery);
    
    // 샘플 검색 결과 - 실제로는 API 응답으로 대체
    setTimeout(() => {
      const mockResults = [
        { id: 1, type: 'course', title: '기초 복종 훈련', trainer: '김훈련', link: '/courses/1' },
        { id: 2, type: 'trainer', title: '박코치', specialty: '행동 교정 전문', link: '/trainers/2' },
        { id: 3, type: 'institute', title: '바우멍 훈련소', location: '서울 강남', link: '/institutes/3' },
        { id: 4, type: 'course', title: '어질리티 중급 과정', trainer: '이트레이너', link: '/courses/4' }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.trainer && item.trainer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };
  
  // 엔터 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // 디버깅용 로그 (개발 완료 후 제거)
  useEffect(() => {
    console.log('TopBar rendered with auth state:', {
      isAuthenticated,
      userRole,
      userName
    });
    
    // 전역 상태 확인
    if ((window as any).__peteduAuthState) {
      console.log('TopBar global auth state:', (window as any).__peteduAuthState);
    }
  }, [isAuthenticated, userRole, userName]);

  const handleLogout = () => {
    console.log("Logout button clicked - 강제 로그아웃 처리");
    
    // 모든 로컬 스토리지 인증 관련 데이터 제거
    localStorage.removeItem('petedu_auth');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    
    // 전역 상태 초기화
    if (window.__peteduAuthState) {
      window.__peteduAuthState = {
        isAuthenticated: false,
        userRole: null,
        userName: null
      };
    }
    
    // 로그아웃 이벤트 발생시켜 다른 컴포넌트에 알림
    window.dispatchEvent(new CustomEvent('logout'));
    
    // 서버 로그아웃 API 호출 (비동기로 처리)
    fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // 쿠키 포함
    }).catch(err => console.error('서버 로그아웃 API 호출 실패:', err));
    
    // 로그아웃 후 홈페이지로 이동
    window.location.href = "/";
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm z-40 transition-colors sticky top-0 w-full">
      <div className="w-full mx-auto px-0">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          
          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-xl ml-0">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary" 
                placeholder="강의, 훈련사, 기관 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                aria-label="검색"
              />
              {searchQuery.length > 0 && (
                <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                  {isSearching ? (
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" aria-hidden="true"></div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSearchQuery('')}
                      className="h-6 w-6 p-0"
                      aria-label="검색어 지우기"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              )}
              
              {/* 검색 결과 드롭다운 */}
              {searchQuery.length > 0 && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto" role="listbox" aria-label="검색 결과">
                  <div className="p-2">
                    {searchResults.map(result => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.link}
                        className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                        onClick={() => setSearchQuery('')}
                        role="option"
                      >
                        <div className="flex items-center">
                          {result.type === 'course' && <Calendar className="h-4 w-4 mr-2 text-blue-500" aria-hidden="true" />}
                          {result.type === 'trainer' && <MessageSquare className="h-4 w-4 mr-2 text-green-500" aria-hidden="true" />}
                          {result.type === 'institute' && <DollarSign className="h-4 w-4 mr-2 text-amber-500" aria-hidden="true" />}
                          <div>
                            <div className="font-medium">{result.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {result.type === 'course' && result.trainer && `훈련사: ${result.trainer}`}
                              {result.type === 'trainer' && result.specialty && `${result.specialty}`}
                              {result.type === 'institute' && result.location && `${result.location}`}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons - Grouped together for better layout */}
          <div className="flex items-center space-x-2">
            {/* Group message, notification and theme toggle together as requested */}
            <div className="flex items-center space-x-2 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
              {/* Messages Button & Popup */}
              <div className="relative" ref={messagePopupRef}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    if (isAuthenticated) {
                      setMessagePopupOpen(!messagePopupOpen);
                      setNotificationPopupOpen(false);
                      setCartPopupOpen(false);
                    } else {
                      setLocation("/auth");
                    }
                  }}
                  className="relative"
                  aria-label={`메시지 ${unreadMessagesCount > 0 ? `(읽지 않은 메시지 ${unreadMessagesCount}개)` : ''}`}
                >
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  {isAuthenticated && unreadMessagesCount > 0 && (
                    <Badge 
                      variant="danger" 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-4 h-4 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {unreadMessagesCount}
                    </Badge>
                  )}
                </Button>
                
                {/* Messages Popup */}
                {messagePopupOpen && isAuthenticated && (
                  <div 
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                    role="dialog"
                    aria-label="메시지 목록"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold">메시지</h3>
                        {unreadMessagesCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={markAllMessagesAsRead}
                            className="text-xs h-7 px-2"
                            aria-label="모든 메시지 읽음 표시하기"
                          >
                            모두 읽음 표시
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto max-h-80">
                      {messages.length === 0 ? (
                        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          메시지가 없습니다
                        </div>
                      ) : (
                        <div>
                          {messages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 cursor-pointer ${
                                !message.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                              }`}
                              onClick={() => markMessageAsRead(message.id)}
                              role="button"
                              aria-label={`${message.sender}님의 메시지: ${message.content}. ${!message.read ? '읽지 않음' : '읽음'}`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  {message.avatar ? (
                                    <img
                                      src={message.avatar}
                                      alt=""
                                      className="h-10 w-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                                        {message.sender.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm font-medium ${!message.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {message.sender}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                      {format(new Date(message.timestamp), 'MM/dd HH:mm')}
                                    </p>
                                  </div>
                                  <p className={`text-sm truncate ${!message.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {message.content}
                                  </p>
                                  {!message.read && (
                                    <span className="inline-block mt-1 rounded-full w-2 h-2 bg-primary"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        variant="outline" 
                        className="w-full text-sm" 
                        onClick={() => setLocation('/messages')}
                      >
                        모든 메시지 보기
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Notifications Button & Popup */}
              <NotificationCenter />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Accessibility Checker */}
              <AccessibilityChecker />
            </div>
            
            {/* Shopping Cart Button & Popup */}
            <div className="relative" ref={cartPopupRef}>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setCartPopupOpen(!cartPopupOpen);
                  setMessagePopupOpen(false);
                  setNotificationPopupOpen(false);
                }}
                className="relative"
                aria-label={`장바구니 ${cartItemsCount > 0 ? `(${cartItemsCount}개 항목)` : '비어있음'}`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-4 h-4 flex items-center justify-center bg-primary text-white"
                    aria-hidden="true"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
              
              {/* Cart Popup */}
              {cartPopupOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                  role="dialog"
                  aria-label="장바구니"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold">장바구니</h3>
                      <Badge variant="outline" className="text-xs">
                        {cartItemsCount}개 상품
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto max-h-80">
                    {cartItems.length === 0 ? (
                      <div className="py-8 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          장바구니가 비어있습니다
                        </p>
                        <Button 
                          variant="link" 
                          className="mt-2 text-sm"
                          onClick={() => setLocation('/shop')}
                        >
                          쇼핑하러 가기
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {cartItems.map((item) => (
                          <div 
                            key={item.id} 
                            className="p-3 border-b border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col h-full justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                      {item.name}
                                    </p>
                                    <div className="flex items-center mt-1">
                                      <div className="flex-1">
                                        <div className="flex items-center">
                                          {item.discountRate && (
                                            <span className="text-xs line-through text-gray-500 dark:text-gray-400 mr-1">
                                              {item.price.toLocaleString()}원
                                            </span>
                                          )}
                                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {item.discountRate 
                                              ? Math.round(item.price * (1 - item.discountRate / 100)).toLocaleString() 
                                              : item.price.toLocaleString()}원
                                          </span>
                                          {item.discountRate && (
                                            <Badge variant="destructive" className="ml-1.5 px-1 py-0 h-4 text-[10px]">
                                              {item.discountRate}%
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                          disabled={item.quantity <= 1}
                                          aria-label="수량 감소"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        </Button>
                                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                          aria-label="수량 증가"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="justify-start -ml-2 mt-1 text-xs text-gray-500 dark:text-gray-400 p-0 h-6"
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label={`${item.name} 상품 삭제`}
                                  >
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    삭제
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {cartItems.length > 0 && (
                    <>
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">총 상품금액</span>
                          <span className="font-medium">{cartTotal.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">배송비</span>
                          <span className="font-medium">
                            {cartTotal >= 50000 ? '무료' : '3,000원'}
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>결제 예상 금액</span>
                          <span className="text-primary">
                            {(cartTotal >= 50000 ? cartTotal : cartTotal + 3000).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 text-sm"
                          onClick={() => setLocation('/cart')}
                        >
                          장바구니
                        </Button>
                        <Button 
                          className="flex-1 text-sm"
                          onClick={() => setLocation('/checkout')}
                        >
                          결제하기
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <div>
                  <Button
                    variant="ghost"
                    className="flex items-center rounded-full transition-opacity"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="사용자 메뉴"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt={userName || '사용자'}
                      />
                      <AvatarFallback>
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                  
                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 transition-opacity"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName || '사용자'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {userRole === 'trainer' ? '훈련사' : 
                            userRole === 'admin' ? '관리자' : 
                            userRole === 'institute' ? '기관 관리자' : 
                            '일반 회원'}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                        >
                          프로필
                        </Link>
                        <Link
                          href="/my/pets"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                        >
                          내 반려동물
                        </Link>
                        <Link
                          href="/my/courses"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                        >
                          수강 중인 강좌
                        </Link>
                        <Link
                          href="/my/orders"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                        >
                          주문 내역
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-100 dark:border-gray-800">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={handleLogout}
                          role="menuitem"
                        >
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setLocation('/auth')}
                  size="sm"
                  className="ml-0"
                >
                  로그인
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}