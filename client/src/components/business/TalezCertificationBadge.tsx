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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCertificationIcon = () => {
    switch (businessData.certificationStatus) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Shield className="w-4 h-4" />;
      case 'rejected':
        return <Award className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
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

  return (
    <div className="flex flex-col gap-2">
      <Badge 
        className={`
          ${getCertificationColor()} 
          ${sizeClasses[size]}
          border flex items-center gap-1.5 font-medium
        `}
      >
        {getCertificationIcon()}
        {getCertificationText()}
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