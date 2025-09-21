import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import mainBannerImage from "@assets/main-banner-talez.png";

const banners = [
  {
    title: "오늘의 총령 보호",
    description: "funnytalez.com에서 따뜻한 홈케어를 만나보세요",
    image: mainBannerImage,
    link: "/home"
  },
  {
    title: "반려견 전문 훈련사와 함께하는 맞춤형 교육",
    description: "1:1 전문 상담으로 반려견에게 알맞은 교육 프로그램을 찾아보세요",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    link: "/courses"
  },
  {
    title: "이달의 베스트 트레이너",
    description: "높은 만족도를 자랑하는 전문 훈련사를 만나보세요",
    image: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    link: "/trainers"
  },
  {
    title: "온라인 화상 교육으로 편리하게",
    description: "이동 시간 걱정 없이 집에서 편하게 교육받으세요",
    image: "https://images.unsplash.com/photo-1609151376730-f246ec0b99e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    link: "/video-call"
  },
  {
    title: "AI 반려동물 행동 분석",
    description: "인공지능으로 반려동물의 행동 패턴을 분석하고 맞춤형 솔루션을 받아보세요",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    link: "/ai-analysis"
  },
  {
    title: "반려동물 친화 장소 찾기",
    description: "반려동물과 함께 방문할 수 있는 다양한 장소를 확인해보세요",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
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
      className="relative overflow-hidden rounded-xl"
      role="region"
      aria-label="배너 슬라이더" 
      aria-roledescription="carousel">
      <Card className="relative h-[400px] overflow-hidden">
        <img
          src={banners[currentIndex].image}
          alt={`${banners[currentIndex].title} - ${banners[currentIndex].description}`}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">{banners[currentIndex].title}</h2>
            <p className="text-lg mb-4 drop-shadow-md font-medium">{banners[currentIndex].description}</p>
            <Button 
              variant="default" 
              asChild
              className="bg-white text-primary hover:bg-white/90 shadow-md border-2 border-white"
            >
              <a href={banners[currentIndex].link}>자세히 보기</a>
            </Button>
          </div>
        </div>
      </Card>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white focus:ring-2 focus:ring-primary"
        onClick={prevSlide}
        aria-label="이전 배너"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white focus:ring-2 focus:ring-primary"
        onClick={nextSlide}
        aria-label="다음 배너"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
        {banners.map((banner, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
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