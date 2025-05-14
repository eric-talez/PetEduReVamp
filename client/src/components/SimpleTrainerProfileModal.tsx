import React, { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, MessageSquare, Phone, Star, VideoIcon, X, Award, Briefcase, Sparkles } from 'lucide-react';

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

interface SimpleTrainerProfileModalProps {
  trainer: Trainer;
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleTrainerProfileModal({ trainer, isOpen, onClose }: SimpleTrainerProfileModalProps) {
  // 디버깅을 위한 훅 사용
  useEffect(() => {
    if (isOpen) {
      console.log("SimpleTrainerProfileModal - 모달이 열렸습니다:", trainer.name);
    }
  }, [isOpen, trainer]);

  if (!isOpen) {
    console.log("SimpleTrainerProfileModal - 모달이 닫혀있습니다");
    return null;
  }
  
  console.log("SimpleTrainerProfileModal - 렌더링:", trainer.name);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        // 배경 클릭 시 모달 닫기 (이벤트 버블링 방지)
        if (e.target === e.currentTarget) {
          console.log("모달 배경 클릭");
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
      >
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 relative">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
              <img 
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover brightness-110 contrast-110" 
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{trainer.name} 트레이너</h2>
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
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("모달 내부 X 버튼 클릭");
              onClose();
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">닫기</span>
          </button>
        </div>
        
        {/* 내용 */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">소개</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {trainer.description}
            </p>
          </div>

          {trainer.experience && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">경력</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {trainer.experience}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">자격증 및 전문분야</h3>
            <div className="flex flex-wrap gap-2">
              {trainer.certifications.map((cert, idx) => (
                <Badge key={idx} variant="outline">{cert}</Badge>
              ))}
            </div>
          </div>

          {trainer.education && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">학력 및 교육</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
                {trainer.education.map((edu, idx) => (
                  <li key={idx}>{edu}</li>
                ))}
              </ul>
            </div>
          )}

          {trainer.languages && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">구사 언어</h3>
              <div className="flex flex-wrap gap-2">
                {trainer.languages.map((lang, idx) => (
                  <Badge key={idx} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </div>
          )}

          {trainer.availableHours && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">가능 시간</h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                {trainer.availableHours}
              </div>
            </div>
          )}
        </div>
        
        {/* 푸터 */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
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
          
          <div className="mt-4 flex justify-between">
            <span className="text-sm">강의 {trainer.coursesCount}개</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                console.log("모달 내부 닫기 버튼 클릭");
                onClose();
              }}
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}