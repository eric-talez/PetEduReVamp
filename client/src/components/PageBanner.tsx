interface PageBannerProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  onBannerClick?: () => void;
}

export function PageBanner({ imageSrc, imageAlt, title, description, onBannerClick }: PageBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10">
      <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] w-full">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="page-banner-image"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent dark:from-black/70 dark:via-black/50 dark:to-black/20" />
        
        <div 
          className="relative h-full flex items-center cursor-pointer group"
          onClick={onBannerClick}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg transform transition-transform duration-300 group-hover:translate-x-2">
                {title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 dark:text-white leading-relaxed drop-shadow-md max-w-xl transform transition-transform duration-300 group-hover:translate-x-2">
                {description}
              </p>
              <div className="mt-4 sm:mt-6 h-1 w-20 sm:w-24 bg-primary dark:bg-primary-foreground rounded-full transform transition-all duration-300 group-hover:w-32 sm:group-hover:w-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
