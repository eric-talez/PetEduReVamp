import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export interface AgreementValues {
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

interface AgreementSectionProps {
  onChange: (values: AgreementValues, valid: boolean) => void;
  initialValues?: Partial<AgreementValues>;
}

export default function AgreementSectionTalez({ onChange, initialValues }: AgreementSectionProps) {
  const [terms, setTerms] = useState(initialValues?.terms || false);
  const [privacy, setPrivacy] = useState(initialValues?.privacy || false);
  const [marketing, setMarketing] = useState(initialValues?.marketing || false);

  useEffect(() => {
    // 초기값이 변경될 경우 상태 업데이트
    if (initialValues) {
      if (initialValues.terms !== undefined) setTerms(initialValues.terms);
      if (initialValues.privacy !== undefined) setPrivacy(initialValues.privacy);
      if (initialValues.marketing !== undefined) setMarketing(initialValues.marketing);
    }
  }, [initialValues]);

  const handleChange = (field: 'terms' | 'privacy' | 'marketing', value: boolean) => {
    let newTerms = terms;
    let newPrivacy = privacy;
    let newMarketing = marketing;

    if (field === 'terms') newTerms = value;
    if (field === 'privacy') newPrivacy = value;
    if (field === 'marketing') newMarketing = value;

    // 필수 항목 모두 동의 시 유효함
    const isValid = newTerms && newPrivacy;
    
    // 상태 업데이트
    if (field === 'terms') setTerms(value);
    if (field === 'privacy') setPrivacy(value);
    if (field === 'marketing') setMarketing(value);

    // 부모 컴포넌트에 변경 알림
    onChange(
      { terms: newTerms, privacy: newPrivacy, marketing: newMarketing },
      isValid
    );
  };

  return (
    <div className="space-y-3 mt-4 py-3 border-t border-b border-gray-200 dark:border-gray-700">
      <div className="mb-2 font-medium text-sm">서비스 이용을 위한 동의</div>
      
      <label className="flex items-center space-x-2 cursor-pointer group">
        <Checkbox 
          checked={terms} 
          onCheckedChange={(v) => handleChange('terms', v === true)} 
          className="data-[state=checked]:bg-primary"
        />
        <span className="text-sm group-hover:text-primary transition-colors">
          [필수] <Link href="/terms" target="_blank" className="text-blue-500 hover:underline">TALEZ 이용약관</Link>에 동의합니다
        </span>
      </label>
      
      <label className="flex items-center space-x-2 cursor-pointer group">
        <Checkbox 
          checked={privacy} 
          onCheckedChange={(v) => handleChange('privacy', v === true)}
          className="data-[state=checked]:bg-primary" 
        />
        <span className="text-sm group-hover:text-primary transition-colors">
          [필수] <Link href="/privacy" target="_blank" className="text-blue-500 hover:underline">개인정보처리방침</Link>에 동의합니다
        </span>
      </label>
      
      <label className="flex items-center space-x-2 cursor-pointer group">
        <Checkbox 
          checked={marketing} 
          onCheckedChange={(v) => handleChange('marketing', v === true)}
          className="data-[state=checked]:bg-primary" 
        />
        <span className="text-sm group-hover:text-primary transition-colors">
          [선택] 마케팅 정보 수신에 동의합니다
        </span>
      </label>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        * 선택 항목에 동의하지 않아도 서비스 이용이 가능합니다.
      </div>
    </div>
  );
}