import { Separator } from "@/components/ui/separator";

export default function TalezPrivacyPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-xl font-bold mb-4">TALEZ 개인정보처리방침</h1>
      <p>TALEZ는 이용자의 개인정보 보호를 중요시하며, 관련 법령에 따라 개인정보를 수집·이용합니다.</p>
      
      <Separator className="my-4" />
      
      <h2 className="font-semibold mt-4">수집하는 개인정보 항목</h2>
      <ul className="list-disc ml-6 space-y-1 mt-2">
        <li>회원가입: 이름, 이메일, 비밀번호</li>
        <li>반려견 프로필 등록: 반려견 이름, 생년월일, 품종, 사진</li>
        <li>결제 및 본인확인: 휴대폰 번호, 생년월일, 결제정보</li>
        <li>훈련사 회원: 자격증 정보, 경력사항, 주요 활동지역</li>
      </ul>
      
      <h2 className="font-semibold mt-4">수집 목적</h2>
      <ul className="list-disc ml-6 space-y-1 mt-2">
        <li>회원 구분 및 서비스 제공</li>
        <li>훈련 일정 관리 및 알림 발송</li>
        <li>고객지원 및 오류 대응</li>
        <li>서비스 개선을 위한 통계 분석 (개인식별 불가 형태로 처리)</li>
      </ul>
      
      <h2 className="font-semibold mt-4">개인정보의 보유 및 이용기간</h2>
      <p className="mt-2">회사는 회원의 개인정보를 원칙적으로 회원탈퇴 시까지 보유합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보존합니다.</p>
      <ul className="list-disc ml-6 space-y-1 mt-2">
        <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
        <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
        <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
        <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
      </ul>
      
      <h2 className="font-semibold mt-4">개인정보의 파기절차 및 방법</h2>
      <p className="mt-2">회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때는 지체없이 해당 개인정보를 파기합니다.</p>
      <p className="mt-2">전자적 파일 형태인 경우 복구 및 재생되지 않도록 안전하게 삭제하고, 그 외의 기록물은 분쇄하거나 소각합니다.</p>
      
      <h2 className="font-semibold mt-4">개인정보의 제3자 제공</h2>
      <p className="mt-2">회사는 이용자의 개인정보를 본 개인정보처리방침에서 명시한 범위 내에서만 처리하며, 이용자의 사전 동의 없이 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 단, 다음의 경우에는 예외로 합니다.</p>
      <ul className="list-disc ml-6 space-y-1 mt-2">
        <li>이용자가 사전에 제3자 제공에 동의한 경우</li>
        <li>법령에 의해 제공이 요구되는 경우</li>
        <li>서비스 제공에 관한 계약 이행을 위해 필요한 경우</li>
      </ul>
      
      <h2 className="font-semibold mt-4">이용자의 권리와 행사 방법</h2>
      <p className="mt-2">이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
      <p className="mt-2">권리 행사는 '내 정보' 메뉴를 통해 직접 할 수 있으며, 문의 페이지 또는 고객센터를 통해 요청하실 수도 있습니다.</p>
      
      <h2 className="font-semibold mt-4">개인정보 보호책임자</h2>
      <p className="mt-2">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
      <p className="mt-2 ml-4">
        개인정보 보호책임자<br />
        이름: 홍길동<br />
        직위: 개인정보보호팀장<br />
        연락처: privacy@funnytalez.com
      </p>
      
      <div className="mt-6 text-right">
        <p>시행일: 2025년 5월 18일</p>
      </div>
    </div>
  );
}