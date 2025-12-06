import { createContext, useContext, useState, ReactNode } from 'react';

type WeatherType = 'clear' | 'rain' | 'snow' | 'cloudy';

interface WeatherData {
  type: WeatherType;
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;
}

interface WeatherContextType {
  weather: WeatherData;
  setWeather: (weather: WeatherData) => void;
}

const defaultWeather: WeatherData = {
  type: 'clear',
  temperature: 23,
  windSpeed: 3,
  humidity: 45,
  description: '맑음'
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData>(defaultWeather);

  return (
    <WeatherContext.Provider value={{ weather, setWeather }}>
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
