import React, { useState, useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="chatbot-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <button 
        className="chatbot-button"
        onClick={toggleChatbot}
        aria-label="챗봇 열기"
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '30px',
          backgroundColor: 'var(--primary-color, #a7e8c5)',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          border: 'none'
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
        right: '0',
        width: '350px',
        height: '500px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
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
        <div className="chatbot-header" style={{
          padding: '15px 20px',
          backgroundColor: 'var(--primary-color, #a7e8c5)',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>테일즈 AI 도우미</span>
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
                backgroundColor: message.role === 'bot' ? '#f7fafc' : 'var(--primary-color, #a7e8c5)',
                color: message.role === 'bot' ? '#2d3748' : 'white',
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
                  backgroundColor: '#f7fafc',
                  color: 'var(--primary-color, #a7e8c5)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  marginRight: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  border: '1px solid #edf2f7',
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
          borderTop: '1px solid #edf2f7',
          display: 'flex',
          gap: '10px',
          backgroundColor: 'white'
        }}>
          <input
            ref={inputRef}
            type="text"
            style={{
              flex: '1',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '10px 15px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white',
              color: '#2d3748'
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
              backgroundColor: !inputValue.trim() ? '#e2e8f0' : 'var(--primary-color, #a7e8c5)',
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
      </div>
    </div>
  );
}