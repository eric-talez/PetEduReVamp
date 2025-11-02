import { Express, Request, Response } from 'express';
import OpenAI from 'openai';
import config from '../config';

const openai = config.OPENAI_API_KEY || config.OPENAI_API_TALEZ 
  ? new OpenAI({ apiKey: config.OPENAI_API_KEY || config.OPENAI_API_TALEZ }) 
  : null;

export function registerMediaAnalysisRoutes(app: Express) {
  app.post('/api/ai/analyze-media', async (req: Request, res: Response) => {
    try {
      const { imageBase64, petId, model = 'gpt-4o', memo } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ 
          success: false, 
          message: '이미지 데이터가 필요합니다.' 
        });
      }

      if (!petId) {
        return res.status(400).json({ 
          success: false, 
          message: '반려동물을 선택해주세요.' 
        });
      }

      if (!openai) {
        return res.status(200).json({
          success: true,
          message: 'OpenAI API가 설정되지 않아 데모 분석 결과를 제공합니다.',
          analysis: {
            summary: '(데모 분석) 이미지가 업로드되었습니다. OpenAI API 설정 후 실제 분석이 가능합니다.',
            posture: {
              score: 75,
              notes: '데모 모드: API 키를 설정하면 실제 자세 분석 결과가 표시됩니다.',
              keyFindings: ['API 설정 필요']
            },
            behavior: {
              observed: ['이미지 업로드 확인됨'],
              concerns: [],
              positive: ['정상적으로 업로드됨']
            },
            health: {
              status: '데모 모드',
              warnings: [],
              recommendations: ['OpenAI API 키를 설정하세요']
            },
            issues: ['OpenAI API 키가 설정되지 않았습니다'],
            solutions: ['관리자에게 문의하여 API 키를 설정하세요']
          },
          tokensUsed: { in: 0, out: 0 },
          model: 'demo-mode'
        });
      }

      const prompt = `당신은 반려견 전문가입니다. 제공된 이미지를 분석하여 다음 정보를 한국어로 제공해주세요:

1. **자세 분석 (Posture Analysis)**:
   - 자세 점수 (0-100점)
   - 자세 관련 주요 발견사항
   - 자세 개선 노트

2. **행동 분석 (Behavior Analysis)**:
   - 관찰된 행동들
   - 우려되는 행동 패턴
   - 긍정적인 행동들

3. **건강 상태 분석 (Health Status)**:
   - 전반적인 건강 상태
   - 건강 경고사항 (있는 경우)
   - 건강 관리 권장사항

4. **문제점 식별 (Issues)**:
   - 발견된 문제점들

5. **해결방안 (Solutions)**:
   - 구체적인 개선 방법
   - 단계별 실행 계획

${memo ? `\n사용자 메모: ${memo}` : ''}

반드시 다음 JSON 형식으로 응답해주세요:
{
  "summary": "종합 분석 요약",
  "posture": {
    "score": 85,
    "notes": "자세 분석 내용",
    "keyFindings": ["발견사항 1", "발견사항 2"]
  },
  "behavior": {
    "observed": ["관찰된 행동 1", "관찰된 행동 2"],
    "concerns": ["우려사항 1"],
    "positive": ["긍정적 행동 1"]
  },
  "health": {
    "status": "건강 상태 설명",
    "warnings": ["경고사항 1"],
    "recommendations": ["권장사항 1", "권장사항 2"]
  },
  "issues": ["문제점 1", "문제점 2"],
  "solutions": ["해결방안 1", "해결방안 2", "해결방안 3"]
}`;

      console.log('[Media Analysis] 이미지 분석 시작:', { 
        petId, 
        model, 
        imageLength: imageBase64.length,
        userId: req.user?.id 
      });

      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('AI 응답이 비어있습니다');
      }

      console.log('[Media Analysis] AI 응답 받음:', content.substring(0, 200));

      let analysis;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          analysis = JSON.parse(content);
        }
      } catch (parseError) {
        console.error('[Media Analysis] JSON 파싱 실패:', content);
        analysis = {
          summary: content,
          posture: {
            score: 0,
            notes: 'JSON 파싱 실패',
            keyFindings: []
          },
          behavior: {
            observed: [],
            concerns: [],
            positive: []
          },
          health: {
            status: '분석 결과 파싱 오류',
            warnings: [],
            recommendations: []
          },
          issues: ['응답 형식 오류'],
          solutions: ['다시 시도해주세요']
        };
      }

      const tokensUsed = {
        in: response.usage?.prompt_tokens || 0,
        out: response.usage?.completion_tokens || 0
      };

      console.log('[Media Analysis] 분석 완료:', {
        petId,
        tokensUsed,
        hasSummary: !!analysis.summary
      });

      return res.json({
        success: true,
        analysis,
        tokensUsed,
        model: response.model
      });

    } catch (error: any) {
      console.error('[Media Analysis] 오류:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'AI 분석 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  });

  console.log('[Media Analysis Routes] 미디어 분석 라우트가 등록되었습니다.');
}
