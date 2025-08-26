import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 회사 정보 */}
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo.svg" alt="TALEZ" className="h-7 w-auto mr-2" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">TALEZ</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                AI 기반 맞춤형 반려동물 교육 플랫폼
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                <p>support@talez.com</p>
                <p>1588-1234</p>
              </div>
            </div>

            {/* 지원 */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-4">지원</h3>
              <ul className="space-y-3">
                <li><Link href="/help/faq" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">자주 묻는 질문</Link></li>
                <li><Link href="/help/contact" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">문의하기</Link></li>
                <li><a href="mailto:support@talez.com" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">이메일 문의</a></li>
              </ul>
            </div>

            {/* 회사 */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-4">회사</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">이용약관</Link></li>
                <li><Link href="/privacy" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">개인정보처리방침</Link></li>
                <li><Link href="/refund" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">환불정책</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 구분선 및 저작권 */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              <p>© 2025 TALEZ Co., Ltd. All rights reserved.</p>
              <p className="mt-1">사업자등록번호: 123-45-67890 | 통신판매업신고: 2025-서울강남-0001</p>
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