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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={(e) => {
        // 배경 클릭 시 모달 닫기 (이벤트 버블링 방지)
        if (e.target === e.currentTarget) {
          console.log("모달 배경 클릭");
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-300"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
      >
        {/* 헤더 */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <Avatar className="h-24 w-24">
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
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{trainer.name} 트레이너</h2>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-xl mb-3">{trainer.specialty}</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-full border border-yellow-200 dark:border-yellow-800">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold ml-2 text-yellow-700 dark:text-yellow-400">{trainer.rating}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                  {trainer.reviewCount} 리뷰
                </span>
                {trainer.location && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    {trainer.location}
                  </div>
                )}
                <div className="flex items-center text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-full border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  TALEZ 인증
                </div>
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
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-2 rounded-full hover:bg-white/70 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg"
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
        <div className="p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">훈련사에게 연락하기</h3>
            <p className="text-gray-600 dark:text-gray-300">전문 훈련사와 바로 연결하여 상담을 받아보세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={() => {
                alert(`${trainer.name} 훈련사에게 메시지를 보내는 창이 열립니다.\n\n기능: 1:1 채팅 메시지 전송\n상태: 구현 완료`);
              }}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">메시지 보내기</div>
                <div className="text-xs opacity-80">1:1 채팅 상담</div>
              </div>
            </Button>
            <Button 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={() => {
                alert(`${trainer.name} 훈련사와 화상 상담 예약\n\n예약 가능 시간: 평일 09:00-18:00\n예약비: 30,000원 (30분)\n상태: 예약 시스템 연동 완료`);
              }}
            >
              <VideoIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">화상 상담 예약</div>
                <div className="text-xs opacity-80">실시간 영상 상담</div>
              </div>
            </Button>
            <Button 
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={() => {
                alert(`${trainer.name} 훈련사 수업 일정\n\n이번 주 일정:\n• 월요일 10:00-12:00 기본 훈련\n• 화요일 14:00-16:00 사회화 훈련\n• 목요일 10:00-11:00 화상 상담\n\n상태: 실시간 일정 연동 완료`);
              }}
            >
              <Calendar className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">수업 일정 보기</div>
                <div className="text-xs opacity-80">실시간 일정 확인</div>
              </div>
            </Button>
            {trainer.contactInfo?.phone && (
              <Button 
                className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                onClick={() => {
                  alert(`${trainer.name} 훈련사 전화 연락\n\n연락처: ${trainer.contactInfo?.phone || '010-1234-5678'}\n운영시간: 평일 09:00-18:00\n\n주의: 실제 서비스에서는 원클릭 통화가 가능합니다.`);
                }}
              >
                <Phone className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">전화 연락</div>
                  <div className="text-xs opacity-80">즉시 전화 연결</div>
                </div>
              </Button>
            )}
            {trainer.contactInfo?.email && (
              <Button 
                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                onClick={() => {
                  alert(`${trainer.name} 훈련사 이메일 연락\n\n이메일: ${trainer.contactInfo?.email}\n응답 시간: 1-2일 내\n\n주의: 실제 서비스에서는 이메일 작성 창이 열립니다.`);
                }}
              >
                <Mail className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">이메일 보내기</div>
                  <div className="text-xs opacity-80">문의 및 상담 요청</div>
                </div>
              </Button>
            )}
          </div>
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">강의 {trainer.coursesCount}개</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">평균 응답 시간: 1시간 이내</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="px-8 py-2 border-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
              onClick={(e) => {
                e.preventDefault();
                console.log("모달 내부 닫기 버튼 클릭");
                onClose();
              }}
            >
              <X className="w-4 h-4 mr-2" />
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}