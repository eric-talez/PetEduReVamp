import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Shield } from 'lucide-react';

interface TalezCertificationBadgeProps {
  businessData: {
    id: string;
    name: string;
    businessNumber: string;
    certificationStatus: 'pending' | 'verified' | 'rejected';
    certificationDate?: string;
    businessType: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function TalezCertificationBadge({ 
  businessData, 
  size = 'md', 
  showDetails = false 
}: TalezCertificationBadgeProps) {
  const getCertificationColor = () => {
    switch (businessData.certificationStatus) {
      case 'verified':
        return 'bg-gradient-to-r from-[#2BAA61] to-[#229954] text-white border-[#2BAA61] shadow-lg shadow-[#2BAA61]/25';
      case 'pending':
        return 'bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white border-[#FFA726] shadow-lg shadow-[#FFA726]/25';
      case 'rejected':
        return 'bg-gradient-to-r from-[#E74D3C] to-[#C0392B] text-white border-[#E74D3C] shadow-lg shadow-[#E74D3C]/25';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCertificationIcon = () => {
    const iconClass = iconSizeClasses[size];
    switch (businessData.certificationStatus) {
      case 'verified':
        return <CheckCircle className={iconClass} />;
      case 'pending':
        return <Shield className={iconClass} />;
      case 'rejected':
        return <Award className={iconClass} />;
      default:
        return <Shield className={iconClass} />;
    }
  };

  const getCertificationText = () => {
    switch (businessData.certificationStatus) {
      case 'verified':
        return 'TALEZ 인증 업체';
      case 'pending':
        return 'TALEZ 인증 심사중';
      case 'rejected':
        return '인증 보류';
      default:
        return '미인증';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex flex-col gap-2">
      <Badge 
        className={`
          ${getCertificationColor()} 
          ${sizeClasses[size]}
          border flex items-center gap-1.5 font-medium relative overflow-visible
          ${businessData.certificationStatus === 'verified' ? 'animate-pulse' : ''}
        `}
      >
        {getCertificationIcon()}
        {getCertificationText()}
        {businessData.certificationStatus === 'verified' && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border border-[#2BAA61]"></div>
        )}
      </Badge>
      
      {showDetails && businessData.certificationStatus === 'verified' && (
        <div className="text-xs text-gray-500 flex flex-col gap-1">
          <div>사업자번호: {businessData.businessNumber}</div>
          {businessData.certificationDate && (
            <div>인증일: {new Date(businessData.certificationDate).toLocaleDateString('ko-KR')}</div>
          )}
          <div>업종: {businessData.businessType}</div>
        </div>
      )}
    </div>
  );
}