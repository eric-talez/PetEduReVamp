import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, MessageSquare, Phone, Star, VideoIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

// 훈련사 정보 타입 정의
export interface Trainer {
  id: number;
  name: string;
  image: string;
  specialty: string;
  description: string;
  rating: number;
  reviewCount: number;
  certifications: string[];
  coursesCount: number;
  location?: string;
  experience?: string;
  education?: string[];
  languages?: string[];
  availableHours?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

interface TrainerProfileModalProps {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrainerProfileModal({ trainer, open, onOpenChange }: TrainerProfileModalProps) {
  console.log("TrainerProfileModal 렌더링", { trainer: trainer?.name, open });
  
  if (!trainer) {
    console.log("훈련사 정보 없음, 모달 렌더링 중단");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      console.log("Dialog onOpenChange:", value);
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
              <img 
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover brightness-110 contrast-110" 
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{trainer.name} 트레이너</DialogTitle>
              <DialogDescription className="text-primary mt-1">
                {trainer.specialty}
              </DialogDescription>
              <div className="flex items-center mt-2">
                <div className="flex items-center mr-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1">{trainer.rating}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({trainer.reviewCount} 리뷰)
                </span>
                {trainer.location && (
                  <div className="ml-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    {trainer.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">소개</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {trainer.description}
          </p>
        </div>

        {trainer.experience && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">경력</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {trainer.experience}
            </p>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">자격증 및 전문분야</h3>
          <div className="flex flex-wrap gap-2">
            {trainer.certifications.map((cert, idx) => (
              <Badge key={idx} variant="outline">{cert}</Badge>
            ))}
          </div>
        </div>

        {trainer.education && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">학력 및 교육</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
              {trainer.education.map((edu, idx) => (
                <li key={idx}>{edu}</li>
              ))}
            </ul>
          </div>
        )}

        {trainer.languages && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">구사 언어</h3>
            <div className="flex flex-wrap gap-2">
              {trainer.languages.map((lang, idx) => (
                <Badge key={idx} variant="secondary">{lang}</Badge>
              ))}
            </div>
          </div>
        )}

        {trainer.availableHours && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">가능 시간</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              {trainer.availableHours}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-md font-semibold mb-3">훈련사에게 연락하기</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              type="button"
              className="w-full" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dialog Action] 메시지 보내기 클릭:', trainer.name);
                onOpenChange(false); // 모달 닫기
                window.location.href = `/messages?trainer=${trainer.id}`;
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              메시지 보내기
            </Button>
            <Button 
              type="button"
              className="w-full" 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dialog Action] 화상 상담 예약 클릭:', trainer.name);
                onOpenChange(false); // 모달 닫기
                window.location.href = `/video-call/reserve?trainer=${trainer.id}`;
              }}
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              화상 상담 예약
            </Button>
            <Button 
              type="button"
              className="w-full" 
              variant="secondary" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dialog Action] 수업 일정 보기 클릭:', trainer.name);
                onOpenChange(false); // 모달 닫기
                window.location.href = `/trainers/detail?id=${trainer.id}`;
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              수업 일정 보기
            </Button>
            {trainer.contactInfo?.phone && (
              <Button 
                type="button"
                className="w-full" 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[Dialog Action] 전화 연락 클릭:', trainer.name);
                  window.open(`tel:${trainer.contactInfo?.phone}`);
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                전화 연락
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-sm">강의 {trainer.coursesCount}개</span>
          <DialogClose asChild>
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dialog Action] 닫기 버튼 클릭');
              }}
            >
              닫기
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}