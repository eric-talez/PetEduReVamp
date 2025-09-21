import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import mainBannerImage from "@assets/main-banner-talez.png";

const banners = [
  {
    title: "전문 반려동물 교육 서비스",
    description: "TALEZ에서 반려동물과 함께하는 행복한 일상을 만들어보세요",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
    link: "/home"
  },
  {
    title: "전문 훈련사와 함께하는 맞춤형 교육",
    description: "1:1 전문 상담으로 반려동물에게 최적화된 교육 프로그램을 제공합니다",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
    link: "/courses"
  },
  {
    title: "검증된 전문 훈련사",
    description: "자격증을 보유한 전문 훈련사들이 체계적인 교육을 제공합니다",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
    link: "/trainers"
  },
  {
    title: "편리한 온라인 화상 교육",
    description: "집에서 편안하게 전문 훈련사와 실시간 교육을 받아보세요",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
    link: "/video-call"
  },
  {
    title: "AI 기반 행동 분석 서비스",
    description: "최신 AI 기술로 반려동물의 행동을 분석하고 맞춤형 케어 솔루션을 제공합니다",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
    link: "/ai-analysis"
  },
  {
    title: "반려동물 친화 시설 안내",
    description: "반려동물과 함께 방문할 수 있는 검증된 시설들을 소개합니다",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
    link: "/places"
  }
];

export function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideLiveRegionId = "banner-live-region";

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      role="region"
      aria-label="배너 슬라이더" 
      aria-roledescription="carousel">
      <Card className="relative h-[450px] overflow-hidden border-0">
        <img
          src={banners[currentIndex].image}
          alt={`${banners[currentIndex].title} - ${banners[currentIndex].description}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          aria-hidden="true"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent">
          <div className="absolute bottom-0 left-0 p-10 text-white max-w-2xl">
            <h2 className="text-4xl font-bold mb-3 drop-shadow-lg leading-tight">{banners[currentIndex].title}</h2>
            <p className="text-xl mb-6 drop-shadow-md font-medium leading-relaxed opacity-95">{banners[currentIndex].description}</p>
            <Button 
              variant="default" 
              size="lg"
              asChild
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-2xl border-0 px-8 py-3"
            >
              <a href={banners[currentIndex].link}>자세히 보기</a>
            </Button>
          </div>
        </div>
      </Card>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-emerald-700 hover:text-emerald-800 shadow-lg backdrop-blur-sm rounded-full h-12 w-12 border border-white/20"
        onClick={prevSlide}
        aria-label="이전 배너"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-emerald-700 hover:text-emerald-800 shadow-lg backdrop-blur-sm rounded-full h-12 w-12 border border-white/20"
        onClick={nextSlide}
        aria-label="다음 배너"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3" role="tablist">
        {banners.map((banner, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-8 shadow-lg" 
                : "bg-white/60 w-2 hover:bg-white/80"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`${banner.title} 배너로 이동`}
            aria-selected={index === currentIndex}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}