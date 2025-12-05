import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actions?: Array<{
    label: string;
    href: string;
  }>;
}

export function PageBanner({
  title,
  subtitle,
  imageUrl,
  actions
}: PageBannerProps) {
  return (
    <div className="relative bg-gradient-to-br from-primary via-primary/95 to-purple-600 text-white py-20 md:py-28 px-6 sm:px-8 lg:px-12 rounded-2xl overflow-hidden shadow-2xl">
      {imageUrl && (
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover opacity-25 scale-105 hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 leading-relaxed drop-shadow-md max-w-3xl mx-auto">{subtitle}</p>
        )}

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            {actions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Button
                  variant={index === 0 ? "default" : "outline"}
                  size="lg"
                  className={index === 0
                    ? "bg-white text-primary hover:bg-white/95 font-bold text-lg px-8 py-4 rounded-xl shadow-2xl min-h-[56px]"
                    : "border-2 border-white text-white hover:bg-white/20 font-bold text-lg px-8 py-4 rounded-xl shadow-xl min-h-[56px] backdrop-blur-md"}
                >
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}