import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [location, setLocation] = useLocation();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // 잘못된 URL 분석 후 추천 경로 생성
  useEffect(() => {
    // 기본 추천 경로 목록
    const defaultSuggestions = ["/", "/courses", "/trainers", "/pets"];
    
    // 현재 경로에 따른 추천 알고리즘
    const path = location.toLowerCase();
    const customSuggestions = [];
    
    // 일부 경로 패턴 확인 및 추천
    if (path.includes("train") || path.includes("course")) {
      customSuggestions.push("/courses", "/trainers");
    } else if (path.includes("pet") || path.includes("dog") || path.includes("cat")) {
      customSuggestions.push("/pets", "/pet-care");
    } else if (path.includes("shop") || path.includes("store") || path.includes("buy")) {
      customSuggestions.push("/shop");
    }
    
    // 중복 제거 후 최종 추천 목록 설정
    const allSuggestions = [...customSuggestions, ...defaultSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    setSuggestions(uniqueSuggestions.slice(0, 4));
  }, [location]);
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg border-0 dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center mb-6 gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">페이지를 찾을 수 없습니다</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                요청하신 페이지가 존재하지 않거나 접근 권한이 없습니다
              </p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 my-6">
            <h2 className="text-base font-medium mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Search className="h-4 w-4" />
              추천 페이지
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <Link 
                  key={index} 
                  href={suggestion}
                  className="text-primary hover:text-primary-dark dark:text-primary-light 
                    dark:hover:text-primary-lighter transition-colors p-2 rounded 
                    hover:bg-gray-200 dark:hover:bg-gray-700/50 text-sm flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {suggestion === "/" ? "홈" : 
                    suggestion.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.history.back()}
            className="text-sm"
          >
            이전 페이지로
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setLocation("/")}
            className="text-sm flex items-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            홈으로 이동
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
