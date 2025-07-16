import fetch from 'node-fetch';

// 반려동물 재활 커리큘럼 데이터
const rehabilitationCurriculum = {
  title: "반려동물 재활 치료 전문 과정",
  description: "수술 후 회복, 관절염, 신경계 질환 등 다양한 재활 치료가 필요한 반려동물을 위한 전문 교육과정입니다. 물리치료, 운동요법, 마사지 등 체계적인 재활 치료 방법을 배웁니다.",
  trainerId: 1,
  trainerName: "강동훈",
  trainerEmail: "donghooon@example.com",
  trainerPhone: "010-1234-5678",
  category: "재활 치료",
  difficulty: "advanced",
  duration: 12,
  price: 580000,
  modules: [
    {
      title: "재활 치료 기초 이론",
      description: "반려동물 재활 치료의 기본 원리와 해부학적 기초",
      order: 1,
      duration: 120,
      objectives: ["해부학적 구조 이해", "재활 치료 원리 파악", "평가 방법 습득"],
      content: "재활 치료의 기본 개념, 근골격계 해부학, 신경계 구조 및 기능, 재활 평가 방법론",
      detailedContent: {
        introduction: "반려동물 재활 치료의 과학적 접근법과 기본 원리를 학습합니다.",
        mainTopics: [
          "근골격계 해부학 및 생리학",
          "신경계 구조와 기능",
          "재활 평가 도구 및 방법",
          "치료 계획 수립 원칙"
        ],
        practicalExercises: [
          "해부학적 구조 식별 실습",
          "기본 평가 기법 연습",
          "치료 계획 작성 실습"
        ],
        keyPoints: [
          "정확한 해부학적 지식의 중요성",
          "개별 맞춤형 치료 계획의 필요성",
          "지속적인 평가와 조정의 중요성"
        ],
        homework: "반려동물 케이스 스터디 분석 및 초기 평가 보고서 작성",
        resources: [
          "재활 치료 해부학 교재",
          "평가 도구 체크리스트",
          "케이스 스터디 자료집"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 48000
    },
    {
      title: "수술 후 재활 프로그램",
      description: "수술 후 회복을 위한 단계별 재활 치료 프로그램",
      order: 2,
      duration: 150,
      objectives: ["수술 후 회복 과정 이해", "단계별 치료법 습득", "합병증 예방법 학습"],
      content: "수술 후 회복 단계, 조기 재활의 중요성, 단계별 운동 요법, 통증 관리",
      detailedContent: {
        introduction: "수술 후 최적의 회복을 위한 체계적인 재활 프로그램을 학습합니다.",
        mainTopics: [
          "수술 후 회복 단계별 특성",
          "조기 재활의 중요성과 효과",
          "단계별 운동 요법 프로그램",
          "통증 관리 및 모니터링"
        ],
        practicalExercises: [
          "수술 후 평가 실습",
          "단계별 운동 요법 시연",
          "통증 평가 및 관리 실습"
        ],
        keyPoints: [
          "조기 재활의 중요성",
          "개별 맞춤형 프로그램 설계",
          "지속적인 모니터링의 필요성"
        ],
        homework: "수술 후 재활 프로그램 설계 과제",
        resources: [
          "수술 후 재활 가이드라인",
          "운동 요법 프로토콜",
          "통증 평가 도구"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 58000
    },
    {
      title: "관절염 및 퇴행성 질환 관리",
      description: "관절염과 퇴행성 질환을 가진 반려동물의 재활 치료",
      order: 3,
      duration: 140,
      objectives: ["관절염 병리 이해", "관리 방법 습득", "생활 개선 방안 학습"],
      content: "관절염의 종류와 병리, 보존적 치료법, 운동 요법, 생활 환경 개선",
      detailedContent: {
        introduction: "관절염 및 퇴행성 질환의 특성을 이해하고 효과적인 관리 방법을 학습합니다.",
        mainTopics: [
          "관절염의 종류와 병리학적 특성",
          "보존적 치료법의 종류와 적용",
          "관절염 전용 운동 요법",
          "생활 환경 개선 방안"
        ],
        practicalExercises: [
          "관절염 진단 및 평가 실습",
          "치료적 운동 시연",
          "생활 환경 개선 계획 수립"
        ],
        keyPoints: [
          "조기 진단의 중요성",
          "지속적인 관리의 필요성",
          "생활 질 향상을 위한 종합적 접근"
        ],
        homework: "관절염 관리 프로그램 설계 및 케이스 스터디",
        resources: [
          "관절염 관리 가이드",
          "운동 요법 매뉴얼",
          "생활 환경 개선 체크리스트"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 56000
    },
    {
      title: "신경계 질환 재활",
      description: "신경계 질환을 가진 반려동물의 전문 재활 치료",
      order: 4,
      duration: 160,
      objectives: ["신경계 질환 이해", "재활 기법 습득", "기능 회복 방법 학습"],
      content: "신경계 질환의 종류, 신경 재활의 원리, 기능 회복 훈련, 보조 기구 활용",
      detailedContent: {
        introduction: "신경계 질환의 특성을 이해하고 전문적인 재활 치료 방법을 학습합니다.",
        mainTopics: [
          "신경계 질환의 종류와 특성",
          "신경 재활의 기본 원리",
          "기능 회복 훈련 방법",
          "보조 기구 및 장비 활용"
        ],
        practicalExercises: [
          "신경계 평가 실습",
          "기능 회복 훈련 시연",
          "보조 기구 사용법 실습"
        ],
        keyPoints: [
          "신경 가소성의 이해",
          "점진적 훈련의 중요성",
          "환자 및 보호자 교육의 필요성"
        ],
        homework: "신경계 질환 재활 프로그램 설계",
        resources: [
          "신경계 질환 재활 매뉴얼",
          "기능 평가 도구",
          "보조 기구 카탈로그"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 64000
    },
    {
      title: "물리치료 기법",
      description: "다양한 물리치료 기법과 장비 활용법",
      order: 5,
      duration: 180,
      objectives: ["물리치료 원리 이해", "기법별 적용법 습득", "장비 활용 능력 향상"],
      content: "물리치료의 원리, 열치료, 냉치료, 전기치료, 초음파 치료, 레이저 치료",
      detailedContent: {
        introduction: "반려동물 재활에 사용되는 다양한 물리치료 기법과 장비 활용법을 학습합니다.",
        mainTopics: [
          "물리치료의 기본 원리",
          "열치료 및 냉치료 적용법",
          "전기치료 및 초음파 치료",
          "레이저 치료 및 자기장 치료"
        ],
        practicalExercises: [
          "물리치료 장비 사용 실습",
          "치료 프로토콜 적용 연습",
          "안전 수칙 및 주의사항 실습"
        ],
        keyPoints: [
          "적절한 치료 방법 선택",
          "안전한 장비 사용",
          "치료 효과 모니터링"
        ],
        homework: "물리치료 프로토콜 작성 및 케이스 적용",
        resources: [
          "물리치료 장비 매뉴얼",
          "치료 프로토콜 가이드",
          "안전 수칙 체크리스트"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 72000
    },
    {
      title: "운동 치료 및 마사지",
      description: "치료적 운동과 마사지 기법",
      order: 6,
      duration: 170,
      objectives: ["운동 치료 원리 이해", "마사지 기법 습득", "프로그램 설계 능력 향상"],
      content: "치료적 운동의 원리, 관절 가동 범위 운동, 근력 강화 운동, 마사지 기법",
      detailedContent: {
        introduction: "재활 치료에 필수적인 운동 치료와 마사지 기법을 전문적으로 학습합니다.",
        mainTopics: [
          "치료적 운동의 원리와 효과",
          "관절 가동 범위 운동 기법",
          "근력 강화 및 지구력 향상 운동",
          "치료적 마사지 기법"
        ],
        practicalExercises: [
          "운동 치료 시연 및 실습",
          "마사지 기법 연습",
          "개별 운동 프로그램 설계"
        ],
        keyPoints: [
          "안전한 운동 범위 설정",
          "점진적 운동 강도 증가",
          "환자 상태에 따른 조정"
        ],
        homework: "맞춤형 운동 치료 프로그램 개발",
        resources: [
          "운동 치료 가이드북",
          "마사지 기법 매뉴얼",
          "운동 프로그램 템플릿"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 68000
    },
    {
      title: "수중 재활 치료",
      description: "수중 환경을 이용한 재활 치료법",
      order: 7,
      duration: 130,
      objectives: ["수중 재활 원리 이해", "수중 운동법 습득", "안전 관리 능력 향상"],
      content: "수중 재활의 장점, 수중 운동 프로그램, 안전 관리, 장비 및 시설",
      detailedContent: {
        introduction: "수중 환경의 특성을 활용한 효과적인 재활 치료 방법을 학습합니다.",
        mainTopics: [
          "수중 재활의 과학적 원리",
          "수중 운동 프로그램 설계",
          "안전 관리 및 응급 처치",
          "수중 재활 시설 및 장비"
        ],
        practicalExercises: [
          "수중 운동 프로그램 실습",
          "안전 관리 시뮬레이션",
          "응급 상황 대처 훈련"
        ],
        keyPoints: [
          "수중 환경의 치료적 효과",
          "안전한 수중 활동 관리",
          "개별 맞춤형 프로그램 설계"
        ],
        homework: "수중 재활 프로그램 설계 및 안전 계획 수립",
        resources: [
          "수중 재활 가이드",
          "안전 관리 매뉴얼",
          "응급 처치 프로토콜"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 52000
    },
    {
      title: "영양 및 생활 관리",
      description: "재활 치료를 위한 영양 관리와 생활 환경 개선",
      order: 8,
      duration: 100,
      objectives: ["영양 관리 원리 이해", "생활 환경 개선 방법 습득", "종합 관리 능력 향상"],
      content: "재활 영양학, 체중 관리, 생활 환경 개선, 보호자 교육",
      detailedContent: {
        introduction: "재활 치료 효과를 극대화하기 위한 영양 관리와 생활 환경 개선을 학습합니다.",
        mainTopics: [
          "재활 시기별 영양 관리",
          "체중 관리 및 식이 조절",
          "생활 환경 개선 방안",
          "보호자 교육 및 상담"
        ],
        practicalExercises: [
          "영양 평가 및 계획 수립",
          "생활 환경 개선 계획 작성",
          "보호자 교육 시뮬레이션"
        ],
        keyPoints: [
          "영양과 재활의 상관관계",
          "환경 개선의 중요성",
          "보호자 참여의 필요성"
        ],
        homework: "종합 관리 계획 수립 및 보호자 교육 자료 제작",
        resources: [
          "재활 영양학 가이드",
          "생활 환경 개선 체크리스트",
          "보호자 교육 자료"
        ]
      },
      videos: [],
      isRequired: true,
      isFree: false,
      price: 40000
    }
  ],
  revenueShare: {
    trainerShare: 75,
    platformShare: 25
  },
  totalRevenue: 0,
  enrollmentCount: 0,
  status: "published"
};

async function registerCurriculum() {
  try {
    console.log('커리큘럼 등록 시작...');
    
    const response = await fetch('http://localhost:5000/api/admin/curriculum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'connect.sid=s%3AadminSessionId.adminSessionSignature' // 관리자 세션 시뮬레이션
      },
      body: JSON.stringify(rehabilitationCurriculum)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('커리큘럼 등록 성공:', result);
    
    return result;
  } catch (error) {
    console.error('커리큘럼 등록 실패:', error);
    throw error;
  }
}

// 실행
registerCurriculum()
  .then(result => {
    console.log('✅ 반려동물 재활 커리큘럼이 성공적으로 등록되었습니다!');
    console.log('등록된 커리큘럼 ID:', result.id);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 커리큘럼 등록 중 오류 발생:', error.message);
    process.exit(1);
  });