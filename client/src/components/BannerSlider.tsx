import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
// 기존 import 제거 - 이제 attached_assets 이미지들을 사용

const banners = [
  {
    title: "전문 반려동물 교육 서비스",
    description: "TALEZ에서 반려동물과 함께하는 행복한 일상을 만들어보세요",
    image: "/attached_assets/image_1746582251297.png",
    link: "/home"
  },
  {
    title: "전문 훈련사와 함께하는 맞춤형 교육",
    description: "국가자격 제1회 반려동물행동지도사와 함께 체계적인 교육을 받아보세요",
    image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 002_1751722697071.png",
    link: "/courses"
  },
  {
    title: "왕짱 반려견스쿨 - 체계적인 훈련 프로그램",
    description: "제1회 국가자격 반려동물행동지도사가 운영하는 전문 교육기관입니다",
    image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 001_1751722697059.png",
    link: "/trainers"
  },
  {
    title: "전국 지점 운영 - 가까운 곳에서 만나세요",
    description: "공평점 반려견스쿨과 석적점 독트레이닝 센터에서 전문 교육을 제공합니다",
    image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 003_1751722697072.png",
    link: "/video-call"
  },
  {
    title: "AI 기반 행동 분석 서비스",
    description: "최신 AI 기술로 반려동물의 행동을 분석하고 맞춤형 케어 솔루션을 제공합니다",
    image: "/attached_assets/image_1746582251297.png",
    link: "/ai-analysis"
  },
  {
    title: "반려동물 친화 시설 안내",
    description: "반려동물과 함께 방문할 수 있는 검증된 시설들을 소개합니다",
    image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 003_1751722697072.png",
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