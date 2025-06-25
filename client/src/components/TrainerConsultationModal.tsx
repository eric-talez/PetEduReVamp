import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar,
  Clock,
  Star,
  User,
  Phone,
  Mail,
  MessageSquare,
  Award,
  CheckCircle
} from 'lucide-react';

interface Trainer {
  id: number;
  name: string;
  specialty: string[];
  experience: string;
  rating: number;
  reviews: number;
  avatar: string;
  bio: string;
  certifications: string[];
  availableSlots: {
    [date: string]: string[];
  };
}

interface TrainerConsultationModalProps {
  trainer: Trainer;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingComplete: (bookingData: any) => void;
}

export function TrainerConsultationModal({ 
  trainer, 
  isOpen, 
  onOpenChange, 
  onConsultationBooked 
}: any) {
  // trainer가 null이면 빈 모달 반환
  if (!trainer) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>훈련사 정보 없음</DialogTitle>
          </DialogHeader>
          <p>선택된 훈련사 정보가 없습니다.</p>
        </DialogContent>
      </Dialog>
    );
  }
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    petName: '',
    petAge: '',
    petBreed: '',
    concerns: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDates = trainer?.availableSlots ? Object.keys(trainer.availableSlots) : [];
  const availableTimes = selectedDate && trainer?.availableSlots ? trainer.availableSlots[selectedDate] || [] : [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    if (!formData.petName || !formData.phone || !formData.email) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        trainerId: trainer.id,
        trainerName: trainer.name,
        date: selectedDate,
        time: selectedTime,
        ...formData,
        bookingId: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('상담 예약 완료:', bookingData);
      onBookingComplete(bookingData);
      onOpenChange(false);
      
      // 폼 초기화
      setFormData({
        petName: '',
        petAge: '',
        petBreed: '',
        concerns: '',
        phone: '',
        email: '',
        notes: ''
      });
      setSelectedDate('');
      setSelectedTime('');
      
      alert('상담 예약이 완료되었습니다! 확인 메시지를 보내드렸습니다.');
    } catch (error) {
      console.error('예약 오류:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            전문 훈련사 상담 예약
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 훈련사 정보 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={trainer.avatar} alt={trainer.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{trainer.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{trainer.rating}</span>
                    <span className="text-gray-500">({trainer.reviews} 후기)</span>
                    <Badge variant="outline">{trainer.experience}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{trainer.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trainer.specialty.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-green-600">
                        <Award className="h-3 w-3" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 예약 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 날짜 및 시간 선택 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  상담 날짜
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">날짜를 선택하세요</option>
                  {availableDates.map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  상담 시간
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!selectedDate}
                >
                  <option value="">시간을 선택하세요</option>
                  {selectedDate && trainer.availableSlots[selectedDate]?.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 반려견 정보 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">반려견 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    반려견 이름 *
                  </label>
                  <Input
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    placeholder="반려견 이름을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    나이
                  </label>
                  <Input
                    value={formData.petAge}
                    onChange={(e) => handleInputChange('petAge', e.target.value)}
                    placeholder="예: 2살"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    견종
                  </label>
                  <Input
                    value={formData.petBreed}
                    onChange={(e) => handleInputChange('petBreed', e.target.value)}
                    placeholder="예: 골든리트리버"
                  />
                </div>
              </div>
            </div>

            {/* 상담 내용 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                상담받고 싶은 내용
              </label>
              <Textarea
                value={formData.concerns}
                onChange={(e) => handleInputChange('concerns', e.target.value)}
                placeholder="반려견의 문제행동이나 훈련받고 싶은 내용을 자세히 적어주세요"
                rows={4}
              />
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">연락처 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    전화번호 *
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010-0000-0000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    이메일 *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 추가 메모 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                추가 메모
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="기타 전달하고 싶은 내용이 있으시면 적어주세요"
                rows={3}
              />
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    예약 중...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    상담 예약하기
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}