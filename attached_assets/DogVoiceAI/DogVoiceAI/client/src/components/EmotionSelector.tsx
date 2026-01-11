import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const emotions = [
  { id: "happy", emoji: "😊", label: "기쁨/흥분" },
  { id: "anxious", emoji: "😰", label: "불안/긴장" },
  { id: "alert", emoji: "🚨", label: "경계/경고" },
  { id: "demanding", emoji: "🙏", label: "요구/필요" },
  { id: "frustrated", emoji: "😤", label: "좌절/짜증" },
  { id: "playful", emoji: "🎾", label: "놀이욕구" },
];

export default function EmotionSelector() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [confidence, setConfidence] = useState([80]);

  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-6 mb-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="flex items-center space-x-2">
          <span>😊</span>
          <span>감정 분석</span>
        </CardTitle>
      </CardHeader>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          주요 감정 (복수 선택 가능)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {emotions.map((emotion) => (
            <label
              key={emotion.id}
              className={`emotion-option ${
                selectedEmotions.includes(emotion.id) ? 'selected' : ''
              }`}
              onClick={() => toggleEmotion(emotion.id)}
            >
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={selectedEmotions.includes(emotion.id)}
                onChange={() => {}} // Handled by label click
              />
              <span className="text-2xl mr-2">{emotion.emoji}</span>
              <span className="text-sm">{emotion.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          분석 확신도: <span className="font-bold">{confidence[0]}%</span>
        </label>
        <Slider
          value={confidence}
          onValueChange={setConfidence}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}