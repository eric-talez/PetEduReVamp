import { Router } from 'express';
import axios from 'axios';

const router = Router();

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
  };
}

// WMO 날씨 코드를 우리 앱의 날씨 타입으로 변환
function getWeatherType(code: number): { type: string; description: string } {
  // WMO Weather interpretation codes
  // https://open-meteo.com/en/docs
  if (code === 0) return { type: 'clear', description: '맑음' };
  if (code >= 1 && code <= 3) return { type: 'cloudy', description: '흐림' };
  if (code >= 45 && code <= 48) return { type: 'cloudy', description: '안개' };
  if (code >= 51 && code <= 67) return { type: 'rain', description: '비' };
  if (code >= 71 && code <= 77) return { type: 'snow', description: '눈' };
  if (code >= 80 && code <= 82) return { type: 'rain', description: '소나기' };
  if (code >= 85 && code <= 86) return { type: 'snow', description: '눈' };
  if (code >= 95 && code <= 99) return { type: 'rain', description: '뇌우' };
  return { type: 'clear', description: '맑음' };
}

// 실시간 날씨 가져오기 (위도, 경도 기반)
router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: '위도(lat)와 경도(lon)가 필요합니다.'
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 좌표입니다.'
      });
    }

    // Open-Meteo API 호출 (무료, API 키 불필요)
    const response = await axios.get<OpenMeteoResponse>(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          timezone: 'Asia/Seoul'
        },
        timeout: 5000
      }
    );

    const { current } = response.data;
    const weatherInfo = getWeatherType(current.weather_code);

    res.json({
      success: true,
      data: {
        type: weatherInfo.type,
        description: weatherInfo.description,
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
        weatherCode: current.weather_code
      }
    });
  } catch (error) {
    const status = (error as any)?.response?.status;
    const reason = (error as any)?.response?.data?.reason || (error as any)?.message || 'unknown';
    console.warn(`[Weather] Open-Meteo API 호출 실패 (status=${status ?? 'N/A'}): ${reason} — fallback 데이터 반환`);

    // 기본 날씨 데이터 반환 (fallback)
    res.json({
      success: true,
      data: {
        type: 'clear',
        description: '맑음',
        temperature: 20,
        humidity: 50,
        windSpeed: 2.5,
        weatherCode: 0,
        isFallback: true
      }
    });
  }
});

export { router as weatherRoutes };
