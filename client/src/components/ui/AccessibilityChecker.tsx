import { useState, useEffect } from 'react';
import {
  Bell,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import * as a11yChecker from '@/utils/a11y-checker';

interface AccessibilityIssue {
  type: string;
  message: string;
  element?: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

interface A11yCheckResult {
  summary: {
    totalIssues: number;
    imageIssues: number;
    colorIssues: number;
    formIssues: number;
    keyboardIssues: number;
    headingIssues: number;
    ariaIssues: number;
  };
  details: {
    image: string[];
    color: string[];
    form: string[];
    keyboard: string[];
    heading: string[];
    aria: string[];
  };
}

const issueImpactMap: Record<string, 'critical' | 'serious' | 'moderate' | 'minor'> = {
  // 이미지 관련 이슈
  'alt 속성이 없습니다': 'critical',
  'alt 텍스트가 너무 깁니다': 'moderate',
  
  // 색상 대비 이슈
  '색상 대비가 부족합니다': 'serious',
  
  // 폼 관련 이슈
  'id 속성이 없습니다': 'serious',
  '연결된 레이블이 없습니다': 'serious',
  'aria-required': 'moderate',
  'aria-describedby': 'moderate',
  '제출 버튼이 없습니다': 'critical',
  
  // 키보드 접근성 이슈
  '포커스 표시가 없을 수 있습니다': 'serious',
  '텍스트나 접근성 레이블이 없습니다': 'critical',
  '의미 없는 텍스트': 'moderate',
  
  // 헤딩 구조 이슈
  '텍스트가 없습니다': 'serious',
  '헤딩 순서가 잘못되었습니다': 'moderate',
  'h1 요소가 첫 번째 헤딩으로 사용되지 않았습니다': 'moderate',
  
  // ARIA 이슈
  '부적절한 role': 'serious',
  '필수 속성이 누락되었습니다': 'serious'
};

const getIssueImpact = (issue: string): 'critical' | 'serious' | 'moderate' | 'minor' => {
  for (const [key, impact] of Object.entries(issueImpactMap)) {
    if (issue.includes(key)) return impact;
  }
  return 'moderate'; // 기본값
};

const getIssueIcon = (impact: 'critical' | 'serious' | 'moderate' | 'minor') => {
  switch (impact) {
    case 'critical':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'serious':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'moderate':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'minor':
      return <Info className="h-4 w-4 text-gray-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

export function AccessibilityChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<A11yCheckResult | null>(null);
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    image: true,
    color: true,
    form: true,
    keyboard: true,
    heading: true,
    aria: true
  });

  // 카테고리별 이슈 데이터
  const categorizedIssues = result ? {
    image: result.details.image.map(issue => ({ 
      type: 'image', 
      message: issue, 
      impact: getIssueImpact(issue) 
    })),
    color: result.details.color.map(issue => ({ 
      type: 'color', 
      message: issue, 
      impact: getIssueImpact(issue) 
    })),
    form: result.details.form.map(issue => ({ 
      type: 'form', 
      message: issue, 
      impact: getIssueImpact(issue) 
    })),
    keyboard: result.details.keyboard.map(issue => ({ 
      type: 'keyboard', 
      message: issue, 
      impact: getIssueImpact(issue) 
    })),
    heading: result.details.heading.map(issue => ({ 
      type: 'heading', 
      message: issue, 
      impact: getIssueImpact(issue) 
    })),
    aria: result.details.aria.map(issue => ({ 
      type: 'aria', 
      message: issue, 
      impact: getIssueImpact(issue) 
    }))
  } : null;

  // 카테고리별 타이틀과 설명
  const categoryInfo = {
    image: {
      title: '이미지 접근성',
      description: '이미지에 적절한 대체 텍스트가 제공되는지 확인합니다.'
    },
    color: {
      title: '색상 대비',
      description: '텍스트와 배경 간의 색상 대비가 충분한지 확인합니다.'
    },
    form: {
      title: '폼 접근성',
      description: '폼 요소가 적절히 레이블되고 접근 가능한지 확인합니다.'
    },
    keyboard: {
      title: '키보드 접근성',
      description: '모든 기능이 키보드로 접근 가능한지 확인합니다.'
    },
    heading: {
      title: '헤딩 구조',
      description: '헤딩 태그가 논리적인 순서로 사용되는지 확인합니다.'
    },
    aria: {
      title: 'ARIA 사용',
      description: 'ARIA 속성이 올바르게 사용되는지 확인합니다.'
    }
  };

  // 접근성 검사 실행
  const runA11yCheck = () => {
    setIsLoading(true);
    
    // 약간의 지연을 두어 UI가 응답하도록 함
    setTimeout(() => {
      try {
        const checkResult = a11yChecker.runAccessibilityCheck();
        setResult(checkResult);
      } catch (error) {
        console.error('접근성 검사 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // 포커스 가능한 요소 강조 토글
  const toggleFocusableHighlight = () => {
    const isActive = a11yChecker.toggleFocusableHighlight();
    setHighlightEnabled(isActive);
  };

  // 모든 카테고리 열기/닫기 토글
  const toggleAllCategories = (isOpen: boolean) => {
    setOpenCategories({
      image: isOpen,
      color: isOpen,
      form: isOpen,
      keyboard: isOpen,
      heading: isOpen,
      aria: isOpen
    });
  };

  // 카테고리별 열기/닫기 토글
  const toggleCategory = (category: string) => {
    setOpenCategories({
      ...openCategories,
      [category]: !openCategories[category]
    });
  };

  // 다이얼로그 열릴 때 자동으로 검사 실행
  useEffect(() => {
    if (isOpen) {
      runA11yCheck();
    }
  }, [isOpen]);

  // 다이얼로그 닫힐 때 하이라이트 제거
  useEffect(() => {
    if (!isOpen && highlightEnabled) {
      a11yChecker.toggleFocusableHighlight();
      setHighlightEnabled(false);
    }
  }, [isOpen, highlightEnabled]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5" 
          onClick={() => setIsOpen(true)}
        >
          <Settings className="h-4 w-4" />
          <span>접근성 검사</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            접근성 검사 도구
          </DialogTitle>
          <DialogDescription>
            웹 페이지의 접근성 문제를 검사하고 개선 방안을 제공합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-2 my-3">
          <Button 
            variant="default" 
            size="sm" 
            onClick={runA11yCheck}
            disabled={isLoading}
            className="gap-1.5"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                <span>검사 중...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>검사 실행</span>
              </>
            )}
          </Button>
          
          <Button 
            variant={highlightEnabled ? "secondary" : "outline"} 
            size="sm" 
            onClick={toggleFocusableHighlight}
            className="gap-1.5"
          >
            {highlightEnabled ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>하이라이트 끄기</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>포커스 요소 표시</span>
              </>
            )}
          </Button>
          
          <div className="ml-auto flex items-center gap-2">
            {result && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleAllCategories(true)}
                >
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                  모두 펼치기
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleAllCategories(false)}
                >
                  <ChevronUp className="h-3.5 w-3.5 mr-1" />
                  모두 접기
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">접근성 검사 중입니다...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className={`p-3 rounded-md ${
                result.summary.totalIssues === 0 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-center gap-2">
                  {result.summary.totalIssues === 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">
                      {result.summary.totalIssues === 0 
                        ? '접근성 문제가 발견되지 않았습니다!' 
                        : `발견된 접근성 문제: ${result.summary.totalIssues}개`}
                    </p>
                    {result.summary.totalIssues > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        아래 항목을 개선하여 더 많은 사용자가 콘텐츠에 접근할 수 있도록 해보세요.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {categorizedIssues && Object.entries(categorizedIssues).map(([category, issues]) => {
                if (issues.length === 0) return null;
                
                const categoryKey = category as keyof typeof categoryInfo;
                const info = categoryInfo[categoryKey];
                
                return (
                  <Collapsible 
                    key={category} 
                    open={openCategories[category]} 
                    onOpenChange={() => toggleCategory(category)}
                    className="border rounded-md"
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-normal">
                          {issues.length}
                        </Badge>
                        <div className="text-left">
                          <h3 className="text-sm font-medium">{info.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{info.description}</p>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openCategories[category] ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-1 space-y-2">
                        {issues.map((issue, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md text-sm ${
                              issue.impact === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' :
                              issue.impact === 'serious' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' :
                              issue.impact === 'moderate' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' :
                              'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex gap-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {getIssueIcon(issue.impact)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-gray-900 dark:text-gray-100">
                                    {issue.message}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`
                                      text-xs font-normal 
                                      ${issue.impact === 'critical' ? 'border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' : 
                                        issue.impact === 'serious' ? 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300' : 
                                        issue.impact === 'moderate' ? 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' : 
                                        'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}
                                    `}
                                  >
                                    {issue.impact === 'critical' ? '심각' : 
                                      issue.impact === 'serious' ? '중요' : 
                                      issue.impact === 'moderate' ? '중간' : 
                                      '낮음'
                                    }
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {info.title}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}

              {result.summary.totalIssues === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">좋은 소식입니다!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    현재 페이지에서 접근성 문제가 발견되지 않았습니다. 
                    모든 사용자가 콘텐츠에 접근할 수 있도록 계속 노력해주세요!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">접근성 검사 준비됨</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                '검사 실행' 버튼을 클릭하여 현재 페이지의 접근성 상태를 확인하세요.
                자동화된 테스트로 주요 문제점을 발견할 수 있습니다.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center mr-auto">
                  <Info className="h-4 w-4 text-gray-400 mr-1.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    자동화된 검사는 모든 접근성 문제를 발견할 수 없습니다. 
                    수동 검사도 함께 진행하세요.
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  자동화된 검사는 WCAG 2.1 지침의 일부만 확인할 수 있습니다. 
                  더 정확한 접근성 평가를 위해 스크린 리더 테스트, 키보드 탐색 테스트, 
                  실제 사용자 테스트 등 다양한 수동 검사를 함께 진행하는 것이 좋습니다.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}