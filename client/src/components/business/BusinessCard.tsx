import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TalezCertificationBadge } from './TalezCertificationBadge';
import { TalezTrainerCertificationBadge } from './TalezTrainerCertificationBadge';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Users, 
  Calendar,
  Award,
  Building2
} from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  specialties: string[];
  experience: number;
  rating: number;
  certifications: string[];
  availableSlots: string[];
}

interface BusinessData {
  id: string;
  name: string;
  businessNumber: string;
  certificationStatus: 'pending' | 'verified' | 'rejected';
  certificationDate?: string;
  businessType: string;
  address: string;
  phone: string;
  hours: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  services: string[];
  trainers?: Trainer[];
  images?: string[];
  type?: string;
  lat?: number;
  lng?: number;
}

interface BusinessCardProps {
  business: BusinessData;
  onReservationClick: (business: any, trainer?: Trainer) => void;
  onViewDetails: (business: any) => void;
  showTrainers?: boolean;
}

export function BusinessCard({ 
  business, 
  onReservationClick, 
  onViewDetails,
  showTrainers = false 
}: BusinessCardProps) {
  const isTrainingCenter = business.businessType === 'training-center' || business.businessType === '훈련소';
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{business.name}</h3>
            <TalezCertificationBadge 
              businessData={business}
              size="sm"
            />
          </div>
          {business.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating}</span>
              {business.reviewCount && (
                <span className="text-gray-500">({business.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 기본 정보 */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{business.address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{business.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{business.hours}</span>
          </div>
        </div>

        {/* 서비스 */}
        <div className="flex flex-wrap gap-1">
          {business.services.map((service, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>

        {/* 설명 */}
        {business.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {business.description}
          </p>
        )}

        {/* 훈련소 전용: 훈련사 리스트 */}
        {isTrainingCenter && business.trainers && showTrainers && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">전문 훈련사 ({business.trainers.length}명)</span>
            </div>
            
            <div className="space-y-3">
              {business.trainers.slice(0, 3).map((trainer) => (
                <div key={trainer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{trainer.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{trainer.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <TalezTrainerCertificationBadge 
                        trainerData={{
                          id: trainer.id,
                          name: trainer.name,
                          talezCertificationStatus: 'verified',
                          talezCertificationLevel: 'advanced',
                          talezCertificationDate: '2024-01-15',
                          licenseNumber: `TZ-${trainer.id.slice(-4).toUpperCase()}`
                        }}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {trainer.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {trainer.experience}년 경력 • {trainer.availableSlots.length}개 예약 가능
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onReservationClick(business, trainer)}
                    className="ml-3"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    예약
                  </Button>
                </div>
              ))}
              
              {business.trainers.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDetails(business)}
                  className="w-full"
                >
                  전체 훈련사 보기 ({business.trainers.length - 3}명 더)
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(business)}
            className="flex-1"
          >
            <Building2 className="w-4 h-4 mr-1" />
            상세보기
          </Button>
          
          {!isTrainingCenter && (
            <Button 
              size="sm" 
              onClick={() => onReservationClick(business)}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-1" />
              예약하기
            </Button>
          )}
          
          {isTrainingCenter && !showTrainers && (
            <Button 
              size="sm" 
              onClick={() => onReservationClick(business)}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-1" />
              훈련사 선택
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}