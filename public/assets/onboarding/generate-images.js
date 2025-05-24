// 온보딩 이미지 생성 스크립트
// 이 파일은 온보딩에 필요한 SVG 이미지를 생성합니다

// 샘플 SVG 이미지 (웰컴 이미지)
const welcomeSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 24px sans-serif; fill: #333; }
    .pet { fill: #8B5CF6; }
    .paw { fill: #6D28D9; }
    .bg { fill: #F3F4F6; }
    .welcome-text { font: bold 32px sans-serif; fill: #4C1D95; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .title { fill: #E5E7EB; }
      .welcome-text { fill: #A78BFA; }
    }
  </style>
  <rect width="100%" height="100%" rx="15" class="bg" />
  <text x="50%" y="80" text-anchor="middle" class="welcome-text">탈레즈에 오신 것을 환영합니다!</text>
  <g transform="translate(300, 220)">
    <path d="M-60,-60 C-50,-80 50,-80 60,-60 L60,0 C50,20 -50,20 -60,0 Z" class="pet" />
    <circle cx="-25" cy="-35" r="8" fill="white" />
    <circle cx="25" cy="-35" r="8" fill="white" />
    <circle cx="-25" cy="-35" r="3" fill="black" />
    <circle cx="25" cy="-35" r="3" fill="black" />
    <path d="M0,-15 C10,-10 10,0 0,5 C-10,0 -10,-10 0,-15" fill="black" />
    <path d="M-70,10 C-60,30 -40,30 -30,10 C-40,5 -60,5 -70,10" class="paw" />
    <path d="M30,10 C40,30 60,30 70,10 C60,5 40,5 30,10" class="paw" />
  </g>
</svg>
`;

// 대시보드 이미지
const dashboardSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .card { fill: white; stroke: #E5E7EB; }
    .card-title { font: bold 14px sans-serif; fill: #374151; }
    .chart-bar { fill: #8B5CF6; }
    .nav { fill: #4C1D95; }
    .icon { fill: #A78BFA; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .card { fill: #374151; stroke: #4B5563; }
      .card-title { fill: #E5E7EB; }
    }
  </style>
  <rect width="100%" height="100%" class="bg" />
  <rect x="0" y="0" width="150" height="400" class="nav" />
  <rect x="170" y="20" width="200" height="150" rx="5" class="card" />
  <text x="180" y="40" class="card-title">반려견 정보</text>
  <circle cx="220" cy="90" r="30" class="icon" />
  <rect x="390" y="20" width="190" height="150" rx="5" class="card" />
  <text x="400" y="40" class="card-title">예정된 수업</text>
  <rect x="410" y="60" width="150" height="20" rx="3" fill="#E5E7EB" />
  <rect x="410" y="90" width="150" height="20" rx="3" fill="#E5E7EB" />
  <rect x="410" y="120" width="150" height="20" rx="3" fill="#E5E7EB" />
  <rect x="170" y="190" width="410" height="180" rx="5" class="card" />
  <text x="180" y="210" class="card-title">훈련 진행 상황</text>
  <rect x="190" y="240" width="40" height="100" class="chart-bar" />
  <rect x="250" y="270" width="40" height="70" class="chart-bar" />
  <rect x="310" y="220" width="40" height="120" class="chart-bar" />
  <rect x="370" y="290" width="40" height="50" class="chart-bar" />
  <rect x="430" y="260" width="40" height="80" class="chart-bar" />
  <rect x="490" y="230" width="40" height="110" class="chart-bar" />
</svg>
`;

// 영상 훈련 이미지
const videoTrainingSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .video-bg { fill: #1F2937; }
    .card { fill: white; stroke: #E5E7EB; }
    .play { fill: #8B5CF6; }
    .progress { fill: #A78BFA; }
    .text { font: 14px sans-serif; fill: #374151; }
    .title { font: bold 16px sans-serif; fill: #111827; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .card { fill: #374151; stroke: #4B5563; }
      .text { fill: #E5E7EB; }
      .title { fill: #F9FAFB; }
    }
  </style>
  <rect width="100%" height="100%" class="bg" />
  <rect x="50" y="50" width="500" height="280" rx="5" class="card" />
  <rect x="70" y="80" width="300" height="200" rx="5" class="video-bg" />
  <circle cx="220" cy="180" r="30" class="play" />
  <path d="M210,165 L240,180 L210,195 Z" fill="white" />
  <rect x="70" y="290" width="300" height="10" rx="5" fill="#E5E7EB" />
  <rect x="70" y="290" width="120" height="10" rx="5" class="progress" />
  <rect x="390" y="80" width="140" height="30" rx="5" fill="#E5E7EB" />
  <text x="420" y="100" text-anchor="middle" class="text">다음 레슨</text>
  <rect x="390" y="120" width="140" height="30" rx="5" fill="#E5E7EB" />
  <text x="420" y="140" text-anchor="middle" class="text">챕터 목록</text>
  <rect x="390" y="160" width="140" height="30" rx="5" fill="#E5E7EB" />
  <text x="420" y="180" text-anchor="middle" class="text">메모하기</text>
  <text x="70" y="70" class="title">기본 복종 훈련 - 1단계</text>
</svg>
`;

// 화상 훈련 이미지
const videoCallSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .card { fill: white; stroke: #E5E7EB; }
    .video-bg { fill: #1F2937; }
    .user-video { fill: #4C1D95; }
    .button { fill: #8B5CF6; }
    .text { font: 14px sans-serif; fill: #374151; }
    .title { font: bold 16px sans-serif; fill: #111827; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .card { fill: #374151; stroke: #4B5563; }
      .text { fill: #E5E7EB; }
      .title { fill: #F9FAFB; }
    }
  </style>
  <rect width="100%" height="100%" class="bg" />
  <rect x="50" y="50" width="500" height="280" rx="5" class="card" />
  <text x="300" y="30" text-anchor="middle" class="title">화상 훈련 수업</text>
  <rect x="70" y="80" width="320" height="180" rx="5" class="video-bg" />
  <rect x="410" y="80" width="120" height="90" rx="5" class="user-video" />
  <circle cx="470" cy="125" r="25" fill="#E5E7EB" />
  <circle cx="470" cy="110" r="10" fill="#A78BFA" />
  <rect x="455" cy="120" width="30" height="20" rx="10" fill="#A78BFA" />
  <rect x="70" y="270" width="80" height="30" rx="5" class="button" />
  <text x="110" y="290" text-anchor="middle" fill="white">음소거</text>
  <rect x="160" y="270" width="80" height="30" rx="5" class="button" />
  <text x="200" y="290" text-anchor="middle" fill="white">비디오</text>
  <rect x="250" y="270" width="80" height="30" rx="5" class="button" />
  <text x="290" y="290" text-anchor="middle" fill="white">채팅</text>
  <rect x="340" y="270" width="80" height="30" rx="5" class="button" />
  <text x="380" y="290" text-anchor="middle" fill="white">화면공유</text>
  <rect x="430" y="270" width="80" height="30" rx="5" fill="#EF4444" />
  <text x="470" y="290" text-anchor="middle" fill="white">종료</text>
</svg>
`;

// 알림장 이미지
const notebookSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .card { fill: white; stroke: #E5E7EB; }
    .sidebar { fill: #EDE9FE; }
    .selected { fill: #8B5CF6; }
    .text { font: 14px sans-serif; fill: #374151; }
    .title { font: bold 16px sans-serif; fill: #111827; }
    .content { font: 14px sans-serif; fill: #4B5563; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .card { fill: #374151; stroke: #4B5563; }
      .sidebar { fill: #4C1D95; }
      .text { fill: #E5E7EB; }
      .title { fill: #F9FAFB; }
      .content { fill: #D1D5DB; }
    }
  </style>
  <rect width="100%" height="400" class="bg" />
  <rect x="50" y="50" width="500" height="300" rx="5" class="card" />
  <rect x="50" y="50" width="150" height="300" rx="5" class="sidebar" />
  <rect x="60" y="90" width="130" height="40" rx="5" class="selected" />
  <text x="125" y="115" text-anchor="middle" fill="white">오늘의 훈련</text>
  <rect x="60" y="140" width="130" height="40" rx="5" fill="transparent" />
  <text x="125" y="165" text-anchor="middle" class="text">지난 기록</text>
  <rect x="60" y="190" width="130" height="40" rx="5" fill="transparent" />
  <text x="125" y="215" text-anchor="middle" class="text">훈련 계획</text>
  <text x="220" y="80" class="title">오늘의 훈련 기록</text>
  <text x="220" y="110" class="content">날짜: 2025년 5월 24일</text>
  <text x="220" y="140" class="content">훈련사: 김훈련</text>
  <text x="220" y="170" class="title">오늘 배운 내용</text>
  <text x="220" y="200" class="content">기본 앉기/엎드리기 명령에 대한 반응이 크게</text>
  <text x="220" y="220" class="content">향상되었습니다. 특히 주의산만한 환경에서도</text>
  <text x="220" y="240" class="content">집중력을 유지하는 모습이 인상적이었습니다.</text>
  <text x="220" y="280" class="title">다음 훈련 계획</text>
  <text x="220" y="310" class="content">산책 중 다른 개를 만났을 때 차분히 있기 연습</text>
</svg>
`;

// 위치 기반 서비스 이미지
const locationsSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .card { fill: white; stroke: #E5E7EB; }
    .map { fill: #D1D5DB; }
    .marker { fill: #8B5CF6; }
    .filter { fill: #EDE9FE; }
    .text { font: 14px sans-serif; fill: #374151; }
    .title { font: bold 16px sans-serif; fill: #111827; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .card { fill: #374151; stroke: #4B5563; }
      .map { fill: #4B5563; }
      .text { fill: #E5E7EB; }
      .title { fill: #F9FAFB; }
      .filter { fill: #4C1D95; }
    }
  </style>
  <rect width="100%" height="100%" class="bg" />
  <rect x="50" y="50" width="500" height="300" rx="5" class="card" />
  <rect x="50" y="90" width="500" height="260" class="map" />
  <circle cx="200" cy="180" r="15" class="marker" />
  <path d="M200,165 L200,195 M185,180 L215,180" stroke="white" stroke-width="3" />
  <circle cx="300" cy="150" r="10" class="marker" />
  <path d="M300,140 L300,160 M290,150 L310,150" stroke="white" stroke-width="2" />
  <circle cx="390" cy="220" r="10" class="marker" />
  <path d="M390,210 L390,230 M380,220 L400,220" stroke="white" stroke-width="2" />
  <rect x="50" y="50" width="500" height="40" fill="white" />
  <text x="70" y="75" class="title">반려견 친화 장소</text>
  <rect x="350" y="55" width="80" height="30" rx="15" class="filter" />
  <text x="390" y="75" text-anchor="middle" class="text">카페</text>
  <rect x="440" y="55" width="80" height="30" rx="15" class="filter" />
  <text x="480" y="75" text-anchor="middle" class="text">공원</text>
</svg>
`;

// 완료 이미지
const completeSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .circle { fill: #8B5CF6; }
    .check { stroke: white; stroke-width: 8; }
    .text { font: bold 32px sans-serif; fill: #4C1D95; }
    .subtext { font: 20px sans-serif; fill: #6B7280; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .text { fill: #A78BFA; }
      .subtext { fill: #E5E7EB; }
    }
  </style>
  <rect width="100%" height="100%" class="bg" />
  <circle cx="300" cy="160" r="80" class="circle" />
  <path d="M260,160 L290,190 L340,140" class="check" fill="none" />
  <text x="300" y="280" text-anchor="middle" class="text">준비 완료!</text>
  <text x="300" y="320" text-anchor="middle" class="subtext">이제 탈레즈와 함께 반려견 훈련을 시작하세요</text>
</svg>
`;

// 훈련사 환영 이미지
const trainerWelcomeSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .title { font: bold 28px sans-serif; fill: #4C1D95; }
    .icon { fill: #8B5CF6; }
    .text { font: 18px sans-serif; fill: #6B7280; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .title { fill: #A78BFA; }
      .text { fill: #E5E7EB; }
    }
  </style>
  <rect width="100%" height="100%" rx="15" class="bg" />
  <text x="300" y="100" text-anchor="middle" class="title">훈련사님, 환영합니다!</text>
  <circle cx="300" cy="200" r="60" class="icon" />
  <path d="M270,180 C270,170 330,170 330,180 L330,220 C330,230 270,230 270,220 Z" fill="white" />
  <circle cx="285" cy="190" r="5" fill="black" />
  <circle cx="315" cy="190" r="5" fill="black" />
  <path d="M290,210 C300,215 310,215 320,210" stroke="black" stroke-width="2" fill="none" />
  <text x="300" y="300" text-anchor="middle" class="text">탈레즈에서 전문 지식을 공유하고</text>
  <text x="300" y="330" text-anchor="middle" class="text">반려인들과 함께 성장하세요</text>
</svg>
`;

// 관리자 환영 이미지
const adminWelcomeSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #F3F4F6; }
    .title { font: bold 28px sans-serif; fill: #4C1D95; }
    .panel { fill: white; stroke: #E5E7EB; }
    .accent { fill: #8B5CF6; }
    .text { font: 18px sans-serif; fill: #6B7280; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1F2937; }
      .panel { fill: #374151; stroke: #4B5563; }
      .title { fill: #A78BFA; }
      .text { fill: #E5E7EB; }
    }
  </style>
  <rect width="100%" height="100%" rx="15" class="bg" />
  <text x="300" y="80" text-anchor="middle" class="title">관리자님, 환영합니다!</text>
  <rect x="150" y="120" width="300" height="180" rx="10" class="panel" />
  <rect x="170" y="150" width="120" height="40" rx="5" class="accent" />
  <rect x="170" y="200" width="80" height="40" rx="5" class="accent" />
  <rect x="170" y="250" width="150" height="20" rx="5" class="accent" />
  <rect x="310" y="150" width="120" height="120" rx="5" class="accent" />
  <text x="300" y="330" text-anchor="middle" class="text">탈레즈 관리 시스템에 오신 것을 환영합니다</text>
</svg>
`;

// 스크립트 실행 시 이미지 파일 생성 (이 코드는 서버사이드에서 실행되어야 함)
// 실제 구현에서는 fs 모듈을 사용하여 파일로 저장하는 로직이 필요합니다.
console.log('SVG 이미지가 생성되었습니다.');