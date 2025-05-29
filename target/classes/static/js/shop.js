// 다크 모드 관련 로직
document.addEventListener('DOMContentLoaded', function() {
  // 테마 설정 초기화
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateDarkModeIcon(true);
  }
  
  // 다크 모드 토글 버튼
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      updateDarkModeIcon(isDarkMode);
      
      // 다크 모드 변경 이벤트 서버로 전송
      fetch('/api/user/preferences/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ darkMode: isDarkMode }),
        credentials: 'include'
      }).catch(error => {
        console.error('테마 설정 저장 중 오류:', error);
      });
    });
  }
  
  // 배너 슬라이더 초기화
  initBannerSlider();
  
  // 검색창 포커스 이벤트
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', function() {
      document.querySelector('.search-suggestions').style.display = 'block';
    });
    
    searchInput.addEventListener('blur', function() {
      setTimeout(() => {
        document.querySelector('.search-suggestions').style.display = 'none';
      }, 200);
    });
  }
  
  // 챗봇 초기화
  initChatbot();
});

// 다크 모드 아이콘 업데이트 함수
function updateDarkModeIcon(isDarkMode) {
  const darkModeIcon = document.getElementById('dark-mode-icon');
  if (darkModeIcon) {
    if (isDarkMode) {
      darkModeIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    } else {
      darkModeIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    }
  }
}

// 배너 슬라이더 관련 로직
let currentSlide = 0;
const totalSlides = 3; // 슬라이드 수에 맞게 조정

function initBannerSlider() {
  // 자동 슬라이드 기능
  setInterval(() => {
    nextSlide();
  }, 5000);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

function updateSlider() {
  const slider = document.getElementById('banner-slider');
  if (slider) {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
}

// 상품 상세 페이지로 이동
function goToProductDetail(productId) {
  window.location.href = `/product/detail/${productId}`;
}

// 카테고리 페이지로 이동
function goToCategory(categoryName) {
  window.location.href = `/shop/category/${encodeURIComponent(categoryName)}`;
}

// 장바구니 페이지로 이동
function goToCart() {
  window.location.href = '/cart';
}

// 본서비스로 이동
function goToMainService() {
  window.location.href = '/';
}

// 쇼핑몰 홈으로 이동
function goToHome() {
  window.location.href = '/shop';
}

// 상품을 장바구니에 추가
function addToCart(productId, quantity = 1, options = {}) {
  fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      quantity,
      ...options
    }),
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(data.message || '상품이 장바구니에 추가되었습니다.');
      updateCartBadge(data.cartCount);
    } else {
      showToast(data.message || '장바구니 추가 실패');
    }
  })
  .catch(error => {
    console.error('장바구니 추가 중 오류:', error);
    showToast('장바구니 추가 중 오류가 발생했습니다.');
  });
}

// 장바구니 뱃지 업데이트
function updateCartBadge(count) {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = count;
  }
}

// 토스트 메시지 표시
function showToast(message) {
  // 이미 있는 토스트 제거
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerText = message;
  
  document.body.appendChild(toast);
  
  // 애니메이션 효과
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // 3초 후 제거
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

// 챗봇 기능
let isChatbotOpen = false;

function initChatbot() {
  // 챗봇 버튼 이벤트
  const chatbotButton = document.querySelector('.chatbot-button');
  if (chatbotButton) {
    chatbotButton.addEventListener('click', toggleChatbot);
  }
  
  // 닫기 버튼 이벤트
  const chatbotClose = document.querySelector('.chatbot-close');
  if (chatbotClose) {
    chatbotClose.addEventListener('click', closeChatbot);
  }
  
  // 메시지 전송 버튼 이벤트
  const chatbotSend = document.querySelector('.chatbot-send');
  if (chatbotSend) {
    chatbotSend.addEventListener('click', sendChatMessage);
  }
  
  // 메시지 입력창 엔터 이벤트
  const messageInput = document.getElementById('chatbot-input');
  if (messageInput) {
    messageInput.addEventListener('keypress', handleChatInputKeypress);
  }
  
  // 초기 메시지 표시
  setTimeout(() => {
    if (!isChatbotOpen) {
      document.getElementById('unread-badge').style.display = 'flex';
    }
  }, 5000);
  
  // 비활성 시간 타이머 설정
  resetInactivityTimer();
}

function toggleChatbot() {
  const chatbotWindow = document.querySelector('.chatbot-window');
  if (chatbotWindow) {
    const isActive = chatbotWindow.classList.toggle('active');
    isChatbotOpen = isActive;
    
    // 읽지 않은 메시지 알림 숨기기
    if (isActive) {
      document.getElementById('unread-badge').style.display = 'none';
      
      // 저장된 쿠폰 제안 메시지가 있으면 표시
      if (localStorage.getItem('showCouponOffer') === 'true') {
        localStorage.removeItem('showCouponOffer');
        setTimeout(() => {
          addBotMessage("현재 신규 회원을 위한 10% 할인 쿠폰이 준비되어 있습니다! 회원가입 후 바로 사용 가능하세요. 도움이 필요하시면 언제든 물어보세요.");
        }, 1000);
      }
      
      // 첫 방문이면 환영 메시지 표시
      if (!localStorage.getItem('chatbotInitialized')) {
        localStorage.setItem('chatbotInitialized', 'true');
        addBotMessage("안녕하세요! 테일즈 쇼핑 챗봇입니다. 무엇을 도와드릴까요?");
        showSuggestions(defaultSuggestions);
      }
    }
    
    resetInactivityTimer();
  }
}

function closeChatbot() {
  const chatbotWindow = document.querySelector('.chatbot-window');
  if (chatbotWindow) {
    chatbotWindow.classList.remove('active');
    isChatbotOpen = false;
  }
}

const defaultSuggestions = [
  "상품 추천해주세요",
  "배송 조회는 어떻게 하나요?",
  "반품 정책이 궁금해요",
  "회원 가입 방법을 알려주세요"
];

function showSuggestions(suggestions) {
  const suggestionsContainer = document.getElementById('chatbot-suggestions');
  if (suggestionsContainer) {
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(text => {
      const button = document.createElement('button');
      button.className = 'suggestion-btn';
      button.textContent = text;
      button.addEventListener('click', () => {
        sendChatMessage(null, text);
      });
      
      suggestionsContainer.appendChild(button);
    });
  }
}

function addBotMessage(text) {
  const messagesContainer = document.querySelector('.chatbot-messages');
  if (messagesContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    messageDiv.appendChild(timeDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function addUserMessage(text) {
  const messagesContainer = document.querySelector('.chatbot-messages');
  if (messagesContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    messageDiv.appendChild(timeDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function findResponse(message) {
  message = message.toLowerCase();
  
  // 챗봇 응답 데이터
  const responses = {
    "상품 추천해주세요": "고객님의 취향에 맞는 상품을 추천해 드릴게요. 강아지용 상품을 찾으시나요, 고양이용 상품을 찾으시나요?",
    "배송 조회는 어떻게 하나요": "배송 조회는 마이페이지 > 주문내역에서 확인하실 수 있습니다. 주문번호를 클릭하시면 배송 현황을 자세히 보실 수 있어요.",
    "반품 정책이 궁금해요": "상품 수령 후 7일 이내에 반품 신청이 가능합니다. 단, 상품이 훼손되었거나 사용한 경우에는 반품이 어려울 수 있어요. 자세한 내용은 고객센터를 통해 문의해주세요.",
    "회원 가입 방법을 알려주세요": "화면 상단의 '회원가입' 버튼을 클릭하신 후, 필요한 정보를 입력하시면 가입이 완료됩니다. 가입 후에는 다양한 혜택을 받으실 수 있어요!"
  };
  
  // 키워드 기반 응답
  const keywords = {
    "배송": "일반 배송은 2-3일, 특급 배송은 다음날 받아보실 수 있습니다. 배송 조회는 마이페이지에서 가능합니다.",
    "환불": "환불은 반품 완료 후 3-5일 내에 처리됩니다. 카드 결제의 경우 카드사 사정에 따라 환불 시점이 달라질 수 있습니다.",
    "쿠폰": "현재 신규 가입자를 위한 10% 할인 쿠폰을 제공하고 있습니다. 회원가입 후 마이페이지에서 확인하세요!",
    "결제": "신용카드, 무통장입금, 휴대폰 결제, 네이버페이, 카카오페이 등 다양한 결제 방법을 지원합니다.",
    "교환": "사이즈나 색상 교환은 상품 수령 후 7일 이내에 신청 가능합니다. 교환 배송비는 고객님 부담입니다."
  };
  
  // 정확한 응답 확인
  for (const key in responses) {
    if (message.includes(key.toLowerCase())) {
      return responses[key];
    }
  }
  
  // 키워드 기반 응답 확인
  for (const keyword in keywords) {
    if (message.includes(keyword)) {
      return keywords[keyword];
    }
  }
  
  // 기본 응답
  return "죄송합니다. 정확한 답변을 드리기 어렵네요. 더 자세한 내용은 고객센터(1234-5678)로 문의해주세요.";
}

function sendChatMessage(event, message) {
  if (event) {
    event.preventDefault();
  }
  
  const messageInput = document.getElementById('chatbot-input');
  const userMessage = message || messageInput.value.trim();
  
  if (userMessage) {
    addUserMessage(userMessage);
    
    // 입력창 초기화
    if (!message) {
      messageInput.value = '';
    }
    
    // 제안 메뉴 숨기기
    document.getElementById('chatbot-suggestions').innerHTML = '';
    
    // 응답 생성 (서버 API 호출 또는 클라이언트 측 로직)
    setTimeout(() => {
      const response = findResponse(userMessage);
      addBotMessage(response);
      
      // 다음 제안 질문 보여주기
      const relatedSuggestions = defaultSuggestions.filter(s => s !== userMessage).slice(0, 3);
      showSuggestions(relatedSuggestions);
    }, 1000);
  }
}