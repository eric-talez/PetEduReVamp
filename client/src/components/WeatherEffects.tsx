import { useEffect, useState } from 'react';

type WeatherType = 'clear' | 'rain' | 'snow' | 'cloudy';

interface WeatherEffectsProps {
  weatherType?: WeatherType;
}

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export function WeatherEffects({ weatherType = 'clear' }: WeatherEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (weatherType === 'rain' || weatherType === 'snow') {
      const particleCount = weatherType === 'rain' ? 100 : 50;
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 5,
          duration: weatherType === 'rain' ? 0.5 + Math.random() * 0.5 : 3 + Math.random() * 2,
          size: weatherType === 'rain' ? 1 + Math.random() : 3 + Math.random() * 5,
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [weatherType]);

  if (weatherType === 'clear' || weatherType === 'cloudy') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" data-testid="weather-effects">
      {weatherType === 'rain' && (
        <>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-blue-400/60"
              style={{
                left: `${particle.x}%`,
                top: '-20px',
                width: `${particle.size}px`,
                height: `${particle.size * 15}px`,
                borderRadius: '50%',
                animation: `rainfall ${particle.duration}s linear infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </>
      )}
      
      {weatherType === 'snow' && (
        <>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-white rounded-full shadow-sm"
              style={{
                left: `${particle.x}%`,
                top: '-20px',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: 0.8,
                animation: `snowfall ${particle.duration}s linear infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </>
      )}
      
      <style>{`
        @keyframes rainfall {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(180deg);
          }
          90% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) translateX(-10px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
