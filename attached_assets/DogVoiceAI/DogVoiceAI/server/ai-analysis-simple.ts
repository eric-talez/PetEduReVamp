import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const DEFAULT_MODEL = "gpt-5.1";

function safeJsonParse(text: string): any {
  let jsonText = text.trim();

  if (jsonText.includes('```')) {
    const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      const startIndex = jsonText.indexOf('{');
      const endIndex = jsonText.lastIndexOf('}') + 1;
      if (startIndex >= 0 && endIndex > startIndex) {
        jsonText = jsonText.substring(startIndex, endIndex);
      }
    }
  }

  if (!jsonText.startsWith('{')) {
    const startIndex = jsonText.indexOf('{');
    if (startIndex >= 0) {
      const endIndex = jsonText.lastIndexOf('}') + 1;
      if (endIndex > startIndex) {
        jsonText = jsonText.substring(startIndex, endIndex);
      }
    }
  }

  return JSON.parse(jsonText.trim());
}

export interface JointPoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

export interface MotionAnalysis {
  joints: JointPoint[];
  movementSpeed: number;
  postureTilt: number;
  limbAngles: {
    frontLeft: number;
    frontRight: number;
    backLeft: number;
    backRight: number;
  };
  activityType: string;
  estimatedPain: boolean;
}

export interface DogBehaviorAnalysis {
  timestamp: number;
  behavior: string;
  confidence: number;
  emotion: string;
  intensity: number;
  bodyLanguage?: {
    tail: string;
    ears: string;
    posture: string;
    eyeContact: string;
  };
  postureAnalysis?: {
    isAbnormal: boolean;
    abnormalityType: string;
    description: string;
    severity: string;
    possibleCauses: string[];
    recommendations: string[];
  };
  detailedBehavior?: {
    primaryAction: string;
    secondaryActions: string[];
    movementPattern: string;
    attentionFocus: string;
    energyLevel: string;
  };
  contextualFactors: {
    environment: string;
    triggers: string[];
    socialContext: string;
  };
  recommendations: string[];
  audioFeatures?: {
    frequency: number;
    amplitude: number;
    pitch: string;
    barType: string;
    duration: number;
  };
  motionAnalysis?: MotionAnalysis;
}

export interface ComprehensiveAnalysis {
  overallMood: string;
  stressLevel: number;
  activityLevel: number;
  socialResponsiveness: number;
  alertness: number;
}

export async function analyzeImageFrame(base64Image: string, timestamp: number): Promise<DogBehaviorAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      max_completion_tokens: 1500,
      messages: [
        {
          role: "system",
          content: `You are an expert canine behaviorist and veterinary specialist. You MUST respond ONLY with a valid JSON object in Korean. Do not include any markdown formatting, explanations, or additional text. Only respond with the JSON object itself.

IMPORTANT: First determine if the image contains a dog. If NO dog is visible, respond with a minimal JSON indicating no dog found.

If a dog IS visible, provide COMPREHENSIVE analysis including:
1. Posture Analysis (자세 분석): 
   - Normal vs Abnormal posture detection
   - Abnormal postures include: limping, head tilting, hunched back, leg dragging, uneven weight distribution, stiff movement, trembling
   - Severity assessment (경미/중간/심각)

2. Detailed Behavior (상세 행동):
   - Primary action (주요 행동)
   - Secondary actions (부차적 행동들)
   - Movement patterns (움직임 패턴)
   - Attention focus (주의 집중 대상)
   - Energy level (에너지 수준)

3. Body Language (신체 언어):
   - Tail position and movement
   - Ear positioning
   - Eye contact and gaze
   - Overall body tension

4. Health Indicators:
   - Signs of pain or discomfort
   - Mobility issues
   - Stress indicators`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `이미지를 상세하게 분석하세요. 강아지의 자세, 행동, 이상징후를 포함하여 분석하세요. 정확히 이 JSON 형식으로만 응답하세요:

{
  "behavior": "주요 행동 (예: 앉아있음, 서있음, 걷기, 뛰기) 또는 '강아지가 아님'",
  "confidence": 0.85,
  "emotion": "감정 상태 (예: 편안함, 긴장, 호기심, 불안, 기쁨)",
  "intensity": 7,
  "bodyLanguage": {
    "tail": "꼬리 상태 (예: 높이 들림, 낮게 내림, 흔들림, 다리 사이에 감춤)",
    "ears": "귀 상태 (예: 쫑긋 세움, 뒤로 젖힘, 한쪽만 세움)",
    "posture": "전체 자세 (예: 이완됨, 긴장됨, 웅크림, 경계 자세)",
    "eyeContact": "시선 (예: 직접 응시, 회피, 측면 주시)"
  },
  "postureAnalysis": {
    "isAbnormal": false,
    "abnormalityType": "정상 또는 이상 유형 (예: 절뚝거림, 머리 기울임, 등 굽힘)",
    "description": "자세에 대한 상세 설명",
    "severity": "정상/경미/중간/심각",
    "possibleCauses": ["가능한 원인들"],
    "recommendations": ["수의사 권고사항"]
  },
  "detailedBehavior": {
    "primaryAction": "주요 행동",
    "secondaryActions": ["부차적 행동들"],
    "movementPattern": "움직임 패턴 (예: 정지, 느린 이동, 활발한 움직임)",
    "attentionFocus": "주의 집중 대상",
    "energyLevel": "에너지 수준 (낮음/보통/높음)"
  },
  "contextualFactors": {
    "environment": "환경 설명",
    "triggers": ["관찰된 자극 요인들"],
    "socialContext": "사회적 상황"
  },
  "recommendations": ["행동 및 건강 관련 제안사항들"]
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content');
    }

    const analysisData = safeJsonParse(content);

    return {
      timestamp,
      behavior: analysisData.behavior,
      confidence: Math.min(Math.max(analysisData.confidence, 0), 1),
      emotion: analysisData.emotion,
      intensity: Math.min(Math.max(analysisData.intensity, 1), 10),
      bodyLanguage: analysisData.bodyLanguage,
      postureAnalysis: analysisData.postureAnalysis,
      detailedBehavior: analysisData.detailedBehavior,
      contextualFactors: analysisData.contextualFactors,
      recommendations: analysisData.recommendations
    };

  } catch (error) {
    console.error('Image analysis error:', error);
    return {
      timestamp,
      behavior: "분석 실패",
      confidence: 0.1,
      emotion: "분석 불가",
      intensity: 0,
      bodyLanguage: {
        tail: "분석 불가",
        ears: "분석 불가",
        posture: "분석 불가",
        eyeContact: "분석 불가"
      },
      postureAnalysis: {
        isAbnormal: false,
        abnormalityType: "분석 불가",
        description: "이미지 분석에 실패했습니다",
        severity: "분석 불가",
        possibleCauses: [],
        recommendations: []
      },
      detailedBehavior: {
        primaryAction: "분석 불가",
        secondaryActions: [],
        movementPattern: "분석 불가",
        attentionFocus: "분석 불가",
        energyLevel: "분석 불가"
      },
      contextualFactors: {
        environment: "분석 불가",
        triggers: ["이미지 분석 오류"],
        socialContext: "분석 불가"
      },
      recommendations: ["이미지 품질을 확인하고 다시 시도해주세요", "강아지가 선명하게 보이는 이미지를 사용해주세요"]
    };
  }
}

export async function analyzeAudioSegment(audioSize: number, timestamp: number, duration: number): Promise<DogBehaviorAnalysis> {
  try {
    const estimatedAmplitude = Math.min(audioSize / 10000, 1);

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      max_completion_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `You are an expert in canine vocal communication. You MUST respond ONLY with a valid JSON object in Korean. No markdown formatting or additional text.

Analyze dog vocalizations for:
- Bark type (짖음 유형): warning bark, playful bark, anxious whine, howl, growl
- Emotional state from vocalization
- Intensity and urgency of the sound`
        },
        {
          role: "user",
          content: `음성 분석 정보: 타임스탬프 ${timestamp}초, 지속시간 ${duration}초, 음량 ${Math.round(estimatedAmplitude * 100)}%.

강아지 짖음을 분석하세요. 정확히 이 JSON 형식으로만 응답:

{"behavior": "음성행동 (예: 경고 짖음, 놀이 짖음, 불안 울음)", "confidence": 0.8, "emotion": "감정", "intensity": 6, "audioFeatures": {"frequency": 350, "amplitude": 0.7, "pitch": "중간", "barType": "짖기 유형", "duration": ${duration}}, "contextualFactors": {"environment": "환경", "triggers": ["자극"], "socialContext": "소통"}, "recommendations": ["제안"]}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content');
    }

    const analysisData = safeJsonParse(content);

    return {
      timestamp,
      behavior: analysisData.behavior,
      confidence: Math.min(Math.max(analysisData.confidence, 0), 1),
      emotion: analysisData.emotion,
      intensity: Math.min(Math.max(analysisData.intensity, 1), 10),
      bodyLanguage: {
        tail: "음성 전용",
        ears: "음성 전용",
        posture: "음성 전용",
        eyeContact: "음성 전용"
      },
      contextualFactors: analysisData.contextualFactors,
      recommendations: analysisData.recommendations,
      audioFeatures: analysisData.audioFeatures
    };

  } catch (error) {
    console.error('Audio analysis error:', error);
    return {
      timestamp,
      behavior: "음성 분석 오류",
      confidence: 0.1,
      emotion: "알 수 없음",
      intensity: 5,
      bodyLanguage: {
        tail: "음성 전용",
        ears: "음성 전용",
        posture: "음성 전용",
        eyeContact: "음성 전용"
      },
      contextualFactors: {
        environment: "분석 불가",
        triggers: ["분석 오류"],
        socialContext: "분석 불가"
      },
      recommendations: ["오디오 파일을 다시 업로드해주세요"],
      audioFeatures: {
        frequency: 0,
        amplitude: 0,
        pitch: "알 수 없음",
        barType: "분석 실패",
        duration
      }
    };
  }
}

export async function comprehensiveAnalysis(analyses: DogBehaviorAnalysis[]): Promise<ComprehensiveAnalysis> {
  if (analyses.length === 0) {
    return {
      overallMood: "분석 대기",
      stressLevel: 5,
      activityLevel: 5,
      socialResponsiveness: 5,
      alertness: 5
    };
  }

  try {
    const summaryData = analyses.map(a => ({
      behavior: a.behavior,
      emotion: a.emotion,
      intensity: a.intensity,
      confidence: a.confidence
    }));

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      max_completion_tokens: 800,
      messages: [
        {
          role: "system",
          content: `You are an expert canine behaviorist. You MUST respond ONLY with a valid JSON object in Korean. No markdown formatting or additional text.`
        },
        {
          role: "user",
          content: `다음 행동 분석 데이터를 종합하여 전반적인 강아지 상태를 평가하세요:
${JSON.stringify(summaryData, null, 2)}

정확히 이 JSON 형식으로만 응답:

{"overallMood": "전반적기분", "stressLevel": 5, "activityLevel": 7, "socialResponsiveness": 6, "alertness": 8}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content');
    }

    const analysisData = safeJsonParse(content);

    return {
      overallMood: analysisData.overallMood,
      stressLevel: Math.min(Math.max(analysisData.stressLevel, 1), 10),
      activityLevel: Math.min(Math.max(analysisData.activityLevel, 1), 10),
      socialResponsiveness: Math.min(Math.max(analysisData.socialResponsiveness, 1), 10),
      alertness: Math.min(Math.max(analysisData.alertness, 1), 10)
    };

  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    return {
      overallMood: "분석 오류",
      stressLevel: 5,
      activityLevel: 5,
      socialResponsiveness: 5,
      alertness: 5
    };
  }
}

export async function generateComprehensiveReport(
  surveyData: any,
  motionAnalyses: any[],
  behaviorAnalyses: DogBehaviorAnalysis[]
): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      max_completion_tokens: 3000,
      messages: [
        {
          role: "system",
          content: `You are an expert canine behaviorist and veterinary consultant. You MUST respond ONLY with a valid JSON object in Korean. 
      
Analyze the owner's survey data combined with motion analysis and behavioral observations to create a comprehensive health and behavior report.

Focus on:
- Correlations between owner observations and objective data
- Health risk indicators
- Behavioral patterns and their causes
- Actionable recommendations for improvement
- Overall wellbeing assessment`
        },
        {
          role: "user",
          content: `다음 데이터를 종합 분석하여 상세한 리포트를 생성해주세요:

견주 설문 데이터:
${JSON.stringify(surveyData, null, 2)}

모션 분석 데이터:
${JSON.stringify(motionAnalyses.slice(0, 10), null, 2)}

행동 분석 데이터:
${JSON.stringify(behaviorAnalyses.slice(0, 10), null, 2)}

다음 JSON 형식으로 응답:
{
  "executiveSummary": "전체 요약 (2-3문장)",
  "motionAnalysisSummary": {
    "overallMobility": "이동성 평가",
    "painIndicators": ["통증 징후들"],
    "activityPatterns": ["활동 패턴들"],
    "physicalCondition": "신체 상태"
  },
  "behaviorAnalysisSummary": {
    "dominantBehaviors": ["주요 행동들"],
    "emotionalState": "감정 상태",
    "stressLevels": "스트레스 수준",
    "socialBehavior": "사회적 행동"
  },
  "surveyInsights": {
    "keyFindings": ["주요 발견사항들"],
    "ownerConcernsValidation": ["견주 우려사항 검증"],
    "environmentalFactors": ["환경적 요인들"]
  },
  "correlationFindings": [
    {
      "observation": "관찰 내용",
      "correlation": "상관관계",
      "significance": "중요도 (high/medium/low)"
    }
  ],
  "aiRecommendations": [
    "구체적인 추천사항들 (우선순위순)"
  ],
  "healthAlerts": [
    "건강 경고 사항들"
  ],
  "trainingAdvice": [
    "훈련 조언들"
  ],
  "overallScore": 75,
  "wellbeingIndex": 8.2
}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content');
    }

    const reportData = safeJsonParse(content);
    return reportData;

  } catch (error) {
    console.error('Comprehensive report generation error:', error);
    return {
      executiveSummary: "종합 리포트 생성 중 오류가 발생했습니다.",
      motionAnalysisSummary: { overallMobility: "분석 실패", painIndicators: [], activityPatterns: [], physicalCondition: "분석 불가" },
      behaviorAnalysisSummary: { dominantBehaviors: [], emotionalState: "분석 실패", stressLevels: "알 수 없음", socialBehavior: "분석 불가" },
      surveyInsights: { keyFindings: [], ownerConcernsValidation: [], environmentalFactors: [] },
      correlationFindings: [],
      aiRecommendations: ["데이터를 다시 확인해주세요"],
      healthAlerts: [],
      trainingAdvice: [],
      overallScore: 50,
      wellbeingIndex: 5.0
    };
  }
}

export async function analyzeFileMetadata(filename: string, fileType: string, duration: number): Promise<Partial<DogBehaviorAnalysis>> {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      max_completion_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You are a canine behavior expert. You MUST respond ONLY with a valid JSON object in Korean. No markdown formatting or additional text.`
        },
        {
          role: "user",
          content: `파일 분석: ${filename}, 유형 ${fileType}, ${duration}초. 

정확히 이 JSON 형식으로만 응답:

{"behavior": "예상행동", "confidence": 0.3, "emotion": "추정감정", "recommendations": ["제안사항"]}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content');
    }

    return safeJsonParse(content);

  } catch (error) {
    console.error('Metadata analysis error:', error);
    return {
      behavior: "파일 분석 준비 중",
      confidence: 0.1,
      emotion: "분석 대기",
      recommendations: ["파일을 업로드하고 분석을 시작하세요"]
    };
  }
}
