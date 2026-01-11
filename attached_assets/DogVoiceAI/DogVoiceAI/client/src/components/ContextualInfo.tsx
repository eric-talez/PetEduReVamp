
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock, Cloud, Users, Activity } from "lucide-react";

interface ContextualData {
  timeOfDay: string;
  weatherConditions: string;
  peoplePresent: string[];
  otherAnimalsPresent: boolean;
  recentActivities: string[];
  physiologicalState: string;
  stressLevel: number;
  energyLevel: number;
}

export default function ContextualInfo() {
  const [contextData, setContextData] = useState<ContextualData>({
    timeOfDay: '',
    weatherConditions: '',
    peoplePresent: [],
    otherAnimalsPresent: false,
    recentActivities: [],
    physiologicalState: '',
    stressLevel: 5,
    energyLevel: 5
  });

  const timeOptions = ["새벽", "아침", "오전", "점심", "오후", "저녁", "밤"];
  const weatherOptions = ["맑음", "흐림", "비", "눈", "바람", "더위", "추위"];
  const peopleOptions = ["주인", "가족구성원", "낯선사람", "아이들", "어른"];
  const activityOptions = ["식사", "산책", "놀이", "훈련", "목욕", "병원", "차량이동", "수면"];
  const physiologicalOptions = ["배고픔", "목마름", "피로", "흥분", "졸림", "아픔"];

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="space-y-4 bg-amber-50 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-amber-800">맥락 정보 수집</h3>
      </div>

      {/* 시간대 */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4" />
          <span>시간대</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {timeOptions.map(time => (
            <Badge
              key={time}
              variant={contextData.timeOfDay === time ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setContextData(prev => ({ ...prev, timeOfDay: time }))}
            >
              {time}
            </Badge>
          ))}
        </div>
      </div>

      {/* 날씨 */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Cloud className="w-4 h-4" />
          <span>날씨 상황</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {weatherOptions.map(weather => (
            <Badge
              key={weather}
              variant={contextData.weatherConditions === weather ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setContextData(prev => ({ ...prev, weatherConditions: weather }))}
            >
              {weather}
            </Badge>
          ))}
        </div>
      </div>

      {/* 주변 사람들 */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Users className="w-4 h-4" />
          <span>주변 사람들 (복수 선택)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {peopleOptions.map(person => (
            <Badge
              key={person}
              variant={contextData.peoplePresent.includes(person) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleArrayItem(
                contextData.peoplePresent,
                person,
                (arr) => setContextData(prev => ({ ...prev, peoplePresent: arr }))
              )}
            >
              {person}
            </Badge>
          ))}
        </div>
      </div>

      {/* 다른 동물 */}
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={contextData.otherAnimalsPresent}
          onCheckedChange={(checked) => 
            setContextData(prev => ({ ...prev, otherAnimalsPresent: !!checked }))
          }
        />
        <label className="text-sm font-medium text-gray-700">다른 동물이 주변에 있음</label>
      </div>

      {/* 최근 활동 */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Activity className="w-4 h-4" />
          <span>최근 활동 (복수 선택)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {activityOptions.map(activity => (
            <Badge
              key={activity}
              variant={contextData.recentActivities.includes(activity) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleArrayItem(
                contextData.recentActivities,
                activity,
                (arr) => setContextData(prev => ({ ...prev, recentActivities: arr }))
              )}
            >
              {activity}
            </Badge>
          ))}
        </div>
      </div>

      {/* 생리적 상태 */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">생리적 상태</label>
        <div className="flex flex-wrap gap-2">
          {physiologicalOptions.map(state => (
            <Badge
              key={state}
              variant={contextData.physiologicalState === state ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setContextData(prev => ({ ...prev, physiologicalState: state }))}
            >
              {state}
            </Badge>
          ))}
        </div>
      </div>

      {/* 스트레스 수준 */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          스트레스 수준: <span className="font-bold text-red-600">{contextData.stressLevel}/10</span>
        </label>
        <Slider
          value={[contextData.stressLevel]}
          onValueChange={(value) => setContextData(prev => ({ ...prev, stressLevel: value[0] }))}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      {/* 에너지 수준 */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          에너지 수준: <span className="font-bold text-green-600">{contextData.energyLevel}/10</span>
        </label>
        <Slider
          value={[contextData.energyLevel]}
          onValueChange={(value) => setContextData(prev => ({ ...prev, energyLevel: value[0] }))}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}
