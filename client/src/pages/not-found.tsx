import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  console.log("404 - 페이지를 찾을 수 없습니다");
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            페이지를 찾을 수 없습니다. 
          </p>
          
          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
            <p className="text-blue-700 dark:text-blue-300 font-medium">디버깅용 링크:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <a href="/shop-new" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                /shop-new 링크
              </a>
              <a href="/" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                홈으로 이동
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
