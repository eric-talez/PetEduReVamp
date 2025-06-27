import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  CheckCircle 
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

interface TrainerSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trainers: Trainer[];
  businessName: string;
  onTrainerSelect: (trainer: Trainer) => void;
}

export function TrainerSelectionDialog({
  isOpen,
  onClose,
  trainers,
  businessName,
  onTrainerSelect
}: TrainerSelectionDialogProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const handleTrainerSelect = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    onTrainerSelect(trainer);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {businessName} - 전문 훈련사 선택
          </DialogTitle>
          <DialogDescription>
            반려동물에게 가장 적합한 전문 훈련사를 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {trainers.map((trainer) => (
            <Card 
              key={trainer.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTrainer?.id === trainer.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTrainer(trainer)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  {trainer.profileImage ? (
                    <img 
                      src={trainer.profileImage} 
                      alt={trainer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{trainer.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{trainer.rating}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {trainer.experience}년 경력
                    </div>
                    
                    {trainer.price && (
                      <div className="text-sm font-medium text-primary">
                        시간당 {trainer.price.toLocaleString()}원
                      </div>
                    )}
                  </div>
                </div>

                {/* 전문 분야 */}
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">전문 분야</div>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 자격증 */}
                {trainer.certifications.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">보유 자격증</div>
                    <div className="space-y-1">
                      {trainer.certifications.slice(0, 2).map((cert, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs">
                          <Award className="w-3 h-3 text-primary" />
                          <span>{cert}</span>
                        </div>
                      ))}
                      {trainer.certifications.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{trainer.certifications.length - 2}개 더
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 예약 가능 시간 */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">예약 가능 시간</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Clock className="w-3 h-3" />
                    <span>{trainer.availableSlots.length}개 시간대 가능</span>
                  </div>
                </div>

                {/* 간단한 소개 */}
                {trainer.bio && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {trainer.bio}
                  </p>
                )}

                <Button
                  className="w-full"
                  variant={selectedTrainer?.id === trainer.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrainerSelect(trainer);
                  }}
                >
                  {selectedTrainer?.id === trainer.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      선택됨
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      선택하기
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {trainers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>등록된 훈련사가 없습니다.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}