import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
// 기존 import 제거 - 이제 attached_assets 이미지들을 사용

const banners = [
  {
    title: "전문 반려동물 교육 서비스",
    description: "TALEZ에서 반려동물과 함께하는 행복한 일상을 만들어보세요",
    image: "/attached_assets/stock_images/happy_dog_training_o_e67db05d.jpg",
    link: "/home"
  },
  {
    title: "전문 훈련사와 함께하는 맞춤형 교육",
    description: "국가자격 제1회 반려동물행동지도사와 함께 체계적인 교육을 받아보세요",
    image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 001_1751722697059.png",
    link: "/courses"
  },
  {
    title: "왕짱 반려견스쿨 - 체계적인 훈련 프로그램",
    description: "제1회 국가자격 반려동물행동지도사가 운영하는 전문 교육기관입니다",
    image: "/attached_assets/stock_images/professional_certifi_8e9795a3.jpg",
    link: "/trainers"
  },
  {
    title: "전국 지점 운영 - 가까운 곳에서 만나세요",
    description: "공평점 반려견스쿨과 석적점 독트레이닝 센터에서 전문 교육을 제공합니다",
    image: "/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 002_1751722697071.png",
    link: "/video-call"
  },
  {
    title: "AI 기반 행동 분석 서비스",
    description: "최신 AI 기술로 반려동물의 행동을 분석하고 맞춤형 케어 솔루션을 제공합니다",
    image: "/attached_assets/stock_images/online_pet_dog_train_c9e8e79a.jpg",
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

  // Mock functions and data structures to align with the provided changes.
  // In a real scenario, these would be passed as props or fetched.
  const setLocation = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, you would use a navigation hook like useNavigate from react-router-dom
  };

  const bannerSlides = banners.map(banner => ({
    ...banner,
    subtitle: banner.description, // Assuming description can be used as subtitle
    features: ["맞춤 교육", "AI 분석", "전국 지점"], // Example features
    primaryAction: { text: "자세히 보기", path: banner.link },
    secondaryAction: { text: "서비스 소개", path: "/about" } // Example secondary action
  }));

  return (
    <div 
      className="relative overflow-hidden rounded-2xl min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-2xl"
      role="region"
      aria-label="배너 슬라이더" 
      aria-roledescription="carousel">
      
      {/* Background Image and Gradient */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <img 
          src={bannerSlides[currentIndex].image} 
          alt={bannerSlides[currentIndex].title}
          className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Banner Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-[500px] md:min-h-[600px] py-12 px-8 md:px-16 text-white">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight drop-shadow-lg">
            {bannerSlides[currentIndex].title}
          </h2>
          <p className="text-white/95 text-base md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed max-w-2xl drop-shadow-md">
            {bannerSlides[currentIndex].subtitle}
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {bannerSlides[currentIndex].features.map((feature, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center text-base md:text-lg bg-white/25 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/35 transition-all duration-200"
              >
                <span className="mr-2 text-yellow-300 text-xl font-bold">✓</span> {feature}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-white text-primary font-bold hover:bg-white/95 border-2 border-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-white/20 text-lg min-h-[56px]"
              onClick={() => setLocation(bannerSlides[currentIndex].primaryAction.path)}
              aria-label={`${bannerSlides[currentIndex].primaryAction.text} - ${bannerSlides[currentIndex].title}`}
            >
              {bannerSlides[currentIndex].primaryAction.text}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 hover:text-white px-8 py-4 rounded-xl backdrop-blur-md font-bold shadow-xl text-lg min-h-[56px]"
              onClick={() => setLocation(bannerSlides[currentIndex].secondaryAction.path)}
              aria-label={`${bannerSlides[currentIndex].secondaryAction.text} - ${bannerSlides[currentIndex].title}`}
            >
              {bannerSlides[currentIndex].secondaryAction.text}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary hover:text-primary/80 shadow-md backdrop-blur-sm rounded-full h-12 w-12"
        onClick={prevSlide}
        aria-label="이전 배너"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary hover:text-primary/80 shadow-md backdrop-blur-sm rounded-full h-12 w-12"
        onClick={nextSlide}
        aria-label="다음 배너"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist">
        {bannerSlides.map((banner, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-5" 
                : "bg-white/50 w-1.5 hover:bg-white/70"
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