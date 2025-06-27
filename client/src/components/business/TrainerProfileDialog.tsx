import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  Calendar, 
  Award, 
  Clock, 
  Users,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  specialties: string[];
  experience: number;
  rating: number;
  certifications: string[];
  availableSlots: string[];
  profileImage?: string;
  bio?: string;
  price?: number;
}

interface TrainerProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer | null;
  businessName: string;
  onReservationClick: (trainer: Trainer) => void;
}

export function TrainerProfileDialog({
  isOpen,
  onClose,
  trainer,
  businessName,
  onReservationClick
}: TrainerProfileDialogProps) {
  if (!trainer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {trainer.name} 훈련사 프로필
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {trainer.profileImage ? (
                  <img 
                    src={trainer.profileImage} 
                    alt={trainer.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{trainer.name}</h2>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{trainer.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{trainer.experience}년 경력</span>
                    </div>
                    {trainer.price && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-primary">
                          시간당 {trainer.price.toLocaleString()}원
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{businessName}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 전문 분야 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                전문 분야
              </h3>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 자격증 */}
          {trainer.certifications.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  보유 자격증
                </h3>
                <div className="space-y-2">
                  {trainer.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 소개 */}
          {trainer.bio && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">소개</h3>
                <p className="text-gray-600 leading-relaxed">{trainer.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* 예약 가능 시간 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                예약 가능 시간
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {trainer.availableSlots.map((slot, index) => (
                  <Badge key={index} variant="outline" className="justify-center">
                    {slot}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 예약 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              닫기
            </Button>
            <Button 
              onClick={() => {
                onReservationClick(trainer);
                onClose();
              }}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              예약하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}