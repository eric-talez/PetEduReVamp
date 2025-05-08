import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { SpecialShopLink } from "@/components/SpecialShopLink";

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
              <a href="/shop" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                /shop 링크
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = window.location.origin + '/shop';
                }} 
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                전체 URL /shop
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  const url = new URL('/shop', window.location.origin);
                  console.log('새 URL 생성:', url.toString());
                  window.location.href = url.toString();
                }} 
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                URL 객체 이용
              </a>
              <a href="/" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                홈으로 이동
              </a>
              <SpecialShopLink className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors">
                특수 쇼핑 링크
              </SpecialShopLink>
              <a href="/shop-redirect" className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">
                쇼핑 리다이렉트
              </a>
              <div className="w-full mt-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">현재 URL: {window.location.href}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Origin: {window.location.origin}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Pathname: {window.location.pathname}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
