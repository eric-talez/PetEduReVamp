import type { Express } from "express";
import OpenAI from "openai";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function registerAIRoutes(app: Express) {
  // AI 챗봇 엔드포인트
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages, model = 'gpt-4o', maxTokens = 1000 } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: '메시지가 필요합니다.' });
      }

      // 시스템 프롬프트 추가
      const systemPrompt = {
        role: 'system',
        content: `당신은 TALEZ의 반려동물 전문 AI 도우미입니다. 
        
        역할:
        - 반려동물 건강, 훈련, 영양, 행동에 대한 전문적이고 정확한 조언 제공
        - 한국어로 친근하고 이해하기 쉽게 응답
        - 긴급한 의료 상황에서는 즉시 수의사 방문을 권장
        - TALEZ 플랫폼의 서비스(훈련사 매칭, 건강 관리 등)를 적절히 언급
        
        응답 가이드라인:
        - 구체적이고 실용적인 조언 제공
        - 전문 용어는 쉽게 설명
        - 안전을 최우선으로 고려
        - 200-300자 내외로 간결하게 답변
        - 필요시 관련 전문가나 수의사 상담 권장`
      };

      // OpenAI API 호출
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [systemPrompt, ...messages],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const response = completion.choices[0]?.message?.content || '응답을 생성할 수 없습니다.';

      res.json({ 
        response,
        usage: completion.usage,
        model: completion.model
      });

    } catch (error: any) {
      console.error('OpenAI API 오류:', error);
      
      // API 키 관련 오류 처리
      if (error.code === 'invalid_api_key') {
        return res.status(401).json({ 
          error: 'OpenAI API 키가 유효하지 않습니다.',
          fallback: true
        });
      }
      
      // 할당량 초과 오류 처리
      if (error.code === 'insufficient_quota') {
        return res.status(429).json({ 
          error: 'API 사용량이 초과되었습니다.',
          fallback: true
        });
      }

      // 기타 오류 처리
      res.status(500).json({ 
        error: 'AI 응답 생성 중 오류가 발생했습니다.',
        fallback: true,
        details: error.message
      });
    }
  });

  // AI 기능 상태 확인 엔드포인트
  app.get('/api/ai/status', async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.json({ 
          available: false, 
          reason: 'API 키가 설정되지 않았습니다.' 
        });
      }

      // 간단한 테스트 요청으로 API 상태 확인
      const testCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      });

      res.json({ 
        available: true, 
        model: testCompletion.model,
        usage: testCompletion.usage
      });

    } catch (error: any) {
      console.error('AI 상태 확인 오류:', error);
      res.json({ 
        available: false, 
        reason: error.message 
      });
    }
  });
}