import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t mt-8">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 회사 정보 */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-3">
              <img src="/logo.svg" alt="TALEZ" className="h-8 w-auto mr-3" />
              <h3 className="text-lg font-semibold">TALEZ</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              AI 기반 맞춤형 반려동물 교육 플랫폼
            </p>
            
            {/* 사업자 정보 */}
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p><strong>상호명:</strong> 주식회사 테일즈</p>
              <p><strong>대표자:</strong> 김대표</p>
              <p><strong>사업자등록번호:</strong> 123-45-67890</p>
              <p><strong>통신판매업신고번호:</strong> 2025-서울강남-0001</p>
              <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123, 4층</p>
              <p><strong>이메일:</strong> support@talez.com</p>
              <p><strong>고객센터:</strong> 1588-1234 (평일 09:00~18:00)</p>
            </div>
          </div>
          
          {/* 서비스 메뉴 */}
          <div>
            <h4 className="font-semibold mb-3">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/courses" className="hover:text-primary transition-colors">교육 과정</Link></li>
              <li><Link href="/trainers" className="hover:text-primary transition-colors">전문 훈련사</Link></li>
              <li><Link href="/institutes" className="hover:text-primary transition-colors">교육 기관</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">펫 용품</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">커뮤니티</Link></li>
            </ul>
          </div>
          
          {/* 고객 지원 */}
          <div>
            <h4 className="font-semibold mb-3">고객 지원</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/help/faq" className="hover:text-primary transition-colors">자주 묻는 질문</Link></li>
              <li><Link href="/help/contact" className="hover:text-primary transition-colors">문의하기</Link></li>
              <li><Link href="/help/guide" className="hover:text-primary transition-colors">이용 가이드</Link></li>
              <li><a href="mailto:support@talez.com" className="hover:text-primary transition-colors">이메일 문의</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* 하단 링크 및 저작권 */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            <Link href="/terms" className="hover:text-primary transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors font-semibold">개인정보처리방침</Link>
            <Link href="/refund" className="hover:text-primary transition-colors">환불규정</Link>
            <Link href="/certified-partner" className="hover:text-primary transition-colors">인증업체 운영규정</Link>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 TALEZ Co., Ltd. All rights reserved.
          </div>
        </div>
        
        {/* 인증 마크 및 추가 정보 */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start text-xs text-gray-400 dark:text-gray-500">
            <div className="mb-4 md:mb-0">
              <p>• 테일즈는 통신판매중개자로서 거래당사자가 아니며, 판매자가 등록한 상품정보 및 거래에 대해 책임을 지지 않습니다.</p>
              <p>• 단, 온라인 교육 서비스 및 플랫폼 이용료에 대해서는 테일즈가 직접 책임집니다.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>개인정보보호 인증</span>
              <span>소비자분쟁조정위원회</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}