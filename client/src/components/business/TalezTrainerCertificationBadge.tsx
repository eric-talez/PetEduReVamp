import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Shield, Star } from 'lucide-react';

interface TalezTrainerCertificationBadgeProps {
  trainerData: {
    id: string;
    name: string;
    talezCertificationStatus?: 'pending' | 'verified' | 'rejected';
    talezCertificationDate?: string;
    talezCertificationLevel?: 'basic' | 'advanced' | 'expert';
    licenseNumber?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function TalezTrainerCertificationBadge({ 
  trainerData, 
  size = 'md', 
  showDetails = false 
}: TalezTrainerCertificationBadgeProps) {
  // 인증 상태가 없으면 미인증으로 처리
  const certificationStatus = trainerData.talezCertificationStatus || 'rejected';
  
  const getCertificationColor = () => {
    switch (certificationStatus) {
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
    switch (certificationStatus) {
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
    switch (certificationStatus) {
      case 'verified':
        const level = trainerData.talezCertificationLevel || 'basic';
        const levelText = {
          basic: '기본',
          advanced: '전문',
          expert: '마스터'
        };
        return `TALEZ ${levelText[level]} 인증 훈련사`;
      case 'pending':
        return 'TALEZ 훈련사 인증 심사중';
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

  const getLevelStars = () => {
    if (certificationStatus !== 'verified') return null;
    
    const level = trainerData.talezCertificationLevel || 'basic';
    const starCount = { basic: 1, advanced: 2, expert: 3 }[level];
    
    return (
      <div className="flex items-center gap-0.5 ml-1">
        {Array.from({ length: starCount }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-300 text-yellow-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Badge 
        className={`
          ${getCertificationColor()} 
          ${sizeClasses[size]}
          border flex items-center gap-1.5 font-medium relative overflow-visible
          ${certificationStatus === 'verified' ? 'animate-pulse' : ''}
        `}
      >
        {getCertificationIcon()}
        {getCertificationText()}
        {getLevelStars()}
        {certificationStatus === 'verified' && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border border-[#2BAA61]"></div>
        )}
      </Badge>
      
      {showDetails && certificationStatus === 'verified' && (
        <div className="text-xs text-gray-500 flex flex-col gap-1">
          {trainerData.licenseNumber && (
            <div>인증번호: {trainerData.licenseNumber}</div>
          )}
          {trainerData.talezCertificationDate && (
            <div>인증일: {new Date(trainerData.talezCertificationDate).toLocaleDateString('ko-KR')}</div>
          )}
          <div>레벨: {trainerData.talezCertificationLevel || 'basic'}</div>
        </div>
      )}
    </div>
  );
}