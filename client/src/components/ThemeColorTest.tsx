import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeColorTest() {
  const { theme, setTheme } = useTheme();

  const testColors = [
    { name: 'Primary', class: 'bg-primary text-primary-foreground' },
    { name: 'Secondary', class: 'bg-secondary text-secondary-foreground' },
    { name: 'Success', class: 'bg-success text-success-foreground' },
    { name: 'Info', class: 'bg-info text-info-foreground' },
    { name: 'Warning', class: 'bg-warning text-warning-foreground' },
    { name: 'Error', class: 'bg-error text-error-foreground' },
    { name: 'Muted', class: 'bg-muted text-muted-foreground' },
    { name: 'Accent', class: 'bg-accent text-accent-foreground' },
    { name: 'Destructive', class: 'bg-destructive text-destructive-foreground' },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">테마 색상 테스트</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? '라이트 모드' : '다크 모드'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 색상 팔레트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>색상 팔레트</CardTitle>
            <CardDescription>
              현재 테마: {theme === 'dark' ? '다크 모드' : '라이트 모드'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testColors.map((color) => (
              <div
                key={color.name}
                className={`p-4 rounded-lg ${color.class} flex items-center justify-between`}
              >
                <span className="font-medium">{color.name}</span>
                <Badge variant="outline" className="bg-background text-foreground">
                  {color.class}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 버튼 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>버튼 색상 테스트</CardTitle>
            <CardDescription>
              다양한 버튼 스타일과 색상 대비 확인
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">기본 버튼</h4>
              <div className="flex gap-2 flex-wrap">
                <Button variant="default">기본</Button>
                <Button variant="secondary">보조</Button>
                <Button variant="outline">테두리</Button>
                <Button variant="ghost">고스트</Button>
                <Button variant="link">링크</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">상태 버튼</h4>
              <div className="flex gap-2 flex-wrap">
                <Button className="bg-success hover:bg-success/90 text-success-foreground">
                  성공
                </Button>
                <Button className="bg-info hover:bg-info/90 text-info-foreground">
                  정보
                </Button>
                <Button className="bg-warning hover:bg-warning/90 text-warning-foreground">
                  경고
                </Button>
                <Button className="bg-error hover:bg-error/90 text-error-foreground">
                  오류
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">크기별 버튼</h4>
              <div className="flex gap-2 items-center flex-wrap">
                <Button size="sm">작은</Button>
                <Button size="default">기본</Button>
                <Button size="lg">큰</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 텍스트 가독성 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>텍스트 가독성</CardTitle>
            <CardDescription>
              배경과 텍스트의 대비 확인
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="p-3 bg-background border rounded">
                <h4 className="text-foreground font-medium">기본 텍스트</h4>
                <p className="text-muted-foreground">보조 텍스트</p>
              </div>
              
              <div className="p-3 bg-card border rounded">
                <h4 className="text-card-foreground font-medium">카드 텍스트</h4>
                <p className="text-muted-foreground">카드 내 보조 텍스트</p>
              </div>

              <div className="p-3 bg-muted rounded">
                <h4 className="text-muted-foreground font-medium">뮤트 배경</h4>
                <p className="text-muted-foreground/80">뮤트 배경의 텍스트</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상태 배지 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>상태 배지</CardTitle>
            <CardDescription>
              상태별 색상과 대비 확인
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge className="status-success">성공</Badge>
              <Badge className="status-info">정보</Badge>
              <Badge className="status-warning">경고</Badge>
              <Badge className="status-error">오류</Badge>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">기본</Badge>
              <Badge variant="secondary">보조</Badge>
              <Badge variant="outline">테두리</Badge>
              <Badge variant="destructive">파괴적</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 접근성 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>접근성 정보</CardTitle>
          <CardDescription>
            WCAG 2.1 AA 기준 색상 대비 확인
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>✅ 일반 텍스트: 최소 4.5:1 대비율</p>
            <p>✅ 큰 텍스트: 최소 3:1 대비율</p>
            <p>✅ 버튼 및 상호작용 요소: 최소 3:1 대비율</p>
            <p>✅ 포커스 인디케이터: 최소 3:1 대비율</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}