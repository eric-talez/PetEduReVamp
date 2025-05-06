import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  cta: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
}

const slides: Slide[] = [
  {
    id: 1,
    title: "반려견과 함께하는 특별한 교육 여정",
    description: "PetEduPlatform과 함께 전문 훈련사의 체계적인 교육으로 더 행복한 반려생활을 시작하세요.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "강의 둘러보기",
      link: "/courses"
    },
    secondaryCta: {
      text: "무료 웨비나 참여",
      link: "/free-webinar"
    }
  },
  {
    id: 2,
    title: "전문 훈련사와 1:1 실시간 화상 교육",
    description: "언제 어디서나 전문 훈련사와 함께 화상으로 실시간 맞춤형 교육을 받아보세요.",
    image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "화상 교육 신청",
      link: "/video-call"
    }
  },
  {
    id: 3,
    title: "반려견 행동 분석 및 맞춤 솔루션",
    description: "과학적인 행동 분석을 통해 반려견의 문제 행동에 대한 효과적인 해결책을 제시합니다.",
    image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "행동 분석 서비스",
      link: "/behavior-analysis"
    }
  },
  {
    id: 4,
    title: "전국 우수 훈련 기관 네트워크",
    description: "전국 각지의 검증된 우수 교육 기관에서 높은 수준의 대면 교육을 받아보세요.",
    image: "https://images.unsplash.com/photo-1601758174296-530e2fe66a90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "교육 기관 찾기",
      link: "/institutes"
    }
  },
  {
    id: 5,
    title: "반려견 사회화 프로그램",
    description: "다른 반려견들과 함께하는 사회화 프로그램으로 균형잡힌 사교성을 키워주세요.",
    image: "https://images.unsplash.com/photo-1589570181701-54e7163af538?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "사회화 프로그램",
      link: "/socialization"
    }
  },
  {
    id: 6,
    title: "반려견 건강관리 및 영양 상담",
    description: "전문가와 함께 반려견의 건강과 영양 관리에 대한 맞춤형 상담을 받아보세요.",
    image: "https://images.unsplash.com/photo-1587559070757-f72a388edbba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "건강관리 상담",
      link: "/health-consulting"
    }
  },
  {
    id: 7,
    title: "반려견 특수 훈련 과정",
    description: "탐지견, 안내견 등 특수 목적의 전문 훈련 과정을 제공합니다.",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "특수 훈련 과정",
      link: "/special-training"
    }
  },
  {
    id: 8,
    title: "반려견 스포츠 및 활동 프로그램",
    description: "애지리티, 플라이볼 등 다양한 반려견 스포츠를 통해 활동성과 유대감을 향상시켜보세요.",
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "스포츠 프로그램",
      link: "/dog-sports"
    }
  }
];

export function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  const slide = slides[currentSlide];
  
  return (
    <div className="relative rounded-xl overflow-hidden h-60 md:h-80 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
      {/* 슬라이드 이미지 */}
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover absolute mix-blend-overlay transition-opacity duration-500"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
      
      {/* 슬라이드 콘텐츠 */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
        <h1 className="text-white text-2xl md:text-4xl font-display font-bold mb-2 md:mb-4 max-w-xl">
          {slide.title}
        </h1>
        <p className="text-white text-sm md:text-lg max-w-xl mb-6">
          {slide.description}
        </p>
        <div>
          <Button
            variant="default"
            className="bg-white text-primary font-semibold mr-3"
          >
            <Link href={slide.cta.link}>{slide.cta.text}</Link>
          </Button>
          
          {slide.secondaryCta && (
            <Button 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              <Link href={slide.secondaryCta.link}>{slide.secondaryCta.text}</Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* 슬라이드 네비게이션 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* 좌우 화살표 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}