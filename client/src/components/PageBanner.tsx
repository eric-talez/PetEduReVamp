interface PageBannerProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  onBannerClick?: () => void;
}

export function PageBanner({ imageSrc, imageAlt, title, description, onBannerClick }: PageBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="relative h-[160px] sm:h-[180px] md:h-[200px] w-full">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="page-banner-image"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        
        <div 
          className="relative h-full flex items-center cursor-pointer group"
          onClick={onBannerClick}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 drop-shadow-md transform transition-transform duration-300 group-hover:translate-x-1">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed drop-shadow-sm max-w-md transform transition-transform duration-300 group-hover:translate-x-1 line-clamp-2">
                {description}
              </p>
              <div className="mt-2 h-0.5 w-12 sm:w-16 bg-[#EB967C] rounded-full transform transition-all duration-300 group-hover:w-20 sm:group-hover:w-24" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
