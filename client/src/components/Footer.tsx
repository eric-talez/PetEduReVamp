import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 로고 및 회사 정보 */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="TALEZ 로고" 
                  className="h-8 w-auto mr-3"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='32' viewBox='0 0 100 32'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3ETALEZ%3C/text%3E%3C/svg%3E";
                  }}
                />
                <span className="text-xl font-bold text-gray-900 dark:text-white">TALEZ</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a 
                    href="mailto:support@talez.com" 
                    className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    support@talez.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <a 
                    href="tel:1588-1234" 
                    className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    1588-1234
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>서울특별시 강남구 테헤란로 123, 4층</span>
                </div>
              </div>
            </div>

            {/* 빠른 링크 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">빠른 링크</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link href="/help/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">FAQ</Link>
                <Link href="/help/guide" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">이용가이드</Link>
                <Link href="/help/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">고객지원</Link>
                <Link href="/help/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">회사소개</Link>
              </div>
            </div>

            {/* 정책 및 약관 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">정책 및 약관</h3>
              <div className="space-y-2 text-sm">
                <Link href="/terms" className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">이용약관</Link>
                <Link href="/privacy" className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">개인정보처리방침</Link>
                <Link href="/refund" className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">환불정책</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 구분선 및 저작권 */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">
              <p className="mb-1">© 2025 TALEZ Co., Ltd. All rights reserved.</p>
              <p className="text-[10px]">
                사업자등록번호: 123-45-67890 | 통신판매업신고: 2025-서울강남-0001
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                v1.2.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}