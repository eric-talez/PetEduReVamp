import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Brain,
  Footprints,
  UtensilsCrossed,
  Bone,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TemplateType =
  | 'daily-progress'
  | 'behavior-analysis'
  | 'meal-record'
  | 'walk-activity'
  | 'potty-tracking'
  | 'custom';

interface Template {
  id: TemplateType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateType: TemplateType) => void;
}

export default function TemplateSelector({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const templates: Template[] = [
    {
      id: 'daily-progress',
      title: '일일 훈련 보고서',
      description: '하루 훈련 내용과 진행 상황을 종합적으로 기록',
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
    },
    {
      id: 'behavior-analysis',
      title: '행동 분석 보고서',
      description: '반려견의 행동 패턴 분석 및 개선 방향 제시',
      icon: <Brain className="h-6 w-6 text-purple-500" />,
    },
    {
      id: 'meal-record',
      title: '식사 기록',
      description: '하루 식사량, 간식, 물 섭취량 등을 기록',
      icon: <UtensilsCrossed className="h-6 w-6 text-green-500" />,
    },
    {
      id: 'walk-activity',
      title: '산책 활동',
      description: '산책 시간, 거리, 반응 등을 상세히 기록',
      icon: <Footprints className="h-6 w-6 text-orange-500" />,
    },
    {
      id: 'potty-tracking',
      title: '배변 기록',
      description: '배변 시간, 상태, 특이사항 등을 기록',
      icon: <Bone className="h-6 w-6 text-red-500" />,
    },
    {
      id: 'custom',
      title: '직접 작성',
      description: '템플릿 없이 자유롭게 작성',
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>템플릿 선택</DialogTitle>
          <DialogDescription>
            원하는 템플릿을 선택하거나 직접 작성할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                'cursor-pointer transition-all hover:border-primary',
                'transform hover:scale-105'
              )}
              onClick={() => {
                onSelectTemplate(template.id);
                onOpenChange(false);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  {template.icon}
                  <span className="ml-2">{template.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{template.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}