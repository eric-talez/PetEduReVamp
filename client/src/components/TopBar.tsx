import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
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
  DollarSign
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
    console.log("Logout button clicked");
    // 기존 logout 함수가 있으면 사용, 없으면 직접 구현
    if (logout) {
      logout();
    } else {
      // 직접 로그아웃 처리
      console.log("직접 로그아웃 처리 실행");
      localStorage.removeItem('petedu_auth');
      window.dispatchEvent(new CustomEvent('logout'));
      // 임시적으로 window.location 사용
      window.location.href = "/auth";
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm z-10 transition-colors">
      <div className="w-full mx-auto px-0">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-xl ml-0">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary" 
                placeholder="강의, 훈련사, 기관 검색" 
              />
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
                  aria-label="메시지"
                >
                  <MessageSquare className="h-5 w-5" />
                  {isAuthenticated && unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Button>
                
                {/* Messages Popup */}
                {messagePopupOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold">메시지</h3>
                        {unreadMessagesCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={markAllMessagesAsRead}
                            className="text-xs h-7 px-2"
                          >
                            모두 읽음 표시
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto py-1">
                      {messages.length > 0 ? (
                        messages.slice(0, 5).map((message) => (
                          <div
                            key={message.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!message.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            onClick={() => {
                              markMessageAsRead(message.id);
                              setMessagePopupOpen(false);
                              setLocation("/messages");
                            }}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <Avatar className="h-8 w-8">
                                  {message.avatar && <AvatarImage src={message.avatar} />}
                                  <AvatarFallback>{message.sender.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium truncate">{message.sender}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(message.timestamp), 'M월 d일', { locale: ko })}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">메시지가 없습니다</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 py-2 px-4">
                      <Button 
                        variant="link" 
                        className="w-full justify-center" 
                        onClick={() => {
                          setMessagePopupOpen(false);
                          setLocation("/messages");
                        }}
                      >
                        모든 메시지 보기
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Notifications Button & Popup */}
              <div className="relative" ref={notificationPopupRef}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    if (isAuthenticated) {
                      setNotificationPopupOpen(!notificationPopupOpen);
                      setMessagePopupOpen(false);
                      setCartPopupOpen(false);
                    } else {
                      setLocation("/auth");
                    }
                  }}
                  className="relative"
                  aria-label="알림"
                >
                  <Bell className="h-5 w-5" />
                  {isAuthenticated && unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Button>
                
                {/* Notifications Popup */}
                {notificationPopupOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold">알림</h3>
                        {unreadNotificationsCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={markAllNotificationsAsRead}
                            className="text-xs h-7 px-2"
                          >
                            모두 읽음 표시
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto py-1">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            onClick={() => {
                              markNotificationAsRead(notification.id);
                              setNotificationPopupOpen(false);
                              if (notification.link) {
                                setLocation(notification.link);
                              } else {
                                setLocation("/notifications");
                              }
                            }}
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0">
                                {notification.type === 'info' && (
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <AlertCircle className="h-4 w-4" />
                                  </div>
                                )}
                                {notification.type === 'success' && (
                                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                )}
                                {notification.type === 'warning' && (
                                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                    <AlertCircle className="h-4 w-4" />
                                  </div>
                                )}
                                {notification.type === 'error' && (
                                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium">{notification.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0">
                                    {format(new Date(notification.timestamp), 'M월 d일', { locale: ko })}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {notification.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">알림이 없습니다</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 py-2 px-4">
                      <Button 
                        variant="link" 
                        className="w-full justify-center" 
                        onClick={() => {
                          setNotificationPopupOpen(false);
                          setLocation("/notifications");
                        }}
                      >
                        모든 알림 보기
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <>
                {/* Shopping Cart Button & Popup */}
                <div className="relative" ref={cartPopupRef}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => {
                      setCartPopupOpen(!cartPopupOpen);
                      setMessagePopupOpen(false);
                      setNotificationPopupOpen(false);
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                  
                  {/* Cart Popup */}
                  {cartPopupOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold">장바구니</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {cartItemsCount}개 상품
                          </span>
                        </div>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto py-1">
                        {cartItems.length > 0 ? (
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {cartItems.map((item) => (
                              <div key={item.id} className="px-4 py-3">
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <div className="flex items-center mt-1">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6 rounded-full p-0"
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                          >
                                            <span className="sr-only">감소</span>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M2.5 7.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </Button>
                                          <span className="mx-2 text-sm font-medium min-w-[20px] text-center">
                                            {item.quantity}
                                          </span>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6 rounded-full p-0"
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                          >
                                            <span className="sr-only">증가</span>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M7.5 2.5V12.5M2.5 7.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        {item.discountRate ? (
                                          <>
                                            <p className="text-sm font-medium">
                                              {Math.round(item.price * (1 - item.discountRate / 100)).toLocaleString()}원
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                              {item.price.toLocaleString()}원
                                            </p>
                                          </>
                                        ) : (
                                          <p className="text-sm font-medium">
                                            {item.price.toLocaleString()}원
                                          </p>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 mt-1 text-gray-500 hover:text-red-500"
                                          onClick={() => removeFromCart(item.id)}
                                        >
                                          <X className="h-4 w-4" />
                                          <span className="sr-only">삭제</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <ShoppingBag className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">장바구니가 비어있습니다</p>
                            <Button
                              variant="link"
                              className="mt-2"
                              onClick={() => {
                                setCartPopupOpen(false);
                                console.log("카트 팝업에서 쇼핑 버튼 클릭 - 직접 /shop으로 이동");
                                window.location.href = "/shop";
                              }}
                            >
                              쇼핑하러 가기
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {cartItems.length > 0 && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">소계</span>
                              <span className="text-sm font-medium">{cartTotal.toLocaleString()}원</span>
                            </div>
                            <Button 
                              className="w-full"
                              onClick={() => {
                                setCartPopupOpen(false);
                                console.log("카트 팝업에서 결제 버튼 클릭");
                                // 결제 페이지도 직접 이동
                                window.location.href = window.location.origin + "/shop/checkout";
                              }}
                            >
                              결제하기
                            </Button>
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 py-2 px-4">
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              onClick={() => {
                                setCartPopupOpen(false);
                                console.log("카트 팝업에서 장바구니 버튼 클릭");
                                // 장바구니는 직접 이동해야 함 (리다이렉트 사용하지 않음)
                                window.location.href = window.location.origin + "/shop/cart";
                              }}
                            >
                              장바구니 보기
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <Avatar className="h-8 w-8">
                      {userRole && (
                        <AvatarImage 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || '')}&background=random&color=fff`} 
                          alt={userName || '사용자'} 
                        />
                      )}
                      <AvatarFallback>{userName ? userName.substring(0, 1).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:flex items-center space-x-1">
                      <span className="text-sm font-medium">{userName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-semibold">{userName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {userRole === 'admin' && '시스템 관리자'}
                          {userRole === 'trainer' && '훈련사'}
                          {userRole === 'institute-admin' && '기관 관리자'}
                          {userRole === 'pet-owner' && '견주 회원'}
                          {userRole === 'user' && '일반 회원'}
                        </div>
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        내 프로필
                      </Link>
                      <Link href="/my-courses" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        내 강의실
                      </Link>
                      <Link href="/my-pets" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        내 반려견
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        설정
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Link href="/auth">로그인</Link>
                </Button>
                <Button variant="default" size="sm">
                  <Link href="/auth?tab=register">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}