import { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeatherInfoProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  visibility: number;
  pressure: number;
}

export function WeatherInfo({ latitude, longitude, locationName }: WeatherInfoProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // OpenWeatherMap API 사용 (무료 API 키 필요)
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('날씨 정보를 가져올 수 없습니다.');
        }
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          visibility: data.visibility / 1000, // km로 변환
          pressure: data.main.pressure,
        });
      } catch (err) {
        console.error('날씨 정보 가져오기 실패:', err);
        setError('날씨 정보를 불러올 수 없습니다.');
        // 데모 데이터로 폴백
        setWeather({
          temperature: 22,
          feelsLike: 20,
          humidity: 65,
          windSpeed: 2.5,
          description: '맑음',
          icon: '01d',
          visibility: 10,
          pressure: 1013,
        });
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  const getWeatherIcon = (iconCode: string) => {
    // 날씨 아이콘 매핑
    if (iconCode.includes('01')) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) 
      return <Cloud className="h-8 w-8 text-gray-500" />;
    if (iconCode.includes('09') || iconCode.includes('10')) 
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (iconCode.includes('13')) return <CloudSnow className="h-8 w-8 text-blue-300" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (error && !weather) {
    return (
      <Card className="p-4">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {error}
        </div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        {/* 제목 */}
        {locationName && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {locationName} 날씨
          </div>
        )}
        
        {/* 메인 날씨 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.icon)}
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                체감 {weather.feelsLike}°C
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {weather.description}
            </div>
          </div>
        </div>
        
        {/* 상세 정보 그리드 */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div className="text-xs">
              <div className="text-gray-600 dark:text-gray-400">습도</div>
              <div className="font-semibold text-gray-900 dark:text-white">{weather.humidity}%</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            <div className="text-xs">
              <div className="text-gray-600 dark:text-gray-400">풍속</div>
              <div className="font-semibold text-gray-900 dark:text-white">{weather.windSpeed}m/s</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <div className="text-xs">
              <div className="text-gray-600 dark:text-gray-400">가시거리</div>
              <div className="font-semibold text-gray-900 dark:text-white">{weather.visibility}km</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-blue-500" />
            <div className="text-xs">
              <div className="text-gray-600 dark:text-gray-400">기압</div>
              <div className="font-semibold text-gray-900 dark:text-white">{weather.pressure}hPa</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
