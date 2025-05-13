import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { generateTemplateContent } from '@/lib/notebook-ai';

const templateTypes = [
  {
    id: 'daily-progress',
    title: '일일 훈련 보고서',
    description: '반려견의 일일 훈련 진행 상황, 성취도, 특이사항 등을 기록합니다.',
    icon: '📋'
  },
  {
    id: 'behavior-analysis',
    title: '행동 분석 보고서',
    description: '반려견의 특정 행동에 대한 분석과 개선 방안을 제시합니다.',
    icon: '🔍'
  },
  {
    id: 'meal-record',
    title: '식사 기록',
    description: '반려견의 식사량, 식성, 간식 등의 정보를 기록합니다.',
    icon: '🍽️'
  },
  {
    id: 'walk-activity',
    title: '산책 활동 기록',
    description: '산책 시간, 코스, 반응, 만난 다른 동물 등을 기록합니다.',
    icon: '🦮'
  },
  {
    id: 'potty-tracking',
    title: '배변 기록',
    description: '배변 시간, 상태, 특이사항 등을 기록합니다.',
    icon: '🧻'
  }
];

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: { title: string; content: string; tags: string[] }) => void;
  petName: string;
  petBreed: string;
}

export default function TemplateSelector({
  open,
  onOpenChange,
  onSelectTemplate,
  petName,
  petBreed
}: TemplateSelectorProps) {
  const [selectedTab, setSelectedTab] = useState('daily-progress');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleSelectTemplate = async (templateType: string) => {
    setIsGenerating(true);
    try {
      const template = await generateTemplateContent(templateType, petName, petBreed);
      onSelectTemplate(template);
      onOpenChange(false);
    } catch (error) {
      console.error('템플릿 생성 오류:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 사전 정의된 템플릿 선택
  const selectPredefinedTemplate = (templateType: string) => {
    let title = '';
    let content = '';
    let tags: string[] = [];
    
    switch (templateType) {
      case 'daily-progress':
        title = `${petName}의 일일 훈련 보고서`;
        content = `오늘의 훈련 내용:
1. 훈련 목표: 
2. 실행한 훈련: 
3. 반려견 반응: 
4. 특이사항: 
5. 다음 훈련 계획: 

집에서 연습하면 좋을 포인트:
- 
- 
- 

추가 코멘트:
`;
        tags = ['일일보고', '훈련', '진행상황'];
        break;
        
      case 'behavior-analysis':
        title = `${petName}의 행동 분석 보고서`;
        content = `행동 분석:
1. 관찰된 행동: 
2. 행동 원인 분석: 
3. 개선 방안: 
4. 훈련 추천: 
5. 주의 사항: 

보호자 피드백:
- `;
        tags = ['행동분석', '심리', '솔루션'];
        break;
        
      case 'meal-record':
        title = `${petName}의 식사 기록`;
        content = `${petName}의 식사 기록:
- 아침 식사 (시간: , 양: , 사료 종류: )
- 점심 식사 (시간: , 양: , 사료 종류: )
- 저녁 식사 (시간: , 양: , 사료 종류: )

간식:
- 종류: , 시간: , 양: 

물 섭취량: 

특이사항: `;
        tags = ['식사기록', '영양', '건강관리'];
        break;
        
      case 'walk-activity':
        title = `${petName}의 산책 활동 기록`;
        content = `${petName}의 산책 기록:
- 시간:  (총  분)
- 거리: 
- 경로: 
- 날씨 상태: 
- 반려견 반응: 
- 만난 다른 동물/사람: 
- 특이사항: 

활동 중 훈련 내용:


다음 산책 계획:
`;
        tags = ['산책', '운동', '야외활동'];
        break;
        
      case 'potty-tracking':
        title = `${petName}의 배변 기록`;
        content = `${petName}의 배변 기록:
- 배변 시간 1: , 상태: , 장소: 
- 배변 시간 2: , 상태: , 장소: 

배변 훈련 진행 상황:


특이사항/건강 상태:
`;
        tags = ['배변기록', '건강체크', '훈련'];
        break;
        
      default:
        title = `${petName}의 알림장`;
        content = `${petName}의 알림장:


특이사항:
`;
        tags = ['알림장', '기록', '반려견'];
    }
    
    onSelectTemplate({ title, content, tags });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>알림장 템플릿 선택</DialogTitle>
          <DialogDescription>
            작성하려는 알림장 유형을 선택해주세요. AI가 적절한 템플릿을 생성하거나 기본 템플릿을 사용할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs
          defaultValue="daily-progress"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full">
            {templateTypes.map(template => (
              <TabsTrigger
                key={template.id}
                value={template.id}
                className="flex flex-col items-center text-xs py-2"
              >
                <span className="text-lg">{template.icon}</span>
                <span className="truncate max-w-[70px]">{template.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {templateTypes.map(template => (
            <TabsContent key={template.id} value={template.id} className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => selectPredefinedTemplate(selectedTab)}
            className="sm:w-1/2"
          >
            기본 템플릿 사용
          </Button>
          <Button
            type="button"
            onClick={() => handleSelectTemplate(selectedTab)}
            disabled={isGenerating}
            className="sm:w-1/2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI로 템플릿 생성 중...
              </>
            ) : (
              'AI로 템플릿 생성'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}