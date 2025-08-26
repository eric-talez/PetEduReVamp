import { Separator } from "@/components/ui/separator";

export default function TalezTermsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-6">📑 테일즈 이용약관 (모든 회원 공통)</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">제1조 (목적)</h2>
          <p className="leading-relaxed">
            본 약관은 테일즈(이하 "회사")가 제공하는 온라인 플랫폼 서비스(영상 강의, 화상 수업, 알림장 기능 등)의 이용조건과 절차를 규정합니다.
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">제2조 (정의)</h2>
          <div className="space-y-2">
            <p><strong>"회원"</strong>: 본 약관에 동의하고 서비스를 이용하는 자</p>
            <p><strong>"훈련소"</strong>: 훈련사를 고용·운영하는 기관</p>
            <p><strong>"훈련사"</strong>: 회사의 승인을 받아 수업을 제공하는 자</p>
            <p><strong>"견주"</strong>: 반려견을 보유한 일반 회원</p>
            <p><strong>"알림장"</strong>: 훈련소·훈련사·견주 간의 소통 기능</p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">제3조 (서비스 내용)</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>영상 강의 제공 및 판매</li>
            <li>화상 수업 연결</li>
            <li>알림장 기능 제공</li>
            <li>커뮤니티 게시판 운영</li>
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">제4조 (회원의 의무)</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>허위 정보 제공 금지</li>
            <li>알림장 및 커뮤니티 내 불법 콘텐츠 게시 금지</li>
            <li>서비스 이용 시 타인의 권리 침해 금지</li>
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">제5조 (회사의 의무)</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>안정적인 서비스 제공</li>
            <li>개인정보 보호</li>
            <li>온라인 서비스 결제·환불·정산 책임</li>
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">제6조 (결제 및 환불)</h2>
          <div className="space-y-2">
            <p>온라인 서비스의 결제 및 환불은 "환불 규정"에 따릅니다.</p>
            <p>회사는 훈련사·견주 간 오프라인에서 발생하는 모든 거래에는 관여하지 않습니다.</p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">제7조 (지적재산권)</h2>
          <div className="space-y-2">
            <p>강의 및 콘텐츠의 저작권은 제작자에게 귀속</p>
            <p>회사는 서비스 홍보 목적 내에서 이용할 수 있음</p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">제8조 (면책)</h2>
          <div className="space-y-2">
            <p>회사는 플랫폼 제공자이며, 훈련사·견주 간 계약, 오프라인 수업, 환불 문제에 대해 책임지지 않습니다.</p>
            <p className="font-medium">단, 온라인 서비스 결제 및 정산과 관련된 문제는 회사가 책임을 집니다.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t text-right text-gray-500">
        <p>시행일: 2025년 1월 26일</p>
      </div>
    </div>
  );
}