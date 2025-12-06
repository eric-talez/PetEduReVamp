import { Link } from "wouter";
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
    <div className="relative py-16 md:py-24 px-6 sm:px-8 lg:px-12 rounded-2xl overflow-hidden shadow-2xl">
      {/* 어두운 벽 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900"></div>
      
      {/* 그래피티 질감 효과 */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }}></div>
      
      {/* 네온 스프레이 효과들 */}
      <div className="absolute top-6 right-12 w-40 h-40 bg-pink-500/25 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-20 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-16 left-1/4 w-32 h-32 bg-yellow-400/15 rounded-full blur-2xl"></div>
      <div className="absolute bottom-6 right-1/3 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-lime-400/15 rounded-full blur-2xl"></div>
      
      {/* 드리핑 페인트 효과 */}
      <div className="absolute top-0 left-24 w-1 h-20 bg-gradient-to-b from-pink-500 to-transparent opacity-50"></div>
      <div className="absolute top-0 left-32 w-0.5 h-14 bg-gradient-to-b from-cyan-400 to-transparent opacity-40"></div>
      <div className="absolute top-0 right-40 w-1 h-24 bg-gradient-to-b from-yellow-400 to-transparent opacity-35"></div>
      <div className="absolute top-0 right-1/3 w-0.5 h-16 bg-gradient-to-b from-lime-400 to-transparent opacity-30"></div>

      {imageUrl && (
        <div className="absolute inset-0 opacity-15">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="relative max-w-7xl mx-auto text-center z-10">
        {/* 그래피티 스타일 제목 */}
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #ff6b9d, #c44569, #ff9ff3, #54a0ff, #00d9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px rgba(255,107,157,0.4)',
            fontFamily: '"Impact", "Arial Black", sans-serif',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            className="text-xl md:text-2xl lg:text-3xl mb-8 leading-relaxed max-w-3xl mx-auto font-medium"
            style={{ 
              color: '#67e8f9',
              textShadow: '0 0 30px rgba(34,211,238,0.5)' 
            }}
          >
            {subtitle}
          </p>
        )}

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            {actions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  variant={index === 0 ? "default" : "outline"}
                  size="lg"
                  className={index === 0
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-pink-500/30 min-h-[56px] border-0 transition-all hover:scale-105"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/30 min-h-[56px] border-0 transition-all hover:scale-105"}
                >
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* 장식 요소들 */}
      <div className="absolute bottom-4 right-8 text-3xl opacity-50">🎨</div>
      <div className="absolute top-8 right-20 text-xl opacity-30 rotate-12">✨</div>
      <div className="absolute bottom-8 left-12 text-2xl opacity-40 -rotate-6">🖌️</div>
    </div>
  );
}