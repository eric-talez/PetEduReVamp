import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Chatbot.css';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

// 기본 제안 질문 목록
const defaultSuggestions = [
  "훈련 서비스는 어떤 것이 있나요?",
  "훈련사는 어떻게 신청하나요?",
  "반려견 교육 코스의 가격이 궁금해요",
  "온라인 상담은 어떻게 받나요?",
  "훈련사의 자격 요건은 무엇인가요?"
];

// 서비스 관련 질문 응답
const serviceResponses: Record<string, string> = {
  "훈련": "테일즈에서는 기초 훈련부터 고급 행동 교정까지 다양한 훈련 서비스를 제공합니다. 기본 복종 훈련, 문제 행동 교정, 특수 기술 훈련 등 반려견의 필요에 맞는 맞춤형 프로그램을 선택하실 수 있습니다.",
  "가격": "훈련 프로그램 가격은 코스에 따라 다양합니다. 기본 과정은 월 15만원부터 시작하며, 특별 교정 과정은 별도 상담을 통해 결정됩니다. 정확한 가격은 상담을 통해 안내해 드립니다.",
  "자격": "테일즈의 모든 훈련사는 공인된 훈련사 자격증을 보유하고 있으며, 최소 3년 이상의 현장 경험을 갖추고 있습니다. 또한 정기적인 교육과 평가를 통해 최신 훈련 기법을 습득하고 있습니다.",
  "상담": "온라인 상담은 홈페이지 상단의 '상담 예약' 버튼을 통해 신청하실 수 있습니다. 화상 상담과 채팅 상담 두 가지 옵션이 있으며, 예약 후 전문 상담사가 지정된 시간에 연락드립니다.",
  "예약": "수업 예약은 마이페이지 > 예약 관리에서 가능합니다. 원하는 날짜와 시간대를 선택한 후 훈련사를 지정할 수 있습니다. 예약은 최소 24시간 전에 완료해주세요.",
  "코스": "테일즈에서는 기초 훈련 과정(8주), 중급 과정(12주), 고급 과정(16주) 및 문제 행동 특화 과정 등 다양한 교육 코스를 제공합니다. 각 코스는 반려견의 연령과 성향에 맞게 커스터마이징이 가능합니다.",
  "온라인": "온라인 훈련 과정은 라이브 화상 교육과 녹화된 강의로 제공됩니다. 주 1회 화상 교육과 함께, 매일 5-10분 정도의 홈트레이닝 가이드를 받아보실 수 있습니다.",
  "그룹": "그룹 수업은 최대 5마리까지 함께 진행되며, 사회성 발달에 중점을 둡니다. 매주 토요일과 일요일에 진행되며, 등록 전 상담을 통해 반려견의 성향을 평가합니다.",
  "강사": "테일즈의 훈련사는 모두 국내외 공인 자격증을 보유하고 있으며, 고객 평가를 통해 지속적으로 모니터링됩니다. 훈련사 프로필은 웹사이트의 '훈련사 소개' 페이지에서 확인하실 수 있습니다.",
  "교육": "테일즈의 교육 철학은 긍정 강화 훈련을 기반으로 합니다. 처벌이나 강압적인 방법이 아닌, 반려견의 자발적인 참여와 즐거움을 통한 학습을 추구합니다.",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState<boolean>(false);
  
  // 드래그 기능을 위한 상태 추가
  const [position, setPosition] = useState({ x: 20, y: 120 });
  const [size, setSize] = useState({ width: 350, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  // 챗봇 초기 메시지 설정
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      addBotMessage("안녕하세요! 테일즈 AI 도우미입니다. 반려동물 훈련과 관련하여 무엇을 도와드릴까요?");
      setSuggestions(defaultSuggestions);
    }
  }, [isOpen, messages.length]);

  // 메시지가 추가될 때마다 스크롤 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 비활성 시간 체크
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowBadge(true);
        // 로컬 스토리지에 세션 메시지 저장
        localStorage.setItem('showPromo', 'true');
      }
    }, 300000); // 5분 (실제로는 더 긴 시간으로 설정 가능)

    return () => clearTimeout(timer);
  }, [isOpen]);

  // 플로팅 저장된 프로모션 메시지 확인
  useEffect(() => {
    const showPromo = localStorage.getItem('showPromo');
    if (showPromo === 'true') {
      setTimeout(() => {
        setIsOpen(true);
        addBotMessage("안녕하세요! 지금 신규 회원 등록 시 첫 훈련 수업이 50% 할인됩니다. 자세한 내용이 궁금하시면 '할인'에 대해 물어보세요!");
        localStorage.removeItem('showPromo');
      }, 3000);
    }
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setShowBadge(false);
    
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'bot', content }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
  };

  const findResponse = (userMessage: string): string => {
    const normalizedMessage = userMessage.toLowerCase();
    
    // 키워드 기반 응답 찾기
    for (const keyword in serviceResponses) {
      if (normalizedMessage.includes(keyword)) {
        return serviceResponses[keyword];
      }
    }

    // 할인 특별 케이스
    if (normalizedMessage.includes('할인')) {
      return "현재 진행 중인 프로모션으로 신규 회원 등록 시 첫 훈련 수업이 50% 할인됩니다. 이 혜택은 등록 후 30일 이내에 사용 가능하며, 모든 훈련 프로그램에 적용 가능합니다. 지금 바로 회원가입하고 혜택을 받아보세요!";
    }
    
    // 기본 응답
    return "죄송합니다. 요청하신 정보를 찾지 못했습니다. 더 자세한 정보는 고객센터(1544-9999)로 문의해 주시거나 '훈련', '예약', '코스', '가격' 등에 대해 물어봐 주세요.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue('');
  };

  const sendMessage = (message: string) => {
    addUserMessage(message);
    
    // 제안 전부 초기화
    setSuggestions([]);
    
    // 응답 생성 (지연 효과 추가)
    setTimeout(() => {
      const response = findResponse(message);
      addBotMessage(response);
      
      // 새로운 제안 질문 표시
      const newSuggestions = defaultSuggestions
        .filter(s => s !== message)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      setSuggestions(newSuggestions);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // 드래그 시작 - 정확한 시작 위치 계산 개선
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isResizing) return;
    
    const rect = chatbotRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    // getBoundingClientRect()를 사용하여 정확한 상대 위치 계산
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // 이벤트 처리 개선
    e.preventDefault();
    e.stopPropagation();
  }, [isResizing]);

  // 리사이즈 시작 - 이벤트 처리 개선
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    
    // 이벤트 처리 개선: preventDefault() 추가
    e.preventDefault();
    e.stopPropagation();
  }, [size]);

  // 마우스 이동 처리 - 좌표 시스템 및 이벤트 처리 개선
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 이벤트 처리 개선: preventDefault() 추가
      e.preventDefault();
      
      if (isDragging) {
        // 좌표 시스템 수정: top/left 기준으로 정확한 위치 계산
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // 화면 경계 내로 제한
        const constrainedX = Math.max(0, Math.min(window.innerWidth - size.width, newX));
        const constrainedY = Math.max(0, Math.min(window.innerHeight - size.height, newY));
        
        // bottom/right 기준에서 top/left 기준으로 좌표 변환
        const bottomPosition = window.innerHeight - constrainedY - size.height;
        const rightPosition = window.innerWidth - constrainedX - size.width;
        
        setPosition({ x: rightPosition, y: bottomPosition });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(280, Math.min(600, resizeStart.width + deltaX));
        const newHeight = Math.max(400, Math.min(700, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      // 커서 스타일 개선: 상태에 따른 적절한 커서 복원
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    if (isDragging || isResizing) {
      // 이벤트 처리 개선: passive: false 옵션 사용
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      
      // 커서 스타일 개선: 상태에 따른 적절한 커서 표시
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDragging ? 'grabbing' : 'se-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, dragStart, resizeStart, size]);

  // 위치 초기화
  const resetPosition = () => {
    setPosition({ x: 20, y: 120 });
    setSize({ width: 350, height: 500 });
  };

  // 다크 모드 여부 확인
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div 
      ref={chatbotRef}
      className="chatbot-container" 
      style={{ 
        position: 'fixed', 
        bottom: `${position.y}px`, 
        right: `${position.x}px`, 
        zIndex: 9999 
      }}
    >
      <button 
        className="chatbot-button"
        onClick={toggleChatbot}
        aria-label="챗봇 열기"
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '30px',
          backgroundColor: isDarkMode ? '#2563eb' : '#1d4ed8',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          border: 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {showBadge && (
          <span className="unread-badge" style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#e53e3e',
            color: 'white',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold'
          }}>1</span>
        )}
      </button>
      
      <div className={`chatbot-panel ${isOpen ? 'open' : ''}`} style={{
        position: 'absolute',
        bottom: '75px',
        right: '0px',
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: isDarkMode ? '#1a1d23' : 'white',
        borderRadius: '12px',
        boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transformOrigin: 'bottom right',
        transform: isOpen ? 'scale(1)' : 'scale(0)',
        opacity: isOpen ? '1' : '0',
        pointerEvents: isOpen ? 'all' : 'none',
        zIndex: 9999
      }}>
        <div 
          className="chatbot-header" 
          onMouseDown={handleDragStart}
          style={{
            padding: '15px 20px',
            backgroundColor: isDarkMode ? '#1e40af' : '#1d4ed8',
            color: 'white',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        >
          <span>테일즈 AI 도우미</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={resetPosition}
              aria-label="위치 초기화"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                opacity: 0.7,
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ⌂
            </button>
            <button 
              className="chatbot-close"
              onClick={toggleChatbot}
              aria-label="챗봇 닫기"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: '1'
              }}
            >
              ✕
            </button>
          </div>
        </div>
        
        <div style={{
          flex: '1',
          padding: '15px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: '16px',
                fontSize: '14px',
                lineHeight: '1.4',
                position: 'relative',
                alignSelf: message.role === 'bot' ? 'flex-start' : 'flex-end',
                backgroundColor: message.role === 'bot' 
                  ? (isDarkMode ? '#374151' : '#f3f4f6') 
                  : (isDarkMode ? '#2563eb' : '#1d4ed8'),
                color: message.role === 'bot' 
                  ? (isDarkMode ? '#f9fafb' : '#1f2937') 
                  : 'white',
                borderBottomLeftRadius: message.role === 'bot' ? '4px' : '16px',
                borderBottomRightRadius: message.role === 'bot' ? '16px' : '4px'
              }}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {suggestions.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 15px 10px 15px'
          }}>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                style={{
                  padding: '8px 12px',
                  backgroundColor: isDarkMode ? '#2d3748' : '#f7fafc',
                  color: 'var(--primary-color, #a7e8c5)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  marginRight: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  border: isDarkMode ? '1px solid #4a5568' : '1px solid #edf2f7',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{
          padding: '12px',
          borderTop: isDarkMode ? '1px solid #4a5568' : '1px solid #edf2f7',
          display: 'flex',
          gap: '10px',
          backgroundColor: isDarkMode ? '#1a1d23' : 'white'
        }}>
          <input
            ref={inputRef}
            type="text"
            style={{
              flex: '1',
              border: isDarkMode ? '1px solid #6b7280' : '1px solid #d1d5db',
              borderRadius: '20px',
              padding: '10px 15px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isDarkMode ? '#374151' : 'white',
              color: isDarkMode ? '#f9fafb' : '#1f2937'
            }}
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button 
            type="submit"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: !inputValue.trim() ? '#9ca3af' : (isDarkMode ? '#2563eb' : '#1d4ed8'),
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: !inputValue.trim() ? 'not-allowed' : 'pointer',
              border: 'none',
              transition: 'background-color 0.2s ease'
            }}
            disabled={!inputValue.trim()}
            aria-label="메시지 보내기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        
        {/* 리사이즈 핸들 - 시각적으로 개선된 디자인 */}
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '20px',
            height: '20px',
            cursor: 'se-resize',
            background: `linear-gradient(135deg, 
              ${isDarkMode ? '#374151' : '#e5e7eb'} 0%, 
              ${isDarkMode ? '#6b7280' : '#9ca3af'} 100%)`,
            borderTopLeftRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            transition: 'all 0.2s ease',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, 
              ${isDarkMode ? '#4b5563' : '#d1d5db'} 0%, 
              ${isDarkMode ? '#9ca3af' : '#6b7280'} 100%)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, 
              ${isDarkMode ? '#374151' : '#e5e7eb'} 0%, 
              ${isDarkMode ? '#6b7280' : '#9ca3af'} 100%)`;
          }}
        >
          ⋰
        </div>
      </div>
    </div>
  );
}