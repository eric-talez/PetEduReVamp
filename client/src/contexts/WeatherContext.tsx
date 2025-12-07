import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type WeatherType = 'clear' | 'rain' | 'snow' | 'cloudy';

interface WeatherData {
  type: WeatherType;
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;
  isLoading?: boolean;
  isRealData?: boolean;
  locationError?: string;
}

interface WeatherContextType {
  weather: WeatherData;
  setWeather: (weather: WeatherData) => void;
  refreshWeather: () => void;
}

const defaultWeather: WeatherData = {
  type: 'clear',
  temperature: 20,
  windSpeed: 2.5,
  humidity: 50,
  description: '날씨 로딩 중...',
  isLoading: true,
  isRealData: false
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData>(defaultWeather);

  const fetchWeatherByLocation = useCallback(async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`/api/weather/current?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setWeather({
          type: data.data.type as WeatherType,
          temperature: data.data.temperature,
          windSpeed: data.data.windSpeed,
          humidity: data.data.humidity,
          description: data.data.description,
          isLoading: false,
          isRealData: !data.data.isFallback
        });
      }
    } catch (error) {
      console.error('날씨 정보 가져오기 실패:', error);
      setWeather({
        ...defaultWeather,
        description: '맑음',
        isLoading: false,
        isRealData: false
      });
    }
  }, []);

  const refreshWeather = useCallback(() => {
    setWeather(prev => ({ ...prev, isLoading: true }));
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('위치 정보 가져오기 실패:', error.message);
          // 기본 위치 (서울)로 날씨 조회
          fetchWeatherByLocation(37.5665, 126.9780);
          setWeather(prev => ({
            ...prev,
            locationError: '위치 권한이 필요합니다'
          }));
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5분 캐시
        }
      );
    } else {
      // Geolocation 미지원 시 서울 기본 좌표
      fetchWeatherByLocation(37.5665, 126.9780);
    }
  }, [fetchWeatherByLocation]);

  useEffect(() => {
    // 컴포넌트 마운트 시 날씨 정보 가져오기
    refreshWeather();

    // 10분마다 날씨 새로고침
    const interval = setInterval(refreshWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  return (
    <WeatherContext.Provider value={{ weather, setWeather, refreshWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
