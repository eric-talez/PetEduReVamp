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
    title: "반려견 교육의 모든 것, PetEduPlatform",
    description: "전국 최대 규모의 반려견 교육 플랫폼에서 전문 훈련사의 체계적인 교육으로 더 행복한 반려생활을 시작하세요.",
    image: "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "서비스 알아보기",
      link: "/courses"
    },
    secondaryCta: {
      text: "무료 체험 신청",
      link: "/free-trial"
    }
  },
  {
    id: 2,
    title: "실시간 화상 교육 서비스",
    description: "거리와 시간에 구애받지 않고 집에서도 전문 훈련사와 1:1 실시간 맞춤형 교육을 시작하세요.",
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "화상 교육 신청",
      link: "/video-call"
    }
  },
  {
    id: 3,
    title: "위치 기반 근처 훈련사 찾기",
    description: "현재 위치를 기반으로 가까운 훈련소와 전문 훈련사를 쉽고 빠르게 찾아보세요.",
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "주변 훈련사 찾기",
      link: "/locations"
    }
  },
  {
    id: 4,
    title: "전문 커뮤니티로 정보 공유",
    description: "같은 고민을 가진 견주들과 소통하고 전문가의 조언을 받을 수 있는 커뮤니티에 참여하세요.",
    image: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "커뮤니티 참여하기",
      link: "/community"
    }
  },
  {
    id: 5,
    title: "반려견 맞춤형 제품 추천",
    description: "AI 기반 맞춤형 추천 시스템으로 내 반려견에게 꼭 맞는 상품과 교육 과정을 만나보세요.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "맞춤 추천 받기",
      link: "/recommendations"
    }
  },
  {
    id: 6,
    title: "교육 과정 수료증 및 자격증",
    description: "체계적인 교육 과정 수료 후 공식 인증 수료증과 자격증을 발급받으세요.",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "자격증 정보 보기",
      link: "/certificates"
    }
  },
  {
    id: 7,
    title: "훈련사/교육기관 입점 프로그램",
    description: "전문 훈련사와 교육기관을 위한 입점 프로그램으로 더 많은 고객과 매출 기회를 얻으세요.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "입점 신청하기",
      link: "/apply"
    }
  },
  {
    id: 8,
    title: "반려견 교육용품 전문 쇼핑몰",
    description: "교육에 필요한 프리미엄 교육용품부터 일상 필수품까지 다양한 제품을 만나보세요.",
    image: "https://images.unsplash.com/photo-1601758174049-203e9b1baa50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400",
    cta: {
      text: "쇼핑몰 바로가기",
      link: "/shop"
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
    <div className="relative rounded-xl overflow-hidden h-60 md:h-80 bg-gray-50 dark:bg-gray-800 shadow-lg">
      <div className="grid md:grid-cols-2 h-full">
        {/* 슬라이드 텍스트 영역 */}
        <div className="p-6 md:p-8 flex flex-col justify-center h-full bg-gray-50 dark:bg-gray-800">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold mb-2 md:mb-3">
            {slide.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 line-clamp-3">
            {slide.description}
          </p>
          <div className="mt-2">
            <Button
              variant="default"
              className="mr-3"
              size="sm"
            >
              <Link href={slide.cta.link}>{slide.cta.text}</Link>
            </Button>
          </div>
        </div>

        {/* 슬라이드 이미지 영역 */}
        <div className="relative hidden md:block">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
        </div>
      </div>
      
      {/* 슬라이드 네비게이션 */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-primary w-4" 
                : "bg-gray-300 dark:bg-gray-600 hover:bg-primary/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* 좌우 화살표 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-gray-800 dark:text-white hover:bg-black/20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-gray-800 dark:text-white hover:bg-black/20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}