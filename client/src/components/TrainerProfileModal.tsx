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
  image?: string;
  avatar?: string;
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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0">
        {/* 배경 이미지 헤더 */}
        <div className="relative h-40 bg-gradient-to-r from-primary to-primary/80 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                <img 
                  src={trainer.avatar || trainer.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`}
                  alt={trainer.name}
                  className="w-full h-full object-cover" 
                  style={{ 
                    filter: 'none !important', 
                    WebkitFilter: 'none !important'
                  }}
                  onLoad={() => {
                    console.log(`[모달 이미지] 로딩 성공: ${trainer.name}, URL: ${trainer.avatar || trainer.image}`);
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log(`[모달 이미지] 로딩 실패: ${trainer.name}, 원본 URL: ${target.src}`);
                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`;
                  }}
                />
              </div>
              <div className="flex-1 pb-1">
                <DialogTitle className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                  {trainer.name} 트레이너
                </DialogTitle>
                <DialogDescription className="text-white/90 font-semibold text-base mb-2 drop-shadow-md">
                  {trainer.specialty}
                </DialogDescription>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                    <span className="text-sm font-semibold ml-1 text-white drop-shadow-sm">{trainer.rating}</span>
                    <span className="text-sm text-white/80 ml-1 drop-shadow-sm">
                      ({trainer.reviewCount} 리뷰)
                    </span>
                  </div>
                  {trainer.location && (
                    <div className="flex items-center text-sm text-white/90 drop-shadow-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {trainer.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogHeader className="sr-only">
          <DialogTitle>{trainer.name} 트레이너</DialogTitle>
          <DialogDescription>{trainer.specialty}</DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              소개
            </h3>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {trainer.description}
            </p>
          </div>

          {trainer.experience && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                경력
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {trainer.experience}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              자격증 및 전문분야
            </h3>
            <div className="flex flex-wrap gap-2">
              {trainer.certifications.map((cert, idx) => (
                <Badge key={idx} variant="outline" className="text-sm py-1 px-3">{cert}</Badge>
              ))}
            </div>
          </div>

          {trainer.education && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                학력 및 교육
              </h3>
              <ul className="text-base text-gray-700 dark:text-gray-300 list-disc pl-6 space-y-1">
                {trainer.education.map((edu, idx) => (
                  <li key={idx}>{edu}</li>
                ))}
              </ul>
            </div>
          )}

          {trainer.languages && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                구사 언어
              </h3>
              <div className="flex flex-wrap gap-2">
                {trainer.languages.map((lang, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">{lang}</Badge>
                ))}
              </div>
            </div>
          )}

          {trainer.availableHours && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                가능 시간
              </h3>
              <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                <Clock className="w-5 h-5 mr-2" />
                {trainer.availableHours}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            훈련사에게 연락하기
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              type="button"
              className="w-full h-12 text-base font-semibold" 
              size="default"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dialog Action] 메시지 보내기 클릭:', trainer.name);
                onOpenChange(false);
                window.location.href = `/messages`;
              }}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              메시지 보내기
            </Button>
            <Button 
              type="button"
              className="w-full h-12 text-base font-semibold" 
              variant="outline" 
              size="default"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dialog Action] 화상 상담 예약 클릭:', trainer.name);
                onOpenChange(false);
                window.location.href = `/video-call`;
              }}
            >
              <VideoIcon className="w-5 h-5 mr-3" />
              화상 상담 예약
            </Button>
            <Button 
              type="button"
              className="w-full h-12 text-base font-semibold" 
              variant="secondary" 
              size="default"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dialog Action] 수업 일정 보기 클릭:', trainer.name);
                onOpenChange(false);
                window.location.href = `/trainers`;
              }}
            >
              <Calendar className="w-5 h-5 mr-3" />
              수업 일정 보기
            </Button>
            {trainer.contactInfo?.phone && (
              <Button 
                type="button"
                className="w-full h-12 text-base font-semibold" 
                variant="outline" 
                size="default"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[Dialog Action] 전화 연락 클릭:', trainer.name);
                  window.open(`tel:${trainer.contactInfo?.phone}`);
                }}
              >
                <Phone className="w-5 h-5 mr-3" />
                전화 연락
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">강의 {trainer.coursesCount}개</span>
          <DialogClose asChild>
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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