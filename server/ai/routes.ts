import { Express, Request, Response } from "express";
import OpenAI from "openai";

// Express 세션 타입 선언
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: string;
      [key: string]: any;
    };
  }
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// OPENAI_API_KEY 환경 변수 사용
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 시스템 프롬프트 설정 - 로그인/비로그인 사용자별 다른 프롬프트 사용
const getSystemPrompt = (isAuthenticated: boolean): string => {
  if (isAuthenticated) {
    return `당신은 '펫에듀'의 반려동물 전문 AI 어시스턴트입니다. 반려동물 훈련, 건강, 행동에 관한 전문적인 지식을 제공합니다.
    사용자는 로그인한 회원이므로 더 자세하고 전문적인 정보를 제공해 주세요.
    
    가능한 기능:
    1. 반려동물 행동 문제에 대한 전문적인 조언
    2. 훈련 방법과 팁 추천
    3. 일반적인 건강 관련 정보 제공 (단, 의학적 진단은 하지 않음)
    4. 품종별 특성과 관리 방법 안내
    5. 영양 및 식이 조언
    
    정보를 제공할 때는 최신 동물 행동학과 과학적 연구에 기반한 정확한 정보만 제공하세요.
    의학적 진단을 내리지 말고, 심각한 증상이나 건강 문제에 대해서는 수의사 상담을 권유하세요.
    반려동물 복지와 인도적인 훈련 방법을 항상 우선시하세요.`;
  } else {
    return `당신은 '펫에듀'의 반려동물 전문 AI 어시스턴트입니다. 반려동물에 관한 기본적인 정보를 제공합니다.
    사용자는 비로그인 방문자이므로, 일반적인 정보와 함께 서비스 가입을 통해 더 많은 기능을 이용할 수 있다는 점을 간략히 안내해 주세요.
    
    가능한 기능:
    1. 반려동물 기본 케어에 관한 일반적인 정보
    2. 간단한 훈련 팁
    3. 일반적인 반려동물 행동에 대한 설명
    
    상세한 맞춤형 정보가 필요한 경우 회원가입을 통해 AI 분석 서비스를 이용할 수 있다고 안내해 주세요.
    의학적 진단을 내리지 말고, 건강 문제는 수의사 상담을 권유하세요.`;
  }
};

export function registerAiRoutes(app: Express) {
  // AI 채팅 API 엔드포인트
  app.post("/api/ai-chat", async (req: Request, res: Response) => {
    try {
      const { message, history = [], isAuthenticated = false } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "메시지가 필요합니다" });
      }
      
      const systemPrompt = getSystemPrompt(isAuthenticated);
      
      // 메시지 배열 구성
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ];
      
      // API 호출
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // 최신 모델 사용
        messages: messages as any,
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      const responseMessage = completion.choices[0].message.content;
      
      res.json({ message: responseMessage });
    } catch (error: any) {
      console.error("AI 채팅 API 오류:", error);
      
      // API 키 관련 오류 처리
      if (error.code === 'invalid_api_key' || error.message?.includes('API key')) {
        return res.status(500).json({ 
          error: "API 키 오류", 
          message: "AI 서비스 연결에 문제가 있습니다. 관리자에게 문의하세요."
        });
      }
      
      res.status(500).json({ 
        error: "서버 오류", 
        message: "AI 응답을 생성하는 도중 오류가 발생했습니다." 
      });
    }
  });
  
  // AI 분석 API (로그인 사용자 전용)
  app.post("/api/ai-analysis", async (req: Request, res: Response) => {
    try {
      // 인증 확인
      if (!req.session?.user) {
        return res.status(401).json({ error: "인증이 필요합니다" });
      }
      
      const { petData, analysisType, userPrompt } = req.body;
      
      if (!petData || !analysisType) {
        return res.status(400).json({ error: "반려동물 데이터와 분석 유형이 필요합니다" });
      }
      
      // 분석 유형에 따른 프롬프트 구성
      let systemPrompt = "당신은 '펫에듀'의 전문 반려동물 행동 분석 AI입니다. ";
      
      switch (analysisType) {
        case 'behavior':
          systemPrompt += "반려동물의 행동 패턴을 분석하고 문제 행동에 대한 해결책을 제시합니다.";
          break;
        case 'training':
          systemPrompt += "반려동물의 훈련 진행 상황을 평가하고 맞춤형 훈련 계획을 제안합니다.";
          break;
        case 'health':
          systemPrompt += "반려동물의 건강 지표를 분석합니다. (의학적 진단은 하지 않으며, 수의사 상담을 권장합니다)";
          break;
        case 'emotional':
          systemPrompt += "반려동물의 감정 상태와 스트레스 수준을 분석하고 웰빙 향상을 위한 조언을 제공합니다.";
          break;
        default:
          systemPrompt += "반려동물의 전체적인 상태를 종합적으로 분석합니다.";
      }
      
      // 펫 데이터를 문자열로 변환
      const petDataStr = JSON.stringify(petData);
      
      // 최종 사용자 프롬프트 구성
      const finalPrompt = userPrompt 
        ? `반려동물 데이터: ${petDataStr}\n\n사용자 질문: ${userPrompt}` 
        : `반려동물 데이터: ${petDataStr}\n\n이 반려동물에 대한 ${analysisType} 분석을 제공해주세요.`;
      
      // API 호출
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // 최신 모델 사용
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.5,
      });
      
      const analysisResult = completion.choices[0].message.content;
      
      res.json({ 
        analysis: analysisResult,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("AI 분석 API 오류:", error);
      
      // API 키 관련 오류 처리
      if (error.code === 'invalid_api_key' || error.message?.includes('API key')) {
        return res.status(500).json({ 
          error: "API 키 오류", 
          message: "AI 서비스 연결에 문제가 있습니다. 관리자에게 문의하세요."
        });
      }
      
      res.status(500).json({ 
        error: "서버 오류", 
        message: "AI 분석을 생성하는 도중 오류가 발생했습니다." 
      });
    }
  });
}