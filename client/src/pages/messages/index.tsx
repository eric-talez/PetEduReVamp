import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Send, Search, Phone, Video, MoreVertical, Clock, CheckCheck } from 'lucide-react';
import { useLocation } from 'wouter';

interface Message {
  id: number;
  sender: string;
  senderId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  isMine: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline: boolean;
}

export default function Messages() {
  const [location] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // 초기 데이터 설정 - 실제로는 API에서 가져와야 함
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: '김훈련 트레이너',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: '훈련사',
      lastMessage: '안녕하세요, 오늘 수업은 어땠나요?',
      lastMessageTime: '10:30',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 2,
      name: '박교정 트레이너',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: '훈련사',
      lastMessage: '다음 수업은 목요일 오후 2시입니다.',
      lastMessageTime: '어제',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 3,
      name: '서울 애견 훈련소',
      avatar: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nJTIwdHJhaW5pbmd8ZW58MHx8MHx8fDA%3D',
      role: '기관',
      lastMessage: '결제가 완료되었습니다.',
      lastMessageTime: '3일 전',
      unreadCount: 0,
      isOnline: true
    }
  ]);

  // URL에서 trainer 파라미터 읽기
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const trainerParam = searchParams.get('trainer');
    
    if (trainerParam) {
      const contact = contacts.find(c => c.name === trainerParam);
      if (contact) {
        setSelectedContact(contact);
        loadMessages(contact.id);
      }
    }
  }, []);

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 연락처 검색 필터링
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 메시지 로드 함수 (실제로는 API에서 가져와야 함)
  const loadMessages = (contactId: number) => {
    // 임시 데이터 - 실제로는 API에서 가져와야 함
    if (contactId === 1) {
      setMessages([
        {
          id: 1,
          sender: '김훈련 트레이너',
          senderId: 1,
          content: '안녕하세요! 오늘 훈련은 어떠셨나요?',
          timestamp: '오전 10:15',
          isRead: true,
          isMine: false
        },
        {
          id: 2,
          sender: '나',
          senderId: 0,
          content: '안녕하세요 선생님, 오늘 훈련은 좋았어요. 하지만 몇 가지 질문이 있습니다.',
          timestamp: '오전 10:20',
          isRead: true,
          isMine: true
        },
        {
          id: 3,
          sender: '김훈련 트레이너',
          senderId: 1,
          content: '물론이죠! 어떤 점이 궁금하신가요?',
          timestamp: '오전 10:22',
          isRead: true,
          isMine: false
        },
        {
          id: 4,
          sender: '나',
          senderId: 0,
          content: '집에서 연습할 때 주의해야 할 점이 있을까요?',
          timestamp: '오전 10:25',
          isRead: true,
          isMine: true
        },
        {
          id: 5,
          sender: '김훈련 트레이너',
          senderId: 1,
          content: '네, 훈련할 때는 일관성이 가장 중요합니다. 매일 같은 시간에 짧게라도 연습하는 것이 좋고, 보상을 통해 긍정적인 강화를 해주세요.',
          timestamp: '오전 10:28',
          isRead: true,
          isMine: false
        },
        {
          id: 6,
          sender: '김훈련 트레이너',
          senderId: 1,
          content: '안녕하세요, 오늘 수업은 어땠나요?',
          timestamp: '오전 10:30',
          isRead: false,
          isMine: false
        }
      ]);
    } else if (contactId === 2) {
      setMessages([
        {
          id: 1,
          sender: '박교정 트레이너',
          senderId: 2,
          content: '안녕하세요, 다음 수업 일정 관련해서 연락드립니다.',
          timestamp: '어제 오후 3:15',
          isRead: true,
          isMine: false
        },
        {
          id: 2,
          sender: '나',
          senderId: 0,
          content: '네, 안녕하세요. 다음 수업은 언제인가요?',
          timestamp: '어제 오후 3:20',
          isRead: true,
          isMine: true
        },
        {
          id: 3,
          sender: '박교정 트레이너',
          senderId: 2,
          content: '다음 수업은 목요일 오후 2시입니다.',
          timestamp: '어제 오후 3:25',
          isRead: true,
          isMine: false
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          sender: '서울 애견 훈련소',
          senderId: 3,
          content: '5월 훈련 패키지 결제가 확인되었습니다.',
          timestamp: '3일 전 오후 2:15',
          isRead: true,
          isMine: false
        },
        {
          id: 2,
          sender: '나',
          senderId: 0,
          content: '확인 감사합니다. 첫 수업은 언제부터 시작되나요?',
          timestamp: '3일 전 오후 2:30',
          isRead: true,
          isMine: true
        },
        {
          id: 3,
          sender: '서울 애견 훈련소',
          senderId: 3,
          content: '첫 수업은 다음 주 월요일부터 시작됩니다. 오리엔테이션 자료를 이메일로 발송해드렸으니 확인 부탁드립니다.',
          timestamp: '3일 전 오후 2:45',
          isRead: true,
          isMine: false
        }
      ]);
    }
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (!currentMessage.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: '나',
      senderId: 0,
      content: currentMessage,
      timestamp: '방금 전',
      isRead: false,
      isMine: true
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage('');

    // 연락처 목록 최신 메시지 업데이트
    const updatedContacts = contacts.map(contact => {
      if (contact.id === selectedContact.id) {
        return {
          ...contact,
          lastMessage: currentMessage,
          lastMessageTime: '방금 전'
        };
      }
      return contact;
    });

    setContacts(updatedContacts);
  };

  // 연락처 선택 핸들러
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    loadMessages(contact.id);
    
    // 읽음 상태 업데이트
    const updatedContacts = contacts.map(c => {
      if (c.id === contact.id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    });
    
    setContacts(updatedContacts);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 연락처 사이드바 */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">메시지</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              className="pl-10"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-3 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedContact?.id === contact.id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="relative">
                  <Avatar src={contact.avatar} alt={contact.name} className="h-12 w-12" />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  )}
                </div>
                
                <div className="ml-3 flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                    {contact.lastMessageTime && (
                      <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    {contact.lastMessage && (
                      <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                    )}
                    {contact.unreadCount ? (
                      <span className="ml-1 flex-shrink-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  
                  <div className="mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {contact.role}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
      
      {/* 메시지 영역 */}
      <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
        {selectedContact ? (
          <>
            {/* 메시지 헤더 */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-900">
              <div className="flex items-center">
                <Avatar src={selectedContact.avatar} alt={selectedContact.name} className="h-10 w-10" />
                <div className="ml-3">
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${selectedContact.isOnline ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                    <span className="text-xs text-gray-500">
                      {selectedContact.isOnline ? '온라인' : '오프라인'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={20} />
                </Button>
              </div>
            </div>
            
            {/* 메시지 내용 */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} mb-4`}>
                  {!message.isMine && (
                    <Avatar 
                      src={selectedContact.avatar} 
                      alt={selectedContact.name} 
                      className="h-8 w-8 mr-2 mt-1"
                    />
                  )}
                  
                  <div className={`max-w-[70%] ${message.isMine ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'} p-3 rounded-lg shadow-sm`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end mt-1 text-xs ${message.isMine ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                      <Clock size={12} className="mr-1" />
                      <span>{message.timestamp}</span>
                      {message.isMine && (
                        <CheckCheck size={14} className={`ml-1 ${message.isRead ? 'text-blue-400' : 'text-gray-400'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* 메시지 입력 */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex space-x-2">
                <Input
                  className="flex-grow"
                  placeholder="메시지 입력..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <MessageSquare size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                메시지함
              </h3>
              <p className="text-gray-500 max-w-md">
                왼쪽에서 대화 상대를 선택하거나 검색하여 메시지를 주고받으세요.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* 모바일에서 연락처를 선택하지 않았을 때 안내 */}
      <div className="flex md:hidden flex-grow items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6">
          <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <MessageSquare size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            메시지함
          </h3>
          <p className="text-gray-500">
            대화 상대를 선택하여 메시지를 주고받으세요.
          </p>
        </div>
      </div>
    </div>
  );
}

// MessageSquare 컴포넌트 정의
function MessageSquare(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}