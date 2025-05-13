import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileBarChart, UtensilsCrossed, Shield, Footprints, Play, CheckCircle2 } from "lucide-react";

export type TemplateType = 'daily-report' | 'behavior-analysis' | 'meal-record' | 'health-check' | 'walk-record' | 'play-record';

interface TemplateSelectorProps {
  onSelectTemplate: (templateType: TemplateType, templateData: any) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateType | null>(null);
  
  const templates = [
    {
      id: 'daily-report',
      title: '일일 보고서',
      description: '반려동물의 하루 전체 활동을 기록하는 템플릿입니다.',
      icon: <FileText className="h-10 w-10" />,
      data: {
        title: '오늘의 일일 보고서',
        content: `안녕하세요! 오늘 하루 반려동물의 모습을 알려드립니다.

오늘은 전반적으로 건강하고 활발한 모습을 보였습니다. 식사량과 물 섭취량 모두 정상이었으며, 산책 시간에는 특히 즐거워하는 모습이었습니다.

특별히 관찰된 점이나 특이사항은 없었습니다. 내일도 건강하고 즐거운 하루가 되길 바랍니다!`,
        tags: ['일일보고', '활동', '건강체크']
      }
    },
    {
      id: 'behavior-analysis',
      title: '행동 분석',
      description: '반려동물의 특정 행동을 분석하는 템플릿입니다.',
      icon: <FileBarChart className="h-10 w-10" />,
      data: {
        title: '행동 분석 보고서',
        content: `오늘 집중적으로 관찰한 행동에 대해 분석해보았습니다.

[행동 설명]
- 관찰된 행동: 
- 발생 상황: 
- 빈도: 
- 강도: 

[분석]
이 행동은 다음과 같은 원인에서 비롯된 것으로 추측됩니다:
- 

[대응 방법]
이러한 행동에 대응하기 위해 다음과 같은 방법을 추천드립니다:
1. 
2. 
3. 

계속 관찰하면서 진행 상황을 업데이트 드리겠습니다.`,
        tags: ['행동분석', '관찰', '솔루션']
      }
    },
    {
      id: 'meal-record',
      title: '식사 기록',
      description: '반려동물의 식사량과 반응을 기록하는 템플릿입니다.',
      icon: <UtensilsCrossed className="h-10 w-10" />,
      data: {
        title: '오늘의 식사 기록',
        content: `오늘의 식사 기록을 공유드립니다.

[아침]
- 사료: 
- 간식: 
- 물: 
- 식사량: 
- 식사 패턴: 

[점심]
- 사료: 
- 간식: 
- 물: 
- 식사량: 
- 식사 패턴: 

[저녁]
- 사료: 
- 간식: 
- 물: 
- 식사량: 
- 식사 패턴: 

전반적인 식사 상태는 양호합니다. 특별한 변화나 이상 징후는 발견되지 않았습니다.`,
        tags: ['식사', '영양', '사료']
      }
    },
    {
      id: 'health-check',
      title: '건강 체크',
      description: '반려동물의 건강 상태를 체크하는 템플릿입니다.',
      icon: <Shield className="h-10 w-10" />,
      data: {
        title: '건강 상태 체크',
        content: `오늘의 건강 상태 체크 결과를 공유드립니다.

[기본 상태]
- 체온: 
- 호흡: 
- 체중: 
- 피부/모질: 
- 눈/귀/코: 
- 배변 상태: 

[관찰된 사항]
- 에너지 수준: 
- 식욕: 
- 음수량: 
- 활동량: 

[특이사항]

[권장사항]

전반적인 건강 상태는 양호합니다. 위 사항 외에 특별한 이상 징후는 발견되지 않았습니다.`,
        tags: ['건강체크', '관리', '상태확인']
      }
    },
    {
      id: 'walk-record',
      title: '산책 기록',
      description: '반려동물의 산책 활동을 기록하는 템플릿입니다.',
      icon: <Footprints className="h-10 w-10" />,
      data: {
        title: '오늘의 산책 기록',
        content: `오늘의 산책 활동을 공유드립니다.

[산책 정보]
- 시간: 
- 장소: 
- 날씨: 
- 거리: 
- 지속 시간: 

[관찰된 행동]
- 리드줄 반응: 
- 다른 동물 만남: 
- 환경 반응: 
- 체력 상태: 

[특이사항]

오늘의 산책은 전반적으로 즐겁고 활동적이었습니다. 다음 산책에서도 즐거운 시간이 되길 바랍니다.`,
        tags: ['산책', '운동', '야외활동']
      }
    },
    {
      id: 'play-record',
      title: '놀이 기록',
      description: '반려동물의 놀이 활동을 기록하는 템플릿입니다.',
      icon: <Play className="h-10 w-10" />,
      data: {
        title: '오늘의 놀이 활동',
        content: `오늘의 놀이 활동을 공유드립니다.

[놀이 종류]
- 
- 
- 

[관찰된 행동]
- 참여도: 
- 선호 장난감: 
- 집중 시간: 
- 에너지 수준: 

[특이사항]

오늘의 놀이 시간은 매우 즐겁고 활동적이었습니다. 앞으로도 다양한 놀이를 통해 정신적, 신체적 자극을 제공하겠습니다.`,
        tags: ['놀이', '활동', '장난감']
      }
    }
  ];

  // 템플릿 선택 핸들러
  const handleSelectTemplate = (template: TemplateType, data: any) => {
    setSelectedTemplateId(template);
    onSelectTemplate(template, data);
  };
  
  // 선택된 템플릿 내용 미리보기
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="space-y-6">
      {/* 템플릿 선택 버튼 그룹 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplateId(template.id as TemplateType)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
              ${selectedTemplateId === template.id 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className={`p-3 rounded-full mb-2 ${selectedTemplateId === template.id ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
              {template.icon}
            </div>
            <h3 className="font-medium text-center">{template.title}</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">{template.description}</p>
          </button>
        ))}
      </div>
      
      {/* 선택된 템플릿 미리보기 */}
      {selectedTemplate && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{selectedTemplate.data.title}</h3>
            <div className="flex gap-1">
              {selectedTemplate.data.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded max-h-40 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{selectedTemplate.data.content}</pre>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => handleSelectTemplate(selectedTemplate.id as TemplateType, selectedTemplate.data)}
              size="lg"
              className="gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              이 템플릿 사용하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}