import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // 클라이언트 측 사용 허용 (실제 프로덕션에서는 서버 측에서 처리하는 것이 좋음)
});

// 활동 기록에 따른 자동 알림장 생성
export const generateNotebookEntry = async (
  petName: string, 
  petBreed: string, 
  activities: {
    training?: string[];
    meal?: { time: string; description: string }[];
    potty?: { time: string; status: string }[];
    walk?: { duration: string; description: string }[];
    play?: string[];
    rest?: string[];
    other?: string[];
  },
  additionalNotes?: string
): Promise<{ title: string; content: string }> => {
  try {
    const activitiesText = Object.entries(activities)
      .filter(([_, value]) => value && value.length > 0)
      .map(([key, value]) => {
        switch (key) {
          case 'training':
            return `훈련: ${(value as string[]).join(', ')}`;
          case 'meal':
            return `식사: ${(value as { time: string; description: string }[])
              .map(v => `${v.time} - ${v.description}`)
              .join(', ')}`;
          case 'potty':
            return `배변: ${(value as { time: string; status: string }[])
              .map(v => `${v.time} - ${v.status}`)
              .join(', ')}`;
          case 'walk':
            return `산책: ${(value as { duration: string; description: string }[])
              .map(v => `${v.duration} - ${v.description}`)
              .join(', ')}`;
          case 'play':
            return `놀이: ${(value as string[]).join(', ')}`;
          case 'rest':
            return `휴식: ${(value as string[]).join(', ')}`;
          case 'other':
            return `기타: ${(value as string[]).join(', ')}`;
          default:
            return '';
        }
      })
      .filter(text => text)
      .join('\n');

    const prompt = `
      당신은 애견 훈련사입니다. ${petName}(${petBreed})의 하루 일과를 기록한 알림장을 작성해주세요.
      알림장은 견주에게 전달될 예정이며, 반려견의 훈련 상황과 일상 활동을 친절하고 상세하게 전달해야 합니다.
      
      오늘의 활동 기록:
      ${activitiesText}
      
      추가 메모:
      ${additionalNotes || ''}
      
      다음 형식으로 알림장을 작성해주세요:
      1. 제목은 반려견 이름과 오늘의 주요 활동을 포함하여 간결하게
      2. 내용은 각 활동에 대한 상세 설명과 반려견의 반응, 특이사항을 포함
      3. 마지막에는 견주에게 전할 조언이나 다음 훈련 계획을 간략히 안내
      4. 전체적으로 전문적이면서도 친근한 어조 유지
      
      응답은 다음 JSON 형식으로 제공해주세요:
      {
        "title": "알림장 제목",
        "content": "알림장 내용"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "당신은 전문 애견 훈련사로서 반려견의 일상과 훈련 상황을 기록하는 알림장을 작성하는 도우미입니다." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const resultContent = response.choices[0].message.content || '';
    const result = JSON.parse(resultContent);
    return result;
  } catch (error) {
    console.error('AI 알림장 생성 오류:', error);
    return {
      title: `${petName}의 오늘 하루`,
      content: `오늘 ${petName}의 하루 활동 기록입니다.\n\n${additionalNotes || ''}` 
    };
  }
};

// 자동 알림장 템플릿 생성
export const generateTemplateContent = async (
  templateType: string,
  petName: string,
  petBreed: string,
  additionalContext?: string
): Promise<{ title: string; content: string; tags: string[] }> => {
  let defaultTags: string[] = ['알림장', '기록', '반려견'];
  
  try {
    let systemPrompt = "당신은 전문 애견 훈련사입니다.";
    let userPrompt = "";

    switch (templateType) {
      case 'daily-progress':
        systemPrompt = "당신은 반려견의 일일 훈련 보고서를 작성하는 전문 애견 훈련사입니다.";
        userPrompt = `${petName}(${petBreed})의 일일 훈련 보고서 템플릿을 작성해주세요. 빈칸은 '___'로 표시하고, 훈련사가 채울 수 있도록 해주세요. ${additionalContext || ''}`;
        defaultTags = ['일일보고', '훈련', '진행상황'];
        break;
        
      case 'behavior-analysis':
        systemPrompt = "당신은 반려견의 행동을 분석하는 전문 동물 행동 분석가입니다.";
        userPrompt = `${petName}(${petBreed})의 행동 분석 보고서 템플릿을 작성해주세요. 빈칸은 '___'로 표시하고, 훈련사가 채울 수 있도록 해주세요. ${additionalContext || ''}`;
        defaultTags = ['행동분석', '심리', '솔루션'];
        break;
        
      case 'meal-record':
        systemPrompt = "당신은 반려견의 식사 기록을 관리하는 전문가입니다.";
        userPrompt = `${petName}(${petBreed})의 식사 기록 템플릿을 작성해주세요. 하루 식사, 간식, 물 섭취량 등을 기록할 수 있어야 합니다. ${additionalContext || ''}`;
        defaultTags = ['식사기록', '영양', '건강관리'];
        break;
        
      case 'walk-activity':
        systemPrompt = "당신은 반려견의 산책 및 야외 활동을 기록하는 전문가입니다.";
        userPrompt = `${petName}(${petBreed})의 산책 활동 기록 템플릿을 작성해주세요. 산책 시간, 거리, 반응, 만난 다른 동물 등을 기록할 수 있어야 합니다. ${additionalContext || ''}`;
        defaultTags = ['산책', '운동', '야외활동'];
        break;
        
      case 'potty-tracking':
        systemPrompt = "당신은 반려견의 배변 훈련 및 건강 상태를 모니터링하는 전문가입니다.";
        userPrompt = `${petName}(${petBreed})의 배변 기록 템플릿을 작성해주세요. 시간, 상태, 특이사항 등을 기록할 수 있어야 합니다. ${additionalContext || ''}`;
        defaultTags = ['배변기록', '건강체크', '훈련'];
        break;
        
      default:
        userPrompt = `${petName}(${petBreed})의 알림장 템플릿을 작성해주세요. 빈칸은 '___'로 표시하고, 훈련사가 채울 수 있도록 해주세요. ${additionalContext || ''}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const resultContent = response.choices[0].message.content || '';
    const result = JSON.parse(resultContent);
    
    // JSON 응답이 없을 경우를 대비한 기본값 설정
    const title = result.title || `${petName}의 ${getTemplateTitle(templateType)}`;
    const content = result.content || '';
    const tags = result.tags || defaultTags;
    
    return { title, content, tags };
  } catch (error) {
    console.error('AI 템플릿 생성 오류:', error);
    return {
      title: `${petName}의 ${getTemplateTitle(templateType)}`,
      content: getDefaultTemplateContent(templateType, petName),
      tags: defaultTags
    };
  }
};

// 템플릿 타입에 따른 기본 제목 반환
const getTemplateTitle = (templateType: string): string => {
  switch (templateType) {
    case 'daily-progress': return '일일 훈련 보고서';
    case 'behavior-analysis': return '행동 분석 보고서';
    case 'meal-record': return '식사 기록';
    case 'walk-activity': return '산책 활동 기록';
    case 'potty-tracking': return '배변 기록';
    default: return '알림장';
  }
};

// 템플릿 타입에 따른 기본 내용 반환
const getDefaultTemplateContent = (templateType: string, petName: string): string => {
  switch (templateType) {
    case 'daily-progress':
      return `오늘의 ${petName} 훈련 내용:
1. 훈련 목표: ___
2. 실행한 훈련: ___
3. 반려견 반응: ___
4. 특이사항: ___
5. 다음 훈련 계획: ___

집에서 연습하면 좋을 포인트:
- ___
- ___

추가 코멘트:
___`;
      
    case 'behavior-analysis':
      return `${petName}의 행동 분석:
1. 관찰된 행동: ___
2. 행동 원인 분석: ___
3. 개선 방안: ___
4. 훈련 추천: ___
5. 주의 사항: ___

보호자 피드백:
___`;
      
    case 'meal-record':
      return `${petName}의 식사 기록:
- 아침 식사 (시간: ___, 양: ___, 사료 종류: ___)
- 점심 식사 (시간: ___, 양: ___, 사료 종류: ___)
- 저녁 식사 (시간: ___, 양: ___, 사료 종류: ___)

간식:
- 종류: ___, 시간: ___, 양: ___

물 섭취량: ___

특이사항: ___`;
      
    case 'walk-activity':
      return `${petName}의 산책 기록:
- 시간: ___ (총 ___ 분)
- 거리: ___
- 경로: ___
- 날씨 상태: ___
- 반려견 반응: ___
- 만난 다른 동물/사람: ___
- 특이사항: ___

활동 중 훈련 내용:
___

다음 산책 계획:
___`;
      
    case 'potty-tracking':
      return `${petName}의 배변 기록:
- 배변 시간 1: ___, 상태: ___, 장소: ___
- 배변 시간 2: ___, 상태: ___, 장소: ___

배변 훈련 진행 상황:
___

특이사항/건강 상태:
___`;
      
    default:
      return `${petName}의 알림장:
___

특이사항:
___`;
  }
};