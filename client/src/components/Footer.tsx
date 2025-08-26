import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* 로고 및 회사 정보 */}
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/logo.svg" alt="TALEZ" className="h-6 w-auto mr-2" />
              <span className="text-sm font-bold text-gray-900 dark:text-white mr-4">TALEZ</span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mr-4">support@talez.com</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">1588-1234</span>
            </div>

            {/* 링크들 */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link href="/help/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">FAQ</Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">이용약관</Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">개인정보처리방침</Link>
              <Link href="/refund" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">환불정책</Link>
              <a href="mailto:support@talez.com" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">문의하기</a>
            </div>
          </div>
        </div>

        {/* 하단 구분선 및 저작권 */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              <p>© 2025 TALEZ Co., Ltd. All rights reserved. | 사업자등록번호: 123-45-67890 | 통신판매업신고: 2025-서울강남-0001</p>
            </div>
            
            <div className="flex space-x-6">
              {/* 소셜 미디어 아이콘 (선택사항) */}
              <div className="text-[10px] text-gray-400 dark:text-gray-500">
                서울특별시 강남구 테헤란로 123, 4층
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}