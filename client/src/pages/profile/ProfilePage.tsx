import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const auth = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-4xl text-gray-500 dark:text-gray-400">
                {auth?.userName ? auth.userName.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold">{auth?.userName || '사용자'}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {auth?.userRole === 'admin' && '시스템 관리자'}
              {auth?.userRole === 'trainer' && '훈련사'}
              {auth?.userRole === 'institute-admin' && '기관 관리자'}
              {auth?.userRole === 'pet-owner' && '견주 회원'}
              {auth?.userRole === 'user' && '일반 회원'}
              {!auth?.userRole && '일반 회원'}
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                <p>user@example.com</p>
              </div>
              <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400">연락처</p>
                <p>010-1234-5678</p>
              </div>
              <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400">가입일</p>
                <p>2023년 8월 15일</p>
              </div>
              <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400">최근 로그인</p>
                <p>2023년 10월 5일</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}