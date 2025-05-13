import { Activity } from "@/components/notebook/ActivityRecorder";

// OpenAI API 키를 환경 변수에서 가져옵니다
const apiKey = process.env.OPENAI_API_KEY;

/**
 * OpenAI API를 사용하여 알림장 내용을 자동 생성합니다
 * 
 * @param petName 반려동물 이름
 * @param petBreed 반려동물 품종
 * @param activities 기록된 활동 데이터
 * @param additionalContext 사용자가 입력한 추가 맥락 정보
 * @returns 생성된 알림장 내용 (제목, 내용)
 */
export async function generateNotebookEntry(
  petName: string,
  petBreed: string,
  activities: Activity = {},
  additionalContext: string = ""
): Promise<{ title: string; content: string }> {
  try {
    // OpenAI API 키가 없는 경우 오류 발생
    if (!apiKey) {
      throw new Error("OpenAI API 키가 설정되지 않았습니다.");
    }

    // 활동 데이터 가공
    const activityDetails = processActivities(activities);
    
    // 시스템 프롬프트 구성
    const systemPrompt = `당신은 한국의 최고 전문 반려동물 훈련사입니다. 반려동물에 대한 알림장(오늘의 활동, 훈련, 식사 상태)을 작성해주세요.
    동물 관련 전문 지식을 활용하여 훈련사가 반려인에게 주는 일일 보고서를 작성합니다.
    글은 친근하고 따뜻한 톤으로, 하지만 전문적인 내용을 담아 작성합니다.
    반응은 한국어로만 해주세요.`;
    
    // 사용자 프롬프트 구성
    const userPrompt = `
    반려동물 정보:
    - 이름: ${petName}
    - 품종: ${petBreed}
    
    오늘의 활동 기록:
    ${activityDetails}
    
    추가 정보:
    ${additionalContext || "특별한 추가 정보 없음"}
    
    위 정보를 바탕으로 알림장을 작성해주세요. 결과는 다음 JSON 형식으로 반환해주세요:
    {
      "title": "알림장 제목",
      "content": "알림장 내용"
    }
    
    알림장 내용은 다음과 같은 내용을 포함하고, 3~5 문단으로 구성해주세요:
    1. 인사와 간단한 오늘의 요약
    2. 활동에 대한 상세 설명
    3. 관찰된 행동이나 발전 사항
    4. 개선이 필요한 부분과 권장사항(필요시)
    5. 마무리 인사와 격려

    위의 정보만 사용하고, 없는 정보는 임의로 만들지 마세요.
    `;

    // 실제 구현 시에는 OpenAI API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // 최신 OpenAI 모델 사용
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI API 오류: ${error.error?.message || "알 수 없는 오류"}`
      );
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      title: result.title || `${petName}의 오늘 하루`,
      content: result.content || "내용 생성에 실패했습니다.",
    };
  } catch (error) {
    console.error("AI 생성 오류:", error);
    return {
      title: `${petName}의 오늘 하루`,
      content: "AI 내용 생성에 실패했습니다. 다시 시도해 주세요.",
    };
  }
}

/**
 * 활동 데이터를 자연어 설명으로 변환
 */
function processActivities(activities: Activity): string {
  const descriptions: string[] = [];

  // 식사 활동 처리
  if (activities.meal) {
    const meal = activities.meal;
    const mealTypes = [];
    if (meal.breakfast) mealTypes.push("아침");
    if (meal.lunch) mealTypes.push("점심");
    if (meal.dinner) mealTypes.push("저녁");
    if (meal.snack) mealTypes.push("간식");
    
    let mealDesc = "";
    if (mealTypes.length > 0) {
      mealDesc = `- 식사: ${mealTypes.join(", ")} 식사를 했습니다.`;
      if (meal.water) mealDesc += " 물도 충분히 마셨습니다.";
      if (meal.custom) mealDesc += ` 기타 정보: ${meal.custom}`;
      descriptions.push(mealDesc);
    }
  }

  // 배변 활동 처리
  if (activities.potty) {
    const potty = activities.potty;
    let pottyDesc = "- 배변: ";
    
    if (potty.pee) pottyDesc += "소변 ";
    if (potty.poop) pottyDesc += "대변 ";
    
    if (potty.pee || potty.poop) {
      pottyDesc += "배변 활동이 있었습니다. ";
      
      if (potty.count) pottyDesc += `총 ${potty.count}회 `;
      
      if (potty.quality) {
        const qualityMap = {
          good: "양호한",
          normal: "보통인",
          bad: "좋지 않은"
        };
        pottyDesc += `배변 상태는 ${qualityMap[potty.quality]} 상태였습니다.`;
      }
      
      descriptions.push(pottyDesc);
    }
  }

  // 산책 활동 처리
  if (activities.walk) {
    const walk = activities.walk;
    const walkTimes = [];
    if (walk.morning) walkTimes.push("아침");
    if (walk.afternoon) walkTimes.push("오후");
    if (walk.evening) walkTimes.push("저녁");
    
    if (walkTimes.length > 0) {
      let walkDesc = `- 산책: ${walkTimes.join(", ")}에 산책을 했습니다.`;
      
      if (walk.duration) walkDesc += ` 약 ${walk.duration}분 동안`;
      if (walk.distance) walkDesc += ` 약 ${(walk.distance / 1000).toFixed(1)}km 거리를`;
      
      if (walk.duration || walk.distance) walkDesc += " 산책했습니다.";
      
      descriptions.push(walkDesc);
    }
  }

  // 훈련 활동 처리
  if (activities.training) {
    const training = activities.training;
    const trainingTypes = [];
    if (training.sit) trainingTypes.push("앉아");
    if (training.stay) trainingTypes.push("기다려");
    if (training.come) trainingTypes.push("이리와");
    if (training.down) trainingTypes.push("엎드려");
    if (training.paw) trainingTypes.push("손");
    
    if (trainingTypes.length > 0) {
      let trainingDesc = `- 훈련: ${trainingTypes.join(", ")} 명령어 훈련을 진행했습니다.`;
      if (training.custom) trainingDesc += ` 추가 훈련: ${training.custom}`;
      descriptions.push(trainingDesc);
    }
  }

  // 놀이 활동 처리
  if (activities.play) {
    const play = activities.play;
    const playTypes = [];
    if (play.fetch) playTypes.push("물건 가져오기");
    if (play.tug) playTypes.push("터그놀이");
    if (play.chase) playTypes.push("쫓기 놀이");
    if (play.puzzle) playTypes.push("퍼즐 장난감");
    
    if (playTypes.length > 0) {
      let playDesc = `- 놀이: ${playTypes.join(", ")} 놀이를 했습니다.`;
      if (play.custom) playDesc += ` 기타 놀이: ${play.custom}`;
      descriptions.push(playDesc);
    }
  }

  // 활동이 없는 경우 기본 메시지 반환
  if (descriptions.length === 0) {
    return "기록된 활동 정보가 없습니다.";
  }

  return descriptions.join("\n");
}