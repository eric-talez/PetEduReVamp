import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';
import { TrainerProfileDialog, type Trainer } from '@/components/TrainerProfileDialog';

export default function Trainers() {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 상태 변경 감지
  useEffect(() => {
    console.log("Trainers - 상태 변경:", { selectedTrainer: selectedTrainer?.name, isProfileOpen });
  }, [selectedTrainer, isProfileOpen]);

  // Mock trainers data
  const trainers: Trainer[] = [
    {
      id: 1,
      name: "김훈련",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "기초 훈련, 행동 교정",
      description: "10년 경력의 반려견 훈련 전문가. 특히 문제행동 교정에 특화된 훈련 프로그램을 진행합니다.",
      rating: 4.9,
      reviewCount: 128,
      certifications: ["KKF 공인 훈련사", "국제 반려동물 관리사"],
      coursesCount: 5,
      location: "서울 강남구",
      experience: "반려견 훈련 10년, 대형견 전문 훈련사 5년, 경찰견 훈련 참여 2년",
      education: [
        "서울대학교 수의학과 학사",
        "국제 반려동물 훈련사 자격증 취득",
        "문제행동 교정 전문가 과정 수료"
      ],
      languages: ["한국어", "영어"],
      availableHours: "평일 10:00 - 18:00, 주말 12:00 - 17:00"
    },
    {
      id: 2,
      name: "박민첩",
      image: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "어질리티, 도그 스포츠",
      description: "국내 최고의 어질리티 전문 훈련사. 다수의 국제 대회 수상 경력이 있으며 즐겁게 배우는 훈련을 지향합니다.",
      rating: 4.8,
      reviewCount: 92,
      certifications: ["국제 어질리티 심판", "반려동물행동교정사"],
      coursesCount: 3,
      location: "서울 송파구",
      experience: "어질리티 대회 참가 8년, 국제 대회 우승 3회, 도그스포츠 지도 6년",
      education: [
        "한국체육대학교 체육학과",
        "국제 어질리티 코치 자격증",
        "스포츠 트레이닝 전문가 과정"
      ],
      languages: ["한국어", "일본어"],
      availableHours: "평일 13:00 - 21:00, 주말 09:00 - 18:00"
    },
    {
      id: 3,
      name: "이사회",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "사회화 훈련, 퍼피 클래스",
      description: "어린 강아지 사회화 전문가. 올바른 성장 습관을 기르고 건강한 사회성을 발달시키는 프로그램을 운영합니다.",
      rating: 4.7,
      reviewCount: 83,
      certifications: ["동물행동학 석사", "유아견 전문 훈련사"],
      coursesCount: 4,
      location: "인천 연수구",
      experience: "퍼피 클래스 운영 7년, 아동-반려견 사회화 프로그램 개발 및 운영",
      education: [
        "동국대학교 동물자원학과",
        "유아견 사회화 전문가 과정",
        "아동심리학 수료"
      ],
      languages: ["한국어"],
      availableHours: "평일 10:00 - 16:00"
    },
    {
      id: 4,
      name: "최행동",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "행동 교정, 분리불안",
      description: "문제행동 교정 전문가. 특히 분리불안, 공격성, 과잉행동과 같은 심리적 문제를 과학적 접근으로 해결합니다.",
      rating: 5.0,
      reviewCount: 76,
      certifications: ["동물심리상담사", "수의행동학 전문가"],
      coursesCount: 2,
      location: "경기 분당구",
      experience: "반려동물 행동교정 센터 운영 9년, 분리불안 특화 훈련 개발",
      education: [
        "건국대학교 수의학 박사",
        "동물행동학 연구소 연구원",
        "해외 문제행동 클리닉 연수"
      ],
      languages: ["한국어", "영어", "독일어"],
      availableHours: "상담 예약제 운영"
    },
    {
      id: 5,
      name: "정특수",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "특수 목적 훈련, 노즈워크",
      description: "노즈워크와 특수 목적 훈련 전문가. 반려견의 뛰어난 후각을 활용한 다양한 활동을 통해 두뇌 발달을 돕습니다.",
      rating: 4.9,
      reviewCount: 62,
      certifications: ["노즈워크 국제 인증 트레이너", "수색견 훈련 전문가"],
      coursesCount: 3,
      location: "경기 고양시",
      experience: "군용견 훈련 5년, 노즈워크 대회 심사위원, 수색견 훈련 컨설팅",
      education: [
        "호서대학교 애완동물학과",
        "유럽 노즈워크 아카데미 수료",
        "특수 목적견 훈련 자격증"
      ],
      languages: ["한국어", "영어"],
      availableHours: "평일/주말 09:00 - 18:00"
    },
    {
      id: 6,
      name: "한치료",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      specialty: "반려견 심리 치료, 노령견 케어",
      description: "반려견 심리 치료 전문가. 특히 노령견의 인지 기능 향상과 심리적 안정을 돕는 프로그램을 진행합니다.",
      rating: 4.8,
      reviewCount: 54,
      certifications: ["동물 심리치료사", "노령견 케어 전문가"],
      coursesCount: 2,
      location: "서울 마포구",
      experience: "노령견 케어 센터 운영 6년, 치료견 프로그램 개발, 병원 연계 치료 프로그램 운영",
      education: [
        "이화여자대학교 심리학과",
        "반려동물 심리상담사 자격증",
        "노인심리학 전공"
      ],
      languages: ["한국어"],
      availableHours: "평일 10:00 - 17:00"
    }
  ];

  // 훈련사 프로필 열기
  const openTrainerProfile = (trainer: Trainer) => {
    console.log("프로필 열기 클릭", trainer.name);
    setSelectedTrainer(trainer);
    setIsProfileOpen(true);
    console.log("isProfileOpen 값:", true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">훈련사 찾기</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          경험 많은 전문 훈련사들이 여러분의 반려견에게 맞춤형 교육을 제공합니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainers.map((trainer) => (
          <Card key={trainer.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
            <CardContent className="p-6">
              <div className="flex gap-5">
                <Avatar 
                  src={trainer.image} 
                  alt={trainer.name}
                  size="lg"
                  bordered
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{trainer.name} 트레이너</h3>
                      <p className="text-sm text-primary mt-1">{trainer.specialty}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center mr-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium ml-1">{trainer.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({trainer.reviewCount} 리뷰)</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                    {trainer.description}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" size="sm">{cert}</Badge>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">강의 {trainer.coursesCount}개</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openTrainerProfile(trainer)}
                    >
                      프로필 보기
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 훈련사 프로필 모달 */}
      <TrainerProfileDialog
        trainer={selectedTrainer}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </div>
  );
}
