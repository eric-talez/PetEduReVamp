import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number;
}

export function SplashScreen({ onComplete, minDisplayTime = 2000 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [onComplete, minDisplayTime]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      data-testid="splash-screen"
    >
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
          <img 
            src="/logo-symbol-new.png"
            alt="TALEZ" 
            className="relative w-32 h-32 md:w-40 md:h-40 object-contain animate-bounce-slow"
            data-testid="splash-logo"
          />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            TALEZ
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
            반려동물 교육 플랫폼
          </p>
        </div>

        <div className="flex space-x-2 mt-8">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    const isMobile = window.innerWidth < 768;
    const hasSeenSplash = sessionStorage.getItem('talez_splash_shown');
    
    return isMobile && !hasSeenSplash;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('talez_splash_shown', 'true');
    setShowSplash(false);
  };

  return { showSplash, handleSplashComplete };
}
