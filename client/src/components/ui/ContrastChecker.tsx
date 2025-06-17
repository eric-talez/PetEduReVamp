
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from '@/context/theme-context';
import { 
  checkAllThemeContrasts, 
  checkPageContrasts,
  themeColorPairs,
  type ContrastResult 
} from '@/utils/contrast-checker';
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Palette,
  Monitor
} from 'lucide-react';

interface ContrastCheckProps {
  showDialog?: boolean;
}

export function ContrastChecker({ showDialog = false }: ContrastCheckProps) {
  const { theme } = useTheme();
  const [themeResults, setThemeResults] = useState<{
    light: ContrastResult[];
    dark: ContrastResult[];
  }>({ light: [], dark: [] });
  
  const [pageResults, setPageResults] = useState<Array<{
    element: HTMLElement;
    result: ContrastResult;
    selector: string;
  }>>([]);
  
  const [isChecking, setIsChecking] = useState(false);

  // 테마 색상 대비 체크
  const checkThemeContrasts = () => {
    setIsChecking(true);
    setTimeout(() => {
      const results = checkAllThemeContrasts();
      setThemeResults(results);
      setIsChecking(false);
    }, 100);
  };

  // 페이지 대비 체크
  const checkPageAccessibility = () => {
    setIsChecking(true);
    setTimeout(() => {
      const results = checkPageContrasts();
      setPageResults(results);
      setIsChecking(false);
    }, 300);
  };

  useEffect(() => {
    checkThemeContrasts();
  }, []);

  const getLevelColor = (level: ContrastResult['level']) => {
    switch (level) {
      case 'AAA': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'AA': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'AA Large': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Fail': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    }
  };

  const ContrastTable = ({ results, colorPairs, mode }: {
    results: ContrastResult[];
    colorPairs: typeof themeColorPairs.light;
    mode: string;
  }) => (
    <div className="space-y-3">
      {results.map((result, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: colorPairs[index].background }}
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ 
                    backgroundColor: colorPairs[index].background,
                    color: colorPairs[index].foreground,
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Aa
                </div>
              </div>
              <div>
                <p className="font-medium">{colorPairs[index].description}</p>
                <p className="text-sm text-muted-foreground">
                  {colorPairs[index].foreground} / {colorPairs[index].background}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono">
                {result.ratio.toFixed(2)}:1
              </span>
              <Badge className={getLevelColor(result.level)}>
                {result.level}
              </Badge>
              {result.isAccessible ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          {result.recommendation && (
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{result.recommendation}</AlertDescription>
            </Alert>
          )}
        </Card>
      ))}
    </div>
  );

  const AccessibilityIssues = () => (
    <div className="space-y-3">
      {pageResults.length === 0 ? (
        <Card className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            페이지에서 접근성 문제가 발견되지 않았습니다.
          </p>
        </Card>
      ) : (
        pageResults.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.selector}</p>
                <p className="text-sm text-muted-foreground">
                  대비 비율: {item.result.ratio.toFixed(2)}:1
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getLevelColor(item.result.level)}>
                  {item.result.level}
                </Badge>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            </div>
            {item.result.recommendation && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{item.result.recommendation}</AlertDescription>
              </Alert>
            )}
          </Card>
        ))
      )}
    </div>
  );

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">접근성 대비 검사</h3>
          <p className="text-sm text-muted-foreground">
            WCAG 2.1 기준으로 색상 대비를 확인합니다
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkThemeContrasts}
            disabled={isChecking}
          >
            <Palette className="w-4 h-4 mr-2" />
            테마 체크
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={checkPageAccessibility}
            disabled={isChecking}
          >
            <Monitor className="w-4 h-4 mr-2" />
            페이지 체크
          </Button>
        </div>
      </div>

      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme">테마 색상</TabsTrigger>
          <TabsTrigger value="light">라이트 모드</TabsTrigger>
          <TabsTrigger value="dark">다크 모드</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-4">
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              현재 활성 테마: <strong>{theme === 'dark' ? '다크 모드' : '라이트 모드'}</strong>
            </AlertDescription>
          </Alert>
          <AccessibilityIssues />
        </TabsContent>
        
        <TabsContent value="light" className="space-y-4">
          <ContrastTable 
            results={themeResults.light}
            colorPairs={themeColorPairs.light}
            mode="light"
          />
        </TabsContent>
        
        <TabsContent value="dark" className="space-y-4">
          <ContrastTable 
            results={themeResults.dark}
            colorPairs={themeColorPairs.dark}
            mode="dark"
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  if (showDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            대비 검사
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>색상 대비 접근성 검사</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          색상 대비 검사
        </CardTitle>
        <CardDescription>
          라이트/다크 모드에서 텍스트와 배경의 대비를 확인합니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}

export default ContrastChecker;
