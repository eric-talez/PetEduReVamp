import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRealTimeAudio } from "@/hooks/useRealTimeAudio";
import RealTimeAccuracy from "./RealTimeAccuracy";
import DogSelector, { type DogSubject } from "./DogSelector";
import { Mic, Square, Download, BarChart3 } from "lucide-react";

export default function AudioRecorder() {
  const [micTestResult, setMicTestResult] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [savedAnalysis, setSavedAnalysis] = useState<any>(null);
  const [selectedDogId, setSelectedDogId] = useState<number | null>(null);
  const [selectedDog, setSelectedDog] = useState<DogSubject | null>(null);
  const {
    isRecording,
    audioMetrics,
    pitchHistory,
    audioBlob,
    startRecording: startRealTimeRecording,
    stopRecording: stopRealTimeRecording,
    getAnalysisResult,
    setWaveformCanvas,
    setSpectrogramCanvas,
    setPitchCanvas
  } = useRealTimeAudio();

  const analyzeAudioMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log('실제 AI 음성 분석 요청 시작...');
      const response = await fetch("/api/ai-analysis/analyze-audio", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(`AI 분석 실패: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log('AI 음성 분석 성공:', data);
      setAnalysisResult({ analysis: data });
      setSavedAnalysis(data);
    },
    onError: (error: any) => {
      console.error('AI 분석 오류:', error);
      alert(`AI 분석 중 오류가 발생했습니다: ${error.message}`);
    }
  });

  const submitAnalysisMutation = useMutation({
    mutationFn: async (submissionData: any) => {
      return await apiRequest("/api/submit-analysis", "POST", submissionData);
    },
    onSuccess: (data) => {
      console.log('통합 분석 제출 성공:', data);
      alert('AI 분석과 훈련사 데이터가 성공적으로 제출되었습니다!');
    },
    onError: (error) => {
      console.error('통합 분석 제출 오류:', error);
      alert(`분석 데이터 제출 중 오류가 발생했습니다: ${error.message}`);
    }
  });

  const [isWaitingForBlob, setIsWaitingForBlob] = useState(false);
  const [lastProcessedBlob, setLastProcessedBlob] = useState<Blob | null>(null);

  // audioBlob이 생성되면 AI 분석 시작
  useEffect(() => {
    if (audioBlob && isWaitingForBlob && audioBlob !== lastProcessedBlob && !analyzeAudioMutation.isPending) {
      console.log('오디오 Blob 수신, AI 분석 시작:', audioBlob.size, 'bytes');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('timestamp', '0');
      formData.append('duration', audioMetrics.duration.toString());
      
      setLastProcessedBlob(audioBlob);
      setIsWaitingForBlob(false);
      setMicTestResult('🤖 AI가 강아지 음성을 분석하고 있습니다...');
      analyzeAudioMutation.mutate(formData);
    }
  }, [audioBlob, isWaitingForBlob, audioMetrics.duration, lastProcessedBlob, analyzeAudioMutation.isPending, analyzeAudioMutation.mutate]);

  const handleRecordingToggle = useCallback(async () => {
    console.log('실시간 녹음 토글 클릭됨. 현재 상태:', isRecording ? '녹음 중' : '대기 중');
    
    if (isRecording) {
      console.log('실시간 녹음 중지 요청');
      try {
        stopRealTimeRecording();
        setIsWaitingForBlob(true);
        setMicTestResult('📊 녹음 완료! AI 분석 준비 중...');
        
        // 로컬 분석 결과도 표시
        const result = getAnalysisResult();
        if (result) {
          setAnalysisResult({ 
            analysis: {
              ...result,
              processing_time: '분석 중...'
            }
          });
        }
      } catch (error: any) {
        console.error('녹음 중지 오류:', error);
        setMicTestResult(`❌ 녹음 중지 오류: ${error.message}`);
        setIsWaitingForBlob(false);
      }
    } else {
      console.log('실시간 녹음 시작 요청');
      setMicTestResult('');
      
      try {
        await startRealTimeRecording();
        setAnalysisResult(null);
        setMicTestResult('✅ 실시간 녹음이 시작되었습니다! 강아지 소리를 녹음하세요.');
      } catch (error: any) {
        console.error('녹음 시작 오류:', error);
        const errorMessage = error.message || '마이크 접근 권한이 필요합니다.';
        setMicTestResult(`❌ ${errorMessage}`);
      }
    }
  }, [isRecording, startRealTimeRecording, stopRealTimeRecording, getAnalysisResult]);

  const handleExportData = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      pitchHistory: pitchHistory.map(p => p.frequency),
      averagePitch: pitchHistory.length > 0 ? 
        (pitchHistory.reduce((sum, p) => sum + p.frequency, 0) / pitchHistory.length).toFixed(1) : 0,
      recordingDuration: audioMetrics.duration,
      analysisResult: analysisResult,
      audioMetrics: audioMetrics
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dog-voice-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pitchHistory, audioMetrics, analysisResult]);

  const handleMicTest = useCallback(async () => {
    setMicTestResult('마이크 테스트 진행 중...');
    
    try {
      // Test browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicTestResult('❌ 브라우저가 마이크 API를 지원하지 않습니다.');
        return;
      }

      // Test MediaRecorder support
      if (typeof MediaRecorder === 'undefined') {
        setMicTestResult('❌ 브라우저가 오디오 녹음을 지원하지 않습니다.');
        return;
      }

      // Test microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      const audioTrack = stream.getAudioTracks()[0];
      const settings = audioTrack.getSettings();
      
      // Test MediaRecorder creation
      const recorder = new MediaRecorder(stream);
      
      setMicTestResult(`✅ 마이크 연동 정상!
🎤 장치: ${audioTrack.label || '기본 마이크'}
📊 샘플레이트: ${settings.sampleRate}Hz
🔊 채널: ${settings.channelCount}개
📹 녹음 형식: ${recorder.mimeType}`);

      // Clean up
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        setMicTestResult('❌ 마이크 접근 권한이 거부되었습니다.\n브라우저 설정에서 마이크 권한을 허용해주세요.');
      } else if (error.name === 'NotFoundError') {
        setMicTestResult('❌ 마이크 장치를 찾을 수 없습니다.\n마이크가 연결되어 있는지 확인해주세요.');
      } else {
        setMicTestResult(`❌ 마이크 테스트 실패: ${error.message}`);
      }
    }
  }, []);

  // 키보드 접근성 향상
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 스페이스바로 녹음 토글 (포커스된 버튼이 아닐 때만)
      if (e.code === 'Space' && !(document.activeElement?.tagName === 'BUTTON')) {
        e.preventDefault();
        handleRecordingToggle();
      }
      
      // Escape 키로 녹음 중지
      if (e.key === 'Escape' && isRecording) {
        e.preventDefault();
        handleRecordingToggle();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleRecordingToggle, isRecording]);

  return (
    <div className="space-y-6">
      {/* 모바일 고정 정지 버튼 - 녹음 중일 때만 표시 */}
      {isRecording && (
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center md:hidden px-4">
          <Button
            onClick={handleRecordingToggle}
            size="lg"
            className="w-full max-w-sm h-16 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-2xl animate-pulse flex items-center justify-center gap-3"
            data-testid="button-mobile-stop-recording"
          >
            <Square size={28} />
            <span>녹음 정지</span>
          </Button>
        </div>
      )}

      {/* 강아지 선택 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            🐕 분석 대상 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DogSelector
            selectedDogId={selectedDogId}
            onSelectDog={(id, dog) => {
              setSelectedDogId(id);
              setSelectedDog(dog);
            }}
            showDetails={true}
            label="음성 분석 대상 강아지"
          />
        </CardContent>
      </Card>

      {/* 실시간 음성 분석 섹션 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Mic className="w-6 h-6" />
            실시간 음성 분석
            {selectedDog && (
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                {selectedDog.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 개선된 녹음 컨트롤 섹션 */}
            <div className="space-y-6">
              {/* 녹음 버튼과 실시간 그래프를 나란히 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* 녹음 버튼 */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Button
                      onClick={handleRecordingToggle}
                      size="lg"
                      className={`w-28 h-28 rounded-full transition-all duration-300 shadow-xl ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                      }`}
                      aria-label={isRecording ? "녹음 중지 (스페이스바)" : "녹음 시작 (스페이스바)"}
                      aria-pressed={isRecording}
                      title={isRecording ? "녹음 중지 (스페이스바 또는 ESC)" : "녹음 시작 (스페이스바)"}
                    >
                      {isRecording ? <Square size={40} /> : <Mic size={40} />}
                      <span className="sr-only">
                        {isRecording ? "현재 녹음 중입니다. 클릭하거나 스페이스바를 눌러 중지하세요." : "녹음을 시작하려면 클릭하거나 스페이스바를 누르세요."}
                      </span>
                    </Button>
                    
                    {isRecording && (
                      <div className="absolute -inset-2">
                        <div className="w-full h-full border-4 border-red-300 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-mono font-bold text-gray-800">
                      {Math.floor(audioMetrics.duration / 60).toString().padStart(2, '0')}:
                      {Math.floor(audioMetrics.duration % 60).toString().padStart(2, '0')}
                    </div>
                    <Badge 
                      variant={isRecording ? "destructive" : "secondary"}
                      className="px-3 py-1 text-sm font-medium mt-2"
                    >
                      {isRecording ? "🔴 녹음 중" : "⏸️ 대기"}
                    </Badge>
                    
                    {/* 녹음 중 정지 버튼 - 항상 표시 */}
                    {isRecording && (
                      <Button
                        onClick={handleRecordingToggle}
                        variant="destructive"
                        size="lg"
                        className="mt-4 w-full font-bold text-lg h-12 flex items-center justify-center gap-2"
                        data-testid="button-stop-recording"
                      >
                        <Square size={20} />
                        녹음 정지
                      </Button>
                    )}
                  </div>
                </div>

                {/* 실시간 웨이브폼 그래프 - 녹음 버튼 옆에 표시 */}
                <div className="flex-1 w-full space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">🌊 실시간 음성 파형</span>
                      {isRecording && (
                        <span className="flex items-center text-xs text-red-500">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                    <canvas 
                      ref={setWaveformCanvas}
                      className="w-full h-20 bg-white rounded-lg shadow-inner"
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 bg-gradient-to-r from-green-50 to-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">🌈 주파수 스펙트럼</span>
                      {isRecording && (
                        <span className="text-xs text-gray-500">{audioMetrics.pitch}Hz</span>
                      )}
                    </div>
                    <canvas 
                      ref={setSpectrogramCanvas}
                      className="w-full h-16 bg-white rounded-lg shadow-inner"
                      style={{ minHeight: '64px' }}
                    />
                  </div>
                </div>
              </div>

              {/* 상태 메시지 */}
              {micTestResult && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                  micTestResult.includes('✅') || micTestResult.includes('🤖') || micTestResult.includes('📊')
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : micTestResult.includes('❌')
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {micTestResult}
                </div>
              )}

              {/* 액션 버튼 그룹 */}
              {pitchHistory.length > 0 && !isRecording && (
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleExportData} 
                    variant="outline" 
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl"
                  >
                    <Download className="w-5 h-5" />
                    <span>데이터 내보내기</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl"
                    onClick={() => window.location.reload()}
                  >
                    <span>🔄</span>
                    <span>새로고침</span>
                  </Button>
                </div>
              )}

              {/* 빠른 안내 */}
              <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">스페이스바</kbd>
                    <span>녹음 토글</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">ESC</kbd>
                    <span>중지</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 실시간 게이미피케이션 정확도 시스템 */}
            <div className="space-y-4">
              <RealTimeAccuracy 
                currentAccuracy={audioMetrics.accuracy || 0}
                isAnalyzing={isRecording}
                onAccuracyUpdate={(accuracy) => {
                  // 정확도 업데이트 콜백 (필요시 추가 로직)
                }}
              />
              
              {/* 기본 메트릭도 간단히 표시 */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-bold">{audioMetrics.pitch}Hz</div>
                  <div>음높이</div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-bold">{audioMetrics.volume}dB</div>
                  <div>음량</div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-bold">{audioMetrics.stability}%</div>
                  <div>안정성</div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-bold">{audioMetrics.duration}s</div>
                  <div>지속시간</div>
                </div>
              </div>
            </div>
          </div>

          {/* 음높이 추적 (녹음 후 표시) */}
          {pitchHistory.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">🎵 음높이 추적</h4>
              <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                <canvas 
                  ref={setPitchCanvas}
                  className="w-full h-32 bg-transparent"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 분석 결과 */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>🤖 실시간 AI 분석 결과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl mb-2">
                  {analysisResult.analysis?.emotion === '식사 요구' ? '🍽️' :
                   analysisResult.analysis?.emotion === '산책 요청' ? '🚶‍♂️' : '😊'}
                </div>
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                  {analysisResult.analysis?.emotion || '기쁨/흥분'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  신뢰도: {Math.round((analysisResult.analysis?.confidence || 0.85) * 100)}%
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                  {analysisResult.analysis?.avgPitch || 850}Hz
                </div>
                <div className="font-semibold">평균 음높이</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  안정성: {analysisResult.analysis?.stability || 85}%
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                  {analysisResult.analysis?.duration || 3}초
                </div>
                <div className="font-semibold">분석 시간</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  처리: {analysisResult.analysis?.processing_time || '1.5초'}
                </div>
              </div>
            </div>

            {/* 훈련사 검증 및 제출 섹션 */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
                훈련사 검증 및 데이터 제출
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">선택된 강아지</div>
                    {selectedDog ? (
                      <div className="px-3 py-2 border border-green-300 rounded-lg bg-green-50 text-green-800 font-medium">
                        🐕 {selectedDog.name} ({selectedDog.breed})
                      </div>
                    ) : (
                      <div className="px-3 py-2 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-800">
                        ⚠️ 상단에서 강아지를 먼저 선택해주세요
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련사 선택</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" id="trainerSelect">
                      <option value="">훈련사를 선택하세요</option>
                      <option value="1">김도우 (5-10년 경험)</option>
                      <option value="2">이전문 (3-5년 경험)</option>
                      <option value="3">박훈련 (1-3년 경험)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상황</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                      placeholder="예: 식사 시간, 놀이 시간 등"
                      id="situationInput"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">환경</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" id="environmentSelect">
                      <option value="">환경을 선택하세요</option>
                      <option value="실내">실내</option>
                      <option value="실외">실외</option>
                      <option value="공원">공원</option>
                      <option value="병원">병원</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련사 감정 판단</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" id="trainerEmotionSelect">
                      <option value="">감정을 선택하세요</option>
                      <option value="기쁨/흥분">기쁨/흥분</option>
                      <option value="요구/필요">요구/필요</option>
                      <option value="놀이욕구">놀이욕구</option>
                      <option value="불안/긴장">불안/긴장</option>
                      <option value="스트레스">스트레스</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련사 신뢰도 (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                      placeholder="1-100"
                      id="trainerConfidenceInput"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상세 맥락</label>
                    <textarea 
                      rows={3} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                      placeholder="구체적인 상황을 설명해주세요"
                      id="contextTextarea"
                    />
                  </div>

                  <Button 
                    onClick={async () => {
                      const trainerId = (document.getElementById('trainerSelect') as HTMLSelectElement)?.value;
                      const situation = (document.getElementById('situationInput') as HTMLInputElement)?.value;
                      const environment = (document.getElementById('environmentSelect') as HTMLSelectElement)?.value;
                      const context = (document.getElementById('contextTextarea') as HTMLTextAreaElement)?.value;
                      const trainerEmotion = (document.getElementById('trainerEmotionSelect') as HTMLSelectElement)?.value;
                      const trainerConfidence = (document.getElementById('trainerConfidenceInput') as HTMLInputElement)?.value;

                      if (!selectedDogId || !trainerId) {
                        alert('강아지와 훈련사를 선택해주세요.');
                        return;
                      }

                      const submissionData = {
                        aiAnalysis: savedAnalysis,
                        dogId: selectedDogId,
                        trainerId: parseInt(trainerId),
                        situation,
                        environment,
                        context,
                        trainerEmotions: trainerEmotion ? [trainerEmotion] : null,
                        trainerConfidence: trainerConfidence ? parseInt(trainerConfidence) : null,
                        timeOfDay: new Date().getHours() < 12 ? '오전' : new Date().getHours() < 18 ? '오후' : '저녁',
                        stressLevel: 3, // 기본값
                        energyLevel: 5, // 기본값
                      };

                      submitAnalysisMutation.mutate(submissionData);
                    }}
                    className="w-full"
                    disabled={submitAnalysisMutation.isPending}
                  >
                    {submitAnalysisMutation.isPending ? '제출 중...' : '🚀 AI 분석 + 훈련사 검증 제출'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 마이크 테스트 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 마이크 테스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleMicTest} 
              variant="outline" 
              className="w-full"
              disabled={isRecording}
            >
              <Mic className="w-4 h-4 mr-2" />
              마이크 테스트 시작
            </Button>
            
            {micTestResult && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{micTestResult}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}