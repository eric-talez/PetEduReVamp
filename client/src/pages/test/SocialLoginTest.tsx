
import React from 'react';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuth } from '@/hooks/useAuth';

const SocialLoginTest = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            소셜 로그인 테스트
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            카카오, 네이버, 구글 간편로그인을 테스트해보세요
          </p>
        </div>

        {isAuthenticated ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  로그인 성공!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>사용자: {user?.name || '익명'}</p>
                  <p>이메일: {user?.email || 'N/A'}</p>
                  <p>역할: {user?.role || 'N/A'}</p>
                  {user?.provider && (
                    <p>로그인 방식: {user.provider}</p>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include'
                      }).then(() => {
                        window.location.reload();
                      });
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                테스트 방법:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 아래 버튼을 클릭하여 각 플랫폼 로그인 테스트</li>
                <li>• 로그인 성공 시 사용자 정보가 표시됩니다</li>
                <li>• 환경변수가 설정되지 않은 경우 오류가 발생할 수 있습니다</li>
              </ul>
            </div>

            <SocialLoginButtons />

            <div className="text-center text-sm text-gray-500">
              <p>또는</p>
              <a 
                href="/auth" 
                className="text-blue-600 hover:text-blue-500"
              >
                일반 로그인 페이지로 이동
              </a>
            </div>
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">설정 상태 확인</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>카카오 로그인:</span>
              <span className="text-green-600">✓ 활성화</span>
            </div>
            <div className="flex justify-between">
              <span>네이버 로그인:</span>
              <span className="text-green-600">✓ 활성화</span>
            </div>
            <div className="flex justify-between">
              <span>구글 로그인:</span>
              <span className="text-red-600">⚠ 환경변수 필요</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginTest;
