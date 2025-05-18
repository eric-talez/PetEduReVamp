import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export type TermsType = "terms" | "privacy" | "marketing";

interface TermsModalProps {
  type: TermsType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ type, isOpen, onOpenChange }: TermsModalProps) {
  // 타입에 따라 제목과 내용 설정
  const getTitle = () => {
    switch (type) {
      case "terms":
        return "TALEZ 이용약관";
      case "privacy":
        return "개인정보 처리방침";
      case "marketing":
        return "마케팅 정보 수신 동의";
      default:
        return "약관 내용";
    }
  };

  // 이용약관 컨텐츠
  const renderTermsContent = () => (
    <>
      <p>본 약관은 TALEZ 서비스를 이용함에 있어 회원의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">제1조 (목적)</h3>
      <p>이 약관은 회사(이하 "회사")가 운영하는 반려견 훈련 플랫폼 TALEZ(이하 "서비스")의 이용조건, 절차 및 책임사항 등을 규정합니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">제2조 (정의)</h3>
      <p>이 약관에서 사용하는 용어는 다음과 같습니다: 
        <br />① "회원"이라 함은 서비스를 이용하는 자를 말합니다. 
        <br />② "훈련사"는 회사에 등록된 전문가입니다. 
        <br />③ "견주"는 반려견을 등록하고 서비스를 이용하는 일반 회원입니다.
      </p>
      
      <h3 className="text-sm font-semibold mt-4">제3조 (약관의 효력 및 변경)</h3>
      <p>① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
      <br />② 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지함으로써 효력이 발생합니다.
      <br />③ 회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있습니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">제4조 (서비스 이용)</h3>
      <p>① 회원은 본 서비스를 이용하여 반려견 훈련 서비스를 제공 받을 수 있습니다.
      <br />② 서비스 이용 시간은 회사의 업무상 또는 기술상 특별한 경우를 제외하고는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.
      <br />③ 회사는 정기점검, 시스템 업데이트 등의 필요가 있는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">제5조 (서비스 변경 및 중단)</h3>
      <p>① 회사는 필요한 경우 서비스의 전부 또는 일부를 변경할 수 있습니다.
      <br />② 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 서비스의 제공을 중단할 수 있습니다.
      <br />③ 서비스 중단의 경우 사전에 공지하되, 사전 공지가 불가능한 경우에는 사후 공지할 수 있습니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">제6조 (개인정보보호)</h3>
      <p>회사는 개인정보보호법 등 관련 법령에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 관해서는 개인정보처리방침을 따릅니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">제7조 (이용계약의 해지)</h3>
      <p>① 회원은 언제든지 회사에 해지 의사를 통지함으로써 이용계약을 해지할 수 있습니다.
      <br />② 회사는 회원이 이 약관에서 정한 회원의 의무를 위반한 경우 사전 통보 후 이용계약을 해지할 수 있습니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">제8조 (면책조항)</h3>
      <p>① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 책임을 지지 않습니다.
      <br />② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</p>
      
      <div className="mt-6 text-right">
        <p>시행일: 2025년 5월 18일</p>
      </div>
    </>
  );

  // 개인정보처리방침 컨텐츠
  const renderPrivacyContent = () => (
    <>
      <p>TALEZ는 이용자의 개인정보 보호를 중요시하며, 관련 법령에 따라 개인정보를 수집·이용합니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">수집하는 개인정보 항목</h3>
      <ul className="list-disc ml-6 space-y-1 mt-2 text-xs">
        <li>회원가입: 이름, 이메일, 비밀번호</li>
        <li>반려견 프로필 등록: 반려견 이름, 생년월일, 품종, 사진</li>
        <li>결제 및 본인확인: 휴대폰 번호, 생년월일, 결제정보</li>
        <li>훈련사 회원: 자격증 정보, 경력사항, 주요 활동지역</li>
      </ul>
      
      <h3 className="text-sm font-semibold mt-4">수집 목적</h3>
      <ul className="list-disc ml-6 space-y-1 mt-2 text-xs">
        <li>회원 구분 및 서비스 제공</li>
        <li>훈련 일정 관리 및 알림 발송</li>
        <li>고객지원 및 오류 대응</li>
        <li>서비스 개선을 위한 통계 분석 (개인식별 불가 형태로 처리)</li>
      </ul>
      
      <h3 className="text-sm font-semibold mt-4">개인정보의 보유 및 이용기간</h3>
      <p className="mt-2 text-xs">회사는 회원의 개인정보를 원칙적으로 회원탈퇴 시까지 보유합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보존합니다.</p>
      <ul className="list-disc ml-6 space-y-1 mt-2 text-xs">
        <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
        <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
        <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
        <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
      </ul>
      
      <h3 className="text-sm font-semibold mt-4">개인정보의 파기절차 및 방법</h3>
      <p className="mt-2 text-xs">회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때는 지체없이 해당 개인정보를 파기합니다.</p>
      <p className="mt-2 text-xs">전자적 파일 형태인 경우 복구 및 재생되지 않도록 안전하게 삭제하고, 그 외의 기록물은 분쇄하거나 소각합니다.</p>
      
      <h3 className="text-sm font-semibold mt-4">개인정보의 제3자 제공</h3>
      <p className="mt-2 text-xs">회사는 이용자의 개인정보를 본 개인정보처리방침에서 명시한 범위 내에서만 처리하며, 이용자의 사전 동의 없이 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 단, 다음의 경우에는 예외로 합니다.</p>
      <ul className="list-disc ml-6 space-y-1 mt-2 text-xs">
        <li>이용자가 사전에 제3자 제공에 동의한 경우</li>
        <li>법령에 의해 제공이 요구되는 경우</li>
        <li>서비스 제공에 관한 계약 이행을 위해 필요한 경우</li>
      </ul>
      
      <div className="mt-6 text-right">
        <p className="text-xs">시행일: 2025년 5월 18일</p>
      </div>
    </>
  );

  // 마케팅 정보 수신 동의 컨텐츠
  const renderMarketingContent = () => (
    <>
      <p>TALEZ 서비스 및 이벤트 정보를 받아보시려면 마케팅 정보 수신에 동의해 주세요.</p>
      
      <h3 className="text-sm font-semibold mt-4">마케팅 정보 수신 동의 안내</h3>
      
      <h4 className="text-xs font-semibold mt-3">1. 수집 항목</h4>
      <p className="text-xs mt-1">이메일 주소, 휴대폰 번호</p>
      
      <h4 className="text-xs font-semibold mt-3">2. 이용 목적</h4>
      <ul className="list-disc ml-6 space-y-1 mt-2 text-xs">
        <li>새로운 서비스 및 기능 안내</li>
        <li>이벤트, 프로모션 정보 제공</li>
        <li>맞춤형 콘텐츠 추천</li>
        <li>서비스 개선을 위한 의견 수렴</li>
      </ul>
      
      <h4 className="text-xs font-semibold mt-3">3. 보유 및 이용 기간</h4>
      <p className="text-xs mt-1">회원 탈퇴 또는 동의 철회 시까지</p>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-4 text-xs">
        <p className="font-semibold">안내사항</p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li>마케팅 정보 수신은 선택 사항이며, 동의하지 않아도 TALEZ 서비스 이용에 제한이 없습니다.</li>
          <li>언제든지 설정 메뉴나 고객센터를 통해 동의를 철회하실 수 있습니다.</li>
          <li>알림 빈도는 월 1-4회 정도이며, 중요 공지사항은 동의 여부와 관계없이 발송될 수 있습니다.</li>
        </ul>
      </div>
      
      <div className="mt-6 text-right">
        <p className="text-xs">시행일: 2025년 5월 18일</p>
      </div>
    </>
  );

  // 타입에 따라 컨텐츠 렌더링
  const renderContent = () => {
    switch (type) {
      case "terms":
        return renderTermsContent();
      case "privacy":
        return renderPrivacyContent();
      case "marketing":
        return renderMarketingContent();
      default:
        return <p>약관 내용이 없습니다.</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {type === "terms" && "TALEZ 서비스 이용약관 전문입니다."}
            {type === "privacy" && "개인정보 수집 및 이용에 대한 안내입니다."}
            {type === "marketing" && "마케팅 정보 수신에 대한 안내입니다."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {renderContent()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}