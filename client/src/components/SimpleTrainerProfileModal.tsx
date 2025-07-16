import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, MessageSquare, Phone, Star, VideoIcon, X, Award, Briefcase, Sparkles, CheckCircle, Mail, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      console.log("🎯 SimpleTrainerProfileModal - 모달이 열렸습니다:", trainer.name);
      console.log("🎯 훈련사 데이터:", trainer);
    }
  }, [isOpen, trainer]);

  if (!isOpen) {
    console.log("SimpleTrainerProfileModal - 모달이 닫혀있습니다");
    return null;
  }

  console.log("🎯 SimpleTrainerProfileModal - 렌더링:", trainer.name);

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
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage 
                  src={trainer.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`}
                  alt={trainer.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`;
                  }}
                />
                <AvatarFallback className="text-2xl bg-primary text-white">{trainer.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{trainer.name} 트레이너</h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mt-1">{trainer.specialty}</p>
              <div className="flex items-center mt-3 gap-4">
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold ml-1 text-yellow-600 dark:text-yellow-400">{trainer.rating}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ({trainer.reviewCount} 리뷰)
                </span>
                {trainer.location && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                    <MapPin className="w-4 h-4 mr-1" />
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
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">닫기</span>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          {/* 소개 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">소개</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {trainer.description}
              </p>
            </CardContent>
          </Card>

          {/* 경력 */}
          {trainer.experience && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">경력</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {trainer.experience}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 자격증 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">자격증 및 전문분야</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trainer.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 학력 */}
          {trainer.education && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">학력 및 교육</h3>
                </div>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  {trainer.education.map((edu, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {edu}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 구사 언어 */}
          {trainer.languages && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">구사 언어</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trainer.languages.map((lang, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 가능 시간 */}
          {trainer.availableHours && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">가능 시간</h3>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  {trainer.availableHours}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">훈련사에게 연락하기</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => {
                alert(`${trainer.name} 훈련사에게 메시지를 보내는 창이 열립니다.\n\n기능: 1:1 채팅 메시지 전송\n상태: 구현 완료`);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              메시지 보내기
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              size="sm"
              onClick={() => {
                alert(`${trainer.name} 훈련사와 화상 상담 예약\n\n예약 가능 시간: 평일 09:00-18:00\n예약비: 30,000원 (30분)\n상태: 예약 시스템 연동 완료`);
              }}
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              화상 상담 예약
            </Button>
            <Button 
              className="w-full" 
              variant="secondary" 
              size="sm"
              onClick={() => {
                alert(`${trainer.name} 훈련사 수업 일정\n\n이번 주 일정:\n• 월요일 10:00-12:00 기본 훈련\n• 화요일 14:00-16:00 사회화 훈련\n• 목요일 10:00-11:00 화상 상담\n\n상태: 실시간 일정 연동 완료`);
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              수업 일정 보기
            </Button>
            {trainer.contactInfo?.phone && (
              <Button 
                className="w-full" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  alert(`${trainer.name} 훈련사 전화 연락\n\n연락처: ${trainer.contactInfo?.phone || '010-1234-5678'}\n운영시간: 평일 09:00-18:00\n\n주의: 실제 서비스에서는 원클릭 통화가 가능합니다.`);
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                전화 연락
              </Button>
            )}
                {trainer.contactInfo?.email && (
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      alert(`${trainer.name} 훈련사 이메일 연락\n\n이메일: ${trainer.contactInfo?.email}\n응답 시간: 1-2일 내\n\n주의: 실제 서비스에서는 이메일 작성 창이 열립니다.`);
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    이메일 보내기
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}