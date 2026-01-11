import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Square, Upload, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SimpleAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // 녹음 시작
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // 녹음 시간 카운터
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "녹음 시작",
        description: "강아지 소리를 녹음하고 있습니다."
      });

    } catch (error) {
      console.error('녹음 시작 오류:', error);
      toast({
        title: "녹음 오류",
        description: "마이크 접근 권한을 확인해주세요.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      toast({
        title: "녹음 완료",
        description: `${recordingTime}초 녹음이 완료되었습니다.`
      });
    }
  }, [isRecording, recordingTime, toast]);

  // 음성 분석
  const analyzeAudio = useCallback(async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('timestamp', '0');
      formData.append('duration', recordingTime.toString());

      const response = await fetch('/api/ai-analysis/analyze-audio', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`분석 실패: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);

      toast({
        title: "분석 완료",
        description: `${result.behavior} - 신뢰도 ${Math.round(result.confidence * 100)}%`
      });

    } catch (error) {
      console.error('음성 분석 오류:', error);
      toast({
        title: "분석 오류",
        description: "음성 분석 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [audioBlob, recordingTime, toast]);

  // 파일 업로드
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "파일 오류",
        description: "음성 파일만 업로드할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }

    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setRecordingTime(0); // 업로드된 파일은 시간을 0으로 초기화

    toast({
      title: "파일 업로드 완료",
      description: "음성 파일이 업로드되었습니다."
    });
  }, [toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5 text-blue-500" />
            <span>간편 음성 분석</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 녹음 컨트롤 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              {!isRecording ? (
                <Button onClick={startRecording} className="flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span>녹음 시작</span>
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex items-center space-x-2">
                  <Square className="w-4 h-4" />
                  <span>녹음 중지</span>
                </Button>
              )}
              
              <label htmlFor="audio-upload">
                <Button variant="outline" className="flex items-center space-x-2" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    <span>파일 업로드</span>
                  </span>
                </Button>
              </label>
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {isRecording && (
              <div className="text-center">
                <Badge variant="destructive" className="animate-pulse">
                  녹음 중 {formatTime(recordingTime)}
                </Badge>
              </div>
            )}
          </div>

          {/* 음성 재생 */}
          {audioUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium">녹음된 음성:</p>
              <audio ref={audioPlayerRef} controls className="w-full">
                <source src={audioUrl} type="audio/wav" />
                브라우저가 오디오를 지원하지 않습니다.
              </audio>
            </div>
          )}

          {/* 분석 버튼 */}
          {audioBlob && (
            <Button 
              onClick={analyzeAudio} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "분석 중..." : "AI 음성 분석 시작"}
            </Button>
          )}

          {/* 분석 진행 상황 */}
          {isAnalyzing && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">AI가 음성을 분석하고 있습니다...</p>
              <Progress value={66} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 분석 결과 */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">분석 결과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>인식된 행동:</strong> {analysisResult.behavior}</p>
                <p><strong>감정 상태:</strong> {analysisResult.emotion}</p>
                <p><strong>강도:</strong> {analysisResult.intensity}/10</p>
              </div>
              <div className="space-y-2">
                <p><strong>신뢰도:</strong> {Math.round(analysisResult.confidence * 100)}%</p>
                <Progress value={analysisResult.confidence * 100} className="w-full" />
              </div>
            </div>
            
            {analysisResult.audioFeatures && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">음성 특성:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>주파수: {analysisResult.audioFeatures.frequency}Hz</p>
                  <p>음량: {Math.round(analysisResult.audioFeatures.amplitude * 100)}%</p>
                  <p>음높이: {analysisResult.audioFeatures.pitch}</p>
                  <p>짖는 유형: {analysisResult.audioFeatures.barType}</p>
                </div>
              </div>
            )}

            {analysisResult.recommendations && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">권장 사항:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}