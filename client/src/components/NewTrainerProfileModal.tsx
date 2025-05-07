import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, MapPin, MessageSquare, Phone, Star, VideoIcon } from 'lucide-react';
import { BasicModalDialog } from './BasicModalDialog';

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
  trainer: Trainer;
  isOpen: boolean;
  onClose: () => void;
}

export function NewTrainerProfileModal({ trainer, isOpen, onClose }: TrainerProfileModalProps) {
  console.log(`NewTrainerProfileModal 렌더링: ${trainer?.name}, isOpen: ${isOpen}`);
  
  if (!trainer) return null;

  return (
    <BasicModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${trainer.name} 트레이너`}
    >
      <div className="space-y-6">
        {/* 프로필 헤더 */}
        <div className="flex items-start gap-4">
          <Avatar 
            src={trainer.image} 
            alt={trainer.name}
            size="xl"
            bordered
          />
          <div>
            <p className="text-primary mt-1">{trainer.specialty}</p>
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

        {/* 소개 */}
        <div>
          <h3 className="text-md font-semibold mb-2">소개</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {trainer.description}
          </p>
        </div>

        {/* 경력 */}
        {trainer.experience && (
          <div>
            <h3 className="text-md font-semibold mb-2">경력</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {trainer.experience}
            </p>
          </div>
        )}

        {/* 자격증 */}
        <div>
          <h3 className="text-md font-semibold mb-2">자격증 및 전문분야</h3>
          <div className="flex flex-wrap gap-2">
            {trainer.certifications.map((cert, idx) => (
              <Badge key={idx} variant="outline">{cert}</Badge>
            ))}
          </div>
        </div>

        {/* 학력 */}
        {trainer.education && (
          <div>
            <h3 className="text-md font-semibold mb-2">학력 및 교육</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
              {trainer.education.map((edu, idx) => (
                <li key={idx}>{edu}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 언어 */}
        {trainer.languages && (
          <div>
            <h3 className="text-md font-semibold mb-2">구사 언어</h3>
            <div className="flex flex-wrap gap-2">
              {trainer.languages.map((lang, idx) => (
                <Badge key={idx} variant="secondary">{lang}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* 가능 시간 */}
        {trainer.availableHours && (
          <div>
            <h3 className="text-md font-semibold mb-2">가능 시간</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              {trainer.availableHours}
            </div>
          </div>
        )}

        {/* 연락 옵션 */}
        <div>
          <h3 className="text-md font-semibold mb-3">훈련사에게 연락하기</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              메시지 보내기
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              <VideoIcon className="w-4 h-4 mr-2" />
              화상 상담 예약
            </Button>
            <Button className="w-full" variant="secondary" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              수업 일정 보기
            </Button>
            {trainer.contactInfo?.phone && (
              <Button className="w-full" variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                전화 연락
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <span className="text-sm">강의 {trainer.coursesCount}개</span>
        </div>
      </div>
    </BasicModalDialog>
  );
}