import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { useState } from "react";

export default function VideoCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const startCall = () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  if (isCallActive) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Video area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            {isCameraOff ? (
              <div className="text-white text-center">
                <CameraOff className="h-16 w-16 mx-auto mb-4" />
                <p>카메라가 꺼져 있습니다</p>
              </div>
            ) : (
              <div className="text-white text-center">
                <Video className="h-16 w-16 mx-auto mb-4" />
                <p>화상 통화 진행 중...</p>
              </div>
            )}
          </div>
          
          {/* Small self video */}
          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-white text-xs">내 화면</div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-800 flex justify-center space-x-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full w-14 h-14"
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
          
          <Button
            variant={isCameraOff ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleCamera}
            className="rounded-full w-14 h-14"
          >
            {isCameraOff ? <CameraOff className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-14 h-14"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6" />
              화상 상담
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Video className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">화상 상담 시작</h2>
              <p className="text-gray-600 mb-6">
                전문 훈련사와 1:1 화상 상담을 시작하세요
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">상담 전 확인사항</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 카메라와 마이크가 정상 작동하는지 확인해주세요</li>
                  <li>• 안정적인 인터넷 연결을 확인해주세요</li>
                  <li>• 반려동물과 함께 준비해주세요</li>
                </ul>
              </div>

              <Button 
                onClick={startCall}
                className="w-full"
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                상담 시작하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}