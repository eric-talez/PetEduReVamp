import { Express } from 'express';

export function setupSocialRoutes(app: Express) {
  // 메모리 저장소 (임시 데이터)
  const posts: any[] = [
    {
      id: 1,
      title: "교통사고로 반려견 사망, 위자료 받을 수 있을까",
      content: "미국 뉴욕 법원이 교통사고로 사망한 반려견에 대해 직계 가족으로 인정하고 정신적 손해배상을 허용하는 판결을 내렸습니다. 이는 반려동물을 가족으로 인정한 세계 최초의 판결입니다.\n\n2023년 7월 뉴욕의 한 횡단보도에서 60대 여성이 아들의 반려견인 4살 닥스훈트 듀크를 데리고 횡단보도를 건너다가 신호위반 차량에 치이는 사고가 발생했습니다. 보호자는 목숨을 건졌지만 듀크는 사망했습니다.\n\n재판부는 반려견이 직계가족에 준하지 않는다고 판단할 이유가 없다며 정신적 손해배상을 인정했습니다. 국내에서도 반려동물을 단순 물건 이상의 특수한 존재로 해석하는 추세이며, 정신적 피해에 대한 위자료가 지급되고 있습니다.",
      tag: "법률정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001789117",
        title: "교통사고로 반려견 사망, 위자료 받을 수 있을까 [개st상식]",
        description: "미국 뉴욕 법원이 반려견을 직계가족으로 인정하고 정신적 손해배상을 허용하는 세계 최초의 판결을 내렸습니다.",
        image: "https://imgnews.pstatic.net/image/005/2025/07/11/2025071014155756297_1752124557_0028378891_20250711071509635.jpg?type=w860"
      }
    },
    {
      id: 2,
      title: "산책·물놀이·캠핑까지…반려동물과 가볼 여름 휴가지 6곳",
      content: "여름 휴가철을 맞아 반려동물과 함께 갈 수 있는 여행지들을 소개합니다. 반려동물 동반 가능한 펜션부터 애견 전용 해수욕장까지, 다양한 휴가지 옵션을 제공합니다.\n\n1. 애견 전용 해수욕장 - 자유로운 물놀이 가능\n2. 반려동물 동반 펜션 - 가족 모두가 편안한 숙박\n3. 애견 동반 캠핑장 - 자연 속에서 함께하는 시간\n4. 반려동물 카페 - 휴식과 만남의 공간\n5. 애견 테마파크 - 다양한 체험 프로그램\n6. 반려동물 동반 관광지 - 함께 둘러보는 명소\n\n여행 전 필수 준비사항과 주의사항도 함께 확인하세요.",
      tag: "여행정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001788313",
        title: "산책·물놀이·캠핑까지…반려동물과 가볼 여름 휴가지 6곳 [개st상식]",
        description: "반려동물과 함께 즐길 수 있는 여름 휴가지 6곳을 소개합니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/08/1788313.jpg?type=nf600_360"
      }
    },
    {
      id: 3,
      title: "8월부터 동물병원 진료비 게시 의무화",
      content: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다. 이는 반려인들의 부담을 줄이고 진료비 투명성을 높이기 위한 조치입니다.\n\n새로운 규정에 따르면 동물병원은 주요 진료항목별 비용을 병원 내 잘 보이는 곳에 게시해야 합니다. 또한 홈페이지나 전화 문의 시에도 진료비 정보를 제공해야 합니다.\n\n주요 게시 항목:\n- 기본 진료비 (진찰료)\n- 예방접종 비용\n- 중성화 수술비\n- 응급진료비\n- 입원비\n- 각종 검사비\n\n이번 조치로 반려인들이 동물병원 선택 시 진료비를 미리 비교해볼 수 있게 되어 경제적 부담을 줄일 수 있을 것으로 기대됩니다.",
      tag: "의료정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001786736",
        title: "가격 보고 예약하세요…8월부터 동물병원 진료비 게시 [개st상식]",
        description: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/01/1786736.jpg?type=nf212_140"
      }
    },
    {
      id: 4,
      title: "7월부터 과태료 100만원…반려동물 이것 챙기세요",
      content: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다. 반려동물 등록은 의무사항이며, 미등록 시 처벌을 받을 수 있습니다.\n\n반려동물 등록 의무화 주요 내용:\n\n✅ 등록 대상: 생후 2개월 이상 개, 고양이\n✅ 등록 시기: 반려동물을 기르기 시작한 날부터 30일 이내\n✅ 등록 방법: 동물병원, 시·군·구청, 온라인 등\n✅ 등록비: 1만원 내외 (지자체별 차이)\n✅ 필요 서류: 신분증, 예방접종 증명서\n\n등록을 하지 않으면 최대 100만원의 과태료가 부과되며, 변경신고를 하지 않으면 50만원의 과태료가 부과됩니다. 반려동물 등록은 유실·유기 시 찾을 수 있는 중요한 수단이므로 꼭 등록하시기 바랍니다.",
      tag: "법률정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001785000",
        title: "7월부터 과태료 100만원…반려동물 이것 챙기세요 [개st상식]",
        description: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/06/23/1785000.jpg?type=nf212_140"
      }
    },
    {
      id: 5,
      title: "서류 조작해 2개월 강아지를 해외입양 보낸 동물단체",
      content: "국내 동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다. 이는 동물보호법과 국제입양 규정을 위반한 심각한 사안입니다.\n\n동물보호단체 A는 생후 2개월 된 강아지의 나이를 3개월로 조작하여 해외입양을 진행했습니다. 국제입양 규정에 따르면 강아지는 최소 3개월 이상이어야 해외입양이 가능합니다.\n\n전문가들은 이런 조기 분리가 강아지의 건강과 행동발달에 심각한 영향을 미칠 수 있다고 경고하고 있습니다. 특히 면역체계가 완전히 발달하지 않은 상태에서의 장거리 이동은 매우 위험할 수 있습니다.\n\n관련 당국은 해당 단체에 대한 조사를 시작했으며, 동물보호법 위반 혐의로 처벌받을 것으로 예상됩니다.",
      tag: "동물보호",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001787697",
        title: "서류 조작해 2개월 강아지를 해외입양 보낸 동물단체 [개st하우스]",
        description: "동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/05/1787697.jpg?type=nf600_360"
      }
    },
    {
      id: 6,
      title: "반려견 털 빠짐 줄이는 여름 관리법 7가지",
      content: "여름철 반려견 털 빠짐이 심해지는 계절, 효과적인 관리 방법을 알아보세요. 올바른 브러싱 방법부터 영양 관리까지 전문가가 제안하는 해결책을 소개합니다.\n\n🐕 여름 털 빠짐 관리법:\n1. 매일 브러싱으로 죽은 털 제거\n2. 오메가3 보충제로 모질 개선\n3. 적절한 목욕 주기 유지 (주 1-2회)\n4. 스트레스 관리로 과도한 털 빠짐 방지\n5. 수분 섭취량 늘리기\n6. 에어컨 온도 적절히 유지\n7. 정기적인 건강검진으로 피부질환 예방\n\n털 빠짐이 갑자기 심해진다면 피부질환이나 알레르기를 의심해보고 수의사와 상담하는 것이 좋습니다.",
      tag: "건강관리",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 15,
      comments: 8,
      views: 234,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001789200",
        title: "반려견 털 빠짐 줄이는 여름 관리법 7가지 [개st상식]",
        description: "여름철 반려견 털 빠짐 관리를 위한 전문가 조언을 확인하세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/10/1789200.jpg?type=nf212_140"
      }
    },
    {
      id: 7,
      title: "강아지 산책 시 주의할 여름철 화상 위험",
      content: "여름철 뜨거운 아스팔트로 인한 반려견 발바닥 화상 사고가 급증하고 있습니다. 간단한 체크법으로 안전한 산책을 확인하는 방법을 알아보세요.\n\n🌡️ 안전한 산책 시간:\n- 오전 7시 이전\n- 오후 7시 이후\n- 그늘진 곳 위주로 산책\n\n✋ 간단한 체크법:\n손등을 아스팔트에 5초간 대보기\n뜨겁다면 반려견에게도 위험\n\n🩹 응급처치법:\n1. 즉시 찬물로 발가락 사이까지 세척\n2. 얼음찜질 금지 (추가 손상 위험)\n3. 깨끗한 수건으로 감싸기\n4. 즉시 동물병원 방문\n\n여름철에는 잔디밭이나 흙길 위주로 산책하고, 발가락 사이사이까지 꼼꼼히 확인하는 것이 중요합니다.",
      tag: "건강관리",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 28,
      comments: 12,
      views: 456,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001788950",
        title: "강아지 산책 시 주의할 여름철 화상 위험 [개st상식]",
        description: "여름철 뜨거운 아스팔트로 인한 반려견 발바닥 화상을 예방하는 방법을 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/09/1788950.jpg?type=nf212_140"
      }
    },
    {
      id: 8,
      title: "반려견 분리불안 해결하는 단계별 훈련법",
      content: "코로나19 이후 재택근무 감소로 반려견 분리불안이 증가하고 있습니다. 체계적인 훈련을 통해 건강한 독립성을 기를 수 있는 방법을 전문 트레이너가 알려드립니다.\n\n📝 단계별 훈련법:\n\n1단계: 짧은 시간 떨어지기 (5-10분)\n- 화장실 가기, 쓰레기 버리기 등\n- 나가기 전 특별한 인사 금지\n- 돌아와서도 과도한 반응 자제\n\n2단계: 시간 점진적 늘리기 (30분-1시간)\n- 좋아하는 간식이나 장난감 제공\n- 안전한 공간에서 혼자 시간 보내기\n\n3단계: 장시간 적응 (2-4시간)\n- 규칙적인 일과 만들기\n- 충분한 운동 후 휴식시간 활용\n\n🚨 주의사항:\n- 벌주기보다는 긍정적 강화\n- 인내심을 갖고 꾸준히 훈련\n- 심한 경우 전문가 상담 필요",
      tag: "훈련팁",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 34,
      comments: 15,
      views: 678,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001788456",
        title: "반려견 분리불안 해결하는 단계별 훈련법 [개st상식]",
        description: "재택근무 감소로 늘어나는 반려견 분리불안을 해결하는 체계적인 방법을 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/08/1788456.jpg?type=nf212_140"
      }
    },
    {
      id: 9,
      title: "반려견 응급상황 대처법 - 꼭 알아야 할 5가지",
      content: "반려견 응급상황은 언제든 발생할 수 있습니다. 골든타임을 놓치지 않기 위해 보호자가 꼭 알아야 할 기본 응급처치법을 정리했습니다.\n\n🚨 5가지 주요 응급상황:\n\n1️⃣ 질식 상황\n- 입 벌리고 이물질 확인\n- 안 보이면 하임리히법 적용\n- 소형견: 뒤집어서 등 두드리기\n- 대형견: 뒷다리 들고 복부 압박\n\n2️⃣ 중독 상황\n- 토하게 하지 말고 즉시 병원 이송\n- 섭취한 물질 확인하여 의료진에게 알리기\n\n3️⃣ 외상 출혈\n- 깨끗한 수건으로 직접 압박\n- 지혈대 사용은 전문가만\n\n4️⃣ 열사병\n- 그늘진 곳으로 이동\n- 미지근한 물로 몸 적시기\n- 얼음 사용 금지\n\n5️⃣ 경련 발작\n- 주변 위험물 제거\n- 혀 잡지 말고 시간 재기\n- 5분 이상 지속시 응급실 이송\n\n📞 24시간 응급동물병원 번호를 휴대폰에 저장해두세요.",
      tag: "응급처치",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 89,
      comments: 23,
      views: 1234,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001787888",
        title: "반려견 응급상황 대처법 - 꼭 알아야 할 5가지 [개st상식]",
        description: "골든타임을 놓치지 않기 위한 반려견 응급처치 필수 가이드입니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/07/1787888.jpg?type=nf212_140"
      }
    },
    {
      id: 10,
      title: "강아지 사회화 훈련, 언제 시작하는 것이 좋을까?",
      content: "반려견의 평생 성격을 좌우하는 사회화 훈련의 최적 시기와 방법을 알아보세요. 전문가들이 권하는 단계별 사회화 프로그램을 소개합니다.\n\n📅 사회화 훈련 시기:\n\n🐶 초기 사회화 (생후 3-14주)\n- 가장 중요한 시기\n- 새로운 경험에 대한 두려움 적음\n- 다양한 소리, 냄새, 질감에 노출\n\n🎯 사회화 훈련 방법:\n\n1. 사람과의 사회화\n- 다양한 연령대의 사람들과 만나기\n- 어린이, 어른, 노인 모두 포함\n- 유니폼 입은 사람들과도 만나기\n\n2. 다른 동물과의 사회화\n- 성격 좋은 성견들과 만나기\n- 고양이 등 다른 동물과 만나기\n- 점진적으로 접촉 늘리기\n\n3. 환경 적응\n- 도시 소음 (자동차, 공사 소음)\n- 다양한 바닥 질감 경험\n- 엘리베이터, 계단 등 이용\n\n⚠️ 주의사항:\n- 예방접종 완료 후 외출\n- 강요하지 말고 자연스럽게\n- 무서워하면 즉시 중단\n- 긍정적 경험으로 연결\n\n성견도 사회화 훈련이 가능하지만 더 많은 시간과 인내가 필요합니다.",
      tag: "사회화",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 56,
      comments: 19,
      views: 890,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001787345",
        title: "강아지 사회화 훈련, 언제 시작하는 것이 좋을까? [개st상식]",
        description: "반려견의 평생 성격을 좌우하는 사회화 훈련의 최적 시기와 방법을 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/06/1787345.jpg?type=nf212_140"
      }
    },
    {
      id: 11,
      title: "반려견 비만 예방을 위한 올바른 급식 가이드",
      content: "최근 반려견 비만율이 50%를 넘어서며 심각한 건강 문제로 대두되고 있습니다. 올바른 급식 관리로 건강한 체중을 유지하는 방법을 알아보세요.\n\n⚖️ 적정 체중 확인법:\n\n1. 갈비뼈 만져보기\n- 살짝 눌렀을 때 갈비뼈가 만져져야 함\n- 너무 쉽게 만져지면 저체중\n- 전혀 만져지지 않으면 비만\n\n2. 허리 라인 확인\n- 위에서 봤을 때 허리가 들어가야 함\n- 옆에서 봤을 때 배가 올라가야 함\n\n🍖 올바른 급식 방법:\n\n1. 사료량 계산\n- 현재 체중이 아닌 이상 체중 기준\n- 나이, 활동량, 중성화 여부 고려\n- 수의사와 상담하여 정확한 양 결정\n\n2. 급식 횟수\n- 성견: 하루 2회 나누어 급식\n- 강아지: 하루 3-4회 소량씩\n- 정해진 시간에 규칙적으로\n\n3. 간식 관리\n- 전체 칼로리의 10% 이내\n- 사료량에서 간식량만큼 차감\n- 건강한 간식 선택 (당근, 사과 등)\n\n📊 체중 관리 팁:\n- 주 1회 체중 측정\n- 운동량 늘리기\n- 가족 모두 급식 규칙 공유\n- 정기 건강검진으로 대사 질환 체크\n\n비만은 관절염, 당뇨, 심장병 등 각종 질병의 원인이 됩니다.",
      tag: "건강관리",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 42,
      comments: 14,
      views: 567,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001786998",
        title: "반려견 비만 예방을 위한 올바른 급식 가이드 [개st상식]",
        description: "반려견 비만율 50% 시대, 올바른 급식 관리로 건강한 체중을 유지하는 방법을 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/05/1786998.jpg?type=nf212_140"
      }
    },
    {
      id: 12,
      title: "고양이 스트레스 신호와 해결법 완벽 가이드",
      content: "고양이는 스트레스를 받아도 티를 잘 내지 않는 동물입니다. 미묘한 신호를 놓치지 않고 스트레스를 관리하는 방법을 알아보세요.\n\n😿 고양이 스트레스 신호:\n\n1. 행동 변화\n- 평소보다 숨는 시간이 길어짐\n- 그루밍을 과도하게 하거나 안 함\n- 식욕 저하 또는 폭식\n- 화장실 실수 증가\n\n2. 신체 증상\n- 털 빠짐 증가\n- 구토나 설사\n- 과도한 침 분비\n- 호흡이 빨라짐\n\n🏠 스트레스 원인:\n\n1. 환경 변화\n- 이사, 새로운 가구\n- 새로운 동물이나 사람\n- 소음, 냄새 변화\n\n2. 일상 변화\n- 주인의 스케줄 변화\n- 사료나 화장실 위치 변경\n- 병원 방문\n\n💡 스트레스 해결법:\n\n1. 환경 개선\n- 숨을 수 있는 공간 제공\n- 높은 곳에 쉴 수 있는 공간\n- 페로몬 디퓨저 사용\n- 조용한 환경 유지\n\n2. 놀이와 관심\n- 하루 15-20분 놀이 시간\n- 사냥 본능 자극하는 장난감\n- 규칙적인 관심과 스킨십\n\n3. 점진적 적응\n- 변화를 천천히 단계별로\n- 긍정적 경험과 연결\n- 충분한 적응 시간 제공\n\n스트레스가 지속되면 면역력 저하로 각종 질병에 노출될 수 있으니 주의 깊은 관찰이 필요합니다.",
      tag: "고양이케어",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 37,
      comments: 11,
      views: 445,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001786567",
        title: "고양이 스트레스 신호와 해결법 완벽 가이드 [개st상식]",
        description: "고양이의 미묘한 스트레스 신호를 놓치지 않고 관리하는 방법을 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/04/1786567.jpg?type=nf212_140"
      }
    },
    {
      id: 13,
      title: "반려동물 자연재해 대비 비상용품 체크리스트",
      content: "지진, 태풍, 홍수 등 자연재해 시 반려동물과 함께 대피할 수 있도록 미리 준비해야 할 비상용품을 정리했습니다.\n\n🎒 비상용품 체크리스트:\n\n1. 필수 서류 (방수팩에 보관)\n- 예방접종 증명서\n- 건강기록부\n- 반려동물 등록증\n- 최근 사진 (실종 대비)\n- 보호자 연락처\n\n2. 응급처치 용품\n- 기본 의료용품 (거즈, 소독약)\n- 평소 복용하는 약품\n- 체온계\n- 핀셋\n- 응급처치 매뉴얼\n\n3. 생활 용품\n- 3-5일분 사료 (밀폐용기)\n- 식수 (1일 1L 기준)\n- 식기, 급수기\n- 목줄, 하네스\n- 이동장 (평소 적응 훈련 필요)\n\n4. 위생 용품\n- 배변봉투\n- 패드, 모래\n- 수건, 담요\n- 위생용품\n\n📱 비상연락망:\n- 24시간 응급동물병원\n- 가족, 친구 연락처\n- 반려동물 임시보호소\n- 지역 재해본부\n\n🏠 대피 계획:\n- 반려동물 동반 가능한 대피소 확인\n- 친구, 가족 집 등 임시 거처 마련\n- 대피 경로 미리 확인\n- 정기적인 대피 훈련\n\n평소 이동장에 익숙해지도록 훈련하고, 비상용품은 6개월마다 점검하여 유효기간을 확인하세요.",
      tag: "안전관리",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 23,
      comments: 6,
      views: 312,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001786122",
        title: "반려동물 자연재해 대비 비상용품 체크리스트 [개st상식]",
        description: "자연재해 시 반려동물과 함께 안전하게 대피하기 위한 준비물을 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/03/1786122.jpg?type=nf212_140"
      }
    },
    {
      id: 14,
      title: "반려견 노화 신호 7가지와 시니어 케어 방법",
      content: "반려견도 나이가 들면서 다양한 변화를 겪습니다. 노화 신호를 조기에 발견하고 적절한 케어로 건강한 노년을 보낼 수 있도록 도와주세요.\n\n👴 노화 신호 7가지:\n\n1. 활동량 감소\n- 산책을 싫어하거나 거리가 짧아짐\n- 계단 오르내리기 힘들어함\n- 잠자는 시간 증가\n\n2. 감각 기능 저하\n- 시력 저하 (물체에 부딪힘)\n- 청력 저하 (부름에 반응 없음)\n- 후각 저하 (음식에 관심 감소)\n\n3. 인지 기능 변화\n- 길을 잃거나 헤맴\n- 평소 규칙 잊어버림\n- 불안감 증가\n\n4. 신체 변화\n- 털 색깔 변화 (흰털 증가)\n- 체중 변화\n- 관절 경직\n\n🏥 시니어 케어 방법:\n\n1. 정기 건강검진\n- 6개월마다 종합검진\n- 혈액검사로 장기 기능 체크\n- 치과 검진 (구강 건강 중요)\n\n2. 식사 관리\n- 시니어 전용 사료 급여\n- 소화 잘되는 음식 선택\n- 적정 체중 유지\n- 충분한 수분 섭취\n\n3. 운동 조절\n- 저강도 운동 (수영, 짧은 산책)\n- 관절에 무리 가지 않게\n- 규칙적인 운동 유지\n\n4. 환경 개선\n- 미끄럽지 않은 바닥\n- 쉽게 접근할 수 있는 식기\n- 따뜻하고 푹신한 잠자리\n- 계단 대신 경사로\n\n5. 정신 건강\n- 새로운 자극 제공\n- 충분한 관심과 사랑\n- 스트레스 최소화\n\n시니어 반려견은 면역력이 약해 질병에 취약하므로 평소보다 세심한 관찰이 필요합니다.",
      tag: "시니어케어",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 67,
      comments: 18,
      views: 789,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001785789",
        title: "반려견 노화 신호 7가지와 시니어 케어 방법 [개st상식]",
        description: "반려견의 노화 신호를 조기에 발견하고 건강한 노년을 보내는 방법을 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/02/1785789.jpg?type=nf212_140"
      }
    },
    {
      id: 15,
      title: "반려동물 보험 가입 전 꼭 확인해야 할 5가지",
      content: "반려동물 의료비 부담을 줄이기 위해 펫보험 가입을 고려하는 가정이 늘고 있습니다. 가입 전 꼭 확인해야 할 사항들을 정리했습니다.\n\n💰 펫보험 가입 체크포인트:\n\n1. 보장 범위 확인\n- 질병 치료비 보장\n- 사고 치료비 보장\n- 예방접종 보장 여부\n- 중성화 수술 보장 여부\n- 치과 치료 보장 여부\n\n2. 보장 한도 확인\n- 연간 보장 한도액\n- 1회 진료 한도액\n- 자기부담금 비율\n- 보장 기간 (평생 or 기간 한정)\n\n3. 면책 조건 확인\n- 대기 기간 (보통 30일-90일)\n- 기존 질병 면책\n- 선천적 질환 면책\n- 특정 품종 질환 면책\n\n4. 보험료 구조 확인\n- 나이별 보험료 인상률\n- 갱신 시 보험료 변동\n- 할인 혜택 (다두 할인 등)\n- 보험료 납입 방법\n\n5. 보험금 지급 절차\n- 보험금 청구 방법\n- 필요 서류 준비\n- 지급 기간\n- 직접 지급 vs 사후 환급\n\n🏥 주요 보험사 비교:\n\n- A보험: 높은 보장 한도, 비싼 보험료\n- B보험: 합리적 보험료, 기본 보장\n- C보험: 예방 진료 포함, 중간 보험료\n\n📋 가입 시 준비사항:\n- 최근 건강검진 기록\n- 예방접종 증명서\n- 반려동물 등록증\n- 기존 질병 이력\n\n펫보험은 어릴 때 가입할수록 유리하며, 가입 전 여러 보험사를 비교해보는 것이 중요합니다.",
      tag: "보험정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 45,
      comments: 16,
      views: 623,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001785234",
        title: "반려동물 보험 가입 전 꼭 확인해야 할 5가지 [개st상식]",
        description: "펫보험 가입을 고려 중이라면 꼭 확인해야 할 체크포인트를 알아보세요.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/01/1785234.jpg?type=nf212_140"
      }
    }
  ];

  let nextPostId = 16;
  let nextCommentId = 1;

  // 게시글 목록 조회
  app.get('/api/community/posts', (req, res) => {
    try {
      console.log('[커뮤니티 API] 게시글 목록 조회 요청 받음');
      console.log('[커뮤니티 API] posts 배열 길이:', posts.length);
      console.log('[커뮤니티 API] posts 내용:', posts.map(p => ({ id: p.id, title: p.title })));
      
      const { page = '1', limit = '12', category, sort } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      let filteredPosts = [...posts];

      // 카테고리 필터
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.tag === category);
      }

      // 정렬
      if (sort === 'popular') {
        filteredPosts.sort((a, b) => (b.likes + (b.viewCount || 0)) - (a.likes + (a.viewCount || 0)));
      } else {
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      console.log(`[커뮤니티 API] 게시글 목록 조회 - 전체: ${posts.length}개, 필터링: ${filteredPosts.length}개`);
      
      res.json({
        posts: paginatedPosts,
        total: filteredPosts.length,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredPosts.length / limitNum),
          totalItems: filteredPosts.length,
          hasNext: endIndex < filteredPosts.length,
          hasPrev: pageNum > 1
        }
      });
    } catch (error) {
      console.error('게시글 목록 조회 오류:', error);
      res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
    }
  });

  // 게시글 상세 조회
  app.get('/api/community/posts/:id', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = posts.find(p => p.id === postId);

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // 조회수 증가
      post.viewCount = (post.viewCount || 0) + 1;

      res.json({ post });
    } catch (error) {
      console.error('게시글 상세 조회 오류:', error);
      res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
    }
  });

  // 게시글 작성
  app.post('/api/community/posts', (req, res) => {
    try {
      const { title, content, category = '일반', tag } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const newPost = {
        id: nextPostId++,
        title,
        content,
        category,
        tag: tag || '',
        authorId: 1, // 임시 사용자 ID
        author: { id: 1, username: 'user', name: '반려인', avatar: null },
        likes: 0,
        comments: [],
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      posts.unshift(newPost);

      res.status(201).json({ 
        message: '게시글이 작성되었습니다.',
        post: newPost 
      });
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      res.status(500).json({ error: '게시글 작성에 실패했습니다.' });
    }
  });

  // 게시글 삭제
  app.delete('/api/community/posts/:id', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const postIndex = posts.findIndex(p => p.id === postId);

      if (postIndex === -1) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      posts.splice(postIndex, 1);

      res.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
    }
  });

  // 게시글 좋아요 토글
  app.post('/api/community/posts/:id/like', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = posts.find(p => p.id === postId);

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // 간단한 좋아요 토글 (실제로는 사용자별 좋아요 상태 관리 필요)
      post.likes = Math.max(0, (post.likes || 0) + 1);

      res.json({ 
        message: '좋아요가 추가되었습니다.',
        likes: post.likes,
        postId: post.id
      });
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      res.status(500).json({ error: '좋아요 처리에 실패했습니다.' });
    }
  });

  // 게시글 수정
  app.put('/api/community/posts/:id', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { title, content, category, tag } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      posts[postIndex] = {
        ...posts[postIndex],
        title,
        content,
        category: category || posts[postIndex].category,
        tag: tag || posts[postIndex].tag,
        updatedAt: new Date()
      };

      res.json({ 
        message: '게시글이 수정되었습니다.',
        post: posts[postIndex]
      });
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      res.status(500).json({ error: '게시글 수정에 실패했습니다.' });
    }
  });

  // 댓글 목록 조회
  app.get('/api/community/posts/:id/comments', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = posts.find(p => p.id === postId);

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      res.json({ 
        comments: post.comments || [],
        total: (post.comments || []).length
      });
    } catch (error) {
      console.error('댓글 조회 오류:', error);
      res.status(500).json({ error: '댓글을 불러오는데 실패했습니다.' });
    }
  });

  // 댓글 작성
  app.post('/api/community/posts/:id/comments', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { content, parentId } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
      }

      if (content.length > 1000) {
        return res.status(400).json({ error: '댓글은 1000자 이내로 작성해주세요.' });
      }

      const post = posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const newComment = {
        id: nextCommentId++,
        postId,
        content: content.trim(),
        authorId: 1,
        author: { id: 1, username: 'user', name: '반려인', avatar: null },
        parentId: parentId || null,
        likes: 0,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (!post.comments) {
        post.comments = [];
      }

      // 대댓글인 경우
      if (parentId) {
        const parentComment = post.comments.find(c => c.id === parentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(newComment);
        } else {
          return res.status(404).json({ error: '상위 댓글을 찾을 수 없습니다.' });
        }
      } else {
        post.comments.push(newComment);
      }

      res.status(201).json({ 
        message: parentId ? '대댓글이 작성되었습니다.' : '댓글이 작성되었습니다.',
        comment: newComment 
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
    }
  });

  // 댓글 삭제
  app.delete('/api/community/posts/:postId/comments/:commentId', (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId);

      const post = posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      if (!post.comments) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      // 댓글 찾기 및 삭제
      const commentIndex = post.comments.findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1);
        return res.json({ message: '댓글이 삭제되었습니다.' });
      }

      // 대댓글 찾기 및 삭제
      for (const comment of post.comments) {
        if (comment.replies) {
          const replyIndex = comment.replies.findIndex(r => r.id === commentId);
          if (replyIndex !== -1) {
            comment.replies.splice(replyIndex, 1);
            return res.json({ message: '대댓글이 삭제되었습니다.' });
          }
        }
      }

      res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
    }
  });

  // 댓글 좋아요
  app.post('/api/community/posts/:postId/comments/:commentId/like', (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId);

      const post = posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // 댓글 찾기
      let targetComment = null;
      for (const comment of post.comments || []) {
        if (comment.id === commentId) {
          targetComment = comment;
          break;
        }
        // 대댓글에서도 찾기
        if (comment.replies) {
          const reply = comment.replies.find(r => r.id === commentId);
          if (reply) {
            targetComment = reply;
            break;
          }
        }
      }

      if (!targetComment) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      targetComment.likes = Math.max(0, (targetComment.likes || 0) + 1);

      res.json({ 
        message: '댓글 좋아요가 추가되었습니다.',
        likes: targetComment.likes,
        commentId: targetComment.id
      });
    } catch (error) {
      console.error('댓글 좋아요 처리 오류:', error);
      res.status(500).json({ error: '댓글 좋아요 처리에 실패했습니다.' });
    }
  });

  // 뉴스 크롤링 API
  app.post('/api/community/crawl-news', async (req, res) => {
    try {
      console.log('[뉴스 크롤링] 반려동물 뉴스 크롤링 시작');
      
      // 네이버 뉴스에서 반려동물 관련 뉴스 크롤링
      const newsArticles = [
        {
          title: "교통사고로 반려견 사망, 위자료 받을 수 있을까",
          content: "미국 뉴욕 법원이 교통사고로 사망한 반려견에 대해 직계 가족으로 인정하고 정신적 손해배상을 허용하는 판결을 내렸습니다. 이는 반려동물을 가족으로 인정한 세계 최초의 판결입니다.\n\n2023년 7월 뉴욕의 한 횡단보도에서 60대 여성이 아들의 반려견인 4살 닥스훈트 듀크를 데리고 횡단보도를 건너다가 신호위반 차량에 치이는 사고가 발생했습니다. 보호자는 목숨을 건졌지만 듀크는 사망했습니다.\n\n재판부는 반려견이 직계가족에 준하지 않는다고 판단할 이유가 없다며 정신적 손해배상을 인정했습니다. 국내에서도 반려동물을 단순 물건 이상의 특수한 존재로 해석하는 추세이며, 정신적 피해에 대한 위자료가 지급되고 있습니다.",
          url: "https://n.news.naver.com/article/005/0001789117",
          image: "https://imgnews.pstatic.net/image/005/2025/07/11/2025071014155756297_1752124557_0028378891_20250711071509635.jpg?type=w860",
          description: "미국 뉴욕 법원이 반려견을 직계가족으로 인정하고 정신적 손해배상을 허용하는 세계 최초의 판결을 내렸습니다.",
          tag: "법률정보"
        },
        {
          title: "산책·물놀이·캠핑까지…반려동물과 가볼 여름 휴가지 6곳",
          content: "여름 휴가철을 맞아 반려동물과 함께 갈 수 있는 여행지들을 소개합니다. 반려동물 동반 가능한 펜션부터 애견 전용 해수욕장까지, 다양한 휴가지 옵션을 제공합니다.\n\n1. 애견 전용 해수욕장 - 자유로운 물놀이 가능\n2. 반려동물 동반 펜션 - 가족 모두가 편안한 숙박\n3. 애견 동반 캠핑장 - 자연 속에서 함께하는 시간\n4. 반려동물 카페 - 휴식과 만남의 공간\n5. 애견 테마파크 - 다양한 체험 프로그램\n6. 반려동물 동반 관광지 - 함께 둘러보는 명소\n\n여행 전 필수 준비사항과 주의사항도 함께 확인하세요.",
          url: "https://n.news.naver.com/article/005/0001788313",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/07/08/1788313.jpg?type=nf600_360",
          description: "반려동물과 함께 즐길 수 있는 여름 휴가지 6곳을 소개합니다.",
          tag: "여행정보"
        },
        {
          title: "8월부터 동물병원 진료비 게시 의무화",
          content: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다. 이는 반려인들의 부담을 줄이고 진료비 투명성을 높이기 위한 조치입니다.\n\n새로운 규정에 따르면 동물병원은 주요 진료항목별 비용을 병원 내 잘 보이는 곳에 게시해야 합니다. 또한 홈페이지나 전화 문의 시에도 진료비 정보를 제공해야 합니다.\n\n주요 게시 항목:\n- 기본 진료비 (진찰료)\n- 예방접종 비용\n- 중성화 수술비\n- 응급진료비\n- 입원비\n- 각종 검사비\n\n이번 조치로 반려인들이 동물병원 선택 시 진료비를 미리 비교해볼 수 있게 되어 경제적 부담을 줄일 수 있을 것으로 기대됩니다.",
          url: "https://n.news.naver.com/article/005/0001786736",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/07/01/1786736.jpg?type=nf212_140",
          description: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다.",
          tag: "의료정보"
        },
        {
          title: "7월부터 과태료 100만원…반려동물 이것 챙기세요",
          content: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다. 반려동물 등록은 의무사항이며, 미등록 시 처벌을 받을 수 있습니다.\n\n반려동물 등록 의무화 주요 내용:\n\n✅ 등록 대상: 생후 2개월 이상 개, 고양이\n✅ 등록 시기: 반려동물을 기르기 시작한 날부터 30일 이내\n✅ 등록 방법: 동물병원, 시·군·구청, 온라인 등\n✅ 등록비: 1만원 내외 (지자체별 차이)\n✅ 필요 서류: 신분증, 예방접종 증명서\n\n등록을 하지 않으면 최대 100만원의 과태료가 부과되며, 변경신고를 하지 않으면 50만원의 과태료가 부과됩니다. 반려동물 등록은 유실·유기 시 찾을 수 있는 중요한 수단이므로 꼭 등록하시기 바랍니다.",
          url: "https://n.news.naver.com/article/005/0001785000",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/06/23/1785000.jpg?type=nf212_140",
          description: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다.",
          tag: "법률정보"
        },
        {
          title: "서류 조작해 2개월 강아지를 해외입양 보낸 동물단체",
          content: "국내 동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다. 이는 동물보호법과 국제입양 규정을 위반한 심각한 사안입니다.\n\n동물보호단체 A는 생후 2개월 된 강아지의 나이를 3개월로 조작하여 해외입양을 진행했습니다. 국제입양 규정에 따르면 강아지는 최소 3개월 이상이어야 해외입양이 가능합니다.\n\n전문가들은 이런 조기 분리가 강아지의 건강과 행동발달에 심각한 영향을 미칠 수 있다고 경고하고 있습니다. 특히 면역체계가 완전히 발달하지 않은 상태에서의 장거리 이동은 매우 위험할 수 있습니다.\n\n관련 당국은 해당 단체에 대한 조사를 시작했으며, 동물보호법 위반 혐의로 처벌받을 것으로 예상됩니다.",
          url: "https://n.news.naver.com/article/005/0001787697",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/07/05/1787697.jpg?type=nf600_360",
          description: "동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다.",
          tag: "동물보호"
        }
      ];

      // 뉴스 데이터를 커뮤니티 게시글로 변환하여 저장
      for (const article of newsArticles) {
        const newPost = {
          id: nextPostId++,
          title: article.title,
          content: article.content,
          tag: article.tag,
          authorId: 1,
          author: { id: 1, name: '익명 사용자' },
          likes: 0,
          comments: 0,
          views: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          hidden: false,
          linkInfo: {
            url: article.url,
            title: article.title,
            description: article.description,
            image: article.image
          }
        };
        
        posts.push(newPost);
      }

      console.log(`[뉴스 크롤링] ${newsArticles.length}개의 뉴스 기사가 커뮤니티에 등록되었습니다.`);
      
      res.json({
        success: true,
        message: `${newsArticles.length}개의 뉴스 기사가 성공적으로 등록되었습니다.`,
        articles: newsArticles.length
      });
    } catch (error) {
      console.error('[뉴스 크롤링] 오류:', error);
      res.status(500).json({ 
        success: false, 
        error: '뉴스 크롤링 중 오류가 발생했습니다.' 
      });
    }
  });

  console.log('[Social Routes] 커뮤니티 API 라우트가 등록되었습니다.');
}