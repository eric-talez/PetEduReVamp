import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, Lock, Store } from 'lucide-react';

/**
 * 쇼핑 로그인 요구 페이지
 * - 비인증 사용자가 쇼핑 페이지 접근 시 로그인 요구 안내
 */
export default function ShopLoginRequired() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* 왼쪽 콘텐츠 영역 (설명 및 버튼) */}
          <div className="p-8 md:w-1/2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">펫에듀 쇼핑</h1>
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">로그인이 필요한 페이지입니다</h2>
            
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              쇼핑 페이지에 접근하려면 로그인이 필요합니다. 로그인하시면 다음과 같은 혜택을 받으실 수 있습니다:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Store className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">다양한 펫 용품 쇼핑</span>
              </li>
              <li className="flex items-start">
                <User className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">맞춤형 상품 추천</span>
              </li>
              <li className="flex items-start">
                <Lock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">안전한 결제 및 주문 관리</span>
              </li>
            </ul>
            
            <div className="space-y-3">
              <Link href="/auth" className="w-full">
                <Button className="w-full" size="lg">로그인하기</Button>
              </Link>
              <Link href="/auth?tab=register" className="w-full">
                <Button variant="outline" className="w-full" size="lg">회원가입하기</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full" size="lg">홈으로 돌아가기</Button>
              </Link>
            </div>
          </div>
          
          {/* 오른쪽 이미지 영역 */}
          <div className="md:w-1/2 bg-primary/10 dark:bg-primary/5 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block p-4 bg-white dark:bg-gray-700 rounded-full mb-4 shadow-md">
                <ShoppingBag className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">펫 케어 상품 쇼핑</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                펫에듀 쇼핑몰에서 반려동물을 위한 모든 것을 찾아보세요. 다양한 할인 혜택과 프로모션이 기다리고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}