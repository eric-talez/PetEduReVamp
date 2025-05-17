import { useEffect, useState } from 'react';

type Season = 'spring' | 'summer' | 'fall' | 'winter';
type HolidayEvent = 'christmas' | 'newyear' | 'halloween' | 'valentines' | 'chuseok' | 'seollal' | 'none';

// 계절 및 특별 이벤트 테마 설정을 위한 훅
export function useSeasonalTheme() {
  const [currentSeason, setCurrentSeason] = useState<Season>('spring');
  const [currentEvent, setCurrentEvent] = useState<HolidayEvent>('none');
  const [seasonAccentColor, setSeasonAccentColor] = useState<string>('');
  const [eventAccentColor, setEventAccentColor] = useState<string>('');
  
  useEffect(() => {
    // 현재 계절 계산
    const determineCurrentSeason = (): Season => {
      const now = new Date();
      const month = now.getMonth(); // 0(1월) ~ 11(12월)
      
      if (month >= 2 && month <= 4) return 'spring'; // 3월~5월: 봄
      if (month >= 5 && month <= 7) return 'summer'; // 6월~8월: 여름
      if (month >= 8 && month <= 10) return 'fall';  // 9월~11월: 가을
      return 'winter';                               // 12월~2월: 겨울
    };
    
    // 특별 이벤트 기간 확인
    const determineCurrentEvent = (): HolidayEvent => {
      const now = new Date();
      const month = now.getMonth();
      const day = now.getDate();
      
      // 크리스마스 시즌 (12월 1일 ~ 12월 31일)
      if (month === 11) return 'christmas';
      
      // 설날 시즌 - 음력이라 매년 다름, 대략적인 기간
      if (month === 0 && day <= 15) return 'seollal';
      
      // 발렌타인데이 (2월 1일 ~ 2월 15일)
      if (month === 1 && day <= 15) return 'valentines';
      
      // 할로윈 시즌 (10월 15일 ~ 10월 31일)
      if (month === 9 && day >= 15) return 'halloween';
      
      // 추석 시즌 - 음력이라 매년 다름, 대략적인 기간
      if (month === 8) return 'chuseok';
      
      // 새해 (1월 1일 ~ 1월 15일)
      if (month === 0 && day <= 15) return 'newyear';
      
      return 'none';
    };
    
    // 계절 및 이벤트 설정
    const season = determineCurrentSeason();
    setCurrentSeason(season);
    
    const event = determineCurrentEvent();
    setCurrentEvent(event);
    
    // 계절별 아이덴티티 색상
    const seasonColors = {
      spring: 'hsl(140, 84%, 82%)', // 밝은 녹색
      summer: 'hsl(190, 84%, 75%)', // 밝은 청색
      fall: 'hsl(35, 84%, 75%)',    // 황금색
      winter: 'hsl(210, 84%, 85%)'  // 하늘색
    };
    
    // 이벤트별 아이덴티티 색상
    const eventColors = {
      christmas: 'hsl(350, 84%, 60%)', // 크리스마스 빨간색
      newyear: 'hsl(45, 84%, 65%)',    // 새해 금색
      halloween: 'hsl(25, 84%, 55%)',  // 할로윈 주황색
      valentines: 'hsl(330, 84%, 75%)', // 발렌타인 분홍색
      chuseok: 'hsl(45, 84%, 65%)',    // 추석 황금색
      seollal: 'hsl(0, 84%, 60%)',     // 설날 빨간색
      none: ''                         // 이벤트 없음
    };
    
    setSeasonAccentColor(seasonColors[season]);
    setEventAccentColor(eventColors[event]);
    
  }, []);
  
  // 현재 계절에 맞는 아이콘 또는 이모티콘 반환
  const getSeasonEmoji = (): string => {
    switch (currentSeason) {
      case 'spring': return '🌸'; // 벚꽃
      case 'summer': return '☀️'; // 태양
      case 'fall': return '🍁';   // 단풍잎
      case 'winter': return '❄️'; // 눈송이
      default: return '';
    }
  };
  
  // 현재 이벤트에 맞는 아이콘 또는 이모티콘 반환
  const getEventEmoji = (): string => {
    switch (currentEvent) {
      case 'christmas': return '🎄'; // 크리스마스 트리
      case 'newyear': return '🎊';   // 축하
      case 'halloween': return '🎃'; // 호박
      case 'valentines': return '💝'; // 하트 선물
      case 'chuseok': return '🌕';   // 보름달
      case 'seollal': return '🧧';   // 빨간 봉투
      default: return '';
    }
  };
  
  // 계절/이벤트에 맞는 애니메이션 효과 클래스 반환
  const getSeasonalEffectClass = (): string => {
    if (currentEvent === 'christmas') return 'theme-effect-snow';
    if (currentEvent === 'newyear') return 'theme-effect-confetti';
    if (currentEvent === 'halloween') return 'theme-effect-spooky';
    
    if (currentSeason === 'spring') return 'theme-effect-petals';
    if (currentSeason === 'fall') return 'theme-effect-leaves';
    if (currentSeason === 'winter') return 'theme-effect-snow';
    
    return '';
  };
  
  return {
    currentSeason,
    currentEvent,
    seasonAccentColor,
    eventAccentColor,
    getSeasonEmoji,
    getEventEmoji,
    getSeasonalEffectClass,
    // 활성화된 테마 여부
    hasActiveSeasonalTheme: currentEvent !== 'none',
    // 현재 사용할 테마 색상 (이벤트 > 계절 순 우선순위)
    activeAccentColor: eventAccentColor || seasonAccentColor
  };
}